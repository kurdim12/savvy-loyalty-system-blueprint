
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContributeGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalId: string;
  goalName: string;
  userPoints: number;
  onContribute: (points: number) => void;
}

export default function ContributeGoalDialog({
  open,
  onOpenChange,
  goalId,
  goalName,
  userPoints,
  onContribute,
}: ContributeGoalDialogProps) {
  const [points, setPoints] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!points || points <= 0) {
      return;
    }
    
    if (points > userPoints) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      onContribute(points);
      setPoints(0);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contribute to {goalName}</DialogTitle>
          <DialogDescription>
            Contribute your points to help achieve this community goal.
            You currently have {userPoints} points available.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="points" className="text-right">
                Points
              </Label>
              <Input
                id="points"
                type="number"
                min={1}
                max={userPoints}
                value={points || ''}
                onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={isSubmitting || points <= 0 || points > userPoints}
              className="bg-amber-700 hover:bg-amber-800"
            >
              {isSubmitting ? 'Contributing...' : 'Contribute Points'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
