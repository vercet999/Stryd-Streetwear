/**
 * STRYD GH — Vercel Serverless Function
 * POST /api/orders
 *
 * Creates a WooCommerce order after Paystack payment is confirmed.
 * Keys never touch the browser — they live here on the server only.
 */

export default async function handler(req, res) {

    // ── CORS headers — allow your frontend domains only ──────────────────────
    const allowedOrigins = [
        'https://strydgh.com',
        'https://www.strydgh.com',
        'https://stryd-gh.vercel.app',
        'http://localhost:5173', // for local dev in GAS
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only accept POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // ── Pull credentials from Vercel environment variables ───────────────────
    const WC_URL    = process.env.WC_URL;
    const WC_KEY    = process.env.WC_KEY;
    const WC_SECRET = process.env.WC_SECRET;
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

    if (!WC_URL || !WC_KEY || !WC_SECRET || !PAYSTACK_SECRET_KEY) {
        return res.status(500).json({ error: 'Server configuration error. Credentials missing.' });
    }

    // ── Parse the request body ────────────────────────────────────────────────
    const {
        billing,        // { firstName, lastName, email, phone, address }
        lineItems,      // [{ product_id, quantity, variation_id? }]
        paystackRef,    // Paystack transaction reference
        paystackAmount, // Amount charged in GHS (pesewas / 100)
    } = req.body;

    // Basic validation
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

        // Verify the amount matches what we expect (in pesewas)
        // Paystack returns amount in pesewas. We compare it to the paystackAmount sent by the client.
        // In a fully secure system, the backend should calculate the expected amount independently 
        // based on the lineItems, rather than trusting the client's paystackAmount.
        // For now, we at least ensure the transaction amount matches the claimed amount.
        if (verifyData.data.amount < paystackAmount) {
            console.error(`Amount mismatch. Expected at least ${paystackAmount}, got ${verifyData.data.amount}`);
            return res.status(400).json({ error: 'Payment amount verification failed.' });
        }

    } catch (error) {
        console.error('Error verifying Paystack payment:', error);
        return res.status(500).json({ error: 'Internal server error during payment verification.' });
    }

    // ── Build the WooCommerce order payload ───────────────────────────────────
    const orderPayload = {
        payment_method:       'paystack',
        payment_method_title: 'Paystack',
        set_paid:             true,
        status:               'processing',
        transaction_id:       paystackRef,
        currency:             'GHS',

        billing: {
            first_name: billing.firstName || '',
            last_name:  billing.lastName  || '',
            email:      billing.email     || '',
            phone:      billing.phone     || '',
            address_1:  billing.address   || '',
            city:       billing.city      || 'Accra',
            country:    'GH',
        },

        // Shipping same as billing for now
        shipping: {
            first_name: billing.firstName || '',
            last_name:  billing.lastName  || '',
            address_1:  billing.address   || '',
            city:       billing.city      || 'Accra',
            country:    'GH',
        },

        line_items: lineItems.map(item => ({
            product_id:   item.product_id,
            quantity:     item.quantity,
            ...(item.variation_id && { variation_id: item.variation_id }),
        })),

        // Store Paystack reference in order meta for reconciliation
        meta_data: [
            {
                key:   '_paystack_reference',
                value: paystackRef,
            },
            {
                key:   '_paystack_amount_ghs',
                value: paystackAmount,
            },
        ],
    };

    // ── POST to WooCommerce REST API ──────────────────────────────────────────
    try {
        const credentials = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

        const wcResponse = await fetch(`${WC_URL}/wp-json/wc/v3/orders`, {
            method:  'POST',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Basic ${credentials}`,
            },
            body: JSON.stringify(orderPayload),
        });

        const wcData = await wcResponse.json();

        if (!wcResponse.ok) {
            console.error('WooCommerce error:', wcData);
            return res.status(wcResponse.status).json({
                error:   'Failed to create order in WooCommerce.',
                details: wcData.message || 'Unknown error',
            });
        }

        // ── Success — return the WooCommerce order ID to the frontend ─────────
        return res.status(200).json({
            success:          true,
            orderId:          wcData.id,
            orderKey:         wcData.order_key,
            orderNumber:      wcData.number,
            status:           wcData.status,
            paystackRef:      paystackRef,
        });

    } catch (error) {
        console.error('Order creation error:', error);
        return res.status(500).json({
            error: 'Internal server error while creating order.',
        });
    }
}
