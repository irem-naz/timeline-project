import { timelineStore } from './generate';

export default async function handler(req, res) {
  const { token } = req.query;
  if (!token || !timelineStore.has(token)) {
    return res.status(404).send('Timeline not found or expired.');
  }

  const data = timelineStore.get(token);
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
        <p><i>This data is stored temporarily in memory and will be lost on redeploy or cold start.</i></p>
      </body>
    </html>
  `);
}
