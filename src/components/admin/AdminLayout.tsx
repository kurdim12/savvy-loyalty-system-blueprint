
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  CoffeeIcon,
  Users,
  GiftIcon,
  LayoutDashboard,
  ArrowRightLeft,
  BarChart4,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // If user is not an admin, redirect to login
    if (user === null) {
      navigate('/admin/login');
      return;
    }
    
    if (user && !isAdmin) {
      toast.error('You do not have admin privileges');
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    {
      title: 'Dashboard',
      path: '/admin',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: 'Users',
      path: '/admin/users',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Drinks',
      path: '/admin/drinks',
      icon: <CoffeeIcon className="h-5 w-5" />,
    },
    {
      title: 'Rewards',
      path: '/admin/rewards',
      icon: <GiftIcon className="h-5 w-5" />,
    },
    {
      title: 'Transactions',
      path: '/admin/transactions',
      icon: <ArrowRightLeft className="h-5 w-5" />,
    },
    {
      title: 'Analytics',
      path: '/admin/analytics',
      icon: <BarChart4 className="h-5 w-5" />,
    },
    {
      title: 'Settings',
      path: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  // Active route helper
  const isActive = (path: string) => {
    if (path === '/admin') {
      return window.location.pathname === '/admin';
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
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              <div className="mb-8 flex items-center px-2 py-4">
                <CoffeeIcon className="mr-2 h-8 w-8 text-amber-700" />
                <span className="text-xl font-bold">Coffee Admin</span>
              </div>

              <nav className="flex-1 space-y-1">
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
        } hidden border-r bg-white transition-width duration-300 md:block`}
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
                <span className="ml-2 text-xl font-bold">Coffee Admin</span>
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

          <nav className="flex-1 space-y-1 px-3 py-4">
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
        <main className="flex-1 px-4 py-8 md:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
