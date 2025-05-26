
import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Rewards from './pages/Rewards';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import CommunityPage from './pages/CommunityPage';
import CommunityHub from '@/pages/CommunityHub';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import TransactionsManagement from './pages/admin/TransactionsManagement';
import RewardsManagement from './pages/admin/RewardsManagement';
import DrinksManagement from './pages/admin/DrinksList';
import CommunityManagement from './pages/admin/CommunityManagement';
import CommunityHubManagement from './pages/admin/CommunityHubManagement';
import SettingsManagement from './pages/admin/SettingsManagement';
import AdminLogin from './pages/admin/Login';
import RedemptionManagement from './pages/admin/RedemptionManagement';

// Auth route protection
import { AdminRoute, UserRoute, PublicRoute, ProtectedRoute } from './components/auth/ProtectedRoutes';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={
        <PublicRoute>
          <Auth />
        </PublicRoute>
      } />
      
      <Route path="/admin/login" element={
        <PublicRoute>
          <AdminLogin />
        </PublicRoute>
      } />
      
      {/* Authenticated User routes */}
      <Route path="/dashboard" element={
        <UserRoute>
          <Dashboard />
        </UserRoute>
      } />
      <Route path="/profile" element={
        <UserRoute>
          <Profile />
        </UserRoute>
      } />
      <Route path="/rewards" element={
        <UserRoute>
          <Rewards />
        </UserRoute>
      } />
      <Route path="/community" element={
        <UserRoute>
          <CommunityPage />
        </UserRoute>
      } />
      <Route path="/community-hub" element={
        <ProtectedRoute>
          <CommunityHub />
        </ProtectedRoute>
      } />
      
      {/* Admin routes */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/dashboard" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />
      <Route path="/admin/users" element={
        <AdminRoute>
          <UserManagement />
        </AdminRoute>
      } />
      <Route path="/admin/transactions" element={
        <AdminRoute>
          <TransactionsManagement />
        </AdminRoute>
      } />
      <Route path="/admin/rewards" element={
        <AdminRoute>
          <RewardsManagement />
        </AdminRoute>
      } />
      <Route path="/admin/drinks" element={
        <AdminRoute>
          <DrinksManagement />
        </AdminRoute>
      } />
      <Route path="/admin/community" element={
        <AdminRoute>
          <CommunityManagement />
        </AdminRoute>
      } />
      <Route path="/admin/community-hub" element={
        <AdminRoute>
          <CommunityHubManagement />
        </AdminRoute>
      } />
      <Route path="/admin/settings" element={
        <AdminRoute>
          <SettingsManagement />
        </AdminRoute>
      } />
      <Route path="/admin/redeem" element={
        <AdminRoute>
          <RedemptionManagement />
        </AdminRoute>
      } />
      
      {/* Fallback route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
