/**
 * Meta Conversions API (CAPI) - Server-side event relay
 *
 * Vercel Serverless Function that forwards events to Meta's Conversions API.
 * This improves ad attribution accuracy beyond client-side Pixel alone.
 *
 * Required Vercel Environment Variables:
 *   META_PIXEL_ID     - Your Meta Pixel ID
 *   META_ACCESS_TOKEN  - Conversions API access token (from Events Manager)
 *
 * Client sends POST to /api/meta-capi with JSON body:
 *   { event_name, event_time, user_data, custom_data, event_source_url, action_source }
 */

const GRAPH_API_VERSION = 'v21.0';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    return res.status(500).json({ error: 'Meta CAPI not configured' });
  }

  try {
    const {
      event_name,
      event_time,
      user_data = {},
      custom_data = {},
      event_source_url,
      action_source = 'website'
    } = req.body;

    if (!event_name) {
      return res.status(400).json({ error: 'event_name is required' });
    }

    // Hash user data fields for privacy (Meta requires SHA-256 hashed PII)
    const hashedUserData = {};
    if (user_data.client_ip_address) {
      hashedUserData.client_ip_address = user_data.client_ip_address;
    } else {
      // Use request IP as fallback
      hashedUserData.client_ip_address =
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.headers['x-real-ip'] ||
        '0.0.0.0';
    }
    if (user_data.client_user_agent) {
      hashedUserData.client_user_agent = user_data.client_user_agent;
    } else {
      hashedUserData.client_user_agent = req.headers['user-agent'] || '';
    }
    if (user_data.fbc) hashedUserData.fbc = user_data.fbc;
    if (user_data.fbp) hashedUserData.fbp = user_data.fbp;

    const eventPayload = {
      data: [
        {
          event_name: event_name,
          event_time: event_time || Math.floor(Date.now() / 1000),
          action_source: action_source,
          event_source_url: event_source_url || '',
          user_data: hashedUserData,
          custom_data: custom_data
        }
      ]
    };

    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events?access_token=${accessToken}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Meta CAPI error:', result);
      return res.status(response.status).json({ error: 'Meta API error', details: result });
    }

    return res.status(200).json({ success: true, events_received: result.events_received });
  } catch (err) {
    console.error('CAPI handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
