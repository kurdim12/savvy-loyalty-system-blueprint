
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Coffee, Star, Plus, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export const ProductCatalog = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drinks')
        .select('*')
        .eq('active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price || 0,
        quantity: 1,
        category: product.category || 'drink'
      }];
    });
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared!');
  };

  const processOrder = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');
      if (cart.length === 0) throw new Error('Cart is empty');

      const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const totalPoints = cart.reduce((sum, item) => {
        const product = products.find(p => p.id === item.id);
        return sum + ((product?.points_earned || 0) * item.quantity);
      }, 0);

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          points: totalPoints,
          transaction_type: 'earn',
          notes: `Order: ${cart.map(item => `${item.quantity}x ${item.name}`).join(', ')}`
        });

      if (transactionError) throw transactionError;

      return { totalAmount, totalPoints };
    },
    onSuccess: ({ totalAmount, totalPoints }) => {
      toast.success(`Order placed! Earned ${totalPoints} points!`);
      setCart([]);
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to process order');
    }
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Search and Cart Summary */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-[#8B4513]" />
          <Badge className="bg-[#8B4513] text-white">
            {cartItemCount} items
          </Badge>
          <span className="font-bold text-[#8B4513]">
            ${cartTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <Coffee className="h-8 w-8 mx-auto mb-2 animate-pulse text-[#8B4513]" />
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Coffee className="h-12 w-12 mx-auto mb-4 opacity-30 text-[#8B4513]" />
            <p className="text-lg font-medium mb-2">No products found</p>
            <p className="text-sm text-gray-500">Try a different search term</p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const cartItem = cart.find(item => item.id === product.id);
            return (
              <Card key={product.id} className="border-[#8B4513]/20 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-[#8B4513]">{product.name}</CardTitle>
                      {product.category && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {product.category}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#8B4513]">
                        ${(product.price || 0).toFixed(2)}
                      </p>
                      {product.points_earned && (
                        <div className="flex items-center text-sm text-yellow-600">
                          <Star className="h-3 w-3 mr-1" />
                          +{product.points_earned} pts
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    {cartItem ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCart(product.id)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-medium w-8 text-center">{cartItem.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addToCart(product)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => addToCart(product)}
                        className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
                        disabled={!user}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Cart and Checkout */}
      {cart.length > 0 && (
        <Card className="border-[#8B4513]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#8B4513]">
              <ShoppingCart className="h-5 w-5" />
              Your Order
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.quantity}x ${item.price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 h-6 p-1"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-lg font-bold">Total: ${cartTotal.toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  Earn {cart.reduce((sum, item) => {
                    const product = products.find(p => p.id === item.id);
                    return sum + ((product?.points_earned || 0) * item.quantity);
                  }, 0)} points
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button
                  onClick={() => processOrder.mutate()}
                  disabled={processOrder.isPending || !user}
                  className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
                >
                  {processOrder.isPending ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </div>
            
            {!user && (
              <p className="text-center text-sm text-gray-500">
                Please sign in to place an order
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
