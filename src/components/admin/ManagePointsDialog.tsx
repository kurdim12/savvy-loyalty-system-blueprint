
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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

interface ManagePointsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: string | null;
  customerName: string | null;
}

const ManagePointsDialog = ({
  open,
  onOpenChange,
  customerId,
  customerName,
}: ManagePointsDialogProps) => {
  const [points, setPoints] = useState<number>(0);
  const [transactionType, setTransactionType] = useState<'earn' | 'redeem'>('earn');
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
      if (!customerId) return;
      
      // Step 1: Create the transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: customerId,
          transaction_type: transactionType,
          points: points,
          notes: notes || `${transactionType === 'earn' ? 'Added' : 'Deducted'} points manually by admin`,
        })
        .select();
      
      if (transactionError) throw transactionError;
      
      // Step 2: Update the user's point balance
      // Note: Now using direct queries instead of rpc
      if (transactionType === 'earn') {
        // Equivalent to increment_points function
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            current_points: supabase.rpc('get_user_points', { user_id: customerId }) + points,
            visits: supabase.rpc('get_user_visits', { user_id: customerId }) + 1,
          })
          .eq('id', customerId);
        
        if (profileError) throw profileError;
      } else {
        // Equivalent to decrement_points function
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            current_points: supabase.raw(`GREATEST(0, current_points - ${points})`),
          })
          .eq('id', customerId);
        
        if (profileError) throw profileError;
      }
      
      return transaction;
    },
    onSuccess: () => {
      toast.success(`Successfully ${transactionType === 'earn' ? 'added' : 'deducted'} ${points} points ${transactionType === 'earn' ? 'to' : 'from'} ${customerName}`);
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'customerTransactions', customerId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'transactions'] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
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
            {customerName ? `Adjust points for ${customerName}` : 'Select a customer to adjust points'}
          </DialogDescription>
        </DialogHeader>

        {customerId ? (
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
