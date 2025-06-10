
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CommunityHub = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to community page since hub tab was removed
    navigate('/community', { replace: true });
  }, [navigate]);

  return null;
};

export default CommunityHub;
