
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, ShoppingCart, Coffee, Star, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
  isProduct?: boolean;
  productData?: {
    id: string;
    name: string;
    price: number;
    points: number;
  };
}

export const CommerceChat = () => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['commerce-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          body,
          created_at,
          user_id,
          profiles:user_id (
            first_name,
            last_name
          )
        `)
        .is('thread_id', null)
        .order('created_at', { ascending: true })
        .limit(50);
      
      if (error) throw error;
      
      return (data || []).map(msg => ({
        ...msg,
        isProduct: msg.body.startsWith('🛒 PRODUCT:'),
        productData: msg.body.startsWith('🛒 PRODUCT:') ? 
          JSON.parse(msg.body.replace('🛒 PRODUCT:', '')) : null
      })) as ChatMessage[];
    },
    refetchInterval: 5000,
  });

  const { data: products = [] } = useQuery({
    queryKey: ['available-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drinks')
        .select('*')
        .eq('active', true)
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('messages')
        .insert({
          body: messageText,
          user_id: user.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['commerce-messages'] });
    },
    onError: (error: any) => {
      toast.error('Failed to send message. Please try again.');
    }
  });

  const shareProductMutation = useMutation({
    mutationFn: async (product: any) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const productMessage = `🛒 PRODUCT:${JSON.stringify({
        id: product.id,
        name: product.name,
        price: product.price || 0,
        points: product.points_earned || 0
      })}`;
      
      const { error } = await supabase
        .from('messages')
        .insert({
          body: productMessage,
          user_id: user.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Product shared in chat!');
      queryClient.invalidateQueries({ queryKey: ['commerce-messages'] });
    },
    onError: (error: any) => {
      toast.error('Failed to share product.');
    }
  });

  const orderProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      // Create transaction record
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          points: productData.points,
          transaction_type: 'earn',
          notes: `Quick Order: ${productData.name}`
        });

      if (error) throw error;
      return productData;
    },
    onSuccess: (productData) => {
      toast.success(`Ordered ${productData.name}! Earned ${productData.points} points!`);
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error: any) => {
      toast.error('Failed to place order.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    sendMessageMutation.mutate(newMessage.trim());
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDisplayName = (message: ChatMessage) => {
    if (message.user_id === user?.id) return 'You';
    const profile = message.profiles;
    return profile ? `${profile.first_name} ${profile.last_name}`.trim() : 'Anonymous';
  };

  return (
    <div className="space-y-6">
      {/* Quick Product Sharing */}
      <Card className="border-[#8B4513]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#8B4513]">
            <Package className="h-5 w-5" />
            Share Products in Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">${(product.price || 0).toFixed(2)}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => shareProductMutation.mutate(product)}
                  className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
                  disabled={shareProductMutation.isPending}
                >
                  Share
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="h-[500px] flex flex-col border-[#8B4513]/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-[#8B4513]">
            <ShoppingCart className="h-5 w-5" />
            Commerce Chat
            <Badge className="bg-[#8B4513] text-white">
              Products & Orders
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col gap-3 p-4">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {isLoading ? (
              <div className="text-center text-gray-500 py-8">
                Loading commerce chat...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No messages yet. Start chatting about products!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  {message.isProduct && message.productData ? (
                    <div className="max-w-[80%] bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white rounded-lg p-4 shadow-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Coffee className="h-4 w-4" />
                        <span className="text-xs opacity-90">
                          {getDisplayName(message)} shared a product
                        </span>
                      </div>
                      <div className="bg-white/10 rounded p-3">
                        <h4 className="font-bold text-lg">{message.productData.name}</h4>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xl font-bold">${message.productData.price.toFixed(2)}</span>
                          <div className="flex items-center gap-1 text-yellow-300">
                            <Star className="h-3 w-3" />
                            <span className="text-sm">+{message.productData.points} pts</span>
                          </div>
                        </div>
                        {message.user_id !== user?.id && user && (
                          <Button
                            size="sm"
                            onClick={() => orderProductMutation.mutate(message.productData)}
                            className="w-full mt-3 bg-white text-[#8B4513] hover:bg-gray-100"
                            disabled={orderProductMutation.isPending}
                          >
                            {orderProductMutation.isPending ? 'Ordering...' : 'Quick Order'}
                          </Button>
                        )}
                      </div>
                      <div className="text-xs opacity-75 mt-2">
                        {formatTime(message.created_at)}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.user_id === user?.id
                          ? 'bg-[#8B4513] text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="text-xs opacity-75 mb-1">
                        {getDisplayName(message)} • {formatTime(message.created_at)}
                      </div>
                      <div className="text-sm">{message.body}</div>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Chat about products, ask questions..."
              className="flex-1 border-[#8B4513]/20 focus:border-[#8B4513]"
              maxLength={500}
              disabled={!user || sendMessageMutation.isPending}
            />
            <Button
              type="submit"
              disabled={!newMessage.trim() || !user || sendMessageMutation.isPending}
              className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          
          {!user && (
            <div className="text-center text-gray-500 text-sm">
              Please sign in to join the conversation
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
