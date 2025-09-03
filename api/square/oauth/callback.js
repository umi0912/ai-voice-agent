module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, state } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code' });
    }

    // For now, just redirect back to the main page
    // In production, you would exchange the code for a token here
    res.redirect('https://ai-voice-agent-phi.vercel.app/?oauth_success=true');
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'OAuth callback failed' });
  }
}
