import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  CoffeeIcon,
  GiftIcon,
  ArrowRightLeft,
  Bell,
  Settings,
  MessageSquare,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Moon,
  Sun,
  Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2); // Mock notification count

  // Admin routes are protected at the router level now, so we don't need to check here

  const handleSignOut = async () => {
    await signOut();
    // Redirection is handled in the AuthContext signOut function
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    toast.success(`${isDarkMode ? 'Light' : 'Dark'} mode enabled`);
    // In a real implementation, you would apply the theme to the document here
  };

  const viewNotifications = () => {
    setUnreadNotifications(0);
    toast.info('All notifications marked as read');
  };

  const navItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: 'Customers',
      path: '/admin/users',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Transactions',
      path: '/admin/transactions',
      icon: <ArrowRightLeft className="h-5 w-5" />,
    },
    {
      title: 'Rewards',
      path: '/admin/rewards',
      icon: <GiftIcon className="h-5 w-5" />,
    },
    {
      title: 'Drinks',
      path: '/admin/drinks',
      icon: <CoffeeIcon className="h-5 w-5" />,
    },
    {
      title: 'Community',
      path: '/admin/community',
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      title: 'Redemptions',
      path: '/admin/redeem',
      icon: <Gift className="h-5 w-5" />,
    },
    {
      title: 'Settings',
      path: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
    }
  ];

  // Active route helper
  const isActive = (path: string) => {
    if (path === '/admin/dashboard') {
      return window.location.pathname === '/admin' || window.location.pathname === '/admin/dashboard';
    }
    return window.location.pathname.startsWith(path);
  };

  if (!user) {
    return <div className="flex h-screen items-center justify-center p-6">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="fixed left-4 top-4 z-50 block md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-full bg-white shadow-md"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="mb-8 flex items-center px-2 py-4">
                <CoffeeIcon className="mr-2 h-8 w-8 text-amber-700" />
                <span className="text-xl font-bold">Raw Smith Admin</span>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                        isActive
                          ? 'bg-amber-100 text-amber-900'
                          : 'text-gray-700 hover:bg-amber-50'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.title}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-auto">
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-amber-200 flex items-center justify-center">
                      <span className="text-sm font-bold text-amber-800">
                        {user?.email?.charAt(0).toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium">{user?.email}</p>
                      <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSignOut}
                    title="Log out"
                  >
                    <LogOut className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } hidden border-r bg-white transition-all duration-300 md:block`}
      >
        <div className="flex h-full flex-col">
          <div
            className={`flex items-center ${
              sidebarOpen ? 'justify-between' : 'justify-center'
            } border-b px-4 py-6`}
          >
            <div className={`flex items-center ${!sidebarOpen && 'justify-center w-full'}`}>
              <CoffeeIcon className="h-8 w-8 text-amber-700" />
              {sidebarOpen && (
                <span className="ml-2 text-xl font-bold">Raw Smith Admin</span>
              )}
            </div>
            {sidebarOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="h-8 w-8 rounded-full p-0"
              >
                <ChevronDown className="h-5 w-5 -rotate-90" />
              </Button>
            )}
          </div>

          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="mx-auto mt-2 h-8 w-8 rounded-full p-0"
            >
              <ChevronDown className="h-5 w-5 rotate-90" />
            </Button>
          )}

          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  isActive(item.path)
                    ? 'bg-amber-100 text-amber-900'
                    : 'text-gray-700 hover:bg-amber-50'
                } ${!sidebarOpen && 'justify-center px-0'}`}
              >
                <span className={sidebarOpen ? 'mr-3' : ''}>{item.icon}</span>
                {sidebarOpen && item.title}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto border-t p-4">
            <div
              className={`flex items-center ${
                sidebarOpen ? 'justify-between' : 'justify-center'
              }`}
            >
              <div className={`flex items-center ${!sidebarOpen && 'flex-col'}`}>
                <div className="h-8 w-8 rounded-full bg-amber-200 flex items-center justify-center">
                  <span className="text-sm font-bold text-amber-800">
                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                {sidebarOpen && (
                  <div className="ml-2">
                    <p className="text-sm font-medium truncate max-w-[120px]">
                      {user?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">Admin</p>
                  </div>
                )}
              </div>
              {sidebarOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="mt-4 mx-auto"
                  title="Log out"
                >
                  <LogOut className="h-5 w-5 text-gray-500" />
                </Button>
              )}
            </div>
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="mt-4 mx-auto"
                title="Log out"
              >
                <LogOut className="h-5 w-5 text-gray-500" />
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            {/* Remove link to user dashboard */}
            <span className="flex items-center text-amber-800 font-medium">
              <CoffeeIcon className="h-5 w-5 mr-1" />
              <span>Admin Panel</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-3 bg-amber-50 border-l-4 border-amber-500">
                    <p className="font-medium">New Customer Registered</p>
                    <p className="text-sm text-muted-foreground">John Doe has joined the loyalty program</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-3 bg-green-50 border-l-4 border-green-500">
                    <p className="font-medium">Points Redeemed</p>
                    <p className="text-sm text-muted-foreground">Jane Smith redeemed 150 points for a free coffee</p>
                    <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={viewNotifications}
                  >
                    Mark All as Read
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {/* Admin Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-amber-200 flex items-center justify-center">
                    <span className="text-sm font-bold text-amber-800">
                      {user.email?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <span className="hidden sm:inline">Admin</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin Dashboard</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <main className="flex-1 px-4 py-8 md:px-6 lg:px-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
