
import { toast } from 'sonner';

export const useErrorHandler = () => {
  const handleError = (error: any, context: string = '') => {
    console.error(`Error ${context}:`, error);
    
    let message = 'An unexpected error occurred';
    
    if (error?.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }
    
    // Show user-friendly error messages
    if (message.includes('JWT')) {
      message = 'Session expired. Please log in again.';
    } else if (message.includes('Network')) {
      message = 'Network error. Please check your connection.';
    } else if (message.includes('duplicate')) {
      message = 'This item already exists.';
    } else if (message.includes('not found')) {
      message = 'The requested item was not found.';
    } else if (message.includes('permission')) {
      message = 'You do not have permission to perform this action.';
    }
    
    toast.error(message);
  };

  return { handleError };
};
