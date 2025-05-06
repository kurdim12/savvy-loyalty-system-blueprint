
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

// Pages
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Rewards from "./pages/Rewards";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import CommunityGoalsAdmin from "./pages/admin/CommunityGoalsAdmin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// We need to create a separate component for route protection
// to ensure useAuth is only called after AuthProvider is initialized
const AppRoutes = () => {
  const { isAdmin, loading, user } = useAuth();
  
  if (loading) return null;
  
  // Protected route that requires admin role
  const AdminRoute = ({ children }: { children: ReactNode }) => {
    // If not authenticated at all, redirect to admin login
    if (!user) {
      return <Navigate to="/admin-login" replace />;
    }
    
    // If authenticated but not admin, redirect to dashboard
    return isAdmin ? <>{children}</> : <Navigate to="/dashboard" replace />;
  };

  // Protected route that requires authentication
  const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    return user ? <>{children}</> : <Navigate to="/auth" replace />;
  };
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected routes that require authentication */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* Admin routes - completely separate flow */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/admin/community-goals" element={<AdminRoute><CommunityGoalsAdmin /></AdminRoute>} />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

// Main App component that sets up providers
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
