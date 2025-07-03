import { getDownloadUrl } from '@vercel/blob';

export default async function handler(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).send('Missing token');
  try {
    const blobName = `${token}.json`;
    let path;
    try {
      path = await getDownloadUrl(blobName); // Note: it's ASYNC!
      console.log('getDownloadUrl result:', path);
    } catch (err) {
      console.error('getDownloadUrl error:', err);
      throw err;
    }

    if (!path || typeof path !== 'string') {
      throw new Error('No valid blob URL/path returned');
    }

    // Fetch the JSON content directly
    const response = await fetch(path);
    if (!response.ok) return res.status(404).send('Timeline not found or expired.');
    const data = await response.json();

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(/* ... your HTML ... */);

  } catch (err) {
    console.error('❌ Blob read failed:', err);
    res.status(500).send('500 | Internal Server Error.');
  }
}
