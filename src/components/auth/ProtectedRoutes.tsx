
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Component for routes that require user authentication
export function UserRoute({ children }: { children: ReactNode }) {
  const { user, loading, isUser, isAdmin } = useAuth();
  const location = useLocation();
  
  console.log("UserRoute: Auth state:", { 
    user: user ? 'exists' : 'null', 
    loading, 
    isUser, 
    isAdmin,
    pathname: location.pathname
  });

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
        <div className="text-center p-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#8B4513] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to auth
  if (!user) {
    console.log('UserRoute: No user found, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // User is authenticated and has proper role
  if (isUser || isAdmin) {
    console.log('UserRoute: Access granted to', location.pathname);
    return <>{children}</>;
  }

  // Fallback
  console.log('UserRoute: No valid role found, redirecting to auth');
  return <Navigate to="/auth" replace />;
}

// Component for routes that require admin authentication
export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  
  console.log("AdminRoute: Auth state:", { 
    user: user ? 'exists' : 'null',
    loading, 
    isAdmin,
    pathname: location.pathname
  });

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
        <div className="text-center p-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#8B4513] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#8B4513] text-sm">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
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

  console.log('AdminRoute: Admin access granted to', location.pathname);
  return <>{children}</>;
}
