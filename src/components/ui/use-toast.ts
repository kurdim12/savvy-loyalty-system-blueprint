
// FIXED: Removed duplicate toast system to prevent conflicts
import { useToast as useToastOriginal } from "@/hooks/use-toast";

// Use only the shadcn toast system to prevent conflicts
export const useToast = useToastOriginal;
