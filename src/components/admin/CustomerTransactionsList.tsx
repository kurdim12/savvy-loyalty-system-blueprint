
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
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

interface CustomerTransactionsListProps {
  customerId?: string;
}

// Create a type that matches the database schema
type Transaction = {
  id: string;
  user_id: string;
  transaction_type: Database['public']['Enums']['transaction_type'];
  points: number;
  created_at: string;
  notes?: string;
};

const CustomerTransactionsList = ({ customerId }: CustomerTransactionsListProps) => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['admin', 'customerTransactions', customerId],
    queryFn: async () => {
      if (!customerId) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', customerId as string)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as unknown as Transaction[];
    },
    enabled: !!customerId
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
        <CardTitle>Customer Transactions</CardTitle>
        <CardDescription>
          View transaction history for this customer.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">Loading transactions...</TableCell>
                </TableRow>
              ) : transactions?.length ? (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.created_at)}</TableCell>
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
                  <TableCell colSpan={4} className="text-center py-4">
                    {customerId ? 'No transactions found for this customer.' : 'Select a customer to view their transactions.'}
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

export default CustomerTransactionsList;
