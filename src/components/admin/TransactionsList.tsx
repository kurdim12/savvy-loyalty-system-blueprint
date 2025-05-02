import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Transaction {
  id: string;
  user_id: string;
  transaction_type: 'earn' | 'redeem';
  points: number;
  created_at: string;
  notes?: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const TransactionsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['admin', 'transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as Transaction[];
    }
  });

  const filteredTransactions = transactions?.filter(transaction => {
    const searchLower = searchQuery.toLowerCase();
    return (
      transaction.profiles?.first_name?.toLowerCase().includes(searchLower) ||
      transaction.profiles?.last_name?.toLowerCase().includes(searchLower) ||
      transaction.profiles?.email?.toLowerCase().includes(searchLower) ||
      `${transaction.profiles?.first_name} ${transaction.profiles?.last_name}`.toLowerCase().includes(searchLower) ||
      (transaction.notes && transaction.notes.toLowerCase().includes(searchLower)) ||
      transaction.transaction_type.includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>
          Recent transactions across the loyalty program.
        </CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
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
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">Loading transactions...</TableCell>
                </TableRow>
              ) : filteredTransactions?.length ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.created_at)}</TableCell>
                    <TableCell>
                      {transaction.profiles?.first_name} {transaction.profiles?.last_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.transaction_type === 'earn' ? 'outline' : 'default'} className="capitalize">
                        {transaction.transaction_type}
                      </Badge>
                    </TableCell>
                    <TableCell className={`font-medium ${transaction.transaction_type === 'earn' ? 'text-green-600' : 'text-amber-700'}`}>
                      {transaction.transaction_type === 'earn' ? '+' : '-'}{transaction.points}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{transaction.notes || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No transactions found. {searchQuery && 'Try a different search term.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
