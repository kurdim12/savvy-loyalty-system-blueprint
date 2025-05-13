
import * as React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Cake, ChevronDown } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function BirthdaySelector() {
  const { profile, updateProfile } = useAuth();
  const [date, setDate] = React.useState<Date | undefined>(
    profile?.birthday ? new Date(profile.birthday) : undefined
  );
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [month, setMonth] = React.useState<number>(date ? date.getMonth() : new Date().getMonth());
  const [year, setYear] = React.useState<number>(date ? date.getFullYear() : 1990);

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Generate years from 1900 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

  const handleMonthChange = (value: string) => {
    const newMonth = parseInt(value);
    setMonth(newMonth);
    
    if (date) {
      const newDate = new Date(date);
      newDate.setMonth(newMonth);
      setDate(newDate);
    } else {
      // If no date selected yet, create one with the selected month, year and default to the 1st
      setDate(new Date(year, newMonth, 1));
    }
  };

  const handleYearChange = (value: string) => {
    const newYear = parseInt(value);
    setYear(newYear);
    
    if (date) {
      const newDate = new Date(date);
      newDate.setFullYear(newYear);
      setDate(newDate);
    } else {
      // If no date selected yet, create one with the selected year, month and default to the 1st
      setDate(new Date(newYear, month, 1));
    }
  };

  React.useEffect(() => {
    if (date) {
      setMonth(date.getMonth());
      setYear(date.getFullYear());
    }
  }, [date]);

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
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
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
              <div className="p-3 space-y-3 bg-white rounded-t-md">
                <div className="flex space-x-2">
                  <Select value={month.toString()} onValueChange={handleMonthChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={year.toString()} onValueChange={handleYearChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                month={new Date(year, month)}
                onMonthChange={(newDate) => {
                  setMonth(newDate.getMonth());
                  setYear(newDate.getFullYear());
                }}
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
