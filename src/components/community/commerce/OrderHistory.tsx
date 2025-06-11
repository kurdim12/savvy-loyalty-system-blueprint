
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Coffee, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const OrderHistory = () => {
  const { user } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['order-history', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('transaction_type', 'earn')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderType = (notes: string) => {
    if (notes?.toLowerCase().includes('order:')) return 'order';
    if (notes?.toLowerCase().includes('bonus')) return 'bonus';
    if (notes?.toLowerCase().includes('challenge')) return 'challenge';
    return 'other';
  };

  const getOrderIcon = (type: string) => {
    switch (type) {
      case 'order': return <Coffee className="h-4 w-4" />;
      case 'bonus': return <Star className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getOrderColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-[#8B4513] text-white';
      case 'bonus': return 'bg-yellow-500 text-white';
      case 'challenge': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Coffee className="h-8 w-8 mx-auto mb-2 animate-pulse text-[#8B4513]" />
          <p className="text-muted-foreground">Loading order history...</p>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Coffee className="h-12 w-12 mx-auto mb-4 opacity-30 text-[#8B4513]" />
          <p className="text-lg font-medium mb-2">Sign in to view orders</p>
          <p className="text-sm text-gray-500">Your order history will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#8B4513]">
          <Clock className="h-5 w-5" />
          Order History
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Coffee className="h-12 w-12 mx-auto mb-4 opacity-30 text-[#8B4513]" />
            <p className="text-lg font-medium mb-2">No orders yet</p>
            <p className="text-sm text-gray-500">Your order history will appear here</p>
          </div>
        ) : (
          orders.map((order) => {
            const orderType = getOrderType(order.notes || '');
            return (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getOrderColor(orderType)}`}>
                    {getOrderIcon(orderType)}
                  </div>
                  <div>
                    <p className="font-medium">
                      {order.notes?.startsWith('Order:') 
                        ? order.notes.replace('Order:', '').trim()
                        : order.notes || 'Transaction'
                      }
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge className="bg-green-500 text-white">
                    +{order.points} points
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
