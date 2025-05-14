
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import { toast } from 'sonner';
import { FullPageSkeleton, DashboardSkeleton } from '@/components/ui/skeleton';

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
  const [pageReady, setPageReady] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  console.log("Layout mounting, auth state:", { 
    user: user ? 'exists' : 'null', 
    isAdmin, 
    isUser, 
    loading, 
    authCheckComplete 
  });

  // Set a maximum wait time for loading to prevent indefinite loading screens
  useEffect(() => {
    const maxLoadingTime = setTimeout(() => {
      console.log("Maximum loading time reached, forcing display");
      setPageReady(true);
      setInitialLoad(false);
      setAuthCheckComplete(true);
      setLoadingTimeout(true);
    }, 3000); // 3 seconds max loading time
    
    return () => clearTimeout(maxLoadingTime);
  }, []);

  // Update page ready state when loading completes
  useEffect(() => {
    if (!loading) {
      console.log("Loading complete, setting page ready");
      // Add a small delay to ensure all data is processed
      const readyTimer = setTimeout(() => {
        setPageReady(true);
        setInitialLoad(false);
        setAuthCheckComplete(true);
      }, 300);
      
      return () => clearTimeout(readyTimer);
    }
  }, [loading]);

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

  // Log state for debugging
  useEffect(() => {
    console.log("Layout state updated:", {
      user: user ? 'exists' : 'null',
      isAdmin,
      isUser,
      loading,
      pageReady,
      authCheckComplete,
      loadingTimeout
    });
  }, [user, isAdmin, isUser, loading, pageReady, authCheckComplete, loadingTimeout]);

  // Show skeleton loading state during initial load
  if ((loading || !pageReady) && initialLoad) {
    console.log("Showing loading skeleton");
    return (
      <div className="flex min-h-screen flex-col bg-[#FAF6F0]">
        <Header />
        <main className="flex-1 p-4 md:p-6 container mx-auto">
          <DashboardSkeleton />
        </main>
        <footer className="py-4 px-6 text-center text-sm text-[#6F4E37] border-t border-[#8B4513]/10">
          &copy; {new Date().getFullYear()} Raw Smith Coffee Loyalty Program
        </footer>
      </div>
    );
  }

  // If loading timed out but we still don't have a user, redirect to auth
  if (loadingTimeout && !user && !loading) {
    console.log("Loading timed out without user, redirecting to auth");
    toast.error('Please sign in to continue');
    return <Navigate to="/auth" replace />;
  }

  // Wait until auth check is complete before evaluating access
  if (!authCheckComplete) {
    console.log("Auth check not complete, showing verification screen");
    return (
      <div className="flex min-h-screen flex-col bg-[#FAF6F0]">
        <Header />
        <main className="flex-1 p-4 md:p-6 container mx-auto flex items-center justify-center">
          <div className="text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent mx-auto mb-4"></div>
            <p className="text-[#8B4513]">Verifying access...</p>
          </div>
        </main>
        <footer className="py-4 px-6 text-center text-sm text-[#6F4E37] border-t border-[#8B4513]/10">
          &copy; {new Date().getFullYear()} Raw Smith Coffee Loyalty Program
        </footer>
      </div>
    );
  }

  // Handle admin-only routes
  if (adminOnly) {
    console.log("Handling admin-only route check");
    if (!user) {
      toast.error('Please sign in to access the admin area');
      return <Navigate to="/admin/login" replace />;
    }
    
    if (!isAdmin) {
      toast.error('Access denied. You do not have admin privileges.');
      return <Navigate to="/auth" replace />;
    }
    
    // Admin is authenticated, continue
    console.log("Admin authentication successful");
  } 
  // For regular user routes
  else if (!user) {
    console.log("No user found, redirecting to auth");
    toast.error('Please sign in to access this page');
    return <Navigate to="/auth" replace />;
  }

  // If admin tries to access user routes - we'll allow it
  if (isAdmin && !adminOnly) {
    console.log("Admin accessing user route - allowed");
    // We allow this, but could redirect if preferred
  }
  
  // Check if user has a valid role
  if (!isUser && !isAdmin) {
    console.log("No valid role found (neither user nor admin)");
    toast.error('Access denied. Contact support if you think this is a mistake.');
    return <Navigate to="/auth" replace />;
  }

  // Additional security: Verify session existence
  if (!session) {
    console.log("Session missing, redirecting to auth");
    toast.error('Session information missing. Please sign in again.');
    return <Navigate to="/auth" replace />;
  }

  // Check membership tier requirement if specified
  if (requireTier && profile && !adminOnly) {
    console.log("Checking membership tier requirement:", requireTier);
    const tierValues: Record<string, number> = {
      'bronze': 1,
      'silver': 2,
      'gold': 3
    };
    
    const userTierValue = tierValues[membershipTier] || 0;
    const requiredTierValue = tierValues[requireTier] || 0;
    
    if (userTierValue < requiredTierValue) {
      console.log("Insufficient membership tier");
      toast.error(`This page requires ${requireTier} tier membership or higher`);
      return <Navigate to="/dashboard" replace />;
    }
  }

  console.log("All checks passed, rendering content");
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
