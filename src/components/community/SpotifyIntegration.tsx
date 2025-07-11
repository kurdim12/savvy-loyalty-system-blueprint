import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipForward, Search, Music, Users, Smartphone, Heart } from 'lucide-react';
import { useSpotify } from '@/hooks/useSpotify';
import { toast } from 'sonner';

export const SpotifyIntegration = () => {
  const {
    isAuthenticated,
    isLoading,
    user,
    playbackState,
    devices,
    authenticate,
    searchTracks,
    getCurrentPlayback,
    playTrack,
    pausePlayback,
    nextTrack,
    getDevices,
    logout,
    handleCallback
  } = useSpotify();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Check for callback on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      toast.error('Spotify authentication failed');
      // Clear URL params with throttling
      setTimeout(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 100);
    } else if (code && !isAuthenticated) {
      handleCallback(code);
      // Clear URL params with throttling
      setTimeout(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 100);
    }
  }, [isAuthenticated, handleCallback]);

  // Fetch current playback and devices when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getCurrentPlayback();
      getDevices();
      
      // Poll for playback updates
      const interval = setInterval(getCurrentPlayback, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchTracks(searchQuery);
      setSearchResults(results);
    } catch (error) {
      toast.error('Failed to search tracks');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlayTrack = async (uri: string, trackName: string) => {
    try {
      await playTrack(uri);
      toast.success(`Now playing: ${trackName}`);
    } catch (error) {
      toast.error('Failed to play track. Make sure Spotify is open on a device.');
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isAuthenticated) {
    return (
      <Card className="bg-gradient-to-r from-green-900/20 to-black/20 border-green-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Music className="h-6 w-6 text-green-400" />
            Connect to Spotify
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-green-200">
            Connect your Spotify account to control music throughout the café and share your favorite tracks with other patrons!
          </p>
          <Button 
            onClick={authenticate}
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            {isLoading ? 'Connecting...' : 'Connect with Spotify'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Profile & Current Playback */}
      <Card className="bg-gradient-to-r from-green-900/20 to-black/20 border-green-400/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className="h-6 w-6 text-green-400" />
              <div>
                <span>Spotify Connected</span>
                {user && (
                  <div className="text-sm text-green-200 font-normal">
                    Welcome, {user.display_name}!
                  </div>
                )}
              </div>
            </div>
            <Button 
              onClick={logout}
              variant="outline"
              size="sm"
              className="border-green-400/50 text-green-200 hover:bg-green-400/10"
            >
              Disconnect
            </Button>
          </CardTitle>
        </CardHeader>

        {playbackState?.item && (
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
                {playbackState.item.album.images[0] ? (
                  <img 
                    src={playbackState.item.album.images[0].url} 
                    alt={playbackState.item.album.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <Music className="h-8 w-8 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white">{playbackState.item.name}</h4>
                <p className="text-green-200 text-sm">
                  {playbackState.item.artists.map(a => a.name).join(', ')}
                </p>
                <p className="text-xs text-green-300">{playbackState.item.album.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-green-300">
                {formatDuration(playbackState.progress_ms)}
              </span>
              <Progress 
                value={(playbackState.progress_ms / playbackState.item.duration_ms) * 100} 
                className="h-2 flex-1 bg-green-900/50" 
              />
              <span className="text-xs text-green-300">
                {formatDuration(playbackState.item.duration_ms)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  onClick={playbackState.is_playing ? pausePlayback : () => {}}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  {playbackState.is_playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={nextTrack}
                  variant="outline"
                  size="sm"
                  className="border-green-400/50 text-green-200 hover:bg-green-400/10"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {playbackState.device && (
                  <Badge className="bg-green-600/20 text-green-200 border-green-400/30">
                    <Smartphone className="h-3 w-3 mr-1" />
                    {playbackState.device.name}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Search & Control */}
      <Card className="bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-[#8B4513] flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Play Music
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for songs, artists, or albums..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
            >
              {isSearching ? '...' : <Search className="h-4 w-4" />}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <h4 className="font-medium text-[#8B4513]">Search Results:</h4>
              {searchResults.map((track) => (
                <div key={track.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      {track.album.images[0] ? (
                        <img 
                          src={track.album.images[0].url} 
                          alt={track.album.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <Music className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-[#8B4513]">{track.name}</h5>
                      <p className="text-sm text-gray-600">
                        {track.artists.map(a => a.name).join(', ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {track.album.name} • {formatDuration(track.duration_ms)}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handlePlayTrack(track.uri, track.name)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Devices */}
      {devices.length > 0 && (
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-[#8B4513] flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Available Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {devices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-[#8B4513]" />
                    <div>
                      <p className="font-medium text-[#8B4513]">{device.name}</p>
                      <p className="text-xs text-gray-600">{device.type}</p>
                    </div>
                  </div>
                  <Badge className={device.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                    {device.is_active ? "Active" : "Available"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
