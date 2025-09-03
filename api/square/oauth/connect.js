import { v4 as uuidv4 } from 'uuid';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const state = uuidv4();
    
    // Square OAuth URL
    const base = 'https://connect.squareup.com';
    const url = new URL(base + '/oauth2/authorize');
    
    // Your Square App ID
    url.searchParams.set('client_id', 'sq0idp-jXJquQQ4uPG0_NwR7DL86Q');
    url.searchParams.set('scope', 'CUSTOMERS_READ CUSTOMERS_WRITE PAYMENTS_WRITE PAYMENTS_READ');
    url.searchParams.set('session', 'false');
    url.searchParams.set('state', state);
    url.searchParams.set('redirect_uri', 'https://ai-voice-agent-phi.vercel.app/api/square/oauth/callback');
    
    // Redirect to Square OAuth
    res.redirect(url.toString());
  } catch (error) {
    console.error('OAuth connect error:', error);
    res.status(500).json({ error: 'OAuth initialization failed' });
  }
}
