
import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import { toast } from 'sonner';

interface LayoutProps {
  children: ReactNode;
  requireTier?: 'bronze' | 'silver' | 'gold';
  adminOnly?: boolean;
}

export default function Layout({ 
  children, 
  requireTier,
  adminOnly
}: LayoutProps) {
  const { user, loading, isAdmin, isUser, session, membershipTier, profile } = useAuth();
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
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent"></div>
      </div>
    );
  }

  // Handle admin-only routes
  if (adminOnly) {
    if (!user) {
      toast.error('Please sign in to access the admin area');
      return <Navigate to="/admin/login" replace />;
    }
    
    if (!isAdmin) {
      toast.error('Access denied. You do not have admin privileges.');
      return <Navigate to="/auth" replace />;
    }
    
    // Admin is authenticated, continue
  } 
  // For regular user routes
  else if (!user) {
    toast.error('Please sign in to access this page');
    return <Navigate to="/auth" replace />;
  }

  // If admin tries to access user routes - we'll allow it, but this could be changed
  // to redirect to admin dashboard if preferred
  if (isAdmin && !adminOnly) {
    // Uncomment below to redirect admins to admin dashboard
    // toast.info('Redirecting to admin dashboard');
    // return <Navigate to="/admin/dashboard" replace />;
  }
  
  // Ensure only users can access user routes
  if (!isUser && !isAdmin) {
    toast.error('Access denied. Contact support if you think this is a mistake.');
    return <Navigate to="/auth" replace />;
  }

  // Additional security: Verify session existence
  if (!session) {
    toast.error('Session information missing. Please sign in again.');
    return <Navigate to="/auth" replace />;
  }

  // Check membership tier requirement if specified
  if (requireTier && profile && !adminOnly) {
    const tierValues: Record<string, number> = {
      'bronze': 1,
      'silver': 2,
      'gold': 3
    };
    
    const userTierValue = tierValues[membershipTier] || 0;
    const requiredTierValue = tierValues[requireTier] || 0;
    
    if (userTierValue < requiredTierValue) {
      toast.error(`This page requires ${requireTier} tier membership or higher`);
      return <Navigate to="/dashboard" replace />;
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF6F0]">
      <Header />
      <main className="flex-1 p-4 md:p-6 container mx-auto">
        {children}
      </main>
      <footer className="py-4 px-6 text-center text-sm text-[#6F4E37] border-t border-[#8B4513]/10">
        &copy; {new Date().getFullYear()} Raw Smith Coffee Loyalty Program
      </footer>
    </div>
  );
}
