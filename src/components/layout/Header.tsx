
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Menu, 
  X, 
  Coffee, 
  Gift, 
  User, 
  Settings, 
  LogOut,
  Crown,
  Users,
  Target
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { NotificationBell } from '@/components/notifications/NotificationBell';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
      navigate('/');
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'gold': return 'bg-yellow-500 text-yellow-900';
      case 'silver': return 'bg-gray-400 text-gray-900';
      case 'bronze': return 'bg-orange-500 text-orange-900';
      default: return 'bg-gray-300 text-gray-900';
    }
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Coffee },
    { name: 'Dashboard', href: '/dashboard', icon: User, auth: true },
    { name: 'Rewards', href: '/rewards', icon: Gift, auth: true },
    { name: 'Community', href: '/community', icon: Users, auth: true },
    ...(isAdmin ? [{ name: 'Admin', href: '/admin', icon: Crown, admin: true }] : []),
  ];

  return (
    <header className="bg-white shadow-lg border-b-2 border-amber-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="Raw Smith Coffee" 
              className="h-10 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-amber-900">Raw Smith Coffee</h1>
              <p className="text-xs text-amber-700">Loyalty Program</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              if (item.auth && !user) return null;
              if (item.admin && !isAdmin) return null;
              
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'text-gray-700 hover:text-amber-900 hover:bg-amber-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NotificationBell />
                
                {/* Points Display */}
                {profile && (
                  <div className="hidden sm:flex items-center space-x-2 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                    <Coffee className="h-4 w-4 text-amber-700" />
                    <span className="text-sm font-medium text-amber-900">
                      {profile.current_points} pts
                    </span>
                    <Badge className={`text-xs px-2 py-1 ${getTierBadgeColor(profile.membership_tier)}`}>
                      {profile.membership_tier}
                    </Badge>
                  </div>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-900">
                        <User className="h-4 w-4" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">
                        {profile?.first_name} {profile?.last_name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      {profile && (
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`text-xs ${getTierBadgeColor(profile.membership_tier)}`}>
                            {profile.membership_tier}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {profile.current_points} points
                          </span>
                        </div>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <Coffee className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/rewards')}>
                      <Gift className="mr-2 h-4 w-4" />
                      <span>Rewards</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/community')}>
                      <Target className="mr-2 h-4 w-4" />
                      <span>Community</span>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Crown className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/auth')}
                  className="text-amber-900 hover:bg-amber-50"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-amber-700 hover:bg-amber-800 text-white"
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-amber-200 py-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                if (item.auth && !user) return null;
                if (item.admin && !isAdmin) return null;
                
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? 'bg-amber-100 text-amber-900'
                        : 'text-gray-700 hover:text-amber-900 hover:bg-amber-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Points Display */}
              {user && profile && (
                <div className="flex items-center justify-between px-3 py-2 bg-amber-50 rounded-md mx-3 mt-4">
                  <div className="flex items-center space-x-2">
                    <Coffee className="h-4 w-4 text-amber-700" />
                    <span className="text-sm font-medium text-amber-900">
                      {profile.current_points} points
                    </span>
                  </div>
                  <Badge className={`text-xs ${getTierBadgeColor(profile.membership_tier)}`}>
                    {profile.membership_tier}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
