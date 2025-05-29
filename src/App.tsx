
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from '@/components/auth/ErrorBoundary';

// Pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Rewards from '@/pages/Rewards';
import CommunityHub from '@/pages/CommunityHub';
import ThreadPage from '@/pages/ThreadPage';
import NotFound from '@/pages/NotFound';

// Admin Pages
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import RewardsManagement from '@/pages/admin/RewardsManagement';
import RedemptionManagement from '@/pages/admin/RedemptionManagement';
import Hub from '@/pages/admin/Hub';
import CommunityGoalsAdmin from '@/pages/admin/CommunityGoalsAdmin';
import TransactionsManagement from '@/pages/admin/TransactionsManagement';

// Route Guards
import { UserRoute, AdminRoute } from '@/components/auth/ProtectedRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected User Routes */}
                <Route path="/dashboard" element={<UserRoute><Dashboard /></UserRoute>} />
                <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
                <Route path="/rewards" element={<UserRoute><Rewards /></UserRoute>} />
                <Route path="/community" element={<UserRoute><CommunityHub /></UserRoute>} />
                <Route path="/community/thread/:id" element={<UserRoute><ThreadPage /></UserRoute>} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                <Route path="/admin/rewards" element={<AdminRoute><RewardsManagement /></AdminRoute>} />
                <Route path="/admin/redemptions" element={<AdminRoute><RedemptionManagement /></AdminRoute>} />
                <Route path="/admin/hub" element={<AdminRoute><Hub /></AdminRoute>} />
                <Route path="/admin/community-goals" element={<AdminRoute><CommunityGoalsAdmin /></AdminRoute>} />
                <Route path="/admin/transactions" element={<AdminRoute><TransactionsManagement /></AdminRoute>} />
                
                {/* Catch All Routes */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
              <Toaster position="top-right" />
            </div>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
