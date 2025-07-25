export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://image-resizer-js.vercel.app/</loc>
    <lastmod>2025-07-26</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://image-resizer-js.vercel.app/privacy.html</loc>
    <lastmod>2025-07-26</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://image-resizer-js.vercel.app/terms.html</loc>
    <lastmod>2025-07-26</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`);
}
