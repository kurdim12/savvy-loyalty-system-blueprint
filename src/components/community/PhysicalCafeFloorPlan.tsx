
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coffee, Users, MapPin, ArrowLeft, Zap } from 'lucide-react';
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
                  <span className="text-xl">RawSmith Coffee - Exact Layout</span>
                  <div className="text-sm text-stone-600 font-normal">Interactive seating based on real café photos</div>
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

      {/* Accurate Floor Plan */}
      <div className="absolute inset-0 pt-24">
        <div className="relative w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
          
          {/* Back Wall */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gray-600 border-b-2 border-gray-700">
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold">
              BACK WALL - CONCRETE
            </div>
          </div>

          {/* L-Shaped Bar - Exact positioning from photos */}
          <div className="absolute" style={{ left: '15%', top: '20%', width: '45%', height: '12%' }}>
            {/* Main long section of the bar */}
            <div className="w-full h-full bg-gray-700 border-2 border-gray-800 rounded-lg shadow-lg relative">
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-b-lg"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-sm">
                L-SHAPED CONCRETE BAR
              </div>
              
              {/* Bar stools */}
              <div className="absolute bottom-[-20px] left-2 right-2 flex justify-between">
                {[1, 2, 3, 4, 5].map((stool) => (
                  <div
                    key={stool}
                    className="w-6 h-6 bg-black rounded-full border-2 border-gray-600 cursor-pointer hover:bg-gray-800 transition-colors"
                    onClick={() => handleSeatSelect(`bar-stool-${stool}`)}
                    title={`Bar Stool ${stool}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Return section of L-shaped bar */}
          <div className="absolute" style={{ left: '15%', top: '32%', width: '12%', height: '20%' }}>
            <div className="w-full h-full bg-gray-700 border-2 border-gray-800 rounded-lg shadow-lg relative">
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-b-lg"></div>
              
              {/* Side bar stools */}
              <div className="absolute right-[-20px] top-2 bottom-2 flex flex-col justify-between">
                {[1, 2, 3].map((stool) => (
                  <div
                    key={stool}
                    className="w-6 h-6 bg-black rounded-full border-2 border-gray-600 cursor-pointer hover:bg-gray-800 transition-colors"
                    onClick={() => handleSeatSelect(`side-bar-stool-${stool}`)}
                    title={`Side Bar Stool ${stool}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Window seating area - right side */}
          <div className="absolute" style={{ right: '10%', top: '25%', width: '25%', height: '40%' }}>
            <div className="w-full h-full bg-blue-100 border-2 border-blue-300 rounded-lg p-4 relative">
              <h3 className="text-blue-800 font-bold text-center mb-2">WINDOW SEATING</h3>
              
              {/* Window tables */}
              <div className="space-y-4">
                {/* Table 1 */}
                <div
                  className="w-16 h-12 bg-amber-600 rounded-lg mx-auto cursor-pointer hover:bg-amber-700 transition-colors relative group"
                  onClick={() => handleSeatSelect('window-table-1')}
                >
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">2</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                    T1
                  </div>
                </div>
                
                {/* Table 2 */}
                <div
                  className="w-16 h-12 bg-amber-600 rounded-lg mx-auto cursor-pointer hover:bg-amber-700 transition-colors relative group"
                  onClick={() => handleSeatSelect('window-table-2')}
                >
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">3</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                    T2
                  </div>
                </div>

                {/* Table 3 */}
                <div
                  className="w-16 h-12 bg-amber-600 rounded-lg mx-auto cursor-pointer hover:bg-amber-700 transition-colors relative group"
                  onClick={() => handleSeatSelect('window-table-3')}
                >
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">4</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                    T3
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Central seating area */}
          <div className="absolute" style={{ left: '35%', top: '45%', width: '30%', height: '30%' }}>
            <div className="w-full h-full bg-green-100 border-2 border-green-300 rounded-lg p-4 relative">
              <h3 className="text-green-800 font-bold text-center mb-2">CENTRAL AREA</h3>
              
              {/* Lounge chair area */}
              <div className="grid grid-cols-2 gap-4 h-full">
                <div
                  className="bg-teal-600 rounded-lg cursor-pointer hover:bg-teal-700 transition-colors flex items-center justify-center text-white font-bold relative"
                  onClick={() => handleSeatSelect('lounge-chair-1')}
                >
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">1</span>
                  </div>
                  TEAL CHAIR
                </div>
                
                <div
                  className="bg-amber-600 rounded-lg cursor-pointer hover:bg-amber-700 transition-colors flex items-center justify-center text-white font-bold relative"
                  onClick={() => handleSeatSelect('central-table-1')}
                >
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">2</span>
                  </div>
                  TABLE
                </div>
              </div>
            </div>
          </div>

          {/* Left seating area */}
          <div className="absolute" style={{ left: '10%', top: '55%', width: '20%', height: '25%' }}>
            <div className="w-full h-full bg-purple-100 border-2 border-purple-300 rounded-lg p-4 relative">
              <h3 className="text-purple-800 font-bold text-center mb-2">COZY CORNER</h3>
              
              <div
                className="w-full h-16 bg-amber-600 rounded-lg cursor-pointer hover:bg-amber-700 transition-colors flex items-center justify-center text-white font-bold relative"
                onClick={() => handleSeatSelect('corner-table-1')}
              >
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">2</span>
                </div>
                CORNER TABLE
              </div>
            </div>
          </div>

          {/* Entrance area */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-gray-800 text-white px-6 py-3 rounded-t-lg font-bold">
              ↑ ENTRANCE ↑
            </div>
          </div>

          {/* Floor pattern indicators */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            {/* Concrete floor pattern */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,.1) 20px, rgba(0,0,0,.1) 21px)',
            }}></div>
          </div>

          {/* Real-time activity indicators */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
            <div className="text-sm font-bold text-gray-800 mb-2">Live Activity</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Sarah at Window Table 2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Mike at Bar Stool 3</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Emma in Teal Chair</span>
              </div>
            </div>
          </div>

          {/* Material legend */}
          <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
            <div className="text-sm font-bold text-gray-800 mb-2">Materials</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-700 rounded"></div>
                <span>Concrete Bar</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-600 rounded"></div>
                <span>Brass Kick Plate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-600 rounded"></div>
                <span>Wood Tables</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-600 rounded"></div>
                <span>Teal Upholstery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
