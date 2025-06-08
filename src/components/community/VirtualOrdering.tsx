
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee, Plus, Minus, ShoppingCart } from 'lucide-react';

interface DrinkOption {
  id: string;
  name: string;
  emoji: string;
  mood: string;
  description: string;
  price: number;
}

interface VirtualOrderingProps {
  onMoodChange: (mood: string) => void;
}

export const VirtualOrdering = ({ onMoodChange }: VirtualOrderingProps) => {
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [orderPlaced, setOrderPlaced] = useState(false);

  const drinks: DrinkOption[] = [
    {
      id: 'espresso',
      name: 'Espresso Shot',
      emoji: '☕',
      mood: '⚡',
      description: 'Pure energy boost',
      price: 3
    },
    {
      id: 'latte',
      name: 'Vanilla Latte',
      emoji: '🥛',
      mood: '😌',
      description: 'Smooth and comforting',
      price: 5
    },
    {
      id: 'cappuccino',
      name: 'Cappuccino',
      emoji: '☕',
      mood: '😊',
      description: 'Perfectly balanced',
      price: 4
    },
    {
      id: 'cold-brew',
      name: 'Cold Brew',
      emoji: '🧊',
      mood: '😎',
      description: 'Cool and refreshing',
      price: 4
    },
    {
      id: 'tea',
      name: 'Herbal Tea',
      emoji: '🍵',
      mood: '🧘',
      description: 'Zen and peaceful',
      price: 3
    }
  ];

  const updateCart = (drinkId: string, change: number) => {
    setCart(prev => ({
      ...prev,
      [drinkId]: Math.max(0, (prev[drinkId] || 0) + change)
    }));
  };

  const placeOrder = () => {
    const orderedDrinks = Object.entries(cart).filter(([_, qty]) => qty > 0);
    if (orderedDrinks.length > 0) {
      // Apply mood effect from first drink
      const firstDrink = drinks.find(d => d.id === orderedDrinks[0][0]);
      if (firstDrink) {
        onMoodChange(firstDrink.mood);
      }
      setOrderPlaced(true);
      setTimeout(() => {
        setOrderPlaced(false);
        setCart({});
      }, 3000);
    }
  };

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const drink = drinks.find(d => d.id === id);
    return sum + (drink ? drink.price * qty : 0);
  }, 0);

  if (orderPlaced) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-2">☕</div>
          <h3 className="text-lg font-bold text-[#8B4513] mb-2">Order Brewing!</h3>
          <p className="text-gray-600">Your virtual drinks are being prepared...</p>
          <div className="mt-4 animate-pulse">
            <Badge className="bg-green-100 text-green-800">
              Mood boost incoming! 
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-[#8B4513]">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5" />
            Virtual Menu
          </div>
          {totalItems > 0 && (
            <Badge className="bg-[#8B4513] text-white">
              <ShoppingCart className="h-3 w-3 mr-1" />
              {totalItems}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {drinks.map((drink) => (
            <div key={drink.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{drink.emoji}</span>
                  <span className="font-medium text-[#8B4513]">{drink.name}</span>
                  <Badge variant="outline" className="text-xs">
                    Mood: {drink.mood}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">{drink.description}</p>
                <p className="text-sm font-bold text-[#8B4513]">${drink.price}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateCart(drink.id, -1)}
                  disabled={!cart[drink.id]}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm">
                  {cart[drink.id] || 0}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateCart(drink.id, 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {totalItems > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-[#8B4513]">Total</span>
              <span className="font-bold text-[#8B4513]">${totalPrice}</span>
            </div>
            <Button
              onClick={placeOrder}
              className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90"
            >
              <Coffee className="h-4 w-4 mr-2" />
              Brew My Order
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          Virtual drinks affect your avatar's mood and café experience!
        </div>
      </CardContent>
    </Card>
  );
};
