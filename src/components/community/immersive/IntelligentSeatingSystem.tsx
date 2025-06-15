
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Zap, 
  Brain, 
  MapPin, 
  Coffee, 
  Headphones,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Heart
} from 'lucide-react';

interface SeatRecommendation {
  seatId: string;
  score: number;
  reasons: string[];
  socialScore: number;
  ambientScore: number;
  comfortScore: number;
  position: [number, number, number];
  nearbyUsers: string[];
  activityType: 'work' | 'social' | 'relaxation' | 'study';
  noiseLevel: number;
  lightingQuality: number;
}

interface IntelligentSeatingSystemProps {
  userPreferences: {
    socialLevel: number; // 0-100
    noisePreference: number; // 0-100
    activityType: string;
    workStyle: string;
  };
  onSeatRecommendation: (recommendations: SeatRecommendation[]) => void;
  currentOccupancy: any[];
}

export const IntelligentSeatingSystem = ({
  userPreferences,
  onSeatRecommendation,
  currentOccupancy
}: IntelligentSeatingSystemProps) => {
  const [recommendations, setRecommendations] = useState<SeatRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  // Advanced AI Seating Algorithm
  const analyzeOptimalSeating = () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const allSeats = [
        {
          seatId: "window-corner-a1",
          position: [10, 0, -10] as [number, number, number],
          activityType: 'work' as const,
          baseComfort: 85,
          lightingQuality: 95,
          noiseLevel: 25,
          nearbyUsers: ["user-42", "user-87"]
        },
        {
          seatId: "social-hub-b3",
          position: [0, 0, 5] as [number, number, number],
          activityType: 'social' as const,
          baseComfort: 70,
          lightingQuality: 80,
          noiseLevel: 75,
          nearbyUsers: ["user-23", "user-91", "user-15", "user-64"]
        },
        {
          seatId: "quiet-study-c2",
          position: [-8, 0, -12] as [number, number, number],
          activityType: 'study' as const,
          baseComfort: 90,
          lightingQuality: 88,
          noiseLevel: 15,
          nearbyUsers: ["user-156"]
        },
        {
          seatId: "creative-lounge-d1",
          position: [6, 0, 8] as [number, number, number],
          activityType: 'relaxation' as const,
          baseComfort: 95,
          lightingQuality: 75,
          noiseLevel: 45,
          nearbyUsers: ["user-203", "user-78"]
        },
        {
          seatId: "collaboration-zone-e4",
          position: [-5, 0, 2] as [number, number, number],
          activityType: 'work' as const,
          baseComfort: 75,
          lightingQuality: 85,
          noiseLevel: 55,
          nearbyUsers: ["user-99", "user-12", "user-145"]
        },
        {
          seatId: "meditation-nook-f1",
          position: [-12, 0, 6] as [number, number, number],
          activityType: 'relaxation' as const,
          baseComfort: 88,
          lightingQuality: 70,
          noiseLevel: 10,
          nearbyUsers: []
        }
      ];

      const scoredRecommendations = allSeats.map(seat => {
        // AI-powered scoring algorithm
        let totalScore = 0;
        const reasons: string[] = [];

        // Social compatibility score
        const socialOptimal = userPreferences.socialLevel;
        const seatSocialLevel = seat.nearbyUsers.length * 25;
        const socialScore = 100 - Math.abs(socialOptimal - seatSocialLevel);
        totalScore += socialScore * 0.35;

        if (socialScore > 80) {
          reasons.push(`Perfect social energy match (${Math.round(socialScore)}%)`);
        } else if (socialScore > 60) {
          reasons.push(`Good social compatibility`);
        }

        // Noise preference alignment
        const noiseOptimal = userPreferences.noisePreference;
        const noiseScore = 100 - Math.abs(noiseOptimal - seat.noiseLevel);
        totalScore += noiseScore * 0.25;

        if (noiseScore > 85) {
          reasons.push(`Ideal noise level for your focus style`);
        }

        // Activity type matching
        const activityMatch = seat.activityType === userPreferences.activityType ? 100 : 50;
        totalScore += activityMatch * 0.2;

        if (activityMatch === 100) {
          reasons.push(`Perfect for ${userPreferences.activityType} activities`);
        }

        // Comfort and ambiance
        const ambientScore = (seat.lightingQuality + seat.baseComfort) / 2;
        totalScore += ambientScore * 0.2;

        if (ambientScore > 85) {
          reasons.push(`Premium comfort and lighting`);
        }

        // Proximity bonus/penalty based on work style
        if (userPreferences.workStyle === 'collaborative' && seat.nearbyUsers.length > 2) {
          totalScore += 15;
          reasons.push(`Great for collaboration`);
        } else if (userPreferences.workStyle === 'focused' && seat.nearbyUsers.length < 2) {
          totalScore += 15;
          reasons.push(`Optimal for deep focus`);
        }

        return {
          ...seat,
          score: Math.round(totalScore),
          reasons,
          socialScore: Math.round(socialScore),
          ambientScore: Math.round(ambientScore),
          comfortScore: seat.baseComfort
        };
      });

      // Sort by score and take top recommendations
      const topRecommendations = scoredRecommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);

      setRecommendations(topRecommendations);
      onSeatRecommendation(topRecommendations);
      setIsAnalyzing(false);
    }, 2000);
  };

  useEffect(() => {
    analyzeOptimalSeating();
  }, [userPreferences]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-400";
    if (score >= 70) return "text-yellow-400";
    return "text-orange-400";
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'work': return <Coffee className="h-4 w-4" />;
      case 'social': return <MessageSquare className="h-4 w-4" />;
      case 'study': return <BookOpen className="h-4 w-4" />;
      case 'relaxation': return <Heart className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="absolute top-6 right-6 z-30 w-96">
      <Card className="bg-black/30 backdrop-blur-xl border border-cyan-400/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-cyan-400" />
            AI Seating Recommendations
            {isAnalyzing && <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isAnalyzing ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center gap-2 text-cyan-300 mb-4">
                <Brain className="h-6 w-6 animate-pulse" />
                <span>Analyzing optimal seating...</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-cyan-400 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
            </div>
          ) : (
            <>
              {/* User Preferences Summary */}
              <div className="bg-white/5 rounded-lg p-3 mb-4">
                <h4 className="text-white text-sm font-semibold mb-2">Your Preferences</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1 text-gray-300">
                    <Users className="h-3 w-3" />
                    Social: {userPreferences.socialLevel}%
                  </div>
                  <div className="flex items-center gap-1 text-gray-300">
                    <Headphones className="h-3 w-3" />
                    Noise: {userPreferences.noisePreference}%
                  </div>
                  <div className="flex items-center gap-1 text-gray-300">
                    <Zap className="h-3 w-3" />
                    Activity: {userPreferences.activityType}
                  </div>
                  <div className="flex items-center gap-1 text-gray-300">
                    <TrendingUp className="h-3 w-3" />
                    Style: {userPreferences.workStyle}
                  </div>
                </div>
              </div>

              {/* Top Recommendations */}
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div
                    key={rec.seatId}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedSeat === rec.seatId
                        ? 'bg-cyan-500/20 border-cyan-400'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => setSelectedSeat(rec.seatId)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getActivityIcon(rec.activityType)}
                        <span className="text-white font-medium text-sm">
                          Seat {rec.seatId.split('-')[2].toUpperCase()}
                        </span>
                        {index === 0 && (
                          <Badge className="bg-yellow-500/20 text-yellow-300 text-xs">
                            BEST MATCH
                          </Badge>
                        )}
                      </div>
                      <span className={`font-bold ${getScoreColor(rec.score)}`}>
                        {rec.score}%
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-2 text-xs">
                      <div className="text-center">
                        <div className="text-gray-400">Social</div>
                        <div className={getScoreColor(rec.socialScore)}>{rec.socialScore}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400">Ambient</div>
                        <div className={getScoreColor(rec.ambientScore)}>{rec.ambientScore}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400">Comfort</div>
                        <div className={getScoreColor(rec.comfortScore)}>{rec.comfortScore}%</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {rec.reasons.slice(0, 2).map((reason, i) => (
                        <div key={i} className="text-xs text-gray-300 flex items-center gap-1">
                          <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                          {reason}
                        </div>
                      ))}
                    </div>

                    {rec.nearbyUsers.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <div className="text-xs text-gray-400">
                          {rec.nearbyUsers.length} people nearby
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10">
                <Button
                  size="sm"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  onClick={() => selectedSeat && console.log('Reserve seat:', selectedSeat)}
                  disabled={!selectedSeat}
                >
                  Reserve Seat
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={analyzeOptimalSeating}
                >
                  Re-analyze
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
