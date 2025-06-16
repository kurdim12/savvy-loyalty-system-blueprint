
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Book, Coffee, Plant, Picture, Settings, Star, Trophy } from 'lucide-react';

interface PersonalItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: 'tech' | 'decoration' | 'books' | 'drinks';
  unlocked: boolean;
  description: string;
}

interface PersonalWorkspaceProps {
  seatId: string;
  userLevel: number;
  userAchievements: string[];
  onItemPlace: (itemId: string, position: { x: number; y: number }) => void;
}

export const PersonalWorkspace: React.FC<PersonalWorkspaceProps> = ({
  seatId,
  userLevel,
  userAchievements,
  onItemPlace
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('items');

  const availableItems: PersonalItem[] = [
    {
      id: 'laptop',
      name: 'MacBook Pro',
      icon: <Monitor className="h-4 w-4" />,
      category: 'tech',
      unlocked: true,
      description: 'Your trusty work companion'
    },
    {
      id: 'notebook',
      name: 'Moleskine Journal',
      icon: <Book className="h-4 w-4" />,
      category: 'books',
      unlocked: true,
      description: 'For creative thoughts'
    },
    {
      id: 'plant',
      name: 'Desk Succulent',
      icon: <Plant className="h-4 w-4" />,
      category: 'decoration',
      unlocked: userLevel >= 5,
      description: 'Brings life to your space'
    },
    {
      id: 'coffee-mug',
      name: 'Favorite Mug',
      icon: <Coffee className="h-4 w-4" />,
      category: 'drinks',
      unlocked: userAchievements.includes('coffee-lover'),
      description: 'Your personal coffee vessel'
    },
    {
      id: 'photo-frame',
      name: 'Memory Frame',
      icon: <Picture className="h-4 w-4" />,
      category: 'decoration',
      unlocked: userLevel >= 10,
      description: 'Cherished memories'
    }
  ];

  const workspaceThemes = [
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'Clean and focused',
      unlocked: true,
      style: 'bg-gradient-to-br from-gray-50 to-white'
    },
    {
      id: 'cozy',
      name: 'Cozy Cabin',
      description: 'Warm and inviting',
      unlocked: userLevel >= 3,
      style: 'bg-gradient-to-br from-amber-50 to-orange-50'
    },
    {
      id: 'modern',
      name: 'Modern Tech',
      description: 'Sleek and professional',
      unlocked: userLevel >= 7,
      style: 'bg-gradient-to-br from-blue-50 to-cyan-50'
    },
    {
      id: 'nature',
      name: 'Nature Inspired',
      description: 'Green and peaceful',
      unlocked: userAchievements.includes('eco-friendly'),
      style: 'bg-gradient-to-br from-green-50 to-emerald-50'
    }
  ];

  const toggleItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getItemsByCategory = (category: PersonalItem['category']) => {
    return availableItems.filter(item => item.category === category);
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Settings className="h-5 w-5" />
          Personal Workspace
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="achievements">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-4">
            <div className="text-sm text-purple-600 mb-3">
              Customize your table with personal items ({selectedItems.length}/5 selected)
            </div>
            
            {(['tech', 'decoration', 'books', 'drinks'] as const).map(category => (
              <div key={category} className="space-y-2">
                <h4 className="text-sm font-medium text-purple-700 capitalize">{category}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {getItemsByCategory(category).map(item => (
                    <Button
                      key={item.id}
                      variant={selectedItems.includes(item.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => item.unlocked && toggleItem(item.id)}
                      disabled={!item.unlocked || (selectedItems.length >= 5 && !selectedItems.includes(item.id))}
                      className={`justify-start h-auto p-3 ${
                        selectedItems.includes(item.id) 
                          ? 'bg-purple-600 text-white' 
                          : item.unlocked 
                            ? 'hover:bg-purple-50' 
                            : 'opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <div className="text-left">
                          <div className="text-xs font-medium">{item.name}</div>
                          <div className="text-xs opacity-75">{item.description}</div>
                        </div>
                      </div>
                      {!item.unlocked && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          Locked
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="themes" className="space-y-4">
            <div className="text-sm text-purple-600 mb-3">
              Choose your workspace theme
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {workspaceThemes.map(theme => (
                <Button
                  key={theme.id}
                  variant="outline"
                  size="sm"
                  disabled={!theme.unlocked}
                  className={`justify-start h-auto p-4 ${theme.style} ${
                    theme.unlocked ? 'hover:scale-105' : 'opacity-50'
                  } transition-all duration-200`}
                >
                  <div className="text-left w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{theme.name}</span>
                      {!theme.unlocked && (
                        <Badge variant="secondary" className="text-xs">
                          Locked
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-600">{theme.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-purple-800">Level {userLevel}</h3>
                <p className="text-sm text-purple-600">Workspace Architect</p>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm font-medium text-purple-700">Achievements</div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {userAchievements.map(achievement => (
                    <Badge key={achievement} className="bg-purple-100 text-purple-800">
                      <Star className="h-3 w-3 mr-1" />
                      {achievement.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="text-xs text-purple-500 bg-purple-50 p-3 rounded">
                🎯 Complete café activities to unlock new items and themes!
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
