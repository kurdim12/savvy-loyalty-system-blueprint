
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { incrementPoints, decrementPoints } from '@/integrations/supabase/functions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

interface ManagePointsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  customerName?: string | null;
}

const ManagePointsDialog = ({
  open,
  onOpenChange,
  userId,
  customerName,
}: ManagePointsDialogProps) => {
  const [points, setPoints] = useState<number>(0);
  const [transactionType, setTransactionType] = useState<Database['public']['Enums']['transaction_type']>('earn');
  const [notes, setNotes] = useState<string>('');
  const queryClient = useQueryClient();

  const handlePointsChange = (value: string) => {
    const numValue = parseInt(value);
    setPoints(isNaN(numValue) ? 0 : Math.max(1, numValue));
  };

  const resetForm = () => {
    setPoints(0);
    setTransactionType('earn');
    setNotes('');
  };

  const createTransaction = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      
      // Use correct typing for the transaction data
      const transactionData = {
        user_id: userId,
        transaction_type: transactionType,
        points: points,
        notes: notes || `${transactionType === 'earn' ? 'Added' : 'Deducted'} points manually by admin`,
      } as unknown as Database['public']['Tables']['transactions']['Insert'];
      
      // Step 1: Create the transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select();
      
      if (transactionError) throw transactionError;
      
      // Step 2: Update the user's point balance
      let updateResult;
      if (transactionType === 'earn') {
        updateResult = await incrementPoints(userId, points);
      } else {
        updateResult = await decrementPoints(userId, points);
      }
      
      if (updateResult.error) throw updateResult.error;
      
      return transaction;
    },
    onSuccess: () => {
      toast.success(`Successfully ${transactionType === 'earn' ? 'added' : 'deducted'} ${points} points ${transactionType === 'earn' ? 'to' : 'from'} ${customerName || 'user'}`);
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'customerTransactions', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'transactions'] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`Failed to update points: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (points <= 0) {
      toast.error('Points must be a positive number');
      return;
    }
    createTransaction.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Points</DialogTitle>
          <DialogDescription>
            {customerName ? `Adjust points for ${customerName}` : 'Adjust points for user'}
          </DialogDescription>
        </DialogHeader>

        {userId ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="transaction-type">Transaction Type</Label>
              <RadioGroup
                id="transaction-type"
                className="flex space-x-4 pt-2"
                value={transactionType}
                onValueChange={(value) => setTransactionType(value as 'earn' | 'redeem')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="earn" id="earn" />
                  <Label htmlFor="earn" className="font-normal cursor-pointer">Add Points</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="redeem" id="redeem" />
                  <Label htmlFor="redeem" className="font-normal cursor-pointer">Deduct Points</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                min="1"
                value={points}
                onChange={(e) => handlePointsChange(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Reason for adjustment..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-amber-700 hover:bg-amber-800"
                disabled={createTransaction.isPending || points <= 0}
              >
                {createTransaction.isPending ? 'Processing...' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            Please select a customer before managing points.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ManagePointsDialog;
