export default async function handler(req, res) {
  const WC_URL = process.env.WC_URL;
  const WC_KEY = process.env.WC_KEY;
  const WC_SECRET = process.env.WC_SECRET;

  const page = req.query.page || 1;
  const per_page = req.query.per_page || 20;
  const slug = req.query.slug;

  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

  try {
    let url = `${WC_URL}/wp-json/wc/v3/products?page=${page}&per_page=${per_page}`;
    if (slug) {
      url += `&slug=${slug}`;
    }

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
