
import { toast } from 'sonner';
import { useCallback } from 'react';

export const useErrorHandler = () => {
  const handleError = useCallback((error: any, context: string = '') => {
    console.error(`Error ${context}:`, error);
    
    let message = 'An unexpected error occurred';
    
    if (error?.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }
    
    // Show user-friendly error messages
    if (message.includes('JWT') || message.includes('jwt') || message.includes('token')) {
      message = 'Session expired. Please log in again.';
    } else if (message.includes('Network') || message.includes('network') || message.includes('fetch')) {
      message = 'Network error. Please check your connection.';
    } else if (message.includes('duplicate') || message.includes('already exists')) {
      message = 'This item already exists.';
    } else if (message.includes('not found') || message.includes('404')) {
      message = 'The requested item was not found.';
    } else if (message.includes('permission') || message.includes('unauthorized') || message.includes('403')) {
      message = 'You do not have permission to perform this action.';
    } else if (message.includes('validation') || message.includes('invalid')) {
      message = 'Please check your input and try again.';
    } else if (message.includes('timeout')) {
      message = 'Request timed out. Please try again.';
    }
    
    toast.error(message);
  }, []);

  return { handleError };
};
