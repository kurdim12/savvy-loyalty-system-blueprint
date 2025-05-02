
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CoffeeIcon } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6 text-amber-700">
          <CoffeeIcon className="h-16 w-16 mx-auto" />
        </div>
        
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Raw Smith Coffee</h1>
        <h2 className="text-xl font-medium text-amber-800 mb-6">Loyalty Program</h2>
        
        <p className="text-amber-700 mb-8">
          Join our loyalty program to earn points, unlock exclusive rewards, and enhance your coffee experience!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="bg-amber-700 hover:bg-amber-800"
            onClick={() => navigate('/auth')}
            size="lg"
          >
            Sign In
          </Button>
          
          <Button
            variant="outline"
            className="border-amber-700 text-amber-700 hover:bg-amber-100"
            onClick={() => navigate('/auth')}
            size="lg"
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
