
import { ReactNode, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

// Component for routes that require user authentication
export function UserRoute({ children }: { children: ReactNode }) {
  const { user, loading, isUser, isAdmin } = useAuth();
  const location = useLocation();
  const [isPageReady, setIsPageReady] = useState(false);

  // Add timeout to prevent indefinite loading
  useEffect(() => {
    // Set a timeout to show content regardless of auth state if it takes too long
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('Auth loading timeout reached, forcing page display');
        setIsPageReady(true);
      }
    }, 5000); // 5 seconds max loading time

    return () => clearTimeout(timeoutId);
  }, [loading]);

  // If auth is done loading, or timeout reached, update page ready state
  useEffect(() => {
    if (!loading || isPageReady) {
      setIsPageReady(true);
    }
  }, [loading, isPageReady]);

  if (loading && !isPageReady) {
    return <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
      <div className="space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent"></div>
        <p className="text-[#8B4513] text-sm">Loading authentication...</p>
      </div>
    </div>;
  }

  // Not authenticated at all
  if (!user) {
    toast.error('Please sign in to access this page');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Admin accessing user routes (optional, can allow or redirect)
  if (isAdmin) {
    // Uncomment the below lines if you want to redirect admins away from user pages
    // toast.info('Redirecting to admin dashboard');
    // return <Navigate to="/admin/dashboard" replace />;
    
    // Or let admins view user pages if preferred
    return <>{children}</>;
  }

  // Ensure only users can access this route
  if (isUser) {
    return <>{children}</>;
  }

  // Fallback - something is wrong with the role
  toast.error('Access denied. Contact support if you think this is a mistake.');
  return <Navigate to="/auth" replace />;
}

// Component for routes that require admin authentication
export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  const [isPageReady, setIsPageReady] = useState(false);

  // Add timeout to prevent indefinite loading
  useEffect(() => {
    // Set a timeout to show content regardless of auth state if it takes too long
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('Auth loading timeout reached, forcing page display');
        setIsPageReady(true);
      }
    }, 5000); // 5 seconds max loading time

    return () => clearTimeout(timeoutId);
  }, [loading]);

  // If auth is done loading, or timeout reached, update page ready state
  useEffect(() => {
    if (!loading || isPageReady) {
      setIsPageReady(true);
    }
  }, [loading, isPageReady]);

  if (loading && !isPageReady) {
    return <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
      <div className="space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent"></div>
        <p className="text-[#8B4513] text-sm">Loading admin access...</p>
      </div>
    </div>;
  }

  // Not authenticated at all
  if (!user) {
    toast.error('Please sign in to access the admin area');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Only allow admins
  if (!isAdmin) {
    toast.error('Access denied. You do not have admin privileges.');
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

// Component for public routes that should redirect authenticated users
export function PublicRoute({ children }: { children: ReactNode }) {
  const { user, isAdmin, isUser, loading } = useAuth();
  const [isPageReady, setIsPageReady] = useState(false);
  
  // Add timeout to prevent indefinite loading
  useEffect(() => {
    // Set a timeout to show content regardless of auth state if it takes too long
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('Auth loading timeout reached, forcing page display');
        setIsPageReady(true);
      }
    }, 5000); // 5 seconds max loading time

    return () => clearTimeout(timeoutId);
  }, [loading]);

  // If auth is done loading, or timeout reached, update page ready state
  useEffect(() => {
    if (!loading || isPageReady) {
      setIsPageReady(true);
    }
  }, [loading, isPageReady]);

  if (loading && !isPageReady) {
    return <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
      <div className="space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent"></div>
        <p className="text-[#8B4513] text-sm">Loading...</p>
      </div>
    </div>;
  }

  // Redirect authenticated users to their appropriate dashboard
  if (user) {
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (isUser) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
