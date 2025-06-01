
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Coffee, Sparkles, Heart, Leaf, Snowflake } from 'lucide-react';

interface ContestTemplate {
  id: string;
  title: string;
  description: string;
  theme: string;
  category: string;
  suggestedPrize: string;
  icon: any;
  duration: string;
  tips: string[];
}

const contestTemplates: ContestTemplate[] = [
  {
    id: 'latte-art',
    title: 'Latte Art Showcase',
    description: 'Show off the beautiful latte art in your cup',
    theme: 'Latte Art',
    category: 'coffee-art',
    suggestedPrize: 'Free latte art workshop',
    icon: Coffee,
    duration: '2 weeks',
    tips: ['Capture the foam pattern clearly', 'Good lighting is key', 'Include the full cup in frame']
  },
  {
    id: 'morning-moment',
    title: 'Perfect Morning Moment',
    description: 'Capture your ideal morning coffee moment',
    theme: 'Morning Coffee',
    category: 'lifestyle',
    suggestedPrize: 'Morning coffee package for a week',
    icon: Sparkles,
    duration: '1 week',
    tips: ['Show the atmosphere', 'Include natural lighting', 'Tell a story with your photo']
  },
  {
    id: 'coffee-setup',
    title: 'Coffee Setup Goals',
    description: 'Show your coffee brewing setup at home or our space',
    theme: 'Coffee Setup',
    category: 'brewing',
    suggestedPrize: 'Premium coffee brewing kit',
    icon: Camera,
    duration: '3 weeks',
    tips: ['Show the full setup', 'Include brewing equipment', 'Demonstrate the process']
  },
  {
    id: 'coffee-love',
    title: 'Coffee Love Story',
    description: 'Share a photo that shows your love for coffee',
    theme: 'Coffee Love',
    category: 'emotional',
    suggestedPrize: 'Coffee lover care package',
    icon: Heart,
    duration: '2 weeks',
    tips: ['Make it personal', 'Show emotion or connection', 'Could include people or just the coffee']
  },
  {
    id: 'sustainable-coffee',
    title: 'Sustainable Coffee',
    description: 'Showcase sustainable coffee practices',
    theme: 'Sustainability',
    category: 'values',
    suggestedPrize: 'Eco-friendly coffee accessories',
    icon: Leaf,
    duration: '1 month',
    tips: ['Highlight eco-friendly practices', 'Show reusable cups', 'Include sustainable elements']
  },
  {
    id: 'seasonal-coffee',
    title: 'Seasonal Coffee Vibes',
    description: 'Capture the essence of the current season with coffee',
    theme: 'Seasonal',
    category: 'seasonal',
    suggestedPrize: 'Seasonal coffee collection',
    icon: Snowflake,
    duration: '3 weeks',
    tips: ['Include seasonal elements', 'Use seasonal colors', 'Show seasonal drinks or atmosphere']
  }
];

interface ContestTemplatesProps {
  onSelectTemplate: (template: ContestTemplate) => void;
}

const ContestTemplates = ({ onSelectTemplate }: ContestTemplatesProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'coffee-art': return 'bg-purple-100 text-purple-800';
      case 'lifestyle': return 'bg-blue-100 text-blue-800';
      case 'brewing': return 'bg-orange-100 text-orange-800';
      case 'emotional': return 'bg-pink-100 text-pink-800';
      case 'values': return 'bg-green-100 text-green-800';
      case 'seasonal': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-amber-900 mb-2">Photo Contest Templates</h3>
        <p className="text-amber-700 text-sm">Select a template to pre-fill contest details. You can customize all values including prizes and duration.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {contestTemplates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-amber-600" />
                    <CardTitle className="text-base">{template.title}</CardTitle>
                  </div>
                  <Badge variant="outline" className={getCategoryColor(template.category)}>
                    {template.category}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Theme:</span>
                    <span className="font-medium text-amber-700">{template.theme}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <Badge variant="outline">{template.duration}</Badge>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Suggested Prize:</span>
                    <p className="text-amber-700 font-medium">{template.suggestedPrize}</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Photo Tips:</span>
                    <ul className="text-xs text-gray-600 mt-1 space-y-1">
                      {template.tips.map((tip, index) => (
                        <li key={index}>• {tip}</li>
                      ))}
                    </ul>
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

export default ContestTemplates;
