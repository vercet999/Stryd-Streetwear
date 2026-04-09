import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add Security Headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // API routes FIRST
  app.use(express.json()); // Add JSON body parsing for POST requests

  app.get("/api/products", async (req, res) => {
    // SECURITY: Never use VITE_ prefix for WooCommerce keys, as it exposes them to the client-side bundle.
    const WC_URL = process.env.WC_URL;
    const WC_KEY = process.env.WC_KEY;
    const WC_SECRET = process.env.WC_SECRET;

    const page = req.query.page || 1;
    const per_page = req.query.per_page || 20;
    const slug = req.query.slug;

    if (!WC_URL || !WC_KEY || !WC_SECRET) {
      return res.status(500).json({ error: "WooCommerce credentials missing" });
    }

    try {
      const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
      
      const params = new URLSearchParams({
        page: String(page),
        per_page: String(per_page),
      });
      
      if (slug) {
        params.append('slug', String(slug));
      }
      
      const url = `${WC_URL}/wp-json/wc/v3/products?${params.toString()}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });

      if (!response.ok) {
        throw new Error(`WooCommerce API responded with status ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching products from WooCommerce:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Local development mock for /api/orders (mirrors Vercel serverless function)
  app.post("/api/orders", async (req, res) => {
    const WC_URL = process.env.WC_URL;
    const WC_KEY = process.env.WC_KEY;
    const WC_SECRET = process.env.WC_SECRET;
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

    if (!WC_URL || !WC_KEY || !WC_SECRET || !PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ error: "Server configuration error. Credentials missing." });
    }

    const { billing, lineItems, paystackRef, paystackAmount } = req.body;

    if (!billing || !lineItems || !lineItems.length || !paystackRef) {
      return res.status(400).json({ error: 'Missing required order data.' });
    }

    // ── Verify Payment with Paystack (CRITICAL SECURITY FIX) ──────────────────
    try {
      const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${paystackRef}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok || !verifyData.status || verifyData.data.status !== 'success') {
        console.error('Paystack verification failed:', verifyData);
        return res.status(400).json({ error: 'Payment verification failed. Cannot create order.' });
      }

      if (verifyData.data.amount < paystackAmount) {
        console.error(`Amount mismatch. Expected at least ${paystackAmount}, got ${verifyData.data.amount}`);
        return res.status(400).json({ error: 'Payment amount verification failed.' });
      }
    } catch (error) {
      console.error('Error verifying Paystack payment:', error);
      return res.status(500).json({ error: 'Internal server error during payment verification.' });
    }

    const orderPayload = {
      payment_method: 'paystack',
      payment_method_title: 'Paystack',
      set_paid: true,
      status: 'processing',
      transaction_id: paystackRef,
      currency: 'GHS',
      billing: {
        first_name: billing.firstName || '',
        last_name: billing.lastName || '',
        email: billing.email || '',
        phone: billing.phone || '',
        address_1: billing.address || '',
        city: billing.city || 'Accra',
        country: 'GH',
      },
      shipping: {
        first_name: billing.firstName || '',
        last_name: billing.lastName || '',
        address_1: billing.address || '',
        city: billing.city || 'Accra',
        country: 'GH',
      },
      line_items: lineItems.map((item: any) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        ...(item.variation_id && { variation_id: item.variation_id }),
      })),
      meta_data: [
        { key: '_paystack_reference', value: paystackRef },
        { key: '_paystack_amount_ghs', value: paystackAmount },
      ],
    };

    try {
      const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
      const wcResponse = await fetch(`${WC_URL}/wp-json/wc/v3/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const wcData = await wcResponse.json();

      if (!wcResponse.ok) {
        return res.status(wcResponse.status).json({
          error: 'Failed to create order in WooCommerce.',
          details: wcData.message || 'Unknown error',
        });
      }

      return res.status(200).json({
        success: true,
        orderId: wcData.id,
        orderKey: wcData.order_key,
        orderNumber: wcData.number,
        status: wcData.status,
        paystackRef: paystackRef,
      });
    } catch (error) {
      console.error('Order creation error:', error);
      return res.status(500).json({ error: 'Internal server error while creating order.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
