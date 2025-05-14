import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Progress } from '@/components/ui/progress';
import { Search, Eye, CreditCard, Award, Phone, Mail, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import RankChanger from './RankChanger';

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  current_points: number;
  membership_tier: Database['public']['Enums']['membership_tier'];
  visits: number;
  created_at: string;
  phone?: string;
  birthday?: string;
}

interface CustomersListProps {
  onManagePoints?: (customerId: string, customerName: string) => void;
  onSelectCustomer?: (customerId: string) => void;
  onRankChange?: (customerId: string, newRank: Database['public']['Enums']['membership_tier']) => void;
}

const CustomersList = ({ onManagePoints, onSelectCustomer, onRankChange }: CustomersListProps) => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rankThresholds, setRankThresholds] = useState({
    silver: 200,
    gold: 550
  });

  // Fetch rank thresholds from settings
  const { data: thresholdData } = useQuery({
    queryKey: ['rankThresholds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('setting_value')
        .eq('setting_name', 'rank_thresholds')
        .single();
      
      if (error) {
        // Return defaults if not found or error
        return { silver: 200, gold: 550 };
      }
      
      return data.setting_value as {silver: number, gold: number};
    }
  });

  useEffect(() => {
    if (thresholdData) {
      setRankThresholds(thresholdData);
    }
  }, [thresholdData]);

  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin', 'customers', searchQuery],
    queryFn: async () => {
      const query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer' as Database['public']['Enums']['user_role'])
        .order('created_at', { ascending: false });
      
      // Apply search filter if present
      if (searchQuery) {
        query.or(
          `first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`
        );
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as unknown as Customer[];
    }
  });

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setViewDialogOpen(true);
    
    // If onSelectCustomer is provided, call it with the customer ID
    if (onSelectCustomer) {
      onSelectCustomer(customer.id);
    }
  };

  // Calculate rank progress
  const calculateProgress = (points: number, tier: string) => {
    if (tier === 'bronze') {
      return Math.min((points / rankThresholds.silver) * 100, 100);
    } else if (tier === 'silver') {
      return Math.min(((points - rankThresholds.silver) / (rankThresholds.gold - rankThresholds.silver)) * 100, 100);
    }
    return 100; // Gold tier
  };

  // Calculate points needed for next tier
  const pointsToNextTier = (points: number, tier: string) => {
    if (tier === 'bronze') {
      return Math.max(0, rankThresholds.silver - points);
    } else if (tier === 'silver') {
      return Math.max(0, rankThresholds.gold - points);
    }
    return 0; // Gold tier has no next tier
  };

  // Get next tier name
  const getNextTier = (tier: string) => {
    if (tier === 'bronze') return 'silver';
    if (tier === 'silver') return 'gold';
    return null; // Gold tier has no next tier
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not provided';
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

  const exportCustomers = () => {
    if (!customers || customers.length === 0) {
      toast.error("No customers to export");
      return;
    }
    
    // Create CSV content
    const headers = [
      'ID', 'First Name', 'Last Name', 'Email', 'Phone', 
      'Points', 'Tier', 'Visits', 'Birthday', 'Joined'
    ];
    
    const rows = customers.map(customer => [
      generateCustomerId(customer.id),
      customer.first_name || '',
      customer.last_name || '',
      customer.email,
      customer.phone || '',
      customer.current_points,
      customer.membership_tier,
      customer.visits,
      customer.birthday || '',
      formatDate(customer.created_at)
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
    a.setAttribute('download', `customers-${new Date().toISOString()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success(`${customers.length} customers exported successfully`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Customer Management</CardTitle>
            <CardDescription>
              View and manage customer accounts, profiles, and reward progress.
            </CardDescription>
          </div>
          <Button variant="outline" onClick={exportCustomers}>
            Export Customers
          </Button>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email or phone..."
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
                <TableHead>Progress</TableHead>
                <TableHead>Visits</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">Loading customers...</TableCell>
                </TableRow>
              ) : customers?.length ? (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{generateCustomerId(customer.id)}</TableCell>
                    <TableCell>
                      {customer.first_name || customer.last_name ? 
                        `${customer.first_name || ''} ${customer.last_name || ''}` : 
                        <span className="text-muted-foreground italic">No name</span>
                      }
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      {onRankChange ? (
                        <RankChanger 
                          customerId={customer.id}
                          currentRank={customer.membership_tier}
                          onRankChange={onRankChange}
                        />
                      ) : (
                        <Badge className="capitalize" variant={
                          customer.membership_tier === 'gold' ? 'default' :
                          customer.membership_tier === 'silver' ? 'outline' : 'secondary'
                        }>
                          {customer.membership_tier}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{customer.current_points}</TableCell>
                    <TableCell>
                      <div className="w-24">
                        <Progress 
                          value={calculateProgress(customer.current_points, customer.membership_tier)} 
                          className="h-2" 
                          indicatorClassName={
                            customer.membership_tier === 'bronze' ? 'bg-amber-500' : 
                            customer.membership_tier === 'silver' ? 'bg-gray-500' : 
                            'bg-yellow-500'
                          }
                        />
                      </div>
                    </TableCell>
                    <TableCell>{customer.visits}</TableCell>
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
                          onClick={() => onManagePoints(customer.id, `${customer.first_name || ''} ${customer.last_name || ''}`)}
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
                  {selectedCustomer.first_name || selectedCustomer.last_name ? 
                    `${selectedCustomer.first_name || ''} ${selectedCustomer.last_name || ''}` :
                    <span className="text-muted-foreground italic">No name provided</span>
                  }
                </h3>
                <Badge className="capitalize" variant={
                  selectedCustomer.membership_tier === 'gold' ? 'default' :
                  selectedCustomer.membership_tier === 'silver' ? 'outline' : 'secondary'
                }>
                  {selectedCustomer.membership_tier} Tier
                </Badge>
              </div>
              
              <div className="bg-amber-50 rounded-md p-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-700" />
                  <span className="font-medium">Current Balance</span>
                </div>
                <span className="text-lg font-bold text-amber-800">{selectedCustomer.current_points} points</span>
              </div>
              
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="font-medium">Customer ID:</div>
                  <div>{generateCustomerId(selectedCustomer.id)}</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="font-medium">Email:</div>
                  <div>{selectedCustomer.email}</div>
                </div>
                
                {selectedCustomer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div className="font-medium">Phone:</div>
                    <div>{selectedCustomer.phone}</div>
                  </div>
                )}
                
                {selectedCustomer.birthday && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="font-medium">Birthday:</div>
                    <div>{formatDate(selectedCustomer.birthday)}</div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <div className="font-medium">Total Visits:</div>
                  <div>{selectedCustomer.visits} visits</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="font-medium">Joined:</div>
                  <div>{formatDate(selectedCustomer.created_at)}</div>
                </div>
              </div>
              
              {selectedCustomer.membership_tier !== 'gold' && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span>Progress to {getNextTier(selectedCustomer.membership_tier)}</span>
                    <span>{calculateProgress(selectedCustomer.current_points, selectedCustomer.membership_tier).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={calculateProgress(selectedCustomer.current_points, selectedCustomer.membership_tier)} 
                    className="h-2" 
                    indicatorClassName={selectedCustomer.membership_tier === 'bronze' ? 'bg-amber-500' : 'bg-gray-500'}
                  />
                  <p className="text-xs mt-2 text-amber-700">
                    {pointsToNextTier(selectedCustomer.current_points, selectedCustomer.membership_tier)} more points needed for {getNextTier(selectedCustomer.membership_tier)}
                  </p>
                </div>
              )}
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
                    `${selectedCustomer.first_name || ''} ${selectedCustomer.last_name || ''}`
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
