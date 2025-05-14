import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Download, Calendar, Filter, Plus, Coffee, DollarSign, CreditCard 
} from 'lucide-react';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';
import { Tabs as UITabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Import and use the TransactionsList component
import TransactionsList from '@/components/admin/TransactionsList';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface CustomerOption {
  id: string;
  displayName: string;
  email: string;
}

interface DrinkOption {
  name: string;
  points: number;
  category: string;
}

interface TransactionFormData {
  customerId: string;
  drinkId: string | null;
  customPoints: number | null;
  notes: string;
  transactionType: 'earn' | 'redeem' | 'adjustment';
  amount: number | null; // For dollar-based points
}

// Pre-defined options for drinks
const DRINK_OPTIONS: DrinkOption[] = [
  { name: 'White Tradition', points: 4, category: 'white' },
  { name: 'Black Tradition', points: 3, category: 'black' },
  { name: 'Raw Signature', points: 5, category: 'signature' },
  { name: 'Raw Specialty', points: 6, category: 'specialty' }
];

const TransactionsManagement = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [transactionType, setTransactionType] = useState<string>('all');
  const [formData, setFormData] = useState<TransactionFormData>({
    customerId: '',
    drinkId: null,
    customPoints: null,
    notes: '',
    transactionType: 'earn',
    amount: null
  });
  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);
  const [searchingCustomers, setSearchingCustomers] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [pointsMethod, setPointsMethod] = useState<'drink' | 'amount'>('drink');
  
  // Fetch drinks from the database
  const { data: drinksData } = useQuery({
    queryKey: ['drinks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drinks')
        .select('*')
        .eq('active', true);
      
      if (error) {
        console.error('Error fetching drinks:', error);
        throw error;
      }
      
      return data || DRINK_OPTIONS.map(drink => ({
        id: drink.name,
        name: drink.name,
        points_earned: drink.points,
        category: drink.category
      }));
    }
  });
  
  // Fetch customers for the dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      if (customerSearch.length < 2) {
        setCustomerOptions([]);
        return;
      }
      
      setSearchingCustomers(true);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email')
          .or(`first_name.ilike.%${customerSearch}%,last_name.ilike.%${customerSearch}%,email.ilike.%${customerSearch}%`)
          .limit(10);
          
        if (error) throw error;
        
        const options: CustomerOption[] = (data || []).map(customer => ({
          id: customer.id,
          displayName: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'No Name',
          email: customer.email
        }));
        
        setCustomerOptions(options);
      } catch (error) {
        console.error('Error searching customers:', error);
        toast.error('Failed to search customers');
      } finally {
        setSearchingCustomers(false);
      }
    };
    
    const timeoutId = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(timeoutId);
  }, [customerSearch]);
  
  // Create transaction mutation
  const createTransaction = useMutation({
    mutationFn: async (data: TransactionFormData) => {
      try {
        let points = 0;
        let notes = data.notes;
        
        if (pointsMethod === 'drink' && data.drinkId) {
          // Get points from selected drink
          if (drinksData?.length) {
            const selectedDrink = drinksData.find(drink => drink.name === data.drinkId);
            points = selectedDrink?.points_earned || 0;
          } else {
            const selectedDrink = DRINK_OPTIONS.find(drink => drink.name === data.drinkId);
            points = selectedDrink?.points || 0;
          }
          notes = notes || `${data.drinkId} purchase`;
        } else if (pointsMethod === 'amount' && data.amount !== null) {
          // $1 = 1 point
          points = Math.floor(data.amount);
          notes = notes || `$${data.amount} purchase (${points} points)`;
        } else if (data.customPoints !== null) {
          points = data.customPoints;
        } else {
          throw new Error('Either a drink, amount, or custom points must be provided');
        }
        
        // Create a transaction record
        const { error } = await supabase
          .from('transactions')
          .insert({
            user_id: data.customerId,
            points: points,
            transaction_type: data.transactionType,
            notes: notes
          });
        
        if (error) throw error;
        
        return true;
      } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction recorded successfully');
      setShowAddDialog(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Failed to record transaction:', error);
      toast.error('Failed to record transaction');
    }
  });
  
  const resetForm = () => {
    setFormData({
      customerId: '',
      drinkId: null,
      customPoints: null,
      notes: '',
      transactionType: 'earn',
      amount: null
    });
    setCustomerSearch('');
    setCustomerOptions([]);
    setPointsMethod('drink');
  };
  
  const handleExport = () => {
    toast.success('Exporting transactions data');
    
    // Get all transactions
    supabase
      .from('transactions')
      .select(`
        *,
        profiles:user_id(first_name, last_name, email)
      `)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          toast.error('Failed to export data');
          return;
        }
        
        if (!data || data.length === 0) {
          toast.error('No transactions to export');
          return;
        }
        
        // Create CSV content
        const headers = ['ID', 'User', 'Email', 'Points', 'Type', 'Notes', 'Date'];
        const rows = data.map(transaction => [
          transaction.id,
          `${transaction.profiles?.first_name || ''} ${transaction.profiles?.last_name || ''}`,
          transaction.profiles?.email || '',
          transaction.points,
          transaction.transaction_type,
          transaction.notes || '',
          new Date(transaction.created_at).toLocaleString()
        ]);
        
        // Combine headers and rows
        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.join(','))
        ].join('\n');
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `transactions-${new Date().toISOString()}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  };
  
  const handleCreateTransaction = () => {
    // Validate form
    if (!formData.customerId) {
      toast.error('Please select a customer');
      return;
    }
    
    if (pointsMethod === 'drink' && !formData.drinkId) {
      toast.error('Please select a drink');
      return;
    }
    
    if (pointsMethod === 'amount' && (formData.amount === null || formData.amount <= 0)) {
      toast.error('Please enter a valid purchase amount');
      return;
    }
    
    // FIX: This is where the error was. Changed from "custom" to checking if it's a transaction_type adjustment
    if (formData.transactionType === 'adjustment' && (formData.customPoints === null || formData.customPoints === undefined)) {
      toast.error('Please enter custom points');
      return;
    }
    
    createTransaction.mutate(formData);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transactions Management</h1>
            <p className="text-gray-500">View and manage all system transactions</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Manual Transaction
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Refine the transaction list</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user or ID..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="earn">Earned Points</SelectItem>
                  <SelectItem value="redeem">Redeemed Points</SelectItem>
                  <SelectItem value="adjustment">Manual Adjustment</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Date Range: </span>
                <Button variant="outline" size="sm">
                  Select Dates
                </Button>
              </div>
              
              <Button className="flex items-center justify-center gap-2">
                <Filter className="h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <TransactionsList />

        {/* Add Transaction Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
              <DialogDescription>
                Record a new transaction for a customer.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              {/* Customer Selector */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="customer" className="text-right font-medium">
                  Customer
                </label>
                <div className="col-span-3">
                  <div className="flex flex-col gap-2">
                    <Input
                      id="customer-search"
                      placeholder="Search by name or email..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                    />
                    
                    {searchingCustomers && (
                      <p className="text-sm text-muted-foreground">Searching...</p>
                    )}
                    
                    {customerOptions.length > 0 && (
                      <div className="border rounded-md overflow-hidden max-h-32 overflow-y-auto">
                        {customerOptions.map(customer => (
                          <div
                            key={customer.id}
                            className="px-3 py-2 hover:bg-muted cursor-pointer border-b last:border-0"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                customerId: customer.id
                              });
                              setCustomerSearch(`${customer.displayName} (${customer.email})`);
                              setCustomerOptions([]);
                            }}
                          >
                            <div className="font-medium">{customer.displayName}</div>
                            <div className="text-sm text-muted-foreground">{customer.email}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {formData.customerId && customerSearch && customerOptions.length === 0 && !searchingCustomers && (
                      <p className="text-sm text-green-600">Customer selected</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Transaction Type */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="transaction-type" className="text-right font-medium">
                  Transaction Type
                </label>
                <div className="col-span-3">
                  <Select 
                    value={formData.transactionType} 
                    onValueChange={(value: 'earn' | 'redeem' | 'adjustment') => {
                      setFormData({
                        ...formData,
                        transactionType: value
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="earn">Earn Points</SelectItem>
                      <SelectItem value="redeem">Redeem Points</SelectItem>
                      <SelectItem value="adjustment">Manual Adjustment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Points Entry Method Tabs */}
              <div className="grid grid-cols-4 items-start gap-4">
                <label className="text-right font-medium pt-2">
                  Points Method
                </label>
                <div className="col-span-3">
                  <UITabs defaultValue="drink" value={pointsMethod} onValueChange={(v) => setPointsMethod(v as 'drink' | 'amount')}>
                    <TabsList className="grid grid-cols-2 mb-2">
                      <TabsTrigger value="drink" className="flex items-center gap-1">
                        <Coffee className="h-4 w-4" />
                        Drink Based
                      </TabsTrigger>
                      <TabsTrigger value="amount" className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        Amount Based
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="drink" className="mt-0">
                      <Select 
                        value={formData.drinkId || ''} 
                        onValueChange={(value) => {
                          if (value) {
                            // Clear custom points when selecting a drink
                            setFormData({
                              ...formData,
                              drinkId: value,
                              customPoints: null,
                              amount: null
                            });
                          } else {
                            setFormData({
                              ...formData,
                              drinkId: null
                            });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a drink" />
                        </SelectTrigger>
                        <SelectContent>
                          {drinksData ? 
                            drinksData.map(drink => (
                              <SelectItem key={drink.id} value={drink.name}>
                                {drink.name} ({drink.points_earned} pts)
                              </SelectItem>
                            ))
                            :
                            DRINK_OPTIONS.map(drink => (
                              <SelectItem key={drink.name} value={drink.name}>
                                {drink.name} ({drink.points} pts)
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </TabsContent>
                    
                    <TabsContent value="amount" className="mt-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">$</span>
                        <Input
                          type="number"
                          placeholder="Enter purchase amount"
                          value={formData.amount === null ? '' : formData.amount}
                          onChange={(e) => {
                            const value = e.target.value ? parseFloat(e.target.value) : null;
                            setFormData({
                              ...formData,
                              amount: value,
                              drinkId: null, // Clear drink selection when entering amount
                              customPoints: null // Clear custom points
                            });
                          }}
                        />
                        <span className="text-sm text-muted-foreground">(1 point per $)</span>
                      </div>
                    </TabsContent>
                  </UITabs>
                </div>
              </div>
              
              {/* Custom Points (for adjustments) */}
              {formData.transactionType === 'adjustment' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="points" className="text-right font-medium">
                    Custom Points
                  </label>
                  <div className="col-span-3">
                    <Input
                      id="points"
                      type="number"
                      placeholder="Enter points (+/-)"
                      value={formData.customPoints === null ? '' : formData.customPoints}
                      onChange={(e) => {
                        const value = e.target.value ? parseInt(e.target.value) : null;
                        setFormData({
                          ...formData,
                          customPoints: value,
                          drinkId: null, // Clear drink selection
                          amount: null // Clear amount
                        });
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use positive numbers to add points, negative to deduct
                    </p>
                  </div>
                </div>
              )}
              
              {/* Notes */}
              <div className="grid grid-cols-4 items-start gap-4">
                <label htmlFor="notes" className="text-right font-medium pt-2">
                  Notes
                </label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes here..."
                  className="col-span-3"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({
                    ...formData,
                    notes: e.target.value
                  })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateTransaction}
                disabled={
                  !formData.customerId || 
                  (pointsMethod === 'drink' && !formData.drinkId) ||
                  (pointsMethod === 'amount' && (formData.amount === null || formData.amount <= 0)) ||
                  (formData.transactionType === 'adjustment' && formData.customPoints === null)
                }
                className="bg-amber-700 hover:bg-amber-800"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Record Transaction
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default TransactionsManagement;
