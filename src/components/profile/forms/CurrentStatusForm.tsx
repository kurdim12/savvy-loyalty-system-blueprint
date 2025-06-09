
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const moodOptions = [
  'Energetic', 'Contemplative', 'Creative', 'Focused', 'Social', 
  'Relaxed', 'Inspired', 'Productive', 'Curious', 'Happy'
];

const availabilityOptions = [
  'Open to chat', 'Focused work', 'Just listening', 'Available for quick chat',
  'Deep conversation welcome', 'Coffee tasting mode', 'Learning mode'
];

interface CurrentStatusFormProps {
  currentMood: string;
  setCurrentMood: (mood: string) => void;
  availabilityStatus: string;
  setAvailabilityStatus: (status: string) => void;
  currentDrink: string;
  setCurrentDrink: (drink: string) => void;
}

export const CurrentStatusForm = ({
  currentMood,
  setCurrentMood,
  availabilityStatus,
  setAvailabilityStatus,
  currentDrink,
  setCurrentDrink
}: CurrentStatusFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#6F4E37]">Current Mood</label>
          <Select value={currentMood} onValueChange={setCurrentMood}>
            <SelectTrigger className="border-[#8B4513]/20">
              <SelectValue placeholder="How are you feeling?" />
            </SelectTrigger>
            <SelectContent>
              {moodOptions.map((mood) => (
                <SelectItem key={mood} value={mood}>{mood}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#6F4E37]">Availability Status</label>
          <Select value={availabilityStatus} onValueChange={setAvailabilityStatus}>
            <SelectTrigger className="border-[#8B4513]/20">
              <SelectValue placeholder="Are you open to chat?" />
            </SelectTrigger>
            <SelectContent>
              {availabilityOptions.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[#6F4E37]">Current Drink</label>
        <Input
          value={currentDrink}
          onChange={(e) => setCurrentDrink(e.target.value)}
          placeholder="What are you drinking right now?"
          className="border-[#8B4513]/20"
        />
      </div>
    </div>
  );
};
