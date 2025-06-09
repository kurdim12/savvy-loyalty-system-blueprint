
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface CoffeePreferencesFormProps {
  favoriteOrigin: string;
  setFavoriteOrigin: (origin: string) => void;
  brewingPreference: string;
  setBrewingPreference: (method: string) => void;
  flavorProfile: string;
  setFlavorProfile: (profile: string) => void;
  adventureLevel: string;
  setAdventureLevel: (level: string) => void;
}

export const CoffeePreferencesForm = ({
  favoriteOrigin,
  setFavoriteOrigin,
  brewingPreference,
  setBrewingPreference,
  flavorProfile,
  setFlavorProfile,
  adventureLevel,
  setAdventureLevel
}: CoffeePreferencesFormProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};
