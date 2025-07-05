import { useState, useEffect } from 'react';
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
import { Progress } from '@/components/ui/progress';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Search, 
  Eye, 
  CreditCard, 
  Award, 
  Phone, 
  Mail, 
  Calendar, 
  User,
  Download,
  AlertTriangle
} from 'lucide-react';
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
    if (tier === 'bronze') return 'Silver';
    if (tier === 'silver') return 'Gold';
    return null;
  };

  // Get progress label
  const getProgressLabel = (points: number, tier: string) => {
    const nextTier = getNextTier(tier);
    const pointsNeeded = pointsToNextTier(points, tier);
    
    if (!nextTier) return 'Max Tier';
    return `${points} / ${tier === 'bronze' ? rankThresholds.silver : rankThresholds.gold} to ${nextTier}`;
  };

  // Check for data integrity issues
  const hasDataIntegrityIssue = (customer: Customer) => {
    return customer.current_points > 0 && customer.visits === 0;
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
    const shortId = id.replace(/-/g, '').slice(-4).toUpperCase();
    return `RSC-${shortId}`;
  };

  const exportCustomers = () => {
    if (!customers || customers.length === 0) {
      toast.error("No customers to export");
      return;
    }
    
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
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `customers-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success(`${customers.length} customers exported successfully`);
  };

  return (
    <TooltipProvider>
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="border-b bg-gray-50/50 rounded-t-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Customer Management</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                View and manage customer accounts, profiles, and reward progress.
              </CardDescription>
            </div>
            <Button 
              onClick={exportCustomers}
              className="bg-gray-900 hover:bg-gray-800 text-white shadow-sm"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Customers
            </Button>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:border-gray-300 focus:ring-gray-300"
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/30 hover:bg-gray-50/30">
                  <TableHead className="font-semibold text-gray-700 px-6 py-4">Customer ID</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-6 py-4">Name</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-6 py-4">Email</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-6 py-4">Tier</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-6 py-4">Points</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-6 py-4 min-w-[200px]">Progress</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-6 py-4">Visits</TableHead>
                  <TableHead className="font-semibold text-gray-700 px-6 py-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        <span>Loading customers...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : customers?.length ? (
                  customers.map((customer, index) => (
                    <TableRow 
                      key={customer.id} 
                      className={`hover:bg-gray-50/50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/25'
                      }`}
                    >
                      <TableCell className="font-mono text-sm font-medium text-gray-900 px-6 py-4">
                        {generateCustomerId(customer.id)}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {customer.first_name || customer.last_name ? 
                            `${customer.first_name || ''} ${customer.last_name || ''}`.trim() : 
                            <span className="text-gray-400 italic">No name</span>
                          }
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-700">
                        {customer.email}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {onRankChange ? (
                          <RankChanger 
                            customerId={customer.id}
                            currentRank={customer.membership_tier}
                            onRankChange={onRankChange}
                          />
                        ) : (
                          <Badge 
                            variant={
                              customer.membership_tier === 'gold' ? 'default' :
                              customer.membership_tier === 'silver' ? 'secondary' : 'outline'
                            }
                            className={`capitalize font-medium ${
                              customer.membership_tier === 'gold' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                              customer.membership_tier === 'silver' ? 'bg-gray-100 text-gray-800 hover:bg-gray-100' : 
                              'bg-amber-100 text-amber-800 hover:bg-amber-100'
                            }`}
                          >
                            {customer.membership_tier}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 font-semibold text-gray-900">
                        {customer.current_points.toLocaleString()}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>{getProgressLabel(customer.current_points, customer.membership_tier)}</span>
                            <span>{calculateProgress(customer.current_points, customer.membership_tier).toFixed(0)}%</span>
                          </div>
                          <Progress 
                            value={calculateProgress(customer.current_points, customer.membership_tier)} 
                            className="h-2 bg-gray-100" 
                            indicatorClassName={
                              customer.membership_tier === 'bronze' ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 
                              customer.membership_tier === 'silver' ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 
                              'bg-gradient-to-r from-yellow-400 to-yellow-600'
                            }
                          />
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{customer.visits}</span>
                          {hasDataIntegrityIssue(customer) && (
                            <Tooltip>
                              <TooltipTrigger>
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Points earned without visits? Check data integrity.</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleViewCustomer(customer)}
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View customer details</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          {onManagePoints && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => onManagePoints(customer.id, `${customer.first_name || ''} ${customer.last_name || ''}`.trim())}
                                  className="h-8 w-8 p-0 hover:bg-gray-100"
                                >
                                  <CreditCard className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Manage points</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="text-gray-500">
                        <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No customers found</p>
                        <p className="text-sm">
                          {searchQuery ? 'Try adjusting your search terms' : 'Customers will appear here once they sign up'}
                        </p>
                      </div>
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
                      `${selectedCustomer.first_name || ''} ${selectedCustomer.last_name || ''}`.trim() :
                      <span className="text-muted-foreground italic">No name provided</span>
                    }
                  </h3>
                  <Badge 
                    variant={
                      selectedCustomer.membership_tier === 'gold' ? 'default' :
                      selectedCustomer.membership_tier === 'silver' ? 'secondary' : 'outline'
                    }
                    className="capitalize"
                  >
                    {selectedCustomer.membership_tier} Tier
                  </Badge>
                </div>
                
                <div className="bg-amber-50 rounded-md p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-700" />
                    <span className="font-medium">Current Balance</span>
                  </div>
                  <span className="text-lg font-bold text-amber-800">
                    {selectedCustomer.current_points.toLocaleString()} points
                  </span>
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
                    <div className="flex items-center space-x-2">
                      <span>{selectedCustomer.visits} visits</span>
                      {hasDataIntegrityIssue(selectedCustomer) && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
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
                      indicatorClassName={
                        selectedCustomer.membership_tier === 'bronze' ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 
                        'bg-gradient-to-r from-gray-400 to-gray-600'
                      }
                    />
                    <p className="text-xs mt-2 text-amber-700">
                      {pointsToNextTier(selectedCustomer.current_points, selectedCustomer.membership_tier).toLocaleString()} more points needed for {getNextTier(selectedCustomer.membership_tier)}
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
                      `${selectedCustomer.first_name || ''} ${selectedCustomer.last_name || ''}`.trim()
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
    </TooltipProvider>
  );
};

export default CustomersList;