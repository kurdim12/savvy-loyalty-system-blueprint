
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
          
          {/* Protected routes */}
          <Route element={<UserRoute>Dashboard</UserRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/:id" element={<CommunityHome />} />
            <Route path="/thread/:id" element={<ThreadPage />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/transactions" element={<TransactionsManagement />} />
            <Route path="/admin/community-goals" element={<CommunityGoalsAdmin />} />
            <Route path="/admin/settings" element={<SettingsManagement />} />
            <Route path="/admin/rewards" element={<RewardsAdmin />} />
            <Route path="/admin/redemptions" element={<RedemptionsAdmin />} />
          </Route>
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
