
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Book, 
  Coffee, 
  Star, 
  Users, 
  Camera, 
  Share2, 
  MessageSquare,
  Award,
  ChefHat,
  Lightbulb
} from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  author: string;
  rating: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string;
  tags: string[];
}

interface Skill {
  id: string;
  name: string;
  category: string;
  provider: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface CommunityFeaturesProps {
  currentUser: {
    id: string;
    name: string;
    skills: string[];
    interests: string[];
  };
}

export const CommunityFeatures: React.FC<CommunityFeaturesProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('recipes');
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    difficulty: 'Easy' as const
  });

  const coffeeRecipes: Recipe[] = [
    {
      id: '1',
      name: 'Perfect Pour Over',
      author: 'Luna',
      rating: 4.8,
      difficulty: 'Medium',
      ingredients: ['20g coffee beans', '300ml water at 95°C', 'V60 dripper', 'Paper filter'],
      instructions: 'Grind beans medium-fine. Wet filter. Add coffee, bloom for 30s. Pour in circles.',
      tags: ['pour-over', 'single-origin', 'manual']
    },
    {
      id: '2',
      name: 'Cosmic Cold Brew',
      author: 'Nova',
      rating: 4.9,
      difficulty: 'Easy',
      ingredients: ['100g coarse ground coffee', '1L cold water', '12+ hours time'],
      instructions: 'Mix coffee and water. Steep 12-24 hours. Strain and enjoy over ice.',
      tags: ['cold-brew', 'summer', 'concentrate']
    }
  ];

  const skillExchanges: Skill[] = [
    {
      id: '1',
      name: 'JavaScript Fundamentals',
      category: 'Programming',
      provider: 'Alex',
      description: 'Learn the basics of JavaScript programming',
      level: 'Beginner'
    },
    {
      id: '2',
      name: 'Coffee Cupping',
      category: 'Coffee',
      provider: 'Barista Sam',
      description: 'Professional coffee tasting techniques',
      level: 'Intermediate'
    },
    {
      id: '3',
      name: 'Mindful Meditation',
      category: 'Wellness',
      provider: 'Sage',
      description: 'Daily meditation practices for focus',
      level: 'Beginner'
    }
  ];

  const bookClubs = [
    {
      id: '1',
      name: 'Tech Innovators Book Club',
      currentBook: 'The Phoenix Project',
      members: 12,
      nextMeeting: '2024-06-20',
      corner: 'workspace-zone'
    },
    {
      id: '2',
      name: 'Mindful Living Circle',
      currentBook: 'The Power of Now',
      members: 8,
      nextMeeting: '2024-06-18',
      corner: 'zen-garden'
    }
  ];

  const handleRecipeSubmit = () => {
    if (newRecipe.name && newRecipe.ingredients && newRecipe.instructions) {
      console.log('New recipe submitted:', newRecipe);
      setNewRecipe({ name: '', ingredients: '', instructions: '', difficulty: 'Easy' });
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-emerald-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-800">
          <Users className="h-5 w-5" />
          Community Hub
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="books">Book Clubs</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="recipes" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-emerald-700">Coffee Recipes</h3>
                <Badge className="bg-emerald-100 text-emerald-800">
                  <ChefHat className="h-3 w-3 mr-1" />
                  {coffeeRecipes.length} recipes
                </Badge>
              </div>
              
              {coffeeRecipes.map(recipe => (
                <Card key={recipe.id} className="bg-emerald-50 border-emerald-200">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-emerald-800">{recipe.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{recipe.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{recipe.difficulty}</Badge>
                      <span className="text-xs text-emerald-600">by {recipe.author}</span>
                    </div>
                    
                    <div className="text-xs text-emerald-700 mb-2">
                      <strong>Ingredients:</strong> {recipe.ingredients.slice(0, 2).join(', ')}
                      {recipe.ingredients.length > 2 && '...'}
                    </div>
                    
                    <div className="flex gap-1">
                      {recipe.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Add Recipe Form */}
              <Card className="bg-emerald-50 border-emerald-200 border-dashed">
                <CardContent className="p-3">
                  <h4 className="font-medium text-emerald-800 mb-3">Share Your Recipe</h4>
                  <div className="space-y-2">
                    <Input
                      placeholder="Recipe name"
                      value={newRecipe.name}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, name: e.target.value }))}
                      className="text-sm"
                    />
                    <Input
                      placeholder="Ingredients (comma separated)"
                      value={newRecipe.ingredients}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, ingredients: e.target.value }))}
                      className="text-sm"
                    />
                    <Textarea
                      placeholder="Instructions"
                      value={newRecipe.instructions}
                      onChange={(e) => setNewRecipe(prev => ({ ...prev, instructions: e.target.value }))}
                      className="text-sm h-16"
                    />
                    <Button
                      size="sm"
                      onClick={handleRecipeSubmit}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
                    >
                      <Share2 className="h-3 w-3 mr-2" />
                      Share Recipe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-emerald-700">Skill Exchange</h3>
                <Badge className="bg-emerald-100 text-emerald-800">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  {skillExchanges.length} available
                </Badge>
              </div>
              
              {skillExchanges.map(skill => (
                <Card key={skill.id} className="bg-emerald-50 border-emerald-200">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-emerald-800">{skill.name}</h4>
                      <Badge variant="outline" className="text-xs">{skill.level}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-emerald-200 text-emerald-800 text-xs">
                        {skill.category}
                      </Badge>
                      <span className="text-xs text-emerald-600">by {skill.provider}</span>
                    </div>
                    
                    <p className="text-xs text-emerald-700 mb-3">{skill.description}</p>
                    
                    <Button size="sm" variant="outline" className="w-full border-emerald-300 hover:bg-emerald-100">
                      <MessageSquare className="h-3 w-3 mr-2" />
                      Request Session
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="books" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-emerald-700">Book Clubs</h3>
                <Badge className="bg-emerald-100 text-emerald-800">
                  <Book className="h-3 w-3 mr-1" />
                  {bookClubs.length} active
                </Badge>
              </div>
              
              {bookClubs.map(club => (
                <Card key={club.id} className="bg-emerald-50 border-emerald-200">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-emerald-800">{club.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {club.members}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-emerald-700 mb-2">
                      <strong>Current Read:</strong> {club.currentBook}
                    </div>
                    
                    <div className="text-xs text-emerald-600 mb-3">
                      Next meeting: {club.nextMeeting} in {club.corner}
                    </div>
                    
                    <Button size="sm" variant="outline" className="w-full border-emerald-300 hover:bg-emerald-100">
                      <Book className="h-3 w-3 mr-2" />
                      Join Discussion
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </div>
              
              <div>
                <h3 className="font-medium text-emerald-800">Community Photo Wall</h3>
                <p className="text-sm text-emerald-600">Share your café moments and workspace setups</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Camera className="h-6 w-6 text-emerald-400" />
                  </div>
                ))}
              </div>
              
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Camera className="h-4 w-4 mr-2" />
                Share Your Photo
              </Button>
              
              <div className="text-xs text-emerald-500 bg-emerald-50 p-3 rounded">
                📸 Showcase your workspace, coffee art, or café memories!
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
