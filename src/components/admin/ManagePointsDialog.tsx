
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

interface ManagePointsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  customerName?: string | null;
}

interface DrinkCategory {
  id: string;
  name: string;
  points: number;
}

// Drink categories with their respective point values
const drinkCategories: DrinkCategory[] = [
  { id: 'white-tradition', name: 'White Tradition', points: 4 },
  { id: 'black-tradition', name: 'Black Tradition', points: 3 },
  { id: 'raw-signature', name: 'Raw Signature', points: 5 },
  { id: 'raw-specialty', name: 'Raw Specialty', points: 6 }
];

const ManagePointsDialog = ({
  open,
  onOpenChange,
  userId,
  customerName,
}: ManagePointsDialogProps) => {
  const [points, setPoints] = useState<number>(1);
  const [transactionType, setTransactionType] = useState<Database['public']['Enums']['transaction_type']>('earn');
  const [notes, setNotes] = useState<string>('');
  const [pointsCalculationMethod, setPointsCalculationMethod] = useState<'custom' | 'drink' | 'amount'>('custom');
  const [selectedDrink, setSelectedDrink] = useState<string>('');
  const [amountSpent, setAmountSpent] = useState<number>(1);
  const queryClient = useQueryClient();

  const handlePointsChange = (value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1) {
      setPoints(1);
    } else {
      setPoints(numValue);
    }
  };

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0.01) {
      setAmountSpent(0.01);
      setPoints(1);
    } else {
      setAmountSpent(numValue);
      setPoints(Math.round(numValue));
    }
  };

  const resetForm = () => {
    setPoints(1);
    setTransactionType('earn');
    setNotes('');
    setPointsCalculationMethod('custom');
    setSelectedDrink('');
    setAmountSpent(1);
  };

  const createTransaction = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      // Calculate final points based on selected method
      let finalPoints = points;
      if (pointsCalculationMethod === 'drink' && selectedDrink) {
        const selectedCategory = drinkCategories.find(d => d.id === selectedDrink);
        finalPoints = selectedCategory?.points || points;
      } else if (pointsCalculationMethod === 'amount') {
        finalPoints = Math.round(amountSpent);
      }
      
      // Ensure points are positive
      if (finalPoints < 1) {
        throw new Error('Points must be at least 1');
      }
      
      console.log('Creating transaction:', {
        user_id: userId,
        transaction_type: transactionType,
        points: finalPoints,
        notes: notes || `${transactionType === 'earn' ? 'Added' : 'Deducted'} ${finalPoints} points manually by admin`
      });
      
      // Create the transaction record with exact points value
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          transaction_type: transactionType,
          points: finalPoints,
          notes: notes || `${transactionType === 'earn' ? 'Added' : 'Deducted'} ${finalPoints} points manually by admin`,
        });
      
      if (transactionError) {
        console.error('Transaction error:', transactionError);
        throw transactionError;
      }
      
      return { points: finalPoints };
    },
    onSuccess: (result) => {
      const pointsAdjusted = result?.points || points;
      toast({
        title: "Success",
        description: `Successfully ${transactionType === 'earn' ? 'added' : 'deducted'} ${pointsAdjusted} points ${transactionType === 'earn' ? 'to' : 'from'} ${customerName || 'user'}`
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'customerTransactions', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'transactions'] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: any) => {
      console.error('Points management error:', error);
      toast({
        title: "Error",
        description: `Failed to update points: ${error.message}`,
        variant: "destructive"
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pointsCalculationMethod === 'custom' && points < 1) {
      toast({
        title: "Validation Error",
        description: 'Points must be at least 1',
        variant: "destructive"
      });
      return;
    }
    
    if (pointsCalculationMethod === 'drink' && !selectedDrink) {
      toast({
        title: "Validation Error",
        description: 'Please select a drink',
        variant: "destructive"
      });
      return;
    }
    
    if (pointsCalculationMethod === 'amount' && amountSpent < 0.01) {
      toast({
        title: "Validation Error",
        description: 'Amount spent must be greater than 0',
        variant: "destructive"
      });
      return;
    }
    
    createTransaction.mutate();
  };

  // Update points when drink is selected
  const handleDrinkChange = (value: string) => {
    setSelectedDrink(value);
    if (value) {
      const drink = drinkCategories.find(d => d.id === value);
      if (drink) {
        setPoints(drink.points);
      }
    }
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

            {transactionType === 'earn' && (
              <div className="space-y-2">
                <Label htmlFor="points-method">Points Calculation Method</Label>
                <Select 
                  value={pointsCalculationMethod} 
                  onValueChange={(value) => setPointsCalculationMethod(value as 'custom' | 'drink' | 'amount')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select points calculation method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Points</SelectItem>
                    <SelectItem value="drink">Points by Drink</SelectItem>
                    <SelectItem value="amount">Points by Amount ($1 = 1pt)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {transactionType === 'earn' && pointsCalculationMethod === 'drink' && (
              <div className="space-y-2">
                <Label htmlFor="drink">Drink Selection</Label>
                <Select value={selectedDrink} onValueChange={handleDrinkChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a drink" />
                  </SelectTrigger>
                  <SelectContent>
                    {drinkCategories.map(drink => (
                      <SelectItem key={drink.id} value={drink.id}>
                        {drink.name} ({drink.points} points)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {transactionType === 'earn' && pointsCalculationMethod === 'amount' && (
              <div className="space-y-2">
                <Label htmlFor="amount-spent">Amount Spent ($)</Label>
                <Input
                  id="amount-spent"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amountSpent}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This will award {Math.round(amountSpent)} points ($1 = 1 point)
                </p>
              </div>
            )}

            {(transactionType === 'redeem' || pointsCalculationMethod === 'custom') && (
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
                <p className="text-xs text-muted-foreground">
                  Minimum: 1 point
                </p>
              </div>
            )}

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
                disabled={createTransaction.isPending || points < 1}
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
