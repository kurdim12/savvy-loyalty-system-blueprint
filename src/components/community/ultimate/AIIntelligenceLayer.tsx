
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, MessageSquare, Lightbulb } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  interests: string[];
  personality: 'introvert' | 'extrovert' | 'ambivert';
  mood: string;
  conversationStyle: 'casual' | 'professional' | 'deep' | 'creative';
}

interface ConversationAnalysis {
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  engagement: number;
  suggestions: string[];
}

interface AIIntelligenceProps {
  currentUser: UserProfile;
  nearbyUsers: UserProfile[];
  currentConversation?: string[];
  onRecommendation: (recommendation: string) => void;
}

export const AIIntelligenceLayer = ({ 
  currentUser, 
  nearbyUsers, 
  currentConversation = [],
  onRecommendation 
}: AIIntelligenceProps) => {
  const [analysis, setAnalysis] = useState<ConversationAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [socialScore, setSocialScore] = useState(85);

  useEffect(() => {
    // Simulate AI analysis of conversation
    if (currentConversation.length > 0) {
      const mockAnalysis: ConversationAnalysis = {
        topics: ['coffee', 'technology', 'travel'],
        sentiment: 'positive',
        engagement: 92,
        suggestions: [
          'Ask about their favorite coffee brewing method',
          'Share your recent travel experience',
          'Discuss the latest tech trends'
        ]
      };
      setAnalysis(mockAnalysis);
    }
  }, [currentConversation]);

  useEffect(() => {
    // Generate smart recommendations based on user compatibility
    const generateRecommendations = () => {
      const compatibleUsers = nearbyUsers.filter(user => {
        const sharedInterests = user.interests.filter(interest => 
          currentUser.interests.includes(interest)
        );
        return sharedInterests.length > 0;
      });

      const newRecommendations = compatibleUsers.map(user => 
        `Connect with ${user.name} - you both love ${user.interests.find(i => currentUser.interests.includes(i))}`
      );

      setRecommendations(newRecommendations);
    };

    generateRecommendations();
  }, [nearbyUsers, currentUser]);

  const getPersonalityInsight = () => {
    switch (currentUser.personality) {
      case 'introvert':
        return 'You prefer meaningful one-on-one conversations';
      case 'extrovert':
        return 'You thrive in group settings and love meeting new people';
      case 'ambivert':
        return 'You adapt well to both quiet and social environments';
      default:
        return 'Your social style is flexible and adaptive';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Social Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{socialScore}%</div>
              <div className="text-sm text-gray-600">Social Compatibility</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{nearbyUsers.length}</div>
              <div className="text-sm text-gray-600">Compatible Nearby</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 mb-2">Personality Insight</h4>
            <p className="text-sm text-gray-600">{getPersonalityInsight()}</p>
          </div>

          {analysis && (
            <div>
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                Conversation Analysis
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Topics: </span>
                  {analysis.topics.map((topic, index) => (
                    <Badge key={index} variant="outline" className="ml-1">
                      {topic}
                    </Badge>
                  ))}
                </div>
                <div>
                  <span className="text-sm font-medium">Engagement: </span>
                  <span className="text-sm text-green-600">{analysis.engagement}%</span>
                </div>
              </div>
            </div>
          )}

          {recommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-1">
                <Lightbulb className="h-4 w-4" />
                Smart Recommendations
              </h4>
              <div className="space-y-2">
                {recommendations.slice(0, 3).map((rec, index) => (
                  <div
                    key={index}
                    className="text-sm p-2 bg-white rounded border-l-4 border-blue-400 cursor-pointer hover:bg-blue-50"
                    onClick={() => onRecommendation(rec)}
                  >
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
