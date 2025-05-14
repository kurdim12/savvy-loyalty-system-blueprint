
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Rewards from './pages/Rewards';
import NotFound from './pages/NotFound';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import TransactionsManagement from './pages/admin/TransactionsManagement';
import RewardsManagement from './pages/admin/RewardsManagement';
import DrinksManagement from './pages/admin/DrinksList';
import CommunityManagement from './pages/admin/CommunityManagement';
import SettingsManagement from './pages/admin/SettingsManagement';
import AdminLogin from './pages/admin/Login';

// Auth route protection
import { AdminRoute, UserRoute, PublicRoute } from './components/auth/ProtectedRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Removed the Router component from here since it's already in main.tsx */}
      <AuthProvider>
        <Routes>
          {/* Public routes */}
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
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
          <Route path="/admin/settings" element={
            <AdminRoute>
              <SettingsManagement />
            </AdminRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster richColors position="top-center" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
