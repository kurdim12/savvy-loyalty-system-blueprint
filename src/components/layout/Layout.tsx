
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function Layout({ children, adminOnly = false }: LayoutProps) {
  const { user, loading, isAdmin } = useAuth();

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

  // If this is an admin-only route and user is not an admin
  if (adminOnly && !isAdmin) {
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
