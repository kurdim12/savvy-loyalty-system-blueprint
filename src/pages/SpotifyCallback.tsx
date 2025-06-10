
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpotify } from '@/hooks/useSpotify';
import { toast } from 'sonner';

const SpotifyCallback = () => {
  const navigate = useNavigate();
  const { handleCallback } = useSpotify();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      toast.error('Spotify authentication failed');
      navigate('/community');
    } else if (code) {
      handleCallback(code);
      navigate('/community');
    } else {
      navigate('/community');
    }
  }, [handleCallback, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF6F0] to-[#F5E6D3] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513] mx-auto mb-4"></div>
        <p className="text-[#8B4513] text-lg">Connecting to Spotify...</p>
      </div>
    </div>
  );
};

export default SpotifyCallback;
