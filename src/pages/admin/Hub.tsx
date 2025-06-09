import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coffee, Users, Music } from 'lucide-react';
import { CoffeeShopFloorPlan } from '@/components/community/CoffeeShopFloorPlan';
import { RealTimeDJSystem } from '@/components/community/RealTimeDJSystem';
import { CoffeeShopSeated } from '@/components/community/CoffeeShopSeated';

const Hub = () => {
  const [currentView, setCurrentView] = useState<'floor-plan' | 'seated' | 'dj'>('floor-plan');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeat(seatId);
    setCurrentView('seated');
  };

  const handleLeaveSeated = () => {
    setSelectedSeat(null);
    setCurrentView('floor-plan');
  };

  const handleViewChange = (view: 'interior') => {
    // Handle the interior view change - for now we'll keep it on floor-plan
    setCurrentView('floor-plan');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Virtual Café Hub</h1>
            <p className="text-gray-500">Experience our interactive coffee shop with real-time music and social features</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('floor-plan')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                currentView === 'floor-plan' 
                  ? 'bg-[#8B4513] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Coffee className="h-4 w-4" />
              Floor Plan
            </button>
            <button
              onClick={() => setCurrentView('dj')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                currentView === 'dj' 
                  ? 'bg-[#8B4513] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Music className="h-4 w-4" />
              DJ System
            </button>
          </div>
        </div>

        <Card className="min-h-[600px]">
          <CardContent className="p-0">
            {currentView === 'floor-plan' && (
              <CoffeeShopFloorPlan 
                onSeatSelect={handleSeatSelect}
                onViewChange={handleViewChange}
              />
            )}
            
            {currentView === 'seated' && selectedSeat && (
              <CoffeeShopSeated 
                seatId={selectedSeat}
                onLeave={handleLeaveSeated}
              />
            )}
            
            {currentView === 'dj' && (
              <div className="p-6">
                <RealTimeDJSystem seatArea="global" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Café Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                +2 from last hour
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Songs in Queue</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                +3 new requests
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupied Tables</CardTitle>
              <Coffee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15/18</div>
              <p className="text-xs text-muted-foreground">
                83% occupancy
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Hub;
