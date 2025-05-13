
import { useToast, toast } from "@/hooks/use-toast";

// Re-export with utility methods for convenience
const enhancedToast = {
  ...toast,
  success: (message: string) => toast({ title: "Success", description: message }),
  error: (message: string) => toast({ title: "Error", description: message, variant: "destructive" }),
  info: (message: string) => toast({ title: "Info", description: message }),
  warning: (message: string) => toast({ title: "Warning", description: message }),
};

export { useToast, enhancedToast as toast };
