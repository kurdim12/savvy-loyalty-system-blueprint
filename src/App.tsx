
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserRoute, AdminRoute } from "@/components/auth/ProtectedRoutes";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";

// Import pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Rewards from "./pages/Rewards";
import CommunityPage from "./pages/CommunityPage";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  useEffect(() => {
    const initMobileApp = async () => {
      if (Capacitor.isNativePlatform()) {
        console.log('Running in native mobile app');
        
        try {
          // Hide splash screen after app loads
          await SplashScreen.hide();
          
          // Configure status bar
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#FAF6F0' });
          
          console.log('Mobile app initialization complete');
        } catch (error) {
          console.error('Error initializing mobile app:', error);
        }
      }
    };

    initMobileApp();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster position="top-right" expand={false} richColors />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected user routes */}
              <Route path="/dashboard" element={<UserRoute><Dashboard /></UserRoute>} />
              <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
              <Route path="/rewards" element={<UserRoute><Rewards /></UserRoute>} />
              <Route path="/community" element={<UserRoute><CommunityPage /></UserRoute>} />
              <Route path="/thread/:id" element={<UserRoute><ThreadPage /></UserRoute>} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
              <Route path="/admin/rewards" element={<AdminRoute><RewardsManagement /></AdminRoute>} />
              <Route path="/admin/transactions" element={<AdminRoute><TransactionsManagement /></AdminRoute>} />
              <Route path="/admin/redemptions" element={<AdminRoute><RedemptionManagement /></AdminRoute>} />
              <Route path="/admin/drinks" element={<AdminRoute><DrinksList /></AdminRoute>} />
              <Route path="/admin/settings" element={<AdminRoute><SettingsManagement /></AdminRoute>} />
              <Route path="/admin/community" element={<AdminRoute><CommunityManagement /></AdminRoute>} />
              <Route path="/admin/community-goals" element={<AdminRoute><CommunityGoalsAdmin /></AdminRoute>} />
              <Route path="/admin/community-hub-management" element={<AdminRoute><CommunityHubManagement /></AdminRoute>} />
              <Route path="/admin/rewards-admin" element={<AdminRoute><RewardsAdmin /></AdminRoute>} />

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
