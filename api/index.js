module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Square Voice Agent</title>
</head>
<body>
    <h1>Square Voice Agent</h1>
    <p>Welcome to the Square Voice Agent application!</p>
    <div class="hint">
        <a href="/api/square/oauth/connect">Connect to Square</a>
    </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (error) {
    console.error('Error in index handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
