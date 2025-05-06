
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Coffee, User, Award, Home, LogOut, Settings } from 'lucide-react';

const Header = () => {
  const { signOut, isAdmin } = useAuth();

  return (
    <header className="bg-amber-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Coffee className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">Raw Smith Coffee</h1>
          </div>

          <nav className="hidden md:flex space-x-4">
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive ? 'bg-amber-900 text-white' : 'hover:bg-amber-700'
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
                  isActive ? 'bg-amber-900 text-white' : 'hover:bg-amber-700'
                }`
              }
            >
              <Award className="h-4 w-4 mr-2" />
              Rewards
            </NavLink>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                `flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive ? 'bg-amber-900 text-white' : 'hover:bg-amber-700'
                }`
              }
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </NavLink>
            
            {/* Admin link - only shown to admins */}
            {isAdmin && (
              <NavLink 
                to="/admin" 
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive ? 'bg-amber-900 text-white' : 'hover:bg-amber-700'
                  }`
                }
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </NavLink>
            )}
          </nav>

          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-amber-700" 
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
