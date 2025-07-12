
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Coffee, User, Award, Users, Gift, MessageSquare, Settings, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function UserLink({ to, icon, label, active, onClick }: NavLinkProps) {
  return (
    <Link to={to} onClick={onClick}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 font-normal",
          active && "bg-muted"
        )}
      >
        {icon}
        {label}
      </Button>
    </Link>
  );
}

export function Nav({ className }: { className?: string }) {
  const { user, isAdmin } = useAuth();

  if (!user) return null;

  const navItems = [
    { to: "/profile", label: "Profile Hub", icon: <User size={16} /> },
    { to: "/dashboard", label: "Dashboard", icon: <Home size={16} /> },
    { to: "/rewards", label: "Rewards", icon: <Award size={16} /> },
    { to: "/community", label: "Community", icon: <Users size={16} /> },
  ];

  const adminItems = [
    { to: "/admin", label: "Admin Dashboard", icon: <Settings size={16} /> },
    { to: "/admin/users", label: "Manage Users", icon: <Users size={16} /> },
    { to: "/admin/rewards", label: "Manage Rewards", icon: <Gift size={16} /> },
    { to: "/admin/drinks", label: "Manage Drinks", icon: <Coffee size={16} /> },
    { to: "/admin/community-goals", label: "Community Goals", icon: <Target size={16} /> },
    { to: "/admin/community", label: "Community Posts", icon: <MessageSquare size={16} /> },
    { to: "/admin/redemptions", label: "Redemptions", icon: <Gift size={16} /> },
  ];

  return (
    <nav className={cn("space-y-1", className)}>
      {navItems.map((item) => (
        <UserLink key={item.to} to={item.to} label={item.label} icon={item.icon} />
      ))}
      
      {isAdmin && (
        <>
          <div className="my-2 border-t border-gray-200 dark:border-gray-800" />
          <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Admin Controls
          </p>
          {adminItems.map((item) => (
            <UserLink key={item.to} to={item.to} label={item.label} icon={item.icon} />
          ))}
        </>
      )}
    </nav>
  );
}
