import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Coffee, 
  User, 
  Settings, 
  LogOut, 
  Award,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { toast } from 'sonner';

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    
    setIsSigningOut(true);
    try {
      console.log('Header: Starting sign out process');
      await signOut();
    } catch (error) {
      console.error('Header: Sign out error:', error);
      toast.error('Sign out failed, please try again');
      setIsSigningOut(false);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Rewards', href: '/rewards' },
    { name: 'Community', href: '/community' },
    { name: 'Community Hub', href: '/community-hub' },
  ];

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin' },
    { name: 'Enhanced Rewards', href: '/admin/enhanced-rewards' },
    { name: 'Community Control', href: '/admin/community' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-concrete sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-black" />
            <span className="text-xl font-bold text-black">Raw Smith</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-concrete hover:text-black transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
            {profile?.role === 'admin' && (
              <>
                <div className="border-l border-concrete mx-4"></div>
                {adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-concrete hover:text-black transition-colors font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* User Menu */}
          {user && profile ? (
            <div className="flex items-center space-x-4">
              {/* Points Display */}
              <div className="hidden sm:flex items-center space-x-2 bg-concrete/20 px-3 py-1 rounded-full">
                <Award className="h-4 w-4 text-black" />
                <span className="text-sm font-semibold text-black">
                  {profile.current_points} pts
                </span>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative hover:bg-concrete/20">
                <Bell className="h-5 w-5" />
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-concrete/20">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-concrete text-black">
                        {getInitials(profile.first_name, profile.last_name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">
                      {profile.first_name} {profile.last_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile.email}
                    </p>
                    <div className="flex items-center space-x-2 pt-1">
                      <Badge variant="secondary" className="capitalize text-xs bg-concrete text-black">
                        {profile.membership_tier}
                      </Badge>
                      {profile.role === 'admin' && (
                        <Badge className="bg-black text-white text-xs">
                          Admin
                        </Badge>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut} 
                    className="text-red-600"
                    disabled={isSigningOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isSigningOut ? 'Signing out...' : 'Sign out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden hover:bg-concrete/20"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="outline" className="border-concrete text-black hover:bg-concrete/20">Sign In</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && user && (
          <div className="md:hidden py-4 border-t border-concrete">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-concrete hover:text-black transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {profile?.role === 'admin' && (
                <>
                  <div className="border-t border-concrete my-2"></div>
                  {adminNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-concrete hover:text-black transition-colors font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
              <div className="flex items-center space-x-2 bg-concrete/20 px-3 py-2 rounded-lg mt-4">
                <Award className="h-4 w-4 text-black" />
                <span className="text-sm font-semibold text-black">
                  {profile?.current_points} points
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
