
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    
    // Get action from URL params for GET requests, or from body for POST requests
    let action: string | null = null;
    let requestBody: any = {};

    if (req.method === 'GET') {
      action = url.searchParams.get('action');
    } else if (req.method === 'POST') {
      try {
        requestBody = await req.json();
        action = requestBody.action;
      } catch (e) {
        console.error('Error parsing request body:', e);
        action = url.searchParams.get('action');
      }
    }

    console.log('Action received:', action);
    console.log('Request method:', req.method);

    const SPOTIFY_CLIENT_ID = Deno.env.get('SPOTIFY_CLIENT_ID')
    const SPOTIFY_CLIENT_SECRET = Deno.env.get('SPOTIFY_CLIENT_SECRET')
    const REDIRECT_URI = `${url.origin}/auth/spotify/callback`

    console.log('Spotify Client ID:', SPOTIFY_CLIENT_ID ? 'Set' : 'Not set');
    console.log('Spotify Client Secret:', SPOTIFY_CLIENT_SECRET ? 'Set' : 'Not set');

    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      throw new Error('Spotify credentials not configured')
    }

    if (action === 'authorize') {
      console.log('Generating authorization URL...');
      
      // Generate authorization URL
      const scopes = [
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
        'playlist-read-private',
        'playlist-modify-public',
        'playlist-modify-private',
        'user-library-read',
        'user-library-modify'
      ].join(' ')

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: SPOTIFY_CLIENT_ID,
        scope: scopes,
        redirect_uri: REDIRECT_URI,
        state: crypto.randomUUID()
      })

      const authUrl = `https://accounts.spotify.com/authorize?${params}`
      
      console.log('Auth URL generated:', authUrl);
      
      return new Response(JSON.stringify({ authUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'callback') {
      const code = url.searchParams.get('code') || requestBody.code
      const state = url.searchParams.get('state') || requestBody.state

      console.log('Callback received with code:', code ? 'Present' : 'Missing');

      if (!code) {
        throw new Error('No authorization code provided')
      }

      // Exchange code for access token
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: REDIRECT_URI
        })
      })

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Token exchange failed:', errorText);
        throw new Error('Failed to exchange code for token')
      }

      const tokens = await tokenResponse.json()
      
      return new Response(JSON.stringify(tokens), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'refresh') {
      const refresh_token = requestBody.refresh_token

      if (!refresh_token) {
        throw new Error('No refresh token provided')
      }

      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token
        })
      })

      if (!tokenResponse.ok) {
        throw new Error('Failed to refresh token')
      }

      const tokens = await tokenResponse.json()
      
      return new Response(JSON.stringify(tokens), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.error('Invalid action received:', action);
    return new Response(JSON.stringify({ error: 'Invalid action', receivedAction: action }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Spotify auth error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
