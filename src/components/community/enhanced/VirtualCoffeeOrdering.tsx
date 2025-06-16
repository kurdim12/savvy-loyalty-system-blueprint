
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee, Plus, Minus, ShoppingCart, Clock, Star } from 'lucide-react';

interface DrinkOption {
  id: string;
  name: string;
  emoji: string;
  mood: string;
  description: string;
  price: number;
  prepTime: number;
}

interface VirtualCoffeeOrderingProps {
  seatId: string;
  onOrderComplete: (order: any) => void;
}

export const VirtualCoffeeOrdering: React.FC<VirtualCoffeeOrderingProps> = ({ 
  seatId, 
  onOrderComplete 
}) => {
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [orderStatus, setOrderStatus] = useState<'ordering' | 'preparing' | 'delivered'>('ordering');
  const [deliveryTime, setDeliveryTime] = useState(0);

  const drinks: DrinkOption[] = [
    {
      id: 'espresso',
      name: 'Artisan Espresso',
      emoji: '☕',
      mood: '⚡',
      description: 'Rich, bold energy boost',
      price: 3.50,
      prepTime: 2
    },
    {
      id: 'latte',
      name: 'Vanilla Cloud Latte',
      emoji: '🥛',
      mood: '😌',
      description: 'Smooth and dreamy',
      price: 5.25,
      prepTime: 4
    },
    {
      id: 'cappuccino',
      name: 'Perfect Cappuccino',
      emoji: '☕',
      mood: '😊',
      description: 'Perfectly balanced harmony',
      price: 4.75,
      prepTime: 3
    },
    {
      id: 'cold-brew',
      name: 'Glacier Cold Brew',
      emoji: '🧊',
      mood: '😎',
      description: 'Cool mountain refreshment',
      price: 4.50,
      prepTime: 1
    },
    {
      id: 'specialty',
      name: 'Cosmic Mocha',
      emoji: '🌟',
      mood: '✨',
      description: 'Out-of-this-world experience',
      price: 6.75,
      prepTime: 5
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
      const totalPrepTime = orderedDrinks.reduce((time, [id, qty]) => {
        const drink = drinks.find(d => d.id === id);
        return time + (drink ? drink.prepTime * qty : 0);
      }, 0);

      setOrderStatus('preparing');
      setDeliveryTime(totalPrepTime);
      
      // Simulate order preparation and delivery
      setTimeout(() => {
        setOrderStatus('delivered');
        onOrderComplete({
          drinks: orderedDrinks.map(([id, qty]) => ({
            ...drinks.find(d => d.id === id),
            quantity: qty
          })),
          seatId,
          deliveredAt: new Date().toISOString()
        });
        
        // Reset after delivery animation
        setTimeout(() => {
          setOrderStatus('ordering');
          setCart({});
        }, 3000);
      }, totalPrepTime * 1000);
    }
  };

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const drink = drinks.find(d => d.id === id);
    return sum + (drink ? drink.price * qty : 0);
  }, 0);

  if (orderStatus === 'preparing') {
    return (
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-4 animate-pulse">☕</div>
          <h3 className="text-lg font-bold text-amber-800 mb-2">Your Order is Being Prepared!</h3>
          <p className="text-amber-600 mb-4">Our virtual barista is crafting your perfect drinks</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-amber-600">
              Estimated delivery: {deliveryTime} minutes
            </span>
          </div>
          <div className="w-full bg-amber-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${100 - (deliveryTime / 10) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (orderStatus === 'delivered') {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-lg font-bold text-green-800 mb-2">Order Delivered!</h3>
          <p className="text-green-600">Your virtual drinks are now at your table. Enjoy!</p>
          <Badge className="bg-green-100 text-green-800 mt-3">
            <Star className="h-3 w-3 mr-1" />
            Mood boost activated!
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-amber-800">
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5" />
            Virtual Café Menu
          </div>
          {totalItems > 0 && (
            <Badge className="bg-amber-600 text-white">
              <ShoppingCart className="h-3 w-3 mr-1" />
              {totalItems}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {drinks.map((drink) => (
            <div key={drink.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{drink.emoji}</span>
                  <span className="font-medium text-amber-800">{drink.name}</span>
                  <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                    {drink.mood}
                  </Badge>
                </div>
                <p className="text-xs text-amber-600">{drink.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-bold text-amber-800">${drink.price}</p>
                  <span className="text-xs text-amber-500">• {drink.prepTime}min</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateCart(drink.id, -1)}
                  disabled={!cart[drink.id]}
                  className="h-8 w-8 p-0 border-amber-300 hover:bg-amber-100"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">
                  {cart[drink.id] || 0}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateCart(drink.id, 1)}
                  className="h-8 w-8 p-0 border-amber-300 hover:bg-amber-100"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {totalItems > 0 && (
          <div className="border-t border-amber-200 pt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="font-medium text-amber-800">Total ({totalItems} items)</span>
              <span className="font-bold text-amber-800 text-lg">${totalPrice.toFixed(2)}</span>
            </div>
            <Button
              onClick={placeOrder}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
            >
              <Coffee className="h-4 w-4 mr-2" />
              Order & Deliver to My Table
            </Button>
          </div>
        )}

        <div className="text-xs text-amber-500 text-center bg-amber-50 p-2 rounded">
          ✨ Virtual drinks enhance your café experience and unlock special features!
        </div>
      </CardContent>
    </Card>
  );
};
