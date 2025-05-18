
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, TransactionInsert, TransactionType } from '@/integrations/supabase/client';
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
  const [points, setPoints] = useState<number>(0);
  const [transactionType, setTransactionType] = useState<TransactionType>('earn');
  const [notes, setNotes] = useState<string>('');
  const [pointsCalculationMethod, setPointsCalculationMethod] = useState<'custom' | 'drink' | 'amount'>('custom');
  const [selectedDrink, setSelectedDrink] = useState<string>('');
  const [amountSpent, setAmountSpent] = useState<number>(0);
  const queryClient = useQueryClient();

  const handlePointsChange = (value: string) => {
    const numValue = parseInt(value);
    setPoints(isNaN(numValue) ? 0 : Math.max(1, numValue));
  };

  const resetForm = () => {
    setPoints(0);
    setTransactionType('earn');
    setNotes('');
    setPointsCalculationMethod('custom');
    setSelectedDrink('');
    setAmountSpent(0);
  };

  const createTransaction = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      
      // Calculate final points based on selected method
      let finalPoints = points;
      if (pointsCalculationMethod === 'drink' && selectedDrink) {
        const selectedCategory = drinkCategories.find(d => d.id === selectedDrink);
        finalPoints = selectedCategory?.points || 0;
      } else if (pointsCalculationMethod === 'amount') {
        // Round down to ensure exact point values
        finalPoints = Math.floor(amountSpent);
      }
      
      // Ensure points are positive integers
      finalPoints = Math.max(1, Math.round(finalPoints));
      
      const transactionData: TransactionInsert = {
        user_id: userId,
        transaction_type: transactionType,
        points: finalPoints,
        notes: notes || `${transactionType === 'earn' ? 'Added' : 'Deducted'} ${finalPoints} points manually by admin`,
      };
      
      // Create the transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert(transactionData);
      
      if (transactionError) throw transactionError;
      
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
      toast({
        title: "Error",
        description: `Failed to update points: ${error.message}`,
        variant: "destructive"
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate points based on selected method
    if (pointsCalculationMethod === 'custom' && points <= 0) {
      toast({
        title: "Validation Error",
        description: 'Points must be a positive number',
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
    
    if (pointsCalculationMethod === 'amount' && amountSpent <= 0) {
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
                onValueChange={(value) => setTransactionType(value as TransactionType)}
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
                  min="0"
                  step="0.01"
                  value={amountSpent}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setAmountSpent(isNaN(value) ? 0 : value);
                    setPoints(Math.floor(isNaN(value) ? 0 : value));
                  }}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This will award {Math.floor(amountSpent)} points ($1 = 1 point)
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
