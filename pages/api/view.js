const storeId = 'cx1a85iwnbqc9ajm'; // ← REPLACE with your Blob Store ID!

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Missing token');
  }

  try {
    // Construct the public blob URL
    const url = `https://${storeId}.public.blob.vercel-storage.com/${token}.json`;

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(404).send('Timeline not found or expired.');
    }

    const data = await response.json();

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

  } catch (err) {
    console.error('❌ Blob read failed:', err);
    res.status(500).send('500 | Internal Server Error.');
  }
}
