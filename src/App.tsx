
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserRoute, AdminRoute } from "@/components/auth/ProtectedRoutes";
import ErrorBoundary from "@/components/common/ErrorBoundary";

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
import Admin from "./pages/Admin";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/spotify/callback" element={<SpotifyCallback />} />
              
              {/* Protected User Routes */}
              <Route element={<UserRoute><></></UserRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/community-home" element={<CommunityHome />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/thread/:id" element={<ThreadPage />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<AdminRoute><></></AdminRoute>}>
                <Route path="/admin" element={<Admin />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="transactions" element={<TransactionsManagement />} />
                  <Route path="rewards" element={<RewardsManagement />} />
                  <Route path="redemptions" element={<RedemptionManagement />} />
                  <Route path="settings" element={<SettingsManagement />} />
                  <Route path="community" element={<CommunityManagement />} />
                  <Route path="community-goals" element={<CommunityGoalsAdmin />} />
                  <Route path="drinks" element={<DrinksList />} />
                  <Route path="rewards-admin" element={<RewardsAdmin />} />
                  <Route path="community-hub" element={<CommunityHubManagement />} />
                </Route>
                <Route path="/admin-community-hub" element={<AdminCommunityHub />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
