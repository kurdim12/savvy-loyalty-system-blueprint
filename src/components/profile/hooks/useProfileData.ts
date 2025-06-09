
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useProfileData = () => {
  const { profile, updateProfile } = useAuth();
  
  // Coffee personality state
  const [currentMood, setCurrentMood] = useState(profile?.current_mood || '');
  const [availabilityStatus, setAvailabilityStatus] = useState(profile?.availability_status || '');
  const [currentDrink, setCurrentDrink] = useState(profile?.current_drink || '');
  const [favoriteOrigin, setFavoriteOrigin] = useState(profile?.favorite_coffee_origin || '');
  const [brewingPreference, setBrewingPreference] = useState(profile?.brewing_preference || '');
  const [flavorProfile, setFlavorProfile] = useState(profile?.flavor_profile || '');
  const [adventureLevel, setAdventureLevel] = useState(profile?.coffee_adventure_level || 'moderate');

  // Social preferences state
  const [primaryTopics, setPrimaryTopics] = useState<string[]>(profile?.primary_topics || []);
  const [conversationStyle, setConversationStyle] = useState(profile?.conversation_style || '');
  const [languagesSpoken, setLanguagesSpoken] = useState<string[]>(profile?.languages_spoken || []);
  const [timeZone, setTimeZone] = useState(profile?.time_zone || '');
  const [favoriteSeating, setFavoriteSeating] = useState(profile?.favorite_seating || '');
  const [visitFrequency, setVisitFrequency] = useState(profile?.visit_frequency || '');

  // Update state when profile changes
  useEffect(() => {
    if (profile) {
      setCurrentMood(profile.current_mood || '');
      setAvailabilityStatus(profile.availability_status || '');
      setCurrentDrink(profile.current_drink || '');
      setFavoriteOrigin(profile.favorite_coffee_origin || '');
      setBrewingPreference(profile.brewing_preference || '');
      setFlavorProfile(profile.flavor_profile || '');
      setAdventureLevel(profile.coffee_adventure_level || 'moderate');
      setPrimaryTopics(profile.primary_topics || []);
      setConversationStyle(profile.conversation_style || '');
      setLanguagesSpoken(profile.languages_spoken || []);
      setTimeZone(profile.time_zone || '');
      setFavoriteSeating(profile.favorite_seating || '');
      setVisitFrequency(profile.visit_frequency || '');
    }
  }, [profile]);

  return {
    // Coffee personality
    currentMood, setCurrentMood,
    availabilityStatus, setAvailabilityStatus,
    currentDrink, setCurrentDrink,
    favoriteOrigin, setFavoriteOrigin,
    brewingPreference, setBrewingPreference,
    flavorProfile, setFlavorProfile,
    adventureLevel, setAdventureLevel,
    
    // Social preferences
    primaryTopics, setPrimaryTopics,
    conversationStyle, setConversationStyle,
    languagesSpoken, setLanguagesSpoken,
    timeZone, setTimeZone,
    favoriteSeating, setFavoriteSeating,
    visitFrequency, setVisitFrequency,
    
    // Update function
    updateProfile
  };
};
