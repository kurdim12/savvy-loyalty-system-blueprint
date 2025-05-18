import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { 
  MembershipTier, 
  ProfilesRow, 
  castDbResult, 
  castJsonToType,  
  settingNameAsString, 
  userRoleAsString,
  membershipTierAsString,
  isValidData
} from '@/integrations/supabase/typeUtils';
import CustomerTransactionsList from './CustomerTransactionsList';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  MoreHorizontal,
  Search,
  UserPlus,
  CheckCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner';

interface CustomerListProps {
  onManagePoints: (customerId: string, customerName: string) => void;
  onRankChange: (customerId: string, newRank: Database['public']['Enums']['membership_tier']) => void;
}

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  membership_tier: string;
  current_points: number;
}

interface DataTableColumnHeaderProps {
  column: {
    id: string;
    title: string;
    sortable: boolean;
  };
  sortConfig: {
    key: string | null;
    direction: 'asc' | 'desc' | null;
  };
  onSort: (key: string) => void;
}

const DataTableColumnHeader: React.FC<DataTableColumnHeaderProps> = ({
  column,
  sortConfig,
  onSort,
}) => {
  const handleSort = () => {
    if (column.sortable) {
      onSort(column.id);
    }
  };

  const isSorted = sortConfig.key === column.id;
  const sortDirection = isSorted ? sortConfig.direction : null;

  return (
    <TableHead className="cursor-pointer select-none" onClick={handleSort}>
      {column.title}
      {column.sortable && (
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      )}
      {sortDirection === 'asc' && <ArrowUp className="ml-2 h-4 w-4" />}
      {sortDirection === 'desc' && <ArrowDown className="ml-2 h-4 w-4" />}
    </TableHead>
  );
};

const CustomersList = ({ 
  onManagePoints,
  onRankChange
}: CustomerListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<MembershipTier | 'all'>('all');
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: 'asc' | 'desc' | null;
  }>({ key: null, direction: null });

  // Fetch rank threshold settings
  const { data: rankThresholds } = useQuery({
    queryKey: ['admin', 'rankSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('setting_value')
        .eq('setting_name', settingNameAsString('rank_thresholds'))
        .single();
      
      if (error) {
        console.error("Error fetching rank thresholds:", error);
        // Use default thresholds if there's an error
        return { silver: 200, gold: 550 };
      }
      
      if (data && data.setting_value) {
        const value = castJsonToType<any>(data.setting_value);
        return { 
          silver: Number(value.silver || 200), 
          gold: Number(value.gold || 550) 
        };
      }
      
      return { silver: 200, gold: 550 };
    }
  });

  // Fetch customers data
  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['admin', 'customers', searchTerm, sortConfig, selectedTier],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', userRoleAsString('customer'));
      
      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }
      
      if (selectedTier !== 'all') {
        query = query.eq('membership_tier', membershipTierAsString(selectedTier));
      }

      if (sortConfig.key) {
        const ascending = sortConfig.direction === 'asc';
        query = query.order(sortConfig.key, { ascending });
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return castDbResult<ProfilesRow[]>(data || []);
    }
  });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
      key = null;
    }
  
    setSortConfig({ key, direction });
  };

  const handleTierChange = (value: string) => {
    setSelectedTier(value as MembershipTier | 'all');
  };

  const columns = [
    {
      id: 'first_name',
      title: 'First Name',
      sortable: true,
    },
    {
      id: 'last_name',
      title: 'Last Name',
      sortable: true,
    },
    {
      id: 'email',
      title: 'Email',
      sortable: true,
    },
    {
      id: 'current_points',
      title: 'Points',
      sortable: true,
    },
    {
      id: 'membership_tier',
      title: 'Membership Tier',
      sortable: true,
    },
    {
      id: 'actions',
      title: 'Actions',
      sortable: false,
    },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return 'text-stone-500';
      case 'silver':
        return 'text-slate-500';
      case 'gold':
        return 'text-amber-500';
      default:
        return 'text-gray-500';
    }
  };

  if (isLoading) {
    return <p>Loading customers...</p>;
  }

  if (error) {
    return <p>Error loading customers: {error.message}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>
          View a list of all registered customers. You can manage their points
          and membership tiers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedTier} onValueChange={handleTierChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="bronze">Bronze</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              {columns.map((column) => (
                <DataTableColumnHeader
                  key={column.id}
                  column={column}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
              ))}
            </TableHeader>
            <TableBody>
              {customers?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.first_name}</TableCell>
                  <TableCell>{customer.last_name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.current_points}</TableCell>
                  <TableCell>
                    <Badge className={getTierColor(customer.membership_tier)}>
                      {customer.membership_tier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            onManagePoints(customer.id, `${customer.first_name} ${customer.last_name}`)
                          }
                        >
                          Manage Points
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            const newRank = customer.membership_tier === 'bronze'
                              ? 'silver'
                              : customer.membership_tier === 'silver'
                                ? 'gold'
                                : 'bronze';
                            onRankChange(customer.id, newRank);
                          }}
                        >
                          Change Rank
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomersList;
