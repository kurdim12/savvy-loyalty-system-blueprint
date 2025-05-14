
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Coffee, User, Award, Users, Gift, MessageSquare, Settings } from 'lucide-react';
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

  return (
    <nav className={cn("space-y-1", className)}>
      <UserLink to="/dashboard" label="Dashboard" icon={<Home size={16} />} />
      <UserLink to="/rewards" label="Rewards" icon={<Award size={16} />} />
      <UserLink to="/community" label="Community" icon={<MessageSquare size={16} />} />
      <UserLink to="/profile" label="Profile" icon={<User size={16} />} />
      
      {isAdmin && (
        <>
          <div className="my-2 border-t border-gray-200 dark:border-gray-800" />
          <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Admin
          </p>
          <UserLink to="/admin/dashboard" label="Admin Home" icon={<Settings size={16} />} />
          <UserLink to="/admin/customers" label="Customers" icon={<Users size={16} />} />
          <UserLink to="/admin/rewards" label="Rewards" icon={<Gift size={16} />} />
          <UserLink to="/admin/drinks" label="Drinks" icon={<Coffee size={16} />} />
        </>
      )}
    </nav>
  );
}
