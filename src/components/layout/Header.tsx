
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CoffeeIcon, UserCircle, LogOut, Settings, Award, Users, Gift } from 'lucide-react';

export default function Header() {
  const { profile, signOut, isAdmin } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-amber-50 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <CoffeeIcon className="h-6 w-6 text-amber-700" />
          <span className="text-xl font-bold text-amber-900">Raw Smith Coffee</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/dashboard" className="text-amber-900 hover:text-amber-700">
            Dashboard
          </Link>
          <Link to="/rewards" className="text-amber-900 hover:text-amber-700">
            Rewards
          </Link>
          
          {isAdmin && (
            <>
              <Link to="/admin/users" className="text-amber-900 hover:text-amber-700">
                Users
              </Link>
              <Link to="/admin/transactions" className="text-amber-900 hover:text-amber-700">
                Transactions
              </Link>
              <Link to="/admin/settings" className="text-amber-900 hover:text-amber-700">
                Settings
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {profile && (
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium leading-none text-amber-900">
                {profile.first_name} {profile.last_name}
              </p>
              <p className="text-xs text-amber-700">
                {profile.membership_tier.charAt(0).toUpperCase() + profile.membership_tier.slice(1)} • {profile.current_points} pts
              </p>
            </div>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserCircle className="h-6 w-6 text-amber-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {profile && (
                <>
                  <div className="p-2 text-center border-b">
                    <p className="font-medium">{profile.first_name} {profile.last_name}</p>
                    <p className="text-xs text-muted-foreground">{profile.email}</p>
                  </div>

                  <Link to="/profile">
                    <DropdownMenuItem>
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </DropdownMenuItem>
                  </Link>

                  <Link to="/rewards">
                    <DropdownMenuItem>
                      <Award className="mr-2 h-4 w-4" />
                      <span>My Rewards</span>
                    </DropdownMenuItem>
                  </Link>

                  {isAdmin && (
                    <>
                      <Link to="/admin/users">
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          <span>Manage Users</span>
                        </DropdownMenuItem>
                      </Link>

                      <Link to="/admin/rewards">
                        <DropdownMenuItem>
                          <Gift className="mr-2 h-4 w-4" />
                          <span>Manage Rewards</span>
                        </DropdownMenuItem>
                      </Link>

                      <Link to="/admin/settings">
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>System Settings</span>
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}

                  <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
