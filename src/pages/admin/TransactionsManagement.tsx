
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
import { Search, Download, Calendar, Filter, Plus, Coffee } from 'lucide-react';
import { toast } from 'sonner';
import { type Profile } from '@/hooks/useDrinks';

// Import and use the TransactionsList component
import TransactionsList from '@/components/admin/TransactionsList';

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
}

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
    notes: ''
  });
  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);
  const [searchingCustomers, setSearchingCustomers] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  
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
        
        if (data.drinkId) {
          // Get points from selected drink
          const selectedDrink = DRINK_OPTIONS.find(drink => drink.name === data.drinkId);
          points = selectedDrink?.points || 0;
          notes = notes || `${data.drinkId} purchase`;
        } else if (data.customPoints !== null) {
          points = data.customPoints;
        } else {
          throw new Error('Either a drink or custom points must be provided');
        }
        
        // Create a transaction record
        const { error } = await supabase
          .from('transactions')
          .insert({
            user_id: data.customerId,
            points: points,
            transaction_type: 'earn',
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
      notes: ''
    });
    setCustomerSearch('');
    setCustomerOptions([]);
  };
  
  const handleExport = () => {
    toast.success('Exporting transactions data');
  };
  
  const handleCreateTransaction = () => {
    // Validate form
    if (!formData.customerId) {
      toast.error('Please select a customer');
      return;
    }
    
    if (!formData.drinkId && (formData.customPoints === null || formData.customPoints === undefined)) {
      toast.error('Please select a drink or enter custom points');
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
                Record a new transaction for a customer. Choose either a drink or enter custom points.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
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
              
              {/* Drink Selector */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="drink" className="text-right font-medium">
                  Drink (Optional)
                </label>
                <div className="col-span-3">
                  <Select 
                    value={formData.drinkId || ''} 
                    onValueChange={(value) => {
                      if (value) {
                        // Clear custom points when selecting a drink
                        setFormData({
                          ...formData,
                          drinkId: value,
                          customPoints: null
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
                      {DRINK_OPTIONS.map(drink => (
                        <SelectItem key={drink.name} value={drink.name}>
                          {drink.name} ({drink.points} pts)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Custom Points */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="points" className="text-right font-medium">
                  Custom Points
                </label>
                <div className="col-span-3">
                  <Input
                    id="points"
                    type="number"
                    placeholder="Enter points"
                    value={formData.customPoints === null ? '' : formData.customPoints}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : null;
                      setFormData({
                        ...formData,
                        customPoints: value,
                        drinkId: value !== null ? null : formData.drinkId // Clear drink selection when entering custom points
                      });
                    }}
                    disabled={formData.drinkId !== null}
                  />
                </div>
              </div>
              
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
                disabled={!formData.customerId || (formData.drinkId === null && formData.customPoints === null)}
                className="bg-amber-700 hover:bg-amber-800"
              >
                <Coffee className="mr-2 h-4 w-4" />
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
