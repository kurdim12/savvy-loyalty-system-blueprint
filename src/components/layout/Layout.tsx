
import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
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
  const { user, loading, isAdmin, isUser, membershipTier, profile } = useAuth();
  const [pageReady, setPageReady] = useState(false);
  
  console.log("Layout mounting, auth state:", { 
    user: user ? 'exists' : 'null', 
    isAdmin, 
    isUser, 
    loading
  });

  // Emergency timeout for loading
  useEffect(() => {
    const maxLoadingTime = setTimeout(() => {
      console.log("Maximum loading time reached, forcing display");
      setPageReady(true);
    }, 2000); // 2 seconds max loading time
    
    return () => clearTimeout(maxLoadingTime);
  }, []);

  // Update page ready state when loading completes
  useEffect(() => {
    if (!loading) {
      console.log("Loading complete, setting page ready");
      setPageReady(true);
    }
  }, [loading]);

  // Show skeleton loading state during initial load
  if ((loading || !pageReady)) {
    console.log("Showing loading skeleton");
    return (
      <div className="flex min-h-screen flex-col bg-[#FAF6F0]">
        <Header />
        <main className="flex-1 p-3 sm:p-4 lg:p-6 container mx-auto max-w-7xl">
          <DashboardSkeleton />
        </main>
        <footer className="py-4 px-6 text-center text-sm text-[#6F4E37] border-t border-[#8B4513]/10">
          &copy; {new Date().getFullYear()} Raw Smith Coffee Loyalty Program
        </footer>
      </div>
    );
  }

  // If loading completed but we still don't have a user, redirect to auth
  if (!user && !loading && pageReady) {
    console.log("No user found, redirecting to auth");
    toast.error('Please sign in to continue');
    return <Navigate to="/auth" replace />;
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
    console.log("No user found for user route, redirecting to auth");
    toast.error('Please sign in to access this page');
    return <Navigate to="/auth" replace />;
  }

  // If admin tries to access user routes - we'll allow it
  if (isAdmin && !adminOnly) {
    console.log("Admin accessing user route - allowed");
  }
  
  // Check if user has a valid role
  if (!isUser && !isAdmin) {
    console.log("No valid role found (neither user nor admin)");
    toast.error('Access denied. Contact support if you think this is a mistake.');
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
      <main className="flex-1 p-3 sm:p-4 lg:p-6 container mx-auto max-w-7xl">
        {children}
      </main>
      <footer className="py-3 sm:py-4 px-4 sm:px-6 text-center text-xs sm:text-sm text-[#6F4E37] border-t border-[#8B4513]/10">
        &copy; {new Date().getFullYear()} Raw Smith Coffee Loyalty Program
      </footer>
    </div>
  );
}
