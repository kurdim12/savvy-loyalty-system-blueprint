
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee, Clock, Star } from 'lucide-react';

export const SitAndChillTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [isActive, setIsActive] = useState(true);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [sessionPhase, setSessionPhase] = useState<'active' | 'complete' | 'starting'>('starting');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setSessionPhase('complete');
            setCompletedSessions(prev => prev + 1);
            setTimeout(() => {
              setSessionPhase('starting');
              return 300; // Reset timer
            }, 3000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  useEffect(() => {
    if (sessionPhase === 'starting') {
      setTimeout(() => {
        setSessionPhase('active');
        setTimeRemaining(300);
      }, 2000);
    }
  }, [sessionPhase]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((300 - timeRemaining) / 300) * 100;

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-amber-800">Sit & Chill</h3>
          </div>
          <Badge className="bg-amber-100 text-amber-800">
            Session {completedSessions + 1}
          </Badge>
        </div>

        {sessionPhase === 'complete' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-lg font-bold text-green-600 mb-2">Session Complete!</h4>
            <p className="text-green-700 text-sm">You've earned your mindful moment</p>
          </div>
        ) : sessionPhase === 'starting' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-500 rounded-full flex items-center justify-center animate-pulse">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-lg font-bold text-amber-600 mb-2">Starting New Session</h4>
            <p className="text-amber-700 text-sm">Take a moment to relax...</p>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            {/* Circular Progress */}
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(245, 158, 11, 0.2)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-amber-700">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>

            {/* Session Info */}
            <div className="flex-1">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-amber-700">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2">
                  <div 
                    className="bg-amber-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Sessions completed: {completedSessions}</span>
                  <span>Time remaining: {formatTime(timeRemaining)}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className="px-3 py-1 bg-amber-500 text-white rounded text-xs hover:bg-amber-600 transition-colors"
                >
                  {isActive ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={() => {
                    setTimeRemaining(300);
                    setSessionPhase('starting');
                  }}
                  className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mindfulness Tips */}
        <div className="mt-4 p-3 bg-amber-100 rounded-lg">
          <p className="text-xs text-amber-700 text-center">
            💡 Take deep breaths, observe your surroundings, and enjoy the present moment
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
