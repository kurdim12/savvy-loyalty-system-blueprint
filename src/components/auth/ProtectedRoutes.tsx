
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

  // Reduced timeout to prevent white screens
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('UserRoute: Timeout reached, forcing display');
      setIsPageReady(true);
    }, 1000); // Reduced from 2000ms to 1000ms

    return () => clearTimeout(timeoutId);
  }, []);

  // Allow render when auth loading completes
  useEffect(() => {
    if (!loading) {
      console.log('UserRoute: Auth loading complete, preparing page');
      setIsPageReady(true);
    }
  }, [loading]);

  // Show loading only briefly
  if (!isPageReady && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
        <div className="text-center p-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#95A5A6] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#95A5A6] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated at all
  if (!user) {
    console.log('UserRoute: No user found, redirecting to auth');
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

  // Reduced timeout to prevent white screens
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('AdminRoute: Timeout reached, forcing display');
      setIsPageReady(true);
    }, 1000); // Reduced from 1500ms to 1000ms

    return () => clearTimeout(timeoutId);
  }, []);

  // Allow render when auth loading completes
  useEffect(() => {
    if (!loading) {
      console.log('AdminRoute: Auth loading complete, preparing page');
      setIsPageReady(true);
    }
  }, [loading]);

  // Show loading only briefly
  if (!isPageReady && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
        <div className="text-center p-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#95A5A6] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#95A5A6] text-sm">Loading admin access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated at all
  if (!user) {
    console.log('AdminRoute: No user found, redirecting to admin login');
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
  
  // Reduced timeout to prevent white screens
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('PublicRoute: Timeout reached, forcing display');
      setIsPageReady(true);
    }, 1000); // Reduced from 1500ms to 1000ms

    return () => clearTimeout(timeoutId);
  }, []);

  // Allow render when auth loading completes
  useEffect(() => {
    if (!loading) {
      console.log('PublicRoute: Auth loading complete, preparing page');
      setIsPageReady(true);
    }
  }, [loading]);

  // Show loading only briefly
  if (!isPageReady && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#95A5A6] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#95A5A6] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users, but only if we're sure about their role
  if (user && !loading) {
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

// Generic protected route component - requires any authenticated user
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isPageReady, setIsPageReady] = useState(false);
  
  console.log("ProtectedRoute: Init with auth state:", { 
    user: user ? 'exists' : 'null', 
    loading
  });

  // Reduced timeout to prevent white screens
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log('ProtectedRoute: Timeout reached, forcing display');
      setIsPageReady(true);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Allow render when auth loading completes
  useEffect(() => {
    if (!loading) {
      console.log('ProtectedRoute: Auth loading complete, preparing page');
      setIsPageReady(true);
    }
  }, [loading]);

  // Show loading only briefly
  if (!isPageReady && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
        <div className="text-center p-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#95A5A6] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#95A5A6] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated at all
  if (!user) {
    console.log('ProtectedRoute: No user found, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute: User authenticated, access granted');
  return <>{children}</>;
}
