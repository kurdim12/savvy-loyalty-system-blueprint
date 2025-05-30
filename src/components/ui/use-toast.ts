
import { useToast as useToastOriginal } from "@/hooks/use-toast";

// Simplified toast interface - use only the shadcn toast system
export const useToast = useToastOriginal;

export const toast = {
  success: (message: string) => {
    try {
      const { toast: showToast } = useToastOriginal();
      showToast({
        title: "Success",
        description: message,
      });
    } catch (error) {
      console.error('Toast error:', error);
    }
  },
  error: (message: string) => {
    try {
      const { toast: showToast } = useToastOriginal();
      showToast({
        title: "Error", 
        description: message,
        variant: "destructive"
      });
    } catch (error) {
      console.error('Toast error:', error);
    }
  },
  info: (message: string) => {
    try {
      const { toast: showToast } = useToastOriginal();
      showToast({
        title: "Info",
        description: message,
      });
    } catch (error) {
      console.error('Toast error:', error);
    }
  },
  warning: (message: string) => {
    try {
      const { toast: showToast } = useToastOriginal();
      showToast({
        title: "Warning",
        description: message,
      });
    } catch (error) {
      console.error('Toast error:', error);
    }
  },
};
