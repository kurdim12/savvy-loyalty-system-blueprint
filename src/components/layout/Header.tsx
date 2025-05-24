
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserCircle, LogOut, Home, Award, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { cn } from '@/lib/utils';

const Header = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/rewards', label: 'Rewards', icon: Award },
    { path: '/community', label: 'Community', icon: MessageSquare },
  ];

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/680bf950-de42-45c2-bcfd-0e9b786df840.png" 
              alt="Raw Smith Coffee" 
              className="h-10 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="font-bold text-xl text-gray-900">Raw Smith</h1>
              <p className="text-xs text-gray-600">Coffee Loyalty</p>
            </div>
          </Link>
        </div>

        {/* Three Panel Navigation */}
        {!isAdmin && (
          <nav className="hidden md:flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-white text-amber-700 shadow-sm" 
                      : "text-gray-600 hover:text-amber-700 hover:bg-white/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Mobile Navigation */}
        {!isAdmin && (
          <nav className="flex md:hidden items-center space-x-1 bg-gray-50 rounded-lg p-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center justify-center p-2 rounded-md transition-all duration-200",
                    isActive 
                      ? "bg-white text-amber-700 shadow-sm" 
                      : "text-gray-600 hover:text-amber-700 hover:bg-white/50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </nav>
        )}

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications for customers */}
          {!isAdmin && <NotificationBell />}
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <UserCircle className="h-5 w-5" />
                <span className="hidden sm:inline text-sm">{user.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Profile
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                  Admin Panel
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
