
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee, Trophy, Users, Calendar, Star, Zap } from 'lucide-react';

interface ChallengeTemplate {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  category: string;
  suggestedTarget: number;
  suggestedReward: string;
  icon: any;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const challengeTemplates: ChallengeTemplate[] = [
  // Coffee Journey Challenges
  {
    id: 'coffee-passport',
    title: 'Coffee Passport Week',
    description: 'Try 5 different coffee origins in 7 days',
    type: 'weekly',
    category: 'exploration',
    suggestedTarget: 5,
    suggestedReward: 'Coffee tasting notes journal',
    icon: Coffee,
    difficulty: 'beginner'
  },
  {
    id: 'brewing-master',
    title: 'Brewing Method Master',
    description: 'Experience 3 different brewing methods',
    type: 'monthly',
    category: 'education',
    suggestedTarget: 3,
    suggestedReward: 'Free brewing workshop',
    icon: Star,
    difficulty: 'intermediate'
  },
  
  // Social Challenges
  {
    id: 'coffee-buddy',
    title: 'Coffee Buddy Challenge',
    description: 'Bring 3 friends for coffee this month',
    type: 'monthly',
    category: 'social',
    suggestedTarget: 3,
    suggestedReward: 'Group coffee tasting session',
    icon: Users,
    difficulty: 'beginner'
  },
  {
    id: 'morning-ritual',
    title: 'Morning Coffee Ritual',
    description: 'Visit before 9 AM for 7 consecutive days',
    type: 'weekly',
    category: 'habit',
    suggestedTarget: 7,
    suggestedReward: 'Early bird special discount',
    icon: Zap,
    difficulty: 'intermediate'
  },
  
  // Seasonal Challenges
  {
    id: 'seasonal-special',
    title: 'Seasonal Specialty Explorer',
    description: 'Try all seasonal drinks this month',
    type: 'monthly',
    category: 'seasonal',
    suggestedTarget: 4,
    suggestedReward: 'First taste of next season menu',
    icon: Calendar,
    difficulty: 'beginner'
  },
  {
    id: 'weekend-warrior',
    title: 'Weekend Coffee Warrior',
    description: 'Visit every weekend for a month',
    type: 'monthly',
    category: 'consistency',
    suggestedTarget: 8,
    suggestedReward: 'Weekend exclusive blend',
    icon: Trophy,
    difficulty: 'intermediate'
  }
];

interface ChallengeTemplatesProps {
  onSelectTemplate: (template: ChallengeTemplate) => void;
}

const ChallengeTemplates = ({ onSelectTemplate }: ChallengeTemplatesProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'exploration': return 'bg-purple-100 text-purple-800';
      case 'education': return 'bg-blue-100 text-blue-800';
      case 'social': return 'bg-pink-100 text-pink-800';
      case 'habit': return 'bg-orange-100 text-orange-800';
      case 'seasonal': return 'bg-amber-100 text-amber-800';
      case 'consistency': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-amber-900 mb-2">Challenge Templates</h3>
        <p className="text-amber-700 text-sm">Select a template to pre-fill challenge details. You can customize all values including points and rewards.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {challengeTemplates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-amber-600" />
                    <CardTitle className="text-base">{template.title}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="outline" className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <Badge variant="outline" className="capitalize">{template.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Difficulty:</span>
                    <Badge className={getDifficultyColor(template.difficulty)}>
                      {template.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Target:</span>
                    <span className="font-medium">{template.suggestedTarget}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Suggested Reward:</span>
                    <p className="text-amber-700 font-medium">{template.suggestedReward}</p>
                  </div>
                  <Button 
                    onClick={() => onSelectTemplate(template)}
                    className="w-full bg-amber-700 hover:bg-amber-800"
                    size="sm"
                  >
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ChallengeTemplates;
