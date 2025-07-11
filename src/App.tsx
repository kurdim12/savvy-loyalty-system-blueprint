import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserRoute, AdminRoute } from "@/components/auth/ProtectedRoutes";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Rewards from "./pages/Rewards";
import CommunityHome from "./pages/CommunityHome";
import CommunityPage from "./pages/CommunityPage";
import ThreadPage from "./pages/ThreadPage";
import NotFound from "./pages/NotFound";
import SpotifyCallback from "./pages/SpotifyCallback";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import TransactionsManagement from "./pages/admin/TransactionsManagement";
import RewardsManagement from "./pages/admin/RewardsManagement";
import RedemptionManagement from "./pages/admin/RedemptionManagement";
import SettingsManagement from "./pages/admin/SettingsManagement";
import CommunityManagement from "./pages/admin/CommunityManagement";
import CommunityGoalsAdmin from "./pages/admin/CommunityGoalsAdmin";
import DrinksList from "./pages/admin/DrinksList";
import RewardsAdmin from "./pages/admin/RewardsAdmin";
import CommunityHubManagement from "./pages/admin/CommunityHubManagement";
import AdminCommunityHub from "./pages/AdminCommunityHub";
import AdminLayout from "./components/admin/AdminLayout";
import BulkEmailManagement from "./pages/admin/BulkEmailManagement";
import QAInspectorAgent from "./pages/admin/QAInspectorAgent";

console.log('App component loading...');

const App = () => {
  console.log('App component rendering');
  
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/spotify/callback" element={<SpotifyCallback />} />
            
            {/* Protected User Routes */}
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
            <Route path="/community-home" element={
              <UserRoute>
                <CommunityHome />
              </UserRoute>
            } />
            <Route path="/community" element={
              <UserRoute>
                <CommunityPage />
              </UserRoute>
            } />
            <Route path="/thread/:id" element={
              <UserRoute>
                <ThreadPage />
              </UserRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Individual Admin Routes with Single Layout Wrapper */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <AdminLayout>
                  <UserManagement />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/transactions" element={
              <AdminRoute>
                <AdminLayout>
                  <TransactionsManagement />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/rewards" element={
              <AdminRoute>
                <AdminLayout>
                  <RewardsManagement />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/redemptions" element={
              <AdminRoute>
                <AdminLayout>
                  <RedemptionManagement />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/settings" element={
              <AdminRoute>
                <AdminLayout>
                  <SettingsManagement />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/community" element={
              <AdminRoute>
                <AdminLayout>
                  <CommunityManagement />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/community-goals" element={
              <AdminRoute>
                <AdminLayout>
                  <CommunityGoalsAdmin />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/drinks" element={
              <AdminRoute>
                <AdminLayout>
                  <DrinksList />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/rewards-admin" element={
              <AdminRoute>
                <AdminLayout>
                  <RewardsAdmin />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/admin/community-hub" element={
              <AdminRoute>
                <AdminLayout>
                  <CommunityHubManagement />
                </AdminLayout>
              </AdminRoute>
            } />
            
            <Route path="/admin-community-hub" element={
              <AdminRoute>
                <AdminCommunityHub />
              </AdminRoute>
            } />
            
            <Route path="/admin/bulk-email" element={
              <AdminRoute>
                <AdminLayout>
                  <BulkEmailManagement />
                </AdminLayout>
              </AdminRoute>
            } />
            
            <Route path="/admin/qa-inspector" element={
              <AdminRoute>
                <AdminLayout>
                  <QAInspectorAgent />
                </AdminLayout>
              </AdminRoute>
            } />
                  
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </TooltipProvider>
    </BrowserRouter>
  );
};

export default App;
