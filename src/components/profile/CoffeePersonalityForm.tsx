
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Coffee } from 'lucide-react';
import { CurrentStatusForm } from './forms/CurrentStatusForm';
import { CoffeePreferencesForm } from './forms/CoffeePreferencesForm';
import { useProfileData } from './hooks/useProfileData';

export const CoffeePersonalityForm = () => {
  const {
    currentMood, setCurrentMood,
    availabilityStatus, setAvailabilityStatus,
    currentDrink, setCurrentDrink,
    favoriteOrigin, setFavoriteOrigin,
    brewingPreference, setBrewingPreference,
    flavorProfile, setFlavorProfile,
    adventureLevel, setAdventureLevel,
    updateProfile
  } = useProfileData();

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
          <CurrentStatusForm
            currentMood={currentMood}
            setCurrentMood={setCurrentMood}
            availabilityStatus={availabilityStatus}
            setAvailabilityStatus={setAvailabilityStatus}
            currentDrink={currentDrink}
            setCurrentDrink={setCurrentDrink}
          />

          <CoffeePreferencesForm
            favoriteOrigin={favoriteOrigin}
            setFavoriteOrigin={setFavoriteOrigin}
            brewingPreference={brewingPreference}
            setBrewingPreference={setBrewingPreference}
            flavorProfile={flavorProfile}
            setFlavorProfile={setFlavorProfile}
            adventureLevel={adventureLevel}
            setAdventureLevel={setAdventureLevel}
          />

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
