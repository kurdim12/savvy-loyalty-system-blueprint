
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Coffee, Plus, X } from 'lucide-react';

const coffeeOrigins = [
  'Ethiopian', 'Colombian', 'Brazilian', 'Guatemalan', 'Kenyan', 
  'Costa Rican', 'Jamaican', 'Hawaiian', 'Yemen', 'Peru'
];

const brewingMethods = [
  'Espresso', 'Pour-over', 'French Press', 'AeroPress', 'Cold Brew',
  'Drip Coffee', 'Chemex', 'V60', 'Moka Pot', 'Turkish'
];

const flavorProfiles = [
  'Fruity', 'Chocolatey', 'Nutty', 'Bright', 'Earthy', 
  'Floral', 'Spicy', 'Sweet', 'Bold', 'Smooth'
];

const adventureLevels = [
  { value: 'conservative', label: 'Conservative - I stick to what I know' },
  { value: 'moderate', label: 'Moderate - Open to trying new things occasionally' },
  { value: 'adventurous', label: 'Adventurous - Always excited to try something new' },
  { value: 'experimental', label: 'Experimental - Love discovering unique flavors' }
];

const moodOptions = [
  'Energetic', 'Contemplative', 'Creative', 'Focused', 'Social', 
  'Relaxed', 'Inspired', 'Productive', 'Curious', 'Happy'
];

const availabilityOptions = [
  'Open to chat', 'Focused work', 'Just listening', 'Available for quick chat',
  'Deep conversation welcome', 'Coffee tasting mode', 'Learning mode'
];

export const CoffeePersonalityForm = () => {
  const { profile, updateProfile } = useAuth();
  const [currentMood, setCurrentMood] = useState(profile?.current_mood || '');
  const [availabilityStatus, setAvailabilityStatus] = useState(profile?.availability_status || '');
  const [currentDrink, setCurrentDrink] = useState(profile?.current_drink || '');
  const [favoriteOrigin, setFavoriteOrigin] = useState(profile?.favorite_coffee_origin || '');
  const [brewingPreference, setBrewingPreference] = useState(profile?.brewing_preference || '');
  const [flavorProfile, setFlavorProfile] = useState(profile?.flavor_profile || '');
  const [adventureLevel, setAdventureLevel] = useState(profile?.coffee_adventure_level || 'moderate');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateCoffeeProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await updateProfile({
        current_mood: currentMood,
        availability_status: availabilityStatus,
        current_drink: currentDrink,
        favorite_coffee_origin: favoriteOrigin,
        brewing_preference: brewingPreference,
        flavor_profile: flavorProfile,
        coffee_adventure_level: adventureLevel,
      });
      toast.success('Coffee profile updated successfully!');
    } catch (error) {
      console.error('Error updating coffee profile:', error);
      toast.error('Failed to update coffee profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="border-[#8B4513]/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#8B4513]">
          <Coffee className="h-5 w-5" />
          Coffee Personality
        </CardTitle>
        <CardDescription className="text-[#6F4E37]">
          Share your coffee preferences and current state to help others connect with you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateCoffeeProfile} className="space-y-6">
          {/* Current Status */}
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

          {/* Coffee Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#6F4E37]">Favorite Coffee Origin</label>
              <Select value={favoriteOrigin} onValueChange={setFavoriteOrigin}>
                <SelectTrigger className="border-[#8B4513]/20">
                  <SelectValue placeholder="Select origin" />
                </SelectTrigger>
                <SelectContent>
                  {coffeeOrigins.map((origin) => (
                    <SelectItem key={origin} value={origin}>{origin}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#6F4E37]">Brewing Preference</label>
              <Select value={brewingPreference} onValueChange={setBrewingPreference}>
                <SelectTrigger className="border-[#8B4513]/20">
                  <SelectValue placeholder="Select brewing method" />
                </SelectTrigger>
                <SelectContent>
                  {brewingMethods.map((method) => (
                    <SelectItem key={method} value={method}>{method}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#6F4E37]">Flavor Profile</label>
              <Select value={flavorProfile} onValueChange={setFlavorProfile}>
                <SelectTrigger className="border-[#8B4513]/20">
                  <SelectValue placeholder="Select flavor profile" />
                </SelectTrigger>
                <SelectContent>
                  {flavorProfiles.map((flavor) => (
                    <SelectItem key={flavor} value={flavor}>{flavor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#6F4E37]">Coffee Adventure Level</label>
              <Select value={adventureLevel} onValueChange={setAdventureLevel}>
                <SelectTrigger className="border-[#8B4513]/20">
                  <SelectValue placeholder="How adventurous are you?" />
                </SelectTrigger>
                <SelectContent>
                  {adventureLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isUpdating}
            className="bg-[#8B4513] hover:bg-[#6F4E37]"
          >
            {isUpdating ? 'Updating...' : 'Save Coffee Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
