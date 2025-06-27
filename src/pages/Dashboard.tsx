import { useEffect } from 'react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardDescription,
  HoverCardHeader,
  HoverCardTitle,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "@radix-ui/react-icons"
import { DateRange } from "react-day-picker"
import { Button as shadcnButton } from "@/components/ui/button"
import { Popover as shadcnPopover, PopoverContent as shadcnPopoverContent, PopoverTrigger as shadcnPopoverTrigger } from "@/components/ui/popover"
import { Input as shadcnInput } from "@/components/ui/input"
import { Label as shadcnLabel } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { NavigationMenu, NavigationMenuItem, NavigationMenuContent, NavigationMenuList, NavigationMenuLink, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Icons } from "@/components/icons"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/components/ui/use-toast"
import { AnimatePresence } from "framer-motion"
import { CalendarDateRangePicker } from "@/components/ui/calendar-date-range-picker"
import { Combobox } from "@/components/ui/combobox"
import { ContextMenu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "@/components/ui/context-menu"
import { DataGrid } from "@/components/ui/data-grid"
import { InputWithButton } from "@/components/ui/input-with-button"
import { Kbd } from "@/components/ui/kbd"
import { Listbox, ListboxContent, ListboxEmpty, ListboxItem, ListboxLabel, ListboxSeparator, ListboxTrigger } from "@/components/ui/listbox"
import { PinInput } from "@/components/ui/pin-input"
import { ProgressRing } from "@/components/ui/progress-ring"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, ResizableSeparator } from "@/components/ui/resizable"
import { Sonner } from "@/components/ui/sonner"
import { Steps, Step } from "@/components/ui/steps"
import { Timeline, TimelineItem } from "@/components/ui/timeline"
import { Toggle } from "@/components/ui/toggle"
import { Tree, TreeItem } from "@/components/ui/tree"
import { useContextMenu } from "@/hooks/use-context-menu"
import { useDrawer } from "@/hooks/use-drawer"
import { useHoverCard } from "@/hooks/use-hover-card"
import { useKeyboard } from "@/hooks/use-keyboard"
import { usePopover } from "@/hooks/use-popover"
import { useResizable } from "@/hooks/use-resizable"
import { useSelect } from "@/hooks/use-select"
import { useSheet } from "@/hooks/use-sheet"
import { useToast as useToastOriginal } from "@/hooks/use-toast"
import { useTransition } from "@/hooks/use-transition"
import { SkeletonDemo } from "@/demos/skeleton"
import { AccordionDemo } from "@/demos/accordion"
import { AlertDialogDemo } from "@/demos/alert-dialog"
import { AspectRatioDemo } from "@/demos/aspect-ratio"
import { AvatarDemo } from "@/demos/avatar"
import { BadgeDemo } from "@/demos/badge"
import { ButtonDemo } from "@/demos/button"
import { CalendarDemo } from "@/demos/calendar"
import { CardDemo } from "@/demos/card"
import { CarouselDemo } from "@/demos/carousel"
import { CheckboxDemo } from "@/demos/checkbox"
import { ComboboxDemo } from "@/demos/combobox"
import { CommandDemo } from "@/demos/command"
import { ContextMenuDemo } from "@/demos/context-menu"
import { DataGridDemo } from "@/demos/data-grid"
import { DialogDemo } from "@/demos/dialog"
import { DrawerDemo } from "@/demos/drawer"
import { DropdownMenuDemo } from "@/demos/dropdown-menu"
import { FormDemo } from "@/demos/form"
import { HoverCardDemo } from "@/demos/hover-card"
import { InputDemo } from "@/demos/input"
import { InputWithButtonDemo } from "@/demos/input-with-button"
import { KbdDemo } from "@/demos/kbd"
import { ListboxDemo } from "@/demos/listbox"
import { MenubarDemo } from "@/demos/menubar"
import { ModeToggleDemo } from "@/demos/mode-toggle"
import { NavigationMenuDemo } from "@/demos/navigation-menu"
import { PinInputDemo } from "@/demos/pin-input"
import { PopoverDemo } from "@/demos/popover"
import { ProgressDemo } from "@/demos/progress"
import { ProgressRingDemo } from "@/demos/progress-ring"
import { RadioGroupDemo } from "@/demos/radio-group"
import { ResizableDemo } from "@/demos/resizable"
import { ScrollAreaDemo } from "@/demos/scroll-area"
import { SelectDemo } from "@/demos/select"
import { SeparatorDemo } from "@/demos/separator"
import { SheetDemo } from "@/demos/sheet"
import { SliderDemo } from "@/demos/slider"
import { SonnerDemo } from "@/demos/sonner"
import { StepsDemo } from "@/demos/steps"
import { SwitchDemo } from "@/demos/switch"
import { TableDemo } from "@/demos/table"
import { TabsDemo } from "@/demos/tabs"
import { TextareaDemo } from "@/demos/textarea"
import { TimelineDemo } from "@/demos/timeline"
import { ToggleDemo } from "@/demos/toggle"
import { ToasterDemo } from "@/demos/toaster"
import { TooltipDemo } from "@/demos/tooltip"
import { TreeDemo } from "@/demos/tree"
import '../utils/sendTestEmail';

const Dashboard = () => {
  const session = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (session.data?.user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.data.user.id)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
          return;
        }

        setIsAdmin(data?.role === 'admin');
      }
    };

    checkAdminStatus();
  }, [session]);

  if (session.status === "loading") {
    return <div>Loading...</div>;
  }

  if (session.status === "unauthenticated") {
    router.push('/login');
    return null;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.data?.user?.email}</p>
      {isAdmin && <p>You have admin access.</p>}
      <Button onClick={() => signOut()}>Sign Out</Button>
    </div>
  );
};

export default Dashboard;
