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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
      return res.status(200).end();
  }

  // Only accept GET
  if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
  }

  const WC_URL = process.env.WC_URL;
  const WC_KEY = process.env.WC_KEY;
  const WC_SECRET = process.env.WC_SECRET;

  const page = req.query.page || 1;
  const per_page = req.query.per_page || 20;
  const slug = req.query.slug;

  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

  try {
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
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
}
