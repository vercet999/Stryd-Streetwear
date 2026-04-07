import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes FIRST
  app.get("/api/products", async (req, res) => {
    // Support both VITE_ prefixed and non-prefixed variables for flexibility
    const WC_URL = process.env.VITE_WC_URL || process.env.WC_URL;
    const WC_KEY = process.env.VITE_WC_KEY || process.env.WC_KEY;
    const WC_SECRET = process.env.VITE_WC_SECRET || process.env.WC_SECRET;

    const page = req.query.page || 1;
    const per_page = req.query.per_page || 20;
    const slug = req.query.slug;

    if (!WC_URL || !WC_KEY || !WC_SECRET) {
      return res.status(500).json({ error: "WooCommerce credentials missing" });
    }

    try {
      const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');
      let url = `${WC_URL}/wp-json/wc/v3/products?page=${page}&per_page=${per_page}`;
      if (slug) {
        url += `&slug=${slug}`;
      }
      
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
