
import { ReactNode, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Component for routes that require user authentication
export function UserRoute({ children }: { children: ReactNode }) {
  const { user, loading, isUser, isAdmin } = useAuth();
  const location = useLocation();
  const [isPageReady, setIsPageReady] = useState(false);
  
  console.log("UserRoute: Init with auth state:", { 
    user: user ? 'exists' : 'null', 
    loading, 
    isUser, 
    isAdmin 
  });

  // Emergency timeout to prevent indefinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('UserRoute: Emergency timeout reached, forcing display');
      setIsPageReady(true);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Regular progress tracking - allow render when auth loading completes
  useEffect(() => {
    if (!loading) {
      console.log('UserRoute: Auth loading complete, preparing page');
      setIsPageReady(true);
    }
  }, [loading]);

  // Emergency page loading state
  if (!isPageReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
        <div className="text-center p-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#8B4513] text-sm">Loading authentication...</p>
          <div className="mt-6 p-4 bg-[#f0f0f0] rounded text-left text-sm">
            <p className="font-semibold mb-2">Debug Info:</p>
            <p>Current URL: {location.pathname}</p>
            <p>Auth Loading: {loading ? 'Yes' : 'No'}</p>
            <p>User: {user ? 'Yes' : 'No'}</p>
            <p>Time: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated at all
  if (!user) {
    console.log('UserRoute: No user found, redirecting to auth');
    toast.error('Please sign in to access this page');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Admin accessing user routes (we allow it)
  if (isAdmin) {
    console.log('UserRoute: Admin user accessing user route - allowing access');
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

// Component for routes that require admin authentication
export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  const [isPageReady, setIsPageReady] = useState(false);
  
  console.log("AdminRoute: Init with auth state:", { 
    user: user ? 'exists' : 'null',
    loading, 
    isAdmin 
  });

  // Emergency timeout to prevent indefinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('AdminRoute: Emergency timeout reached, forcing display');
      setIsPageReady(true);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Regular progress tracking - allow render when auth loading completes
  useEffect(() => {
    if (!loading) {
      console.log('AdminRoute: Auth loading complete, preparing page');
      setIsPageReady(true);
    }
  }, [loading]);

  // Emergency page loading state
  if (!isPageReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
        <div className="text-center p-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#8B4513] text-sm">Loading admin access...</p>
          <div className="mt-6 p-4 bg-[#f0f0f0] rounded text-left text-sm">
            <p className="font-semibold mb-2">Debug Info:</p>
            <p>Current URL: {location.pathname}</p>
            <p>Auth Loading: {loading ? 'Yes' : 'No'}</p>
            <p>User: {user ? 'Yes' : 'No'}</p>
            <p>Time: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    );
  }

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

// Component for public routes that should redirect authenticated users
export function PublicRoute({ children }: { children: ReactNode }) {
  const { user, isAdmin, isUser, loading } = useAuth();
  const [isPageReady, setIsPageReady] = useState(false);
  
  console.log("PublicRoute: Init with auth state:", { 
    user: user ? 'exists' : 'null', 
    loading, 
    isAdmin, 
    isUser 
  });
  
  // Emergency timeout to prevent indefinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('PublicRoute: Emergency timeout reached, forcing display');
      setIsPageReady(true);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Regular progress tracking - allow render when auth loading completes
  useEffect(() => {
    if (!loading) {
      console.log('PublicRoute: Auth loading complete, preparing page');
      setIsPageReady(true);
    }
  }, [loading]);

  // Emergency page loading state
  if (!isPageReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#8B4513] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to their appropriate dashboard
  if (user) {
    console.log('PublicRoute: User authenticated, redirecting to dashboard');
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (isUser) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  console.log('PublicRoute: No authenticated user, showing public content');
  return <>{children}</>;
}
