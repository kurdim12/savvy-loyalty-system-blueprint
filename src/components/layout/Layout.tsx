
import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import { toast } from 'sonner';

interface LayoutProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function Layout({ children, adminOnly = false }: LayoutProps) {
  const { user, loading, isAdmin, session } = useAuth();
  const navigate = useNavigate();

  // Check authentication session expiration
  useEffect(() => {
    const checkSessionExpiration = () => {
      // If we have a user but session might be expired
      if (user && session) {
        const expiresAt = session.expires_at;
        if (!expiresAt) return;
        
        const now = Math.floor(Date.now() / 1000);
        
        // If token is expired or about to expire (within 60 seconds)
        if (expiresAt - now < 60) {
          toast.error('Your session has expired. Please sign in again.');
          // Redirect to auth after a short delay
          setTimeout(() => {
            navigate('/auth', { replace: true });
          }, 1500);
        }
      }
    };
    
    checkSessionExpiration();
    // Check every minute
    const intervalId = setInterval(checkSessionExpiration, 60000);
    
    return () => clearInterval(intervalId);
  }, [user, navigate, session]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-amber-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-700 border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Additional security: Verify session existence
  if (!session) {
    toast.error('Session information missing. Please sign in again.');
    return <Navigate to="/auth" replace />;
  }

  // If this is an admin-only route and user is not an admin
  if (adminOnly && !isAdmin) {
    toast.error('You do not have permission to access this page');
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <Header />
      <main className="flex-1 p-4 md:p-6 container mx-auto">
        {children}
      </main>
      <footer className="py-4 px-6 text-center text-sm text-amber-700 border-t">
        &copy; {new Date().getFullYear()} Raw Smith Coffee Loyalty Program
      </footer>
    </div>
  );
}
