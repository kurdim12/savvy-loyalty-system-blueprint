
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Users, MapPin, Zap, User } from 'lucide-react';

interface User {
  id: string;
  seatId: string;
  name: string;
  mood: string;
  activity: string;
  status: 'chatting' | 'working' | 'available' | 'focused';
  drinkType: 'espresso' | 'latte' | 'cappuccino' | 'americano';
}

interface UltimateSeatingPlanProps {
  onSeatSelect: (seatId: string) => void;
  selectedSeat: string | null;
  hideHeader?: boolean;
  onlineUsers?: User[];
}

export const UltimateSeatingPlan = ({ 
  onSeatSelect, 
  selectedSeat, 
  hideHeader = false,
  onlineUsers = []
}: UltimateSeatingPlanProps) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  // Define seating areas with cleaner layout
  const seatingAreas = [
    {
      id: 'window-side',
      name: 'Window Side',
      seats: ['window-1', 'window-2', 'window-3'],
      position: { x: 20, y: 15 },
      layout: 'horizontal'
    },
    {
      id: 'center-tables',
      name: 'Center Tables',
      seats: ['center-1', 'center-2', 'center-3', 'center-4'],
      position: { x: 35, y: 35 },
      layout: 'grid'
    },
    {
      id: 'cozy-corner',
      name: 'Cozy Corner',
      seats: ['corner-1', 'corner-2'],
      position: { x: 70, y: 20 },
      layout: 'corner'
    },
    {
      id: 'counter-bar',
      name: 'Counter Bar',
      seats: ['bar-1', 'bar-2', 'bar-3'],
      position: { x: 25, y: 70 },
      layout: 'bar'
    }
  ];

  const getUserAtSeat = (seatId: string) => {
    return onlineUsers.find(user => user.seatId === seatId);
  };

  const getSeatColor = (seatId: string) => {
    const user = getUserAtSeat(seatId);
    if (user) {
      switch (user.status) {
        case 'chatting': return 'bg-green-500';
        case 'working': return 'bg-blue-500';
        case 'focused': return 'bg-purple-500';
        default: return 'bg-amber-500';
      }
    }
    return 'bg-stone-300 hover:bg-stone-400';
  };

  const renderSeat = (seatId: string, index: number, layout: string) => {
    const user = getUserAtSeat(seatId);
    const isSelected = selectedSeat === seatId;
    const isHovered = hoveredSeat === seatId;

    let seatStyle = {};
    
    if (layout === 'horizontal') {
      seatStyle = { left: `${index * 25}px`, top: '0px' };
    } else if (layout === 'grid') {
      seatStyle = { 
        left: `${(index % 2) * 40}px`, 
        top: `${Math.floor(index / 2) * 40}px` 
      };
    } else if (layout === 'corner') {
      seatStyle = { 
        left: `${index * 30}px`, 
        top: `${index * 20}px` 
      };
    } else if (layout === 'bar') {
      seatStyle = { left: `${index * 30}px`, top: '0px' };
    }

    return (
      <div
        key={seatId}
        className="absolute cursor-pointer transition-all duration-200"
        style={seatStyle}
        onMouseEnter={() => setHoveredSeat(seatId)}
        onMouseLeave={() => setHoveredSeat(null)}
        onClick={() => onSeatSelect(seatId)}
      >
        <div
          className={`
            w-8 h-8 rounded-full border-2 transition-all duration-200
            ${getSeatColor(seatId)}
            ${isSelected ? 'border-yellow-400 scale-110' : 'border-white'}
            ${isHovered ? 'scale-105 shadow-lg' : ''}
          `}
        >
          {user && (
            <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
        
        {(isHovered || isSelected) && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {user ? (
                <div>
                  <div className="font-medium">{user.name} {user.mood}</div>
                  <div className="text-gray-300">{user.activity}</div>
                </div>
              ) : (
                <div>Seat {seatId.split('-')[1]}</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSeatingArea = (area: typeof seatingAreas[0]) => {
    return (
      <div
        key={area.id}
        className="absolute"
        style={{
          left: `${area.position.x}%`,
          top: `${area.position.y}%`,
          width: area.layout === 'grid' ? '80px' : area.layout === 'horizontal' ? '100px' : '70px',
          height: area.layout === 'grid' ? '80px' : '40px'
        }}
      >
        <div className="relative w-full h-full">
          {area.seats.map((seatId, index) => renderSeat(seatId, index, area.layout))}
        </div>
        
        <div className="absolute -bottom-6 left-0 text-xs text-stone-600 font-medium">
          {area.name}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full h-full bg-gradient-to-br from-amber-50 to-stone-100 border-stone-200">
      {!hideHeader && (
        <div className="p-4 border-b border-stone-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-stone-600" />
              <div>
                <h3 className="font-semibold text-stone-800">Coffee Shop Seating</h3>
                <p className="text-sm text-stone-600">Click any seat to join the conversation</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500 text-white">
                <Users className="h-3 w-3 mr-1" />
                {onlineUsers.length} Online
              </Badge>
            </div>
          </div>
        </div>
      )}
      
      <CardContent className="p-0 relative">
        <div className="relative w-full h-[500px] overflow-hidden">
          {/* Coffee Bar Background */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-amber-900/20 to-transparent" />
          
          {/* Barista Station */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 bg-amber-800 text-white px-4 py-2 rounded-full">
              <Coffee className="h-4 w-4" />
              <span className="text-sm font-medium">Barista Station</span>
            </div>
          </div>
          
          {/* Render all seating areas */}
          {seatingAreas.map(renderSeatingArea)}
          
          {/* Legend */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm">
            <h4 className="text-xs font-semibold text-stone-800 mb-2">Status Legend</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Chatting</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Working</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>Focused</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-stone-300"></div>
                <span>Available</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
