
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee, Wifi, Menu, Newspaper } from 'lucide-react';

interface PersonalTableSurfaceProps {
  seatId: string;
}

const coffeeOrders = {
  'counter-1': { type: 'Espresso', temperature: 'Hot', strength: 'Strong' },
  'window-table-1': { type: 'Latte', temperature: 'Warm', strength: 'Medium' },
  'center-table-1': { type: 'Cappuccino', temperature: 'Hot', strength: 'Medium' }
};

const dailySpecials = [
  { name: 'Ethiopian Yirgacheffe', price: '$4.50', description: 'Bright and floral' },
  { name: 'Colombian Supremo', price: '$4.20', description: 'Rich and balanced' },
  { name: 'Guatemalan Antigua', price: '$4.80', description: 'Full-bodied with chocolate notes' }
];

export const PersonalTableSurface = ({ seatId }: PersonalTableSurfaceProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const currentOrder = coffeeOrders[seatId as keyof typeof coffeeOrders] || coffeeOrders['counter-1'];

  return (
    <div className="absolute bottom-32 left-6 right-6 z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        
        {/* Coffee Cup */}
        <Card 
          className="bg-white/90 backdrop-blur-sm border-white/50 cursor-pointer transform transition-all duration-200 hover:scale-105"
          onMouseEnter={() => setHoveredItem('coffee')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <CardContent className="p-4 text-center">
            <div className="relative w-16 h-16 mx-auto mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-900 to-amber-700 rounded-full flex items-center justify-center shadow-lg">
                <Coffee className="h-8 w-8 text-white" />
              </div>
              {/* Steam effect */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-6 bg-white/30 rounded-full animate-pulse"
                    style={{
                      animationDelay: `${i * 0.3}s`,
                      transform: `translateX(${(i - 1) * 4}px)`
                    }}
                  />
                ))}
              </div>
            </div>
            <h4 className="font-semibold text-[#8B4513] mb-1">Your Coffee</h4>
            <p className="text-sm text-gray-600">{currentOrder.type}</p>
            <div className="flex justify-center gap-1 mt-2">
              <Badge variant="outline" className="text-xs">{currentOrder.temperature}</Badge>
              <Badge variant="outline" className="text-xs">{currentOrder.strength}</Badge>
            </div>
            {hoveredItem === 'coffee' && (
              <div className="mt-2 text-xs text-amber-700">
                Perfect brewing temperature: 195°F
              </div>
            )}
          </CardContent>
        </Card>

        {/* WiFi Info */}
        <Card 
          className="bg-white/90 backdrop-blur-sm border-white/50 cursor-pointer transform transition-all duration-200 hover:scale-105"
          onMouseEnter={() => setHoveredItem('wifi')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <CardContent className="p-4 text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
              <Wifi className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-[#8B4513] mb-1">Free WiFi</h4>
            <p className="text-sm text-gray-600">CafeConnect</p>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800 text-xs">Connected</Badge>
            </div>
            {hoveredItem === 'wifi' && (
              <div className="mt-2 text-xs text-blue-700">
                Speed: 100 Mbps • 23 users online
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Menu */}
        <Card 
          className="bg-white/90 backdrop-blur-sm border-white/50 cursor-pointer transform transition-all duration-200 hover:scale-105"
          onMouseEnter={() => setHoveredItem('menu')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <CardContent className="p-4 text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-lg">
              <Menu className="h-8 w-8 text-white" />
            </div>
            <h4 className="font-semibold text-[#8B4513] mb-1">Today's Special</h4>
            <p className="text-sm text-gray-600">{dailySpecials[0].name}</p>
            <div className="mt-2">
              <Badge className="bg-amber-100 text-amber-800 text-xs">{dailySpecials[0].price}</Badge>
            </div>
            {hoveredItem === 'menu' && (
              <div className="mt-2 text-xs text-green-700">
                {dailySpecials[0].description}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Table Surface Details - Always visible items */}
      <div className="mt-4 flex justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm">
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Newspaper className="h-3 w-3" />
              <span>Local News Available</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            <div>Power Outlet Available</div>
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            <div>Napkins & Sugar</div>
          </div>
        </div>
      </div>
    </div>
  );
};
