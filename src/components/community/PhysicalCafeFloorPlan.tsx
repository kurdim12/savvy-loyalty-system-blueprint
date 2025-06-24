
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Users, MapPin, ArrowLeft, Zap, TreePine, Sun } from 'lucide-react';
import { UniqueSeatingArea } from './enhanced/UniqueSeatingArea';
import { SeatedPerspectiveView } from './enhanced/SeatedPerspectiveView';

export const PhysicalCafeFloorPlan = () => {
  const [currentView, setCurrentView] = useState<'floor-plan' | 'seated'>('floor-plan');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeat(seatId);
    setCurrentView('seated');
  };

  const handleStandUp = () => {
    setCurrentView('floor-plan');
    setSelectedSeat(null);
  };

  if (currentView === 'seated' && selectedSeat) {
    return (
      <SeatedPerspectiveView
        seatId={selectedSeat}
        tableId={selectedSeat}
        onStandUp={handleStandUp}
      />
    );
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-stone-100 to-amber-50">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <Card className="bg-white/95 backdrop-blur-sm border-white/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-stone-800">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-stone-600" />
                <div>
                  <span className="text-xl">RawSmith Coffee - Complete Layout</span>
                  <div className="text-sm text-stone-600 font-normal">Indoor & Outdoor seating simulation</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500 text-white">
                  <Users className="h-3 w-3 mr-1" />
                  Live Presence
                </Badge>
                <Badge className="bg-amber-600 text-white">
                  <Zap className="h-3 w-3 mr-1" />
                  Real-time Chat
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Complete Floor Plan with Outdoor Area */}
      <div className="absolute inset-0 pt-24">
        <div className="relative w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
          
          {/* Indoor Section */}
          <div className="absolute left-0 top-0 w-3/5 h-full bg-gradient-to-br from-gray-200 to-gray-300">
            
            {/* Back Wall */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gray-600 border-b-2 border-gray-700">
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-sm">
                BACK WALL - CONCRETE
              </div>
            </div>

            {/* L-Shaped Bar - Exact positioning */}
            <div className="absolute" style={{ left: '20%', top: '20%', width: '50%', height: '12%' }}>
              <div className="w-full h-full bg-gray-700 border-2 border-gray-800 rounded-lg shadow-lg relative">
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-b-lg"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xs">
                  L-SHAPED BAR
                </div>
                
                {/* Bar stools */}
                <div className="absolute bottom-[-20px] left-2 right-2 flex justify-between">
                  {[1, 2, 3, 4].map((stool) => (
                    <div
                      key={stool}
                      className="w-5 h-5 bg-black rounded-full border-2 border-gray-600 cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => handleSeatSelect(`bar-stool-${stool}`)}
                      title={`Bar Stool ${stool}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Return section of L-shaped bar */}
            <div className="absolute" style={{ left: '20%', top: '32%', width: '15%', height: '20%' }}>
              <div className="w-full h-full bg-gray-700 border-2 border-gray-800 rounded-lg shadow-lg relative">
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-b-lg"></div>
                
                {/* Side bar stools */}
                <div className="absolute right-[-20px] top-2 bottom-2 flex flex-col justify-between">
                  {[1, 2].map((stool) => (
                    <div
                      key={stool}
                      className="w-5 h-5 bg-black rounded-full border-2 border-gray-600 cursor-pointer hover:bg-gray-800 transition-colors"
                      onClick={() => handleSeatSelect(`side-bar-stool-${stool}`)}
                      title={`Side Bar Stool ${stool}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Central seating area */}
            <div className="absolute" style={{ left: '25%', top: '55%', width: '35%', height: '25%' }}>
              <div className="w-full h-full bg-green-100 border-2 border-green-300 rounded-lg p-3 relative">
                <h3 className="text-green-800 font-bold text-center mb-2 text-sm">CENTRAL SEATING</h3>
                
                <div className="grid grid-cols-2 gap-3 h-full">
                  <div
                    className="bg-teal-600 rounded-lg cursor-pointer hover:bg-teal-700 transition-colors flex items-center justify-center text-white font-bold text-xs relative"
                    onClick={() => handleSeatSelect('teal-chair-1')}
                  >
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
                    TEAL
                  </div>
                  
                  <div
                    className="bg-amber-600 rounded-lg cursor-pointer hover:bg-amber-700 transition-colors flex items-center justify-center text-white font-bold text-xs relative"
                    onClick={() => handleSeatSelect('central-table-1')}
                  >
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"></div>
                    TABLE
                  </div>
                </div>
              </div>
            </div>

            {/* Entrance */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gray-800 text-white px-4 py-2 rounded-t-lg font-bold text-sm">
                ↑ ENTRANCE ↑
              </div>
            </div>
          </div>

          {/* Outdoor Section */}
          <div className="absolute right-0 top-0 w-2/5 h-full bg-gradient-to-br from-green-100 to-blue-100 border-l-4 border-green-400">
            
            {/* Outdoor Header */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-green-600 border-b-2 border-green-700">
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-sm flex items-center gap-2">
                <Sun className="h-4 w-4" />
                OUTDOOR TERRACE
                <TreePine className="h-4 w-4" />
              </div>
            </div>

            {/* Street-side seating */}
            <div className="absolute" style={{ left: '15%', top: '25%', width: '70%', height: '20%' }}>
              <div className="w-full h-full bg-amber-100 border-2 border-amber-400 rounded-lg p-3 relative">
                <h3 className="text-amber-800 font-bold text-center mb-2 text-sm">STREET VIEW</h3>
                
                <div className="flex justify-between items-center h-full">
                  {[1, 2].map((table) => (
                    <div
                      key={table}
                      className="w-12 h-10 bg-amber-600 rounded-lg cursor-pointer hover:bg-amber-700 transition-colors relative group flex items-center justify-center text-white text-xs font-bold"
                      onClick={() => handleSeatSelect(`outdoor-street-${table}`)}
                    >
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                      T{table}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Garden-side seating */}
            <div className="absolute" style={{ left: '15%', top: '50%', width: '70%', height: '25%' }}>
              <div className="w-full h-full bg-green-200 border-2 border-green-400 rounded-lg p-3 relative">
                <h3 className="text-green-800 font-bold text-center mb-2 text-sm">GARDEN AREA</h3>
                
                <div className="grid grid-cols-2 gap-3 h-full">
                  {[1, 2, 3, 4].map((table) => (
                    <div
                      key={table}
                      className="bg-green-600 rounded-lg cursor-pointer hover:bg-green-700 transition-colors relative group flex items-center justify-center text-white text-xs font-bold"
                      onClick={() => handleSeatSelect(`outdoor-garden-${table}`)}
                    >
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
                      G{table}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Outdoor plants decoration */}
            <div className="absolute bottom-20 left-4 right-4 flex justify-between">
              {[1, 2, 3, 4].map((plant) => (
                <div key={plant} className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <TreePine className="h-3 w-3 text-white" />
                </div>
              ))}
            </div>

            {/* Weather indicator */}
            <div className="absolute top-20 right-4 bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
              <Sun className="h-3 w-3" />
              Sunny 22°C
            </div>
          </div>

          {/* Real-time activity indicators */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
            <div className="text-sm font-bold text-gray-800 mb-2">Live Activity</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Sarah at Bar Stool 2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Mike in Garden G1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Emma in Teal Chair</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span>Alex at Street Table</span>
              </div>
            </div>
          </div>

          {/* Layout legend */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
            <div className="text-sm font-bold text-gray-800 mb-2">Layout Guide</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-700 rounded"></div>
                <span>Indoor Bar</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                <span>Outdoor Garden</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-600 rounded"></div>
                <span>Lounge Seating</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-600 rounded"></div>
                <span>Street Tables</span>
              </div>
            </div>
          </div>

          {/* Capacity overview */}
          <div className="absolute bottom-4 right-1/3 bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
            <div className="text-sm font-bold text-gray-800 mb-2">Capacity</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-600">12</div>
                <div>Indoor Seats</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">16</div>
                <div>Outdoor Seats</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
