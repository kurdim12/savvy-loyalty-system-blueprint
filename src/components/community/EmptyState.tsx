
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  children 
}: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <Icon className="h-12 w-12 text-[#95A5A6] mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-black mb-2">{title}</h3>
      <p className="text-[#95A5A6] mb-4">{description}</p>
      {action && (
        <Button 
          onClick={action.onClick}
          className="bg-black hover:bg-[#95A5A6] text-white"
        >
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
};
