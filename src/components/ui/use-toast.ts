
import { useToast as useToastOriginal } from "@/hooks/use-toast";

// Simplified toast interface - use only the shadcn toast system
export const useToast = useToastOriginal;

export const toast = {
  success: (message: string) => {
    const { toast: showToast } = useToastOriginal();
    showToast({
      title: "Success",
      description: message,
    });
  },
  error: (message: string) => {
    const { toast: showToast } = useToastOriginal();
    showToast({
      title: "Error", 
      description: message,
      variant: "destructive"
    });
  },
  info: (message: string) => {
    const { toast: showToast } = useToastOriginal();
    showToast({
      title: "Info",
      description: message,
    });
  },
  warning: (message: string) => {
    const { toast: showToast } = useToastOriginal();
    showToast({
      title: "Warning",
      description: message,
    });
  },
};
