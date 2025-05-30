
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
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['admin', 'customerTransactions', customerId],
    queryFn: async () => {
      if (!customerId) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', customerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Transaction[];
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

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Customer Transactions</CardTitle>
          <CardDescription>Error loading transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-600">
            Failed to load transactions. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
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
                <TableHead className="w-[140px]">Date</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead className="w-[80px] text-right">Points</TableHead>
                <TableHead className="min-w-[150px]">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                      <span>Loading transactions...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : transactions?.length ? (
                transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="text-sm">
                      {formatDate(transaction.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={transaction.transaction_type === 'earn' ? 'outline' : 'default'} 
                        className={`capitalize ${
                          transaction.transaction_type === 'earn' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {transaction.transaction_type}
                      </Badge>
                    </TableCell>
                    <TableCell className={`font-medium text-right ${
                      transaction.transaction_type === 'earn' ? 'text-green-600' : 'text-amber-700'
                    }`}>
                      {transaction.transaction_type === 'earn' ? '+' : '-'}{transaction.points}
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="truncate" title={transaction.notes || ''}>
                        {transaction.notes || '-'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
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
