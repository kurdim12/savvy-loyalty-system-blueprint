
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Sparkles } from 'lucide-react';

interface AvatarCustomizerProps {
  currentMood: string;
  currentActivity: string;
  onMoodChange: (mood: string) => void;
  onActivityChange: (activity: string) => void;
}

export const AvatarCustomizer = ({ 
  currentMood, 
  currentActivity, 
  onMoodChange, 
  onActivityChange 
}: AvatarCustomizerProps) => {
  const moods = [
    { emoji: '😊', name: 'Happy', color: 'bg-yellow-100' },
    { emoji: '☕', name: 'Caffeinated', color: 'bg-amber-100' },
    { emoji: '💻', name: 'Working', color: 'bg-blue-100' },
    { emoji: '📖', name: 'Reading', color: 'bg-green-100' },
    { emoji: '🎵', name: 'Vibing', color: 'bg-purple-100' },
    { emoji: '🌙', name: 'Chill', color: 'bg-indigo-100' },
    { emoji: '💡', name: 'Creative', color: 'bg-orange-100' },
    { emoji: '🧘', name: 'Zen', color: 'bg-teal-100' }
  ];

  const activities = [
    'Enjoying coffee',
    'Working on laptop',
    'Reading a book',
    'Listening to music',
    'Having a meeting',
    'Sketching ideas',
    'Writing',
    'People watching',
    'Relaxing',
    'Brainstorming'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#8B4513]">
          <Palette className="h-5 w-5" />
          Customize Your Presence
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-[#8B4513] mb-2">Current Mood</h4>
          <div className="grid grid-cols-4 gap-2">
            {moods.map((mood) => (
              <Button
                key={mood.emoji}
                variant={currentMood === mood.emoji ? 'default' : 'outline'}
                className={`h-12 text-lg ${mood.color} ${
                  currentMood === mood.emoji 
                    ? 'bg-[#8B4513] text-white' 
                    : 'hover:bg-[#8B4513]/10'
                }`}
                onClick={() => onMoodChange(mood.emoji)}
                title={mood.name}
              >
                {mood.emoji}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-[#8B4513] mb-2">What are you doing?</h4>
          <div className="grid grid-cols-2 gap-2">
            {activities.map((activity) => (
              <Button
                key={activity}
                variant={currentActivity === activity ? 'default' : 'outline'}
                className={`text-sm ${
                  currentActivity === activity 
                    ? 'bg-[#8B4513] text-white' 
                    : 'hover:bg-[#8B4513]/10'
                }`}
                onClick={() => onActivityChange(activity)}
              >
                {activity}
              </Button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <Badge className="bg-[#8B4513]/10 text-[#8B4513]">
            <Sparkles className="h-3 w-3 mr-1" />
            Your vibe affects the café atmosphere!
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
