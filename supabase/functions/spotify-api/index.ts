
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
    const { action, accessToken, ...params } = await req.json()

    if (!accessToken) {
      throw new Error('No access token provided')
    }

    const spotifyHeaders = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }

    let response
    
    switch (action) {
      case 'search':
        const { query, type = 'track', limit = 20 } = params
        response = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`,
          { headers: spotifyHeaders }
        )
        break

      case 'get-user-profile':
        response = await fetch('https://api.spotify.com/v1/me', {
          headers: spotifyHeaders
        })
        break

      case 'get-current-playback':
        response = await fetch('https://api.spotify.com/v1/me/player', {
          headers: spotifyHeaders
        })
        break

      case 'play':
        const { uris, device_id } = params
        const playUrl = device_id ? 
          `https://api.spotify.com/v1/me/player/play?device_id=${device_id}` :
          'https://api.spotify.com/v1/me/player/play'
        
        response = await fetch(playUrl, {
          method: 'PUT',
          headers: spotifyHeaders,
          body: JSON.stringify({ uris })
        })
        break

      case 'pause':
        response = await fetch('https://api.spotify.com/v1/me/player/pause', {
          method: 'PUT',
          headers: spotifyHeaders
        })
        break

      case 'next':
        response = await fetch('https://api.spotify.com/v1/me/player/next', {
          method: 'POST',
          headers: spotifyHeaders
        })
        break

      case 'previous':
        response = await fetch('https://api.spotify.com/v1/me/player/previous', {
          method: 'POST',
          headers: spotifyHeaders
        })
        break

      case 'get-devices':
        response = await fetch('https://api.spotify.com/v1/me/player/devices', {
          headers: spotifyHeaders
        })
        break

      case 'create-playlist':
        const { user_id, name, description, public: isPublic = false } = params
        response = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
          method: 'POST',
          headers: spotifyHeaders,
          body: JSON.stringify({
            name,
            description,
            public: isPublic
          })
        })
        break

      case 'add-tracks-to-playlist':
        const { playlist_id, track_uris } = params
        response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
          method: 'POST',
          headers: spotifyHeaders,
          body: JSON.stringify({
            uris: track_uris
          })
        })
        break

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    let data
    if (response.status === 204) {
      data = { success: true }
    } else if (response.ok) {
      data = await response.json()
    } else {
      const errorData = await response.text()
      throw new Error(`Spotify API error: ${response.status} - ${errorData}`)
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Spotify API error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
