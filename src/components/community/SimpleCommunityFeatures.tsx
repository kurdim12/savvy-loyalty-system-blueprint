import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Star, Coffee, Award } from 'lucide-react';

interface SimpleCommunityFeaturesProps {
  currentUser?: {
    id: string;
    name: string;
    skills?: string[];
    interests?: string[];
  };
}

export const SimpleCommunityFeatures: React.FC<SimpleCommunityFeaturesProps> = ({ currentUser }) => {
  const features = [
    {
      title: "Community Chat",
      description: "Connect with other coffee lovers",
      icon: <MessageSquare className="h-6 w-6" />,
      action: "Join Chat"
    },
    {
      title: "Coffee Reviews",
      description: "Share your coffee experiences",
      icon: <Star className="h-6 w-6" />,
      action: "Write Review"
    },
    {
      title: "Daily Challenges",
      description: "Complete daily coffee challenges",
      icon: <Award className="h-6 w-6" />,
      action: "View Challenges"
    },
    {
      title: "Coffee Groups",
      description: "Join interest-based groups",
      icon: <Users className="h-6 w-6" />,
      action: "Browse Groups"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Community Features</h2>
        <p className="text-gray-600">Connect with fellow coffee enthusiasts</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                  {feature.icon}
                </div>
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <Button variant="outline" className="w-full">
                {feature.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {currentUser && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-amber-900">Welcome, {currentUser.name}!</h3>
                <p className="text-amber-700 text-sm">Ready to explore the community?</p>
              </div>
              <Coffee className="h-8 w-8 text-amber-600" />
            </div>
            {currentUser.interests && currentUser.interests.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-amber-700 mb-2">Your interests:</p>
                <div className="flex flex-wrap gap-2">
                  {currentUser.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="bg-amber-200 text-amber-800">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};