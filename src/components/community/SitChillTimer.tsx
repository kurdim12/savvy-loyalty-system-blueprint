
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Coffee, Timer, Sparkles } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MobileService } from '@/services/mobileService';

interface SitChillTimerProps {
  onPointsEarned?: (points: number) => void;
}

export const SitChillTimer = ({ onPointsEarned }: SitChillTimerProps) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  const earnPointsMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('earn-points', {
        body: { type: 'chill', points: 5 }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      console.log('🎉 Chill reward earned:', data);
      toast.success(`☕ ${data.points_earned} points earned for chilling!`, {
        description: `Total points: ${data.total_points} • Tier: ${data.tier}`,
        duration: 4000,
      });
      
      // Trigger haptic feedback on mobile
      MobileService.vibrate('light');
      
      // Notify parent component
      onPointsEarned?.(data.points_earned);
      
      // Invalidate queries to refresh user data
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['user-points'] });
    },
    onError: (error: any) => {
      console.error('❌ Failed to earn chill points:', error);
      
      if (error.message?.includes('Rate limited')) {
        toast.warning('⏰ Take a break! You can earn chill points again in a minute.');
      } else {
        toast.error('Failed to earn points. Please try again.');
      }
    }
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setProgress(((300 - newTime) / 300) * 100);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Timer completed - award points
      setIsActive(false);
      earnPointsMutation.mutate();
      setTimeLeft(300);
      setProgress(0);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startChilling = () => {
    setIsActive(true);
    toast.info('🪑 You\'re now chilling! Relax and earn points in 5 minutes.');
    MobileService.vibrate('medium');
  };

  const stopChilling = () => {
    setIsActive(false);
    setTimeLeft(300);
    setProgress(0);
    toast.info('😊 Chill session ended early. Start again anytime!');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-[#8B4513]/5 to-[#D2B48C]/10 border-[#8B4513]/20">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Coffee className="h-6 w-6 text-[#8B4513]" />
            <h3 className="text-xl font-bold text-[#8B4513]">Sit & Chill</h3>
            <Sparkles className="h-5 w-5 text-[#D2B48C]" />
          </div>
          
          {!isActive ? (
            <div className="space-y-4">
              <p className="text-[#95A5A6] text-sm">
                Take a 5-minute break and earn <span className="font-bold text-[#8B4513]">5 points</span>!
              </p>
              <Button 
                onClick={startChilling}
                className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
                disabled={earnPointsMutation.isPending}
              >
                <Timer className="h-4 w-4 mr-2" />
                Start Chilling
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-3xl font-bold text-[#8B4513]">
                {formatTime(timeLeft)}
              </div>
              
              <Progress 
                value={progress} 
                className="w-full h-3"
                style={{
                  background: 'linear-gradient(to right, #D2B48C, #8B4513)'
                }}
              />
              
              <p className="text-[#95A5A6] text-sm">
                Chilling in progress... ☕✨
              </p>
              
              <Button 
                onClick={stopChilling}
                variant="outline"
                className="w-full border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513]/10"
              >
                Stop Early
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
