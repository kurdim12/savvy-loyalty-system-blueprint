
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Users, Plus, X, MessageSquare } from 'lucide-react';

const conversationStyles = [
  'Deep discussions', 'Casual chat', 'Educational', 'Supportive',
  'Humorous', 'Professional networking', 'Creative brainstorming', 'Philosophical'
];

const seatingPreferences = [
  'Bar counter', 'Intimate tables', 'Community tables', 'Window seats',
  'Cozy corners', 'Standing areas', 'Outdoor seating', 'Quiet zones'
];

const visitFrequencies = [
  'Daily regular', 'Weekly visitor', 'Weekend warrior', 'Occasional explorer',
  'Special events only', 'New to the community'
];

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian'
];

const topicSuggestions = [
  'Photography', 'Travel', 'Startups', 'Art', 'Music', 'Books', 'Technology',
  'Cooking', 'Fitness', 'Nature', 'Film', 'Design', 'Writing', 'History',
  'Science', 'Philosophy', 'Gaming', 'Sports', 'Fashion', 'Politics'
];

export const SocialPreferencesForm = () => {
  const { profile, updateProfile } = useAuth();
  const [primaryTopics, setPrimaryTopics] = useState<string[]>(profile?.primary_topics || []);
  const [conversationStyle, setConversationStyle] = useState(profile?.conversation_style || '');
  const [languagesSpoken, setLanguagesSpoken] = useState<string[]>(profile?.languages_spoken || []);
  const [timeZone, setTimeZone] = useState(profile?.time_zone || '');
  const [favoriteSeating, setFavoriteSeating] = useState(profile?.favorite_seating || '');
  const [visitFrequency, setVisitFrequency] = useState(profile?.visit_frequency || '');
  const [newTopic, setNewTopic] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const addTopic = (topic: string) => {
    if (topic && !primaryTopics.includes(topic) && primaryTopics.length < 7) {
      setPrimaryTopics([...primaryTopics, topic]);
      setNewTopic('');
    }
  };

  const removeTopic = (topicToRemove: string) => {
    setPrimaryTopics(primaryTopics.filter(topic => topic !== topicToRemove));
  };

  const addLanguage = (language: string) => {
    if (language && !languagesSpoken.includes(language)) {
      setLanguagesSpoken([...languagesSpoken, language]);
      setNewLanguage('');
    }
  };

  const removeLanguage = (languageToRemove: string) => {
    setLanguagesSpoken(languagesSpoken.filter(lang => lang !== languageToRemove));
  };

  const handleUpdateSocialProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await updateProfile({
        primary_topics: primaryTopics,
        conversation_style: conversationStyle,
        languages_spoken: languagesSpoken,
        time_zone: timeZone,
        favorite_seating: favoriteSeating,
        visit_frequency: visitFrequency,
      });
      toast.success('Social preferences updated successfully!');
    } catch (error) {
      console.error('Error updating social preferences:', error);
      toast.error('Failed to update social preferences. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="border-[#8B4513]/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#8B4513]">
          <Users className="h-5 w-5" />
          Social Preferences
        </CardTitle>
        <CardDescription className="text-[#6F4E37]">
          Help others find you for meaningful conversations and connections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateSocialProfile} className="space-y-6">
          {/* Primary Topics */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[#6F4E37]">
              Primary Topics (Max 7)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {primaryTopics.map((topic) => (
                <Badge 
                  key={topic} 
                  variant="secondary" 
                  className="bg-[#8B4513]/10 text-[#8B4513] hover:bg-[#8B4513]/20"
                >
                  {topic}
                  <button
                    type="button"
                    onClick={() => removeTopic(topic)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {topicSuggestions
                .filter(topic => !primaryTopics.includes(topic))
                .slice(0, 8)
                .map((topic) => (
                <Button
                  key={topic}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTopic(topic)}
                  disabled={primaryTopics.length >= 7}
                  className="text-xs border-[#8B4513]/20 text-[#8B4513] hover:bg-[#8B4513]/10"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {topic}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Add custom topic..."
                className="border-[#8B4513]/20"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic(newTopic))}
              />
              <Button
                type="button"
                onClick={() => addTopic(newTopic)}
                disabled={primaryTopics.length >= 7}
                variant="outline"
                className="border-[#8B4513]/20 text-[#8B4513]"
              >
                Add
              </Button>
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-[#6F4E37]">Languages Spoken</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {languagesSpoken.map((language) => (
                <Badge 
                  key={language} 
                  variant="secondary" 
                  className="bg-[#8B4513]/10 text-[#8B4513] hover:bg-[#8B4513]/20"
                >
                  {language}
                  <button
                    type="button"
                    onClick={() => removeLanguage(language)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Select value={newLanguage} onValueChange={(value) => addLanguage(value)}>
              <SelectTrigger className="border-[#8B4513]/20">
                <SelectValue placeholder="Add a language" />
              </SelectTrigger>
              <SelectContent>
                {languages
                  .filter(lang => !languagesSpoken.includes(lang))
                  .map((language) => (
                  <SelectItem key={language} value={language}>{language}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Conversation and Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#6F4E37]">Conversation Style</label>
              <Select value={conversationStyle} onValueChange={setConversationStyle}>
                <SelectTrigger className="border-[#8B4513]/20">
                  <SelectValue placeholder="Select conversation style" />
                </SelectTrigger>
                <SelectContent>
                  {conversationStyles.map((style) => (
                    <SelectItem key={style} value={style}>{style}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#6F4E37]">Favorite Seating</label>
              <Select value={favoriteSeating} onValueChange={setFavoriteSeating}>
                <SelectTrigger className="border-[#8B4513]/20">
                  <SelectValue placeholder="Select seating preference" />
                </SelectTrigger>
                <SelectContent>
                  {seatingPreferences.map((seating) => (
                    <SelectItem key={seating} value={seating}>{seating}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#6F4E37]">Visit Frequency</label>
              <Select value={visitFrequency} onValueChange={setVisitFrequency}>
                <SelectTrigger className="border-[#8B4513]/20">
                  <SelectValue placeholder="How often do you visit?" />
                </SelectTrigger>
                <SelectContent>
                  {visitFrequencies.map((frequency) => (
                    <SelectItem key={frequency} value={frequency}>{frequency}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#6F4E37]">Time Zone</label>
              <Input
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                placeholder="e.g., EST, PST, GMT+1"
                className="border-[#8B4513]/20"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isUpdating}
            className="bg-[#8B4513] hover:bg-[#6F4E37]"
          >
            {isUpdating ? 'Updating...' : 'Save Social Preferences'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
