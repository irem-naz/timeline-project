import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    if (!body || !body.entries || !Array.isArray(body.entries)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    const token = Math.random().toString(36).substring(2, 8);

    // Save timeline JSON to blob
    await put(`${token}.json`, JSON.stringify(body), {
      contentType: 'application/json'
    });

    res.status(200).json({
      url: `${req.headers.origin || 'https://timeline-startad.vercel.app'}/api/view?token=${token}`
    });

  } catch (err) {
    console.error('💥 Blob write failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
