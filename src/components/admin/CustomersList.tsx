import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Search, Eye, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  current_points: number;
  membership_tier: string;
  visits: number;
  created_at: string;
}

interface CustomersListProps {
  onManagePoints?: (customerId: string, customerName: string) => void;
  onSelectCustomer?: (customerId: string) => void;
}

const CustomersList = ({ onManagePoints, onSelectCustomer }: CustomersListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin', 'customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer' as Database['public']['Enums']['user_role'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as unknown as Customer[];
    }
  });

  const filteredCustomers = customers?.filter(customer => {
    const searchLower = searchQuery.toLowerCase();
    return (
      customer.first_name?.toLowerCase().includes(searchLower) ||
      customer.last_name?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(searchLower)
    );
  });

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewDialogOpen(true);
    
    // If onSelectCustomer is provided, call it with the customer ID
    if (onSelectCustomer) {
      onSelectCustomer(customer.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Generate a customer ID in the format RSC-#### based on their database ID
  const generateCustomerId = (id: string) => {
    // Use the last 4 characters of the UUID
    const shortId = id.replace(/-/g, '').slice(-4).toUpperCase();
    return `RSC-${shortId}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Management</CardTitle>
        <CardDescription>
          View and manage customer accounts, profiles, and reward progress.
        </CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Visits</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">Loading customers...</TableCell>
                </TableRow>
              ) : filteredCustomers?.length ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{generateCustomerId(customer.id)}</TableCell>
                    <TableCell>{customer.first_name} {customer.last_name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      <Badge className="capitalize" variant={
                        customer.membership_tier === 'gold' ? 'default' :
                        customer.membership_tier === 'silver' ? 'outline' : 'secondary'
                      }>
                        {customer.membership_tier}
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.current_points}</TableCell>
                    <TableCell>{customer.visits}</TableCell>
                    <TableCell>{formatDate(customer.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewCustomer(customer)}
                        className="mr-1"
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      
                      {onManagePoints && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onManagePoints(customer.id, `${customer.first_name} ${customer.last_name}`)}
                        >
                          <CreditCard className="h-4 w-4 mr-1" /> Points
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No customers found. {searchQuery && 'Try a different search term.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Customer Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected customer.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">
                  {selectedCustomer.first_name} {selectedCustomer.last_name}
                </h3>
                <Badge className="capitalize" variant={
                  selectedCustomer.membership_tier === 'gold' ? 'default' :
                  selectedCustomer.membership_tier === 'silver' ? 'outline' : 'secondary'
                }>
                  {selectedCustomer.membership_tier} Tier
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Customer ID:</div>
                <div>{generateCustomerId(selectedCustomer.id)}</div>
                
                <div className="font-medium">Email:</div>
                <div>{selectedCustomer.email}</div>
                
                <div className="font-medium">Points Balance:</div>
                <div>{selectedCustomer.current_points} points</div>
                
                <div className="font-medium">Total Visits:</div>
                <div>{selectedCustomer.visits} visits</div>
                
                <div className="font-medium">Joined:</div>
                <div>{formatDate(selectedCustomer.created_at)}</div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            {onManagePoints && selectedCustomer && (
              <Button 
                variant="outline"
                onClick={() => {
                  setViewDialogOpen(false);
                  onManagePoints(
                    selectedCustomer.id, 
                    `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
                  );
                }}
                className="mr-auto"
              >
                <CreditCard className="h-4 w-4 mr-2" /> Manage Points
              </Button>
            )}
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CustomersList;
