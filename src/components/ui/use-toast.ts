
import { useToast, toast as baseToast } from "@/hooks/use-toast";
import type { ToastProps } from "@/components/ui/toast";

// Create a properly callable function with additional methods
const toast = Object.assign(
  // The main function
  (props: ToastProps) => baseToast(props),
  // Additional utility methods
  {
    success: (message: string) => baseToast({ title: "Success", description: message }),
    error: (message: string) => baseToast({ title: "Error", description: message, variant: "destructive" }),
    info: (message: string) => baseToast({ title: "Info", description: message }),
    warning: (message: string) => baseToast({ title: "Warning", description: message }),
  }
);

export { useToast, toast };
