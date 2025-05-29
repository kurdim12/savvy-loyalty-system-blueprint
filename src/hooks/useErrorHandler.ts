
import { useCallback } from 'react';
import { toast } from 'sonner';

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
}

export const useErrorHandler = () => {
  const handleError = useCallback((error: unknown, context?: string) => {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    
    let message = 'An unexpected error occurred';
    
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      message = (error as any).message;
    }
    
    // Handle specific error types
    if (message.includes('auth')) {
      message = 'Authentication error. Please sign in again.';
    } else if (message.includes('network') || message.includes('fetch')) {
      message = 'Network error. Please check your connection.';
    } else if (message.includes('permission') || message.includes('unauthorized')) {
      message = 'You do not have permission to perform this action.';
    }
    
    toast.error(message);
    
    return { message, error };
  }, []);
  
  return { handleError };
};
