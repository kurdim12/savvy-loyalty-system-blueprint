
import { createBrowserRouter } from "react-router-dom";
import RequireAdmin from "./components/auth/ProtectedRoutes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Rewards from "./pages/Rewards";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import DrinksList from "./pages/admin/DrinksList";
import RewardsAdmin from "./pages/admin/RewardsAdmin";
import CommunityHome from "./pages/CommunityHome";
import ThreadPage from "./pages/ThreadPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/rewards",
    element: <Rewards />,
  },
  {
    path: "/community",
    element: <CommunityHome />,
  },
  {
    path: "/community/:threadId",
    element: <ThreadPage />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/dashboard",
    element: <RequireAdmin><AdminDashboard /></RequireAdmin>,
  },
  {
    path: "/admin/users",
    element: <RequireAdmin><UserManagement /></RequireAdmin>,
  },
  {
    path: "/admin/drinks",
    element: <RequireAdmin><DrinksList /></RequireAdmin>,
  },
  {
    path: "/admin/rewards",
    element: <RequireAdmin><RewardsAdmin /></RequireAdmin>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
