
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Coffee, ArrowLeft, RotateCcw } from 'lucide-react';

interface SeatAreaProps {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  occupied: boolean;
  users: number;
  capacity: number;
  type: 'indoor' | 'outdoor';
  onClick: () => void;
}

const SeatArea = ({ id, name, position, occupied, users, capacity, type, onClick }: SeatAreaProps) => {
  return (
    <div
      className="absolute cursor-pointer group transition-all duration-300 hover:scale-110"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translateZ(${position.z}px)`,
      }}
      onClick={onClick}
    >
      {/* Table */}
      <div className="relative">
        <div className={`w-16 h-16 rounded-lg shadow-lg border-2 ${
          type === 'outdoor' 
            ? 'bg-gradient-to-br from-amber-200 to-orange-300 border-amber-400' 
            : 'bg-gradient-to-br from-amber-800 to-orange-900 border-amber-600'
        }`}>
          {/* Table surface */}
          <div className="absolute inset-1 bg-amber-100 rounded opacity-80"></div>
        </div>
        
        {/* Chairs around table */}
        <div className="absolute -top-2 -left-2 w-3 h-3 bg-amber-700 rounded"></div>
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-amber-700 rounded"></div>
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-amber-700 rounded"></div>
        <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-amber-700 rounded"></div>
        
        {/* Occupancy indicator */}
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
          occupied ? 'bg-red-500' : 'bg-green-500'
        } animate-pulse`}></div>
        
        {/* Label */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white bg-black/70 px-2 py-1 rounded whitespace-nowrap">
          {name}
        </div>
        
        {/* User count */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-blue-600 text-white px-1 rounded">
          {users}/{capacity}
        </div>
      </div>
    </div>
  );
};

interface CSS3DCafeSimulationProps {
  onSeatSelect: (seatId: string) => void;
}

const CSS3DCafeSimulation = ({ onSeatSelect }: CSS3DCafeSimulationProps) => {
  const [rotateX, setRotateX] = useState(-20);
  const [rotateY, setRotateY] = useState(0);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const seatAreas = [
    // Indoor cave areas
    {
      id: 'cave-corner-1',
      name: 'Cave Corner',
      position: { x: 120, y: 100, z: 0 },
      occupied: true,
      users: 2,
      capacity: 4,
      type: 'indoor' as const
    },
    {
      id: 'center-table',
      name: 'Center Hub',
      position: { x: 300, y: 180, z: 0 },
      occupied: true,
      users: 3,
      capacity: 4,
      type: 'indoor' as const
    },
    {
      id: 'window-spot',
      name: 'Window Spot',
      position: { x: 120, y: 260, z: 0 },
      occupied: false,
      users: 0,
      capacity: 2,
      type: 'indoor' as const
    },
    {
      id: 'cozy-nook',
      name: 'Cozy Nook',
      position: { x: 480, y: 100, z: 0 },
      occupied: false,
      users: 0,
      capacity: 2,
      type: 'indoor' as const
    },
    
    // Outdoor areas
    {
      id: 'outdoor-table-1',
      name: 'Garden View',
      position: { x: 580, y: 180, z: 0 },
      occupied: true,
      users: 2,
      capacity: 4,
      type: 'outdoor' as const
    },
    {
      id: 'outdoor-table-2',
      name: 'Street Side',
      position: { x: 680, y: 260, z: 0 },
      occupied: false,
      users: 0,
      capacity: 2,
      type: 'outdoor' as const
    }
  ];

  const handleSeatClick = (seatId: string) => {
    setSelectedSeat(seatId);
    onSeatSelect(seatId);
  };

  const resetView = () => {
    setRotateX(-20);
    setRotateY(0);
  };

  const rotateLeft = () => setRotateY(prev => prev - 15);
  const rotateRight = () => setRotateY(prev => prev + 15);
  const tiltUp = () => setRotateX(prev => Math.max(prev - 10, -60));
  const tiltDown = () => setRotateX(prev => Math.min(prev + 10, 10));

  return (
    <div className="w-full h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 overflow-hidden relative">
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-20 space-y-2">
        <Card className="bg-black/80 backdrop-blur-sm border-amber-400/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-amber-200">
              <Coffee className="h-5 w-5" />
              Cave Cafe Layout
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <div className="flex gap-2">
              <Button size="sm" onClick={rotateLeft} className="bg-amber-700 hover:bg-amber-600">
                ←
              </Button>
              <Button size="sm" onClick={rotateRight} className="bg-amber-700 hover:bg-amber-600">
                →
              </Button>
              <Button size="sm" onClick={tiltUp} className="bg-amber-700 hover:bg-amber-600">
                ↑
              </Button>
              <Button size="sm" onClick={tiltDown} className="bg-amber-700 hover:bg-amber-600">
                ↓
              </Button>
              <Button size="sm" onClick={resetView} variant="outline" className="border-amber-400">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-amber-200">
              Use arrows to rotate • Click tables to sit
            </div>
          </CardContent>
        </Card>

        {selectedSeat && (
          <Card className="bg-black/80 backdrop-blur-sm border-amber-400/30">
            <CardContent className="p-3">
              <div className="space-y-2">
                <h3 className="font-semibold text-amber-200">
                  {seatAreas.find(a => a.id === selectedSeat)?.name}
                </h3>
                <div className="flex items-center gap-2 text-amber-200">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">
                    {seatAreas.find(a => a.id === selectedSeat)?.users}/
                    {seatAreas.find(a => a.id === selectedSeat)?.capacity}
                  </span>
                  <Badge className="ml-2 bg-amber-600">
                    {seatAreas.find(a => a.id === selectedSeat)?.type}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Panel */}
      <div className="absolute top-4 right-4 z-20">
        <Card className="bg-black/80 backdrop-blur-sm border-amber-400/30">
          <CardContent className="p-3">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-amber-400">
                  {seatAreas.filter(a => a.type === 'indoor').length}
                </div>
                <div className="text-xs text-amber-200">Indoor</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-400">
                  {seatAreas.filter(a => a.type === 'outdoor').length}
                </div>
                <div className="text-xs text-amber-200">Outdoor</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">
                  {seatAreas.reduce((sum, a) => sum + a.users, 0)}
                </div>
                <div className="text-xs text-amber-200">Active</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-400">
                  {seatAreas.reduce((sum, a) => sum + a.capacity, 0)}
                </div>
                <div className="text-xs text-amber-200">Capacity</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3D Scene Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="relative preserve-3d"
          style={{
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Cave walls */}
          <div className="absolute w-96 h-80 bg-gradient-to-br from-amber-800 to-orange-900 rounded-3xl shadow-2xl"
               style={{ transform: 'translateZ(-100px)' }}>
            <div className="absolute inset-4 bg-gradient-to-br from-amber-700 to-orange-800 rounded-2xl opacity-80"></div>
            <div className="absolute top-8 left-8 text-amber-200 font-bold">INDOOR CAVE AREA</div>
          </div>

          {/* Floor */}
          <div className="absolute w-[800px] h-[400px] bg-gradient-to-br from-amber-600 to-orange-700 rounded-xl shadow-xl"
               style={{ transform: 'rotateX(90deg) translateZ(-50px)' }}>
          </div>

          {/* Outdoor deck */}
          <div className="absolute w-64 h-60 bg-gradient-to-br from-sky-300 to-blue-400 rounded-2xl shadow-xl"
               style={{ transform: 'translateX(500px) translateZ(-20px)' }}>
            <div className="absolute inset-2 bg-gradient-to-br from-sky-200 to-blue-300 rounded-xl opacity-80"></div>
            <div className="absolute top-4 left-4 text-blue-800 font-bold text-sm">OUTDOOR DECK</div>
          </div>

          {/* Coffee counter */}
          <div className="absolute w-48 h-16 bg-gradient-to-br from-amber-900 to-orange-950 rounded-lg shadow-lg"
               style={{ transform: 'translateY(-150px) translateZ(20px)' }}>
            <div className="absolute inset-1 bg-gradient-to-br from-amber-800 to-orange-900 rounded opacity-90"></div>
            <div className="absolute top-2 left-4 text-amber-200 font-bold text-xs">COFFEE BAR</div>
          </div>

          {/* Seating Areas */}
          {seatAreas.map((area) => (
            <SeatArea
              key={area.id}
              id={area.id}
              name={area.name}
              position={area.position}
              occupied={area.occupied}
              users={area.users}
              capacity={area.capacity}
              type={area.type}
              onClick={() => handleSeatClick(area.id)}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <Card className="bg-black/80 backdrop-blur-xl border-amber-400/30">
          <CardContent className="p-3">
            <div className="text-center text-amber-200">
              <div className="text-sm font-medium mb-1">Interactive Cave Cafe</div>
              <div className="text-xs text-amber-300">
                Use arrow buttons to rotate view • Click tables to select seating area
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CSS3DCafeSimulation;
