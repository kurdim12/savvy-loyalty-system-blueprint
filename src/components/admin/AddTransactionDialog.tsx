
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
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

const AddTransactionDialog = ({ open, onOpenChange }: AddTransactionDialogProps) => {
  const [customerId, setCustomerId] = useState('');
  const [transactionType, setTransactionType] = useState<Database['public']['Enums']['transaction_type']>('earn');
  const [points, setPoints] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [pointsCalculationMethod, setPointsCalculationMethod] = useState<'drink' | 'amount'>('drink');
  const [amountSpent, setAmountSpent] = useState<number>(1);
  
  const queryClient = useQueryClient();
  
  // Fetch customers for selection
  const { data: customers } = useQuery({
    queryKey: ['admin', 'customersDropdown', customerSearchQuery],
    queryFn: async () => {
      const query = supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('role', 'customer' as Database['public']['Enums']['user_role']);
        
      // Apply search filter if provided
      if (customerSearchQuery) {
        query.or(`first_name.ilike.%${customerSearchQuery}%,last_name.ilike.%${customerSearchQuery}%,email.ilike.%${customerSearchQuery}%`);
      }
      
      // Limit results
      query.limit(20);
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Customer[];
    },
    enabled: open, // Only fetch when dialog is open
  });

  const createTransaction = useMutation({
    mutationFn: async () => {
      if (!customerId) throw new Error('Customer is required');
      
      let finalPoints = 1;
      
      // Calculate points based on selected method
      if (pointsCalculationMethod === 'drink') {
        if (selectedCategory) {
          const category = drinkCategories.find(c => c.id === selectedCategory);
          finalPoints = category ? category.points : points;
        } else {
          finalPoints = points;
        }
      } else {
        // Amount-based: Use exact amount for points (1:1 ratio)
        finalPoints = Math.round(amountSpent);
      }
      
      // Ensure points are positive
      if (finalPoints < 1) {
        throw new Error('Points must be at least 1');
      }
      
      console.log('Creating transaction:', {
        user_id: customerId,
        transaction_type: transactionType,
        points: finalPoints,
        notes: notes || `${transactionType === 'earn' ? 'Earned' : 'Redeemed'} ${finalPoints} points`
      });
      
      // Create the transaction record with exact points value
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: customerId,
          transaction_type: transactionType,
          points: finalPoints,
          notes: notes || `${transactionType === 'earn' ? 'Earned' : 'Redeemed'} ${finalPoints} points`,
        });
      
      if (transactionError) {
        console.error('Transaction error:', transactionError);
        throw transactionError;
      }
      
      return { points: finalPoints };
    },
    onSuccess: (result) => {
      const finalPoints = result?.points || points;
      toast({
        title: "Transaction Created",
        description: `Successfully ${transactionType === 'earn' ? 'added' : 'deducted'} ${finalPoints} points`
      });
      resetForm();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'transactions'] });
    },
    onError: (error: any) => {
      console.error('Transaction creation error:', error);
      toast({
        title: "Error",
        description: `Failed to create transaction: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setCustomerId('');
    setTransactionType('earn');
    setPoints(1);
    setSelectedCategory('');
    setNotes('');
    setCustomerSearchQuery('');
    setPointsCalculationMethod('drink');
    setAmountSpent(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTransaction.mutate();
  };

  // Update points when category is selected
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value) {
      const category = drinkCategories.find(c => c.id === value);
      if (category) {
        setPoints(category.points);
      }
    }
  };

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

  // Get selected customer name
  const selectedCustomer = customers?.find(c => c.id === customerId);
  const customerName = selectedCustomer 
    ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}` 
    : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Record a new transaction for a customer.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <div className="space-y-2">
              <Input
                placeholder="Search customers..."
                value={customerSearchQuery}
                onChange={(e) => setCustomerSearchQuery(e.target.value)}
                className="mb-2"
              />
              <Select 
                value={customerId} 
                onValueChange={setCustomerId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers?.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.first_name} {customer.last_name} ({customer.email})
                    </SelectItem>
                  ))}
                  {customers?.length === 0 && (
                    <SelectItem value="none" disabled>
                      No customers found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
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
                <Label htmlFor="earn" className="font-normal cursor-pointer">Earn Points</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="redeem" id="redeem" />
                <Label htmlFor="redeem" className="font-normal cursor-pointer">Redeem Points</Label>
              </div>
            </RadioGroup>
          </div>
          
          {transactionType === 'earn' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="points-method">Points Calculation Method</Label>
                <Select 
                  value={pointsCalculationMethod} 
                  onValueChange={(value) => setPointsCalculationMethod(value as 'drink' | 'amount')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select points calculation method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drink">Points by Drink</SelectItem>
                    <SelectItem value="amount">Points by Amount ($1 = 1pt)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {pointsCalculationMethod === 'drink' ? (
                <div className="space-y-2">
                  <Label htmlFor="drink-category">Drink Category</Label>
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select drink category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Custom amount</SelectItem>
                      {drinkCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name} ({category.points} points)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
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
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="points">Points</Label>
            <Input
              id="points"
              type="number"
              min="1"
              value={points}
              onChange={(e) => handlePointsChange(e.target.value)}
              required
              disabled={pointsCalculationMethod === 'amount'}
            />
            <p className="text-xs text-muted-foreground">
              Minimum: 1 point
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-amber-700 hover:bg-amber-800"
              disabled={createTransaction.isPending || !customerId || points < 1}
            >
              {createTransaction.isPending ? 'Processing...' : 'Create Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
