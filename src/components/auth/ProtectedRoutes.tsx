
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Component for routes that require user authentication
export function UserRoute({ children }: { children: ReactNode }) {
  const { user, loading, isUser, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading state with enhanced UI
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-amber-200">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto mb-6"></div>
          <p className="text-amber-800 text-lg font-medium">Authenticating...</p>
          <p className="text-amber-600 text-sm mt-2">Please wait while we verify your access</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to auth
  if (!user) {
    // Prevent auth redirect loop by checking current path
    if (location.pathname === '/auth') {
      return <>{children}</>;
    }
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // User is authenticated and has proper role
  if (isUser || isAdmin) {
    return <>{children}</>;
  }

  // If user exists but no role is determined yet, show loading
  // This prevents the "Access denied" flash while profile loads
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-amber-200">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mx-auto mb-6"></div>
        <p className="text-amber-800 text-lg font-medium">Loading profile...</p>
        <p className="text-amber-600 text-sm mt-2">Please wait while we set up your account</p>
      </div>
    </div>
  );
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
