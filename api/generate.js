const timelineStore = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body;
  if (!body || !body.entries || !Array.isArray(body.entries)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  const token = Math.random().toString(36).substring(2, 8);
  timelineStore.set(token, body);

  return res.status(200).json({
    url: `https://${req.headers.host}/api/view?token=${token}`
  });
}

export { timelineStore };
