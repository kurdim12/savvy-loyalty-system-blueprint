
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState = ({ title, message, onRetry }: ErrorStateProps) => {
  return (
    <div className="text-center py-12">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-black mb-2">{title}</h3>
      <p className="text-[#95A5A6] mb-4">{message}</p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          className="bg-black hover:bg-[#95A5A6] text-white"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
