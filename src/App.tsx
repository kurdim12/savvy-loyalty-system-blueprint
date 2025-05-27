import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoutes from "@/components/auth/ProtectedRoutes";

// Import pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Rewards from "./pages/Rewards";
import CommunityPage from "./pages/CommunityPage";
import CommunityHub from "./pages/CommunityHub";
import ThreadPage from "./pages/ThreadPage";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import RewardsManagement from "./pages/admin/RewardsManagement";
import TransactionsManagement from "./pages/admin/TransactionsManagement";
import RedemptionManagement from "./pages/admin/RedemptionManagement";
import DrinksList from "./pages/admin/DrinksList";
import SettingsManagement from "./pages/admin/SettingsManagement";
import CommunityManagement from "./pages/admin/CommunityManagement";
import CommunityGoalsAdmin from "./pages/admin/CommunityGoalsAdmin";
import CommunityHubManagement from "./pages/admin/CommunityHubManagement";
import RewardsAdmin from "./pages/admin/RewardsAdmin";
import Hub from "./pages/admin/Hub";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected user routes */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/community-hub" element={<CommunityHub />} />
              <Route path="/thread/:id" element={<ThreadPage />} />
            </Route>

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoutes adminOnly />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/hub" element={<Hub />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/rewards" element={<RewardsManagement />} />
              <Route path="/admin/transactions" element={<TransactionsManagement />} />
              <Route path="/admin/redemptions" element={<RedemptionManagement />} />
              <Route path="/admin/drinks" element={<DrinksList />} />
              <Route path="/admin/settings" element={<SettingsManagement />} />
              <Route path="/admin/community" element={<CommunityManagement />} />
              <Route path="/admin/community-goals" element={<CommunityGoalsAdmin />} />
              <Route path="/admin/community-hub-management" element={<CommunityHubManagement />} />
              <Route path="/admin/rewards-admin" element={<RewardsAdmin />} />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
