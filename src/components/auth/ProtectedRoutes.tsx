
import { ReactNode, useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

// Component for routes that require user authentication
export function UserRoute({ children }: { children: ReactNode }) {
  const { user, loading, isUser, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isPageReady, setIsPageReady] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  console.log("UserRoute: Initializing with auth state:", { 
    user: user ? 'exists' : 'null', 
    loading, 
    isUser, 
    isAdmin 
  });

  // Add timeout to prevent indefinite loading
  useEffect(() => {
    // Set a timeout to show content regardless of auth state if it takes too long
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('UserRoute: Auth loading timeout reached, forcing page display');
        setIsPageReady(true);
        setAuthChecked(true);
        setLoadingTimeout(true);
      }
    }, 3000); // 3 seconds max loading time

    return () => clearTimeout(timeoutId);
  }, [loading]);

  // If auth is done loading, or timeout reached, update page ready state
  useEffect(() => {
    if (!loading) {
      console.log('UserRoute: Auth loading complete, preparing page');
      // Small delay to ensure auth context is fully processed
      const readyTimer = setTimeout(() => {
        setIsPageReady(true);
        setAuthChecked(true);
      }, 200);
      
      return () => clearTimeout(readyTimer);
    }
  }, [loading]);

  // Force redirect if loading times out with no user
  useEffect(() => {
    if (loadingTimeout && !user && !loading) {
      console.log('UserRoute: Loading timed out with no user, redirecting to auth');
      toast.error('Please sign in to access this page');
      navigate('/auth', { replace: true });
    }
  }, [loadingTimeout, user, loading, navigate]);

  if (loading && !isPageReady) {
    console.log('UserRoute: Showing loading state');
    return <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
      <div className="space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent"></div>
        <p className="text-[#8B4513] text-sm">Loading authentication...</p>
      </div>
    </div>;
  }

  // Only check access after auth state is confirmed
  if (authChecked) {
    console.log('UserRoute: Auth checked, evaluating access');

    // Not authenticated at all
    if (!user) {
      console.log('UserRoute: No user found, redirecting to auth');
      toast.error('Please sign in to access this page');
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    // Admin accessing user routes (optional, can allow or redirect)
    if (isAdmin) {
      console.log('UserRoute: Admin user accessing user route - allowing access');
      // We allow admins to view user pages
      return <>{children}</>;
    }

    // Ensure only users can access this route
    if (isUser) {
      console.log('UserRoute: User access granted');
      return <>{children}</>;
    }

    // Fallback - something is wrong with the role
    console.log('UserRoute: No valid role found (not user or admin)');
    toast.error('Access denied. Contact support if you think this is a mistake.');
    return <Navigate to="/auth" replace />;
  }

  // Show loading state while checking auth
  return <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
    <div className="space-y-4">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent"></div>
      <p className="text-[#8B4513] text-sm">Verifying access...</p>
    </div>
  </div>;
}

// Component for routes that require admin authentication
export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isPageReady, setIsPageReady] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  console.log("AdminRoute: Initializing with auth state:", { 
    user: user ? 'exists' : 'null',
    loading, 
    isAdmin 
  });

  // Add timeout to prevent indefinite loading
  useEffect(() => {
    // Set a timeout to show content regardless of auth state if it takes too long
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('AdminRoute: Auth loading timeout reached, forcing page display');
        setIsPageReady(true);
        setAuthChecked(true);
        setLoadingTimeout(true);
      }
    }, 3000); // 3 seconds max loading time

    return () => clearTimeout(timeoutId);
  }, [loading]);

  // If auth is done loading, or timeout reached, update page ready state
  useEffect(() => {
    if (!loading) {
      console.log('AdminRoute: Auth loading complete, preparing page');
      // Small delay to ensure auth context is fully processed
      const readyTimer = setTimeout(() => {
        setIsPageReady(true);
        setAuthChecked(true);
      }, 200);
      
      return () => clearTimeout(readyTimer);
    }
  }, [loading]);
  
  // Force redirect if loading times out with no user
  useEffect(() => {
    if (loadingTimeout && !user && !loading) {
      console.log('AdminRoute: Loading timed out with no user, redirecting to admin login');
      toast.error('Please sign in to access the admin area');
      navigate('/admin/login', { replace: true });
    }
  }, [loadingTimeout, user, loading, navigate]);

  if (loading && !isPageReady) {
    console.log('AdminRoute: Showing loading state');
    return <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
      <div className="space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent"></div>
        <p className="text-[#8B4513] text-sm">Loading admin access...</p>
      </div>
    </div>;
  }

  // Only check access after auth state is confirmed
  if (authChecked) {
    console.log('AdminRoute: Auth checked, evaluating access');

    // Not authenticated at all
    if (!user) {
      console.log('AdminRoute: No user found, redirecting to admin login');
      toast.error('Please sign in to access the admin area');
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Only allow admins
    if (!isAdmin) {
      console.log('AdminRoute: User is not an admin, access denied');
      toast.error('Access denied. You do not have admin privileges.');
      return <Navigate to="/auth" replace />;
    }

    console.log('AdminRoute: Admin access granted');
    return <>{children}</>;
  }

  // Show loading state while checking auth
  return <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
    <div className="space-y-4">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent"></div>
      <p className="text-[#8B4513] text-sm">Verifying admin access...</p>
    </div>
  </div>;
}

// Component for public routes that should redirect authenticated users
export function PublicRoute({ children }: { children: ReactNode }) {
  const { user, isAdmin, isUser, loading } = useAuth();
  const [isPageReady, setIsPageReady] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  
  console.log("PublicRoute: Initializing with auth state:", { 
    user: user ? 'exists' : 'null', 
    loading, 
    isAdmin, 
    isUser 
  });
  
  // Add timeout to prevent indefinite loading
  useEffect(() => {
    // Set a timeout to show content regardless of auth state if it takes too long
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('PublicRoute: Auth loading timeout reached, forcing page display');
        setIsPageReady(true);
        setAuthChecked(true);
      }
    }, 3000); // 3 seconds max loading time

    return () => clearTimeout(timeoutId);
  }, [loading]);

  // If auth is done loading, or timeout reached, update page ready state
  useEffect(() => {
    if (!loading) {
      console.log('PublicRoute: Auth loading complete, preparing page');
      // Small delay to ensure auth context is fully processed
      const readyTimer = setTimeout(() => {
        setIsPageReady(true);
        setAuthChecked(true);
      }, 200);
      
      return () => clearTimeout(readyTimer);
    }
  }, [loading]);

  if (loading && !isPageReady) {
    console.log('PublicRoute: Showing loading state');
    return <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
      <div className="space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent"></div>
        <p className="text-[#8B4513] text-sm">Loading...</p>
      </div>
    </div>;
  }

  // Only handle redirects after auth state is confirmed
  if (authChecked) {
    console.log('PublicRoute: Auth checked, evaluating redirects');
    // Redirect authenticated users to their appropriate dashboard
    if (user) {
      console.log('PublicRoute: User authenticated, redirecting to dashboard');
      if (isAdmin) {
        return <Navigate to="/admin/dashboard" replace />;
      } else if (isUser) {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  console.log('PublicRoute: No authenticated user, showing public content');
  return <>{children}</>;
}
