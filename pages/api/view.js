const storeId = process.env.BLOB_STORE_ID;
const timelineUiHtml = require('./timelineUiHtml');

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
    res.status(200).send(timelineUiHtml(data));

  } catch (err) {
    console.error('❌ Blob read failed:', err);
    res.status(500).send('500 | Internal Server Error.');
  }
}
