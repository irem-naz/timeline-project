import { get } from '@vercel/blob';

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Missing token');
  }

  const blob = await get(`${token}.json`);

  if (!blob || !blob.body) {
    return res.status(404).send('Timeline not found or expired.');
  }

  const raw = await blob.text();
  const data = JSON.parse(raw);

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <html>
      <head>
        <title>Timeline View</title>
        <style>
          body { font-family: sans-serif; padding: 2em; }
          pre { background: #f5f5f5; padding: 1em; border-radius: 8px; }
        </style>
      </head>
      <body>
        <h1>Timeline Viewer</h1>
        <pre>${JSON.stringify(data, null, 2)}</pre>
        <p><i>This data is stored in Vercel Blob and is temporary. You may delete it anytime by redeploying or rotating tokens.</i></p>
      </body>
    </html>
  `);
}
