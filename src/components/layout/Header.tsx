
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Coffee, User, Award, Home, LogOut } from 'lucide-react';

const Header = () => {
  const { signOut, isAdmin, profile } = useAuth();
  
  // Get user's first name for display
  const firstName = profile?.first_name || 'User';

  return (
    <header className="bg-[#8B4513] text-white shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src="/lovable-uploads/8d4d71ac-a5a9-4e5d-92d5-3083e04eeda7.png" alt="Raw Smith Coffee" className="h-8 w-auto mr-2" />
            <h1 className="text-xl font-bold text-white">Raw Smith Coffee</h1>
          </div>

          <nav className="hidden md:flex space-x-4">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive ? 'bg-[#6F4E37] text-white' : 'hover:bg-[#6F4E37]'
                }`
              }
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </NavLink>
            <NavLink 
              to="/rewards" 
              className={({ isActive }) => 
                `flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive ? 'bg-[#6F4E37] text-white' : 'hover:bg-[#6F4E37]'
                }`
              }
            >
              <Award className="h-4 w-4 mr-2" />
              Rewards
            </NavLink>
            <NavLink 
              to="/community" 
              className={({ isActive }) => 
                `flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive ? 'bg-[#6F4E37] text-white' : 'hover:bg-[#6F4E37]'
                }`
              }
            >
              <Coffee className="h-4 w-4 mr-2" />
              Community
            </NavLink>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                `flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive ? 'bg-[#6F4E37] text-white' : 'hover:bg-[#6F4E37]'
                }`
              }
            >
              <User className="h-4 w-4 mr-2" />
              {firstName}'s Profile
            </NavLink>
          </nav>

          <div className="flex items-center space-x-2">
            <span className="hidden md:inline text-sm">Hi, {firstName}!</span>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-[#6F4E37]" 
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
