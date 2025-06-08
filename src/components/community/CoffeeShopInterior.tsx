
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coffee, Users, MapPin } from 'lucide-react';

interface CoffeeShopInteriorProps {
  onSeatSelect: (seatId: string) => void;
  onBack: () => void;
}

export const CoffeeShopInterior = ({ onSeatSelect }: CoffeeShopInteriorProps) => {
  const availableSeats = [
    { id: 'seat-1', name: 'Window Seat', occupied: false, view: 'Street view' },
    { id: 'seat-2', name: 'Corner Table', occupied: true, view: 'Garden view' },
    { id: 'seat-3', name: 'Counter Stool', occupied: false, view: 'Barista view' },
    { id: 'seat-4', name: 'Lounge Chair', occupied: false, view: 'Fireplace view' }
  ];

  return (
    <div className="relative w-full h-full">
      {/* First-Person Interior View */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(139, 69, 19, 0.1), rgba(210, 180, 140, 0.1)), url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><linearGradient id="floor" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23D2B48C"/><stop offset="100%" style="stop-color:%23DEB887"/></linearGradient><linearGradient id="wall" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23F5DEB3"/><stop offset="100%" style="stop-color:%23DDBF94"/></linearGradient></defs><rect fill="url(%23floor)" width="1200" height="400"/><rect fill="url(%23wall)" width="1200" height="200" y="0"/><rect fill="%238B4513" x="100" y="150" width="200" height="100" rx="10"/><rect fill="%236B3410" x="400" y="180" width="150" height="80" rx="8"/><circle fill="%23654321" cx="800" cy="200" r="40"/><rect fill="%23F5DEB3" x="900" y="160" width="180" height="120" rx="15"/></svg>')`
        }}
      />

      {/* Ambient Lighting Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#8B4513]/10" />

      {/* Steam Effects */}
      <div className="absolute top-20 left-32">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-1 h-8 bg-white/20 rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.3}s`,
              transform: `translateX(${i * 10}px) translateY(${Math.sin(i) * 10}px)`
            }}
          />
        ))}
      </div>

      {/* Interactive Seats */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-6 max-w-2xl">
          {availableSeats.map((seat) => (
            <div
              key={seat.id}
              className={`p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                seat.occupied
                  ? 'bg-[#95A5A6]/20 border-[#95A5A6]/40 opacity-60 cursor-not-allowed'
                  : 'bg-white/90 border-[#8B4513]/30 hover:border-[#8B4513] hover:shadow-lg hover:scale-105'
              }`}
              onClick={() => !seat.occupied && onSeatSelect(seat.id)}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#8B4513] to-[#D2B48C] rounded-full flex items-center justify-center">
                  {seat.occupied ? (
                    <Users className="h-8 w-8 text-white" />
                  ) : (
                    <Coffee className="h-8 w-8 text-white" />
                  )}
                </div>
                
                <h3 className="font-bold text-[#8B4513] mb-2">{seat.name}</h3>
                
                <div className="flex items-center justify-center gap-1 text-sm text-[#95A5A6] mb-3">
                  <MapPin className="h-3 w-3" />
                  <span>{seat.view}</span>
                </div>
                
                <Badge 
                  className={
                    seat.occupied 
                      ? "bg-[#95A5A6] text-white"
                      : "bg-green-500 text-white"
                  }
                >
                  {seat.occupied ? 'Occupied' : 'Available'}
                </Badge>
                
                {!seat.occupied && (
                  <div className="mt-3">
                    <Button
                      size="sm"
                      className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white"
                    >
                      Sit Here
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Atmospheric Details */}
      <div className="absolute bottom-4 right-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center">
          <Coffee className="h-6 w-6 mx-auto text-[#8B4513] mb-1" />
          <div className="text-xs text-[#95A5A6]">Raw Smith Interior</div>
          <div className="text-sm font-medium text-[#8B4513]">Choose Your Spot</div>
        </div>
      </div>
    </div>
  );
};
