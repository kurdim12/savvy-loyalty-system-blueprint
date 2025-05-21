
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import Rewards from '@/pages/Rewards';
import CommunityPage from '@/pages/CommunityPage';
import CommunityHome from '@/pages/CommunityHome';
import ThreadPage from '@/pages/ThreadPage';
import Admin from '@/pages/Admin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import TransactionsManagement from '@/pages/admin/TransactionsManagement';
import CommunityGoalsAdmin from '@/pages/admin/CommunityGoalsAdmin';
import SettingsManagement from '@/pages/admin/SettingsManagement';
import RewardsAdmin from '@/pages/admin/RewardsAdmin';
import RedemptionsAdmin from '@/pages/admin/RedemptionsAdmin';
import AdminLogin from '@/pages/AdminLogin';
import NotFound from '@/pages/NotFound';

import { UserRoute, AdminRoute } from '@/components/auth/ProtectedRoutes';
import { AuthProvider } from '@/contexts/AuthContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* User protected routes */}
          <Route path="/dashboard" element={<UserRoute><Dashboard /></UserRoute>} />
          <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
          <Route path="/rewards" element={<UserRoute><Rewards /></UserRoute>} />
          <Route path="/community" element={<UserRoute><CommunityPage /></UserRoute>} />
          <Route path="/community/:id" element={<UserRoute><CommunityHome /></UserRoute>} />
          <Route path="/thread/:id" element={<UserRoute><ThreadPage /></UserRoute>} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<UserRoute><Admin /></UserRoute>} />
          <Route path="/admin/dashboard" element={<UserRoute><AdminDashboard /></UserRoute>} />
          <Route path="/admin/users" element={<UserRoute><UserManagement /></UserRoute>} />
          <Route path="/admin/transactions" element={<UserRoute><TransactionsManagement /></UserRoute>} />
          <Route path="/admin/community-goals" element={<UserRoute><CommunityGoalsAdmin /></UserRoute>} />
          <Route path="/admin/settings" element={<UserRoute><SettingsManagement /></UserRoute>} />
          <Route path="/admin/rewards" element={<UserRoute><RewardsAdmin /></UserRoute>} />
          <Route path="/admin/redemptions" element={<UserRoute><RedemptionsAdmin /></UserRoute>} />
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
