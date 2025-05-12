
import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Cake } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function BirthdaySelector() {
  const { profile, updateProfile } = useAuth();
  const [date, setDate] = React.useState<Date | undefined>(
    profile?.birthday ? new Date(profile.birthday) : undefined
  );
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleSaveBirthday = async () => {
    if (!date) return;
    
    setIsUpdating(true);
    try {
      await updateProfile({
        birthday: date.toISOString()
      });
      toast.success("Birthday updated successfully!");
    } catch (error) {
      console.error("Failed to update birthday:", error);
      toast.error("Failed to update birthday. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="border-[#8B4513]/20 overflow-visible">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-[#8B4513]">
          <Cake className="h-5 w-5 text-[#9b87f5]" />
          Birthday
        </CardTitle>
        <CardDescription className="text-[#6F4E37]">
          Add your birthday to receive special rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left w-full md:w-[240px] border-[#E5DEFF] bg-[#F1F0FB]",
                  !date && "text-muted-foreground"
                )}
              >
                <Cake className="mr-2 h-4 w-4 text-[#9b87f5]" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => 
                  date > new Date() || 
                  date < new Date("1900-01-01")
                }
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            onClick={handleSaveBirthday} 
            disabled={!date || isUpdating}
            className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
          >
            {isUpdating ? "Saving..." : "Save"}
          </Button>
        </div>
        
        {profile?.birthday && (
          <div className="mt-2 text-sm text-[#6F4E37]">
            <div className="p-3 rounded-md bg-[#F2FCE2] border border-[#F2FCE2]/30 text-[#403E43]">
              <span className="font-medium">Current birthday:</span> {format(new Date(profile.birthday), "PPP")}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
