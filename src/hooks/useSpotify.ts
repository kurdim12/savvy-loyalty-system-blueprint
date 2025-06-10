
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  uri: string;
  duration_ms: number;
  preview_url?: string;
}

interface SpotifyPlaybackState {
  is_playing: boolean;
  item?: SpotifyTrack;
  progress_ms: number;
  device?: {
    id: string;
    name: string;
    type: string;
  };
}

export const useSpotify = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokens, setTokens] = useState<SpotifyTokens | null>(null);
  const [user, setUser] = useState<any>(null);
  const [playbackState, setPlaybackState] = useState<SpotifyPlaybackState | null>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Check for stored tokens on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem('spotify_tokens');
    if (storedTokens) {
      const parsed = JSON.parse(storedTokens);
      setTokens(parsed);
      setIsAuthenticated(true);
      fetchUserProfile(parsed.access_token);
    }
  }, []);

  // Refresh token before expiry
  useEffect(() => {
    if (!tokens) return;

    const refreshInterval = setInterval(async () => {
      await refreshAccessToken();
    }, (tokens.expires_in - 300) * 1000); // Refresh 5 minutes before expiry

    return () => clearInterval(refreshInterval);
  }, [tokens]);

  const authenticate = async () => {
    try {
      setIsLoading(true);
      const { data } = await supabase.functions.invoke('spotify-auth', {
        body: { action: 'authorize' }
      });

      if (data?.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Failed to authenticate with Spotify');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallback = async (code: string) => {
    try {
      setIsLoading(true);
      const { data } = await supabase.functions.invoke('spotify-auth', {
        body: { action: 'callback', code }
      });

      if (data) {
        setTokens(data);
        setIsAuthenticated(true);
        localStorage.setItem('spotify_tokens', JSON.stringify(data));
        await fetchUserProfile(data.access_token);
        toast.success('Successfully connected to Spotify!');
      }
    } catch (error) {
      console.error('Callback error:', error);
      toast.error('Failed to complete Spotify authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    if (!tokens?.refresh_token) return;

    try {
      const { data } = await supabase.functions.invoke('spotify-auth', {
        body: { 
          action: 'refresh',
          refresh_token: tokens.refresh_token 
        }
      });

      if (data) {
        const newTokens = { ...tokens, ...data };
        setTokens(newTokens);
        localStorage.setItem('spotify_tokens', JSON.stringify(newTokens));
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
    }
  };

  const fetchUserProfile = async (accessToken: string) => {
    try {
      const { data } = await supabase.functions.invoke('spotify-api', {
        body: {
          action: 'get-user-profile',
          accessToken
        }
      });
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const searchTracks = async (query: string): Promise<SpotifyTrack[]> => {
    if (!tokens?.access_token) return [];

    try {
      const { data } = await supabase.functions.invoke('spotify-api', {
        body: {
          action: 'search',
          accessToken: tokens.access_token,
          query,
          type: 'track',
          limit: 20
        }
      });

      return data?.tracks?.items || [];
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search tracks');
      return [];
    }
  };

  const getCurrentPlayback = async () => {
    if (!tokens?.access_token) return;

    try {
      const { data } = await supabase.functions.invoke('spotify-api', {
        body: {
          action: 'get-current-playback',
          accessToken: tokens.access_token
        }
      });

      setPlaybackState(data);
      return data;
    } catch (error) {
      console.error('Failed to get playback state:', error);
    }
  };

  const playTrack = async (uri: string, deviceId?: string) => {
    if (!tokens?.access_token) return;

    try {
      await supabase.functions.invoke('spotify-api', {
        body: {
          action: 'play',
          accessToken: tokens.access_token,
          uris: [uri],
          device_id: deviceId
        }
      });

      toast.success('Track started playing!');
      await getCurrentPlayback();
    } catch (error) {
      console.error('Play error:', error);
      toast.error('Failed to play track');
    }
  };

  const pausePlayback = async () => {
    if (!tokens?.access_token) return;

    try {
      await supabase.functions.invoke('spotify-api', {
        body: {
          action: 'pause',
          accessToken: tokens.access_token
        }
      });

      await getCurrentPlayback();
    } catch (error) {
      console.error('Pause error:', error);
      toast.error('Failed to pause playback');
    }
  };

  const nextTrack = async () => {
    if (!tokens?.access_token) return;

    try {
      await supabase.functions.invoke('spotify-api', {
        body: {
          action: 'next',
          accessToken: tokens.access_token
        }
      });

      await getCurrentPlayback();
    } catch (error) {
      console.error('Next track error:', error);
      toast.error('Failed to skip to next track');
    }
  };

  const getDevices = async () => {
    if (!tokens?.access_token) return;

    try {
      const { data } = await supabase.functions.invoke('spotify-api', {
        body: {
          action: 'get-devices',
          accessToken: tokens.access_token
        }
      });

      setDevices(data?.devices || []);
      return data?.devices || [];
    } catch (error) {
      console.error('Failed to get devices:', error);
      return [];
    }
  };

  const logout = () => {
    setTokens(null);
    setIsAuthenticated(false);
    setUser(null);
    setPlaybackState(null);
    setDevices([]);
    localStorage.removeItem('spotify_tokens');
    toast.success('Logged out of Spotify');
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    playbackState,
    devices,
    authenticate,
    handleCallback,
    searchTracks,
    getCurrentPlayback,
    playTrack,
    pausePlayback,
    nextTrack,
    getDevices,
    logout
  };
};
