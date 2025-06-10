
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Coffee, BookOpen, Heart, Laptop, Music, MessageSquare, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SeatPurpose {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface OccupiedSeat {
  seatId: string;
  userId: string;
  userName: string;
  purpose: string;
  checkedInAt: string;
  status: 'available' | 'looking_for_chat' | 'do_not_disturb' | 'open_to_meet';
}

const SEAT_PURPOSES: SeatPurpose[] = [
  { id: 'work', label: 'Work/Study', icon: <Laptop className="h-4 w-4" />, color: 'bg-blue-500' },
  { id: 'social', label: 'Meet People', icon: <Users className="h-4 w-4" />, color: 'bg-green-500' },
  { id: 'relax', label: 'Relax/Chill', icon: <Heart className="h-4 w-4" />, color: 'bg-purple-500' },
  { id: 'read', label: 'Reading', icon: <BookOpen className="h-4 w-4" />, color: 'bg-orange-500' },
  { id: 'coffee', label: 'Coffee Tasting', icon: <Coffee className="h-4 w-4" />, color: 'bg-brown-500' },
  { id: 'music', label: 'Music Listening', icon: <Music className="h-4 w-4" />, color: 'bg-pink-500' }
];

export const PhysicalCafeFloorPlan = () => {
  const { user } = useAuth();
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<string>('');
  const [occupiedSeats, setOccupiedSeats] = useState<OccupiedSeat[]>([
    {
      seatId: 'T1',
      userId: '1',
      userName: 'Sarah M.',
      purpose: 'work',
      checkedInAt: '2024-01-10T10:30:00Z',
      status: 'available'
    },
    {
      seatId: 'T4',
      userId: '2',
      userName: 'Alex K.',
      purpose: 'social',
      checkedInAt: '2024-01-10T11:15:00Z',
      status: 'looking_for_chat'
    },
    {
      seatId: 'B2',
      userId: '3',
      userName: 'Emma L.',
      purpose: 'read',
      checkedInAt: '2024-01-10T09:45:00Z',
      status: 'do_not_disturb'
    }
  ]);

  const [userCurrentSeat, setUserCurrentSeat] = useState<string | null>(null);

  // Define table positions based on your floor plan
  const tables = [
    { id: 'T1', x: 15, y: 20, size: 'small' },
    { id: 'T2', x: 35, y: 20, size: 'small' },
    { id: 'T3', x: 55, y: 20, size: 'medium' },
    { id: 'T4', x: 75, y: 20, size: 'small' },
    { id: 'T5', x: 15, y: 40, size: 'medium' },
    { id: 'T6', x: 40, y: 40, size: 'large' },
    { id: 'T7', x: 65, y: 40, size: 'medium' },
    { id: 'T8', x: 15, y: 60, size: 'small' },
    { id: 'T9', x: 35, y: 60, size: 'small' },
    { id: 'T10', x: 55, y: 60, size: 'medium' },
    { id: 'T11', x: 75, y: 60, size: 'small' }
  ];

  const barSeats = [
    { id: 'B1', x: 20, y: 80 },
    { id: 'B2', x: 30, y: 80 },
    { id: 'B3', x: 40, y: 80 },
    { id: 'B4', x: 50, y: 80 },
    { id: 'B5', x: 60, y: 80 },
    { id: 'B6', x: 70, y: 80 }
  ];

  const patioSeats = [
    { id: 'P1', x: 85, y: 25 },
    { id: 'P2', x: 85, y: 35 },
    { id: 'P3', x: 85, y: 45 },
    { id: 'P4', x: 85, y: 55 }
  ];

  const handleSeatClick = (seatId: string) => {
    if (!user) {
      toast.error('Please sign in to check into a seat');
      return;
    }

    const isOccupied = occupiedSeats.some(seat => seat.seatId === seatId);
    if (isOccupied && userCurrentSeat !== seatId) {
      toast.error('This seat is already occupied');
      return;
    }

    setSelectedSeat(seatId);
  };

  const handleCheckIn = () => {
    if (!selectedSeat || !selectedPurpose || !user) return;

    // Check out from previous seat if any
    if (userCurrentSeat) {
      setOccupiedSeats(prev => prev.filter(seat => seat.userId !== user.id));
    }

    // Check into new seat
    const newOccupiedSeat: OccupiedSeat = {
      seatId: selectedSeat,
      userId: user.id,
      userName: user.email?.split('@')[0] || 'Anonymous',
      purpose: selectedPurpose,
      checkedInAt: new Date().toISOString(),
      status: 'available'
    };

    setOccupiedSeats(prev => [...prev.filter(seat => seat.userId !== user.id), newOccupiedSeat]);
    setUserCurrentSeat(selectedSeat);
    setSelectedSeat(null);
    setSelectedPurpose('');
    
    toast.success(`Checked into seat ${selectedSeat}! Others can now see you're here for ${SEAT_PURPOSES.find(p => p.id === selectedPurpose)?.label}`);
  };

  const handleCheckOut = () => {
    if (!userCurrentSeat || !user) return;

    setOccupiedSeats(prev => prev.filter(seat => seat.userId !== user.id));
    setUserCurrentSeat(null);
    toast.success('Checked out successfully');
  };

  const getSeatOccupant = (seatId: string) => {
    return occupiedSeats.find(seat => seat.seatId === seatId);
  };

  const getPurposeInfo = (purposeId: string) => {
    return SEAT_PURPOSES.find(p => p.id === purposeId);
  };

  const getSeatColor = (seatId: string) => {
    const occupant = getSeatOccupant(seatId);
    if (!occupant) return 'bg-green-200 hover:bg-green-300';
    
    if (occupant.userId === user?.id) return 'bg-blue-400 hover:bg-blue-500';
    
    const purpose = getPurposeInfo(occupant.purpose);
    return purpose ? purpose.color.replace('bg-', 'bg-') + '/70' : 'bg-gray-400';
  };

  const renderSeat = (seat: any, type: 'table' | 'bar' | 'patio') => {
    const occupant = getSeatOccupant(seat.id);
    const isUserSeat = occupant?.userId === user?.id;
    
    return (
      <div
        key={seat.id}
        className={`absolute cursor-pointer transition-all duration-200 hover:scale-110 ${getSeatColor(seat.id)} rounded-lg border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white`}
        style={{
          left: `${seat.x}%`,
          top: `${seat.y}%`,
          width: type === 'table' ? (seat.size === 'small' ? '8%' : seat.size === 'medium' ? '10%' : '12%') : '6%',
          height: type === 'table' ? (seat.size === 'small' ? '8%' : seat.size === 'medium' ? '10%' : '12%') : '6%'
        }}
        onClick={() => handleSeatClick(seat.id)}
      >
        <div className="text-center">
          <div className="text-xs font-bold">{seat.id}</div>
          {occupant && (
            <div className="text-[10px] opacity-90">
              {getPurposeInfo(occupant.purpose)?.icon}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Café Status Bar */}
      <Card className="bg-gradient-to-r from-[#8B4513]/10 to-[#D2B48C]/20 border-[#8B4513]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#8B4513]">
            <MapPin className="h-5 w-5" />
            Physical Café Floor Plan
            <Badge className="bg-green-500 text-white">
              {occupiedSeats.length} people checked in
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* User Status */}
      {userCurrentSeat && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500 text-white">
                  Currently at {userCurrentSeat}
                </Badge>
                <span className="text-sm text-gray-600">
                  Purpose: {getPurposeInfo(occupiedSeats.find(s => s.userId === user?.id)?.purpose || '')?.label}
                </span>
              </div>
              <Button onClick={handleCheckOut} variant="outline" size="sm">
                Check Out
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floor Plan */}
      <Card className="h-[500px] relative overflow-hidden">
        <CardContent className="p-0 h-full relative bg-gradient-to-br from-[#F5E6D3] to-[#FAF6F0]">
          {/* Counter/Bar Area */}
          <div 
            className="absolute bg-[#8B4513] rounded-lg shadow-lg flex items-center justify-center text-white font-bold"
            style={{ left: '10%', top: '75%', width: '70%', height: '10%' }}
          >
            COUNTER & BAR
          </div>

          {/* Entrance */}
          <div 
            className="absolute bg-gray-300 rounded shadow flex items-center justify-center text-gray-700 font-bold text-xs"
            style={{ left: '45%', top: '5%', width: '10%', height: '5%' }}
          >
            ENTRANCE
          </div>

          {/* Patio Label */}
          <div 
            className="absolute bg-green-200 rounded shadow flex items-center justify-center text-green-700 font-bold text-xs"
            style={{ left: '85%', top: '15%', width: '12%', height: '5%' }}
          >
            PATIO
          </div>

          {/* Tables */}
          {tables.map(table => renderSeat(table, 'table'))}

          {/* Bar Seats */}
          {barSeats.map(seat => renderSeat(seat, 'bar'))}

          {/* Patio Seats */}
          {patioSeats.map(seat => renderSeat(seat, 'patio'))}
        </CardContent>
      </Card>

      {/* Check-in Modal */}
      {selectedSeat && (
        <Card className="border-2 border-[#8B4513] bg-white">
          <CardHeader>
            <CardTitle className="text-[#8B4513]">
              Check into seat {selectedSeat}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                What are you here for today?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SEAT_PURPOSES.map(purpose => (
                  <Button
                    key={purpose.id}
                    variant={selectedPurpose === purpose.id ? "default" : "outline"}
                    className={`justify-start gap-2 ${selectedPurpose === purpose.id ? purpose.color + ' text-white' : ''}`}
                    onClick={() => setSelectedPurpose(purpose.id)}
                  >
                    {purpose.icon}
                    {purpose.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleCheckIn}
                disabled={!selectedPurpose}
                className="bg-[#8B4513] hover:bg-[#8B4513]/90 text-white flex-1"
              >
                Check In
              </Button>
              <Button 
                onClick={() => setSelectedSeat(null)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#8B4513]">Seat Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 rounded border"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-400 rounded border"></div>
              <span className="text-sm">Your seat</span>
            </div>
            {SEAT_PURPOSES.map(purpose => (
              <div key={purpose.id} className="flex items-center gap-2">
                <div className={`w-4 h-4 ${purpose.color} rounded border`}></div>
                <span className="text-sm">{purpose.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Currently Here */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#8B4513] flex items-center gap-2">
            <Users className="h-5 w-5" />
            Who's Here Now
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {occupiedSeats.map(seat => {
            const purpose = getPurposeInfo(seat.purpose);
            const isUser = seat.userId === user?.id;
            
            return (
              <div key={seat.seatId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={`${purpose?.color} text-white`}>
                    {seat.seatId}
                  </Badge>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#8B4513]">
                        {isUser ? 'You' : seat.userName}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {purpose?.label}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      Since {new Date(seat.checkedInAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                {!isUser && seat.status === 'looking_for_chat' && (
                  <Button size="sm" variant="outline" className="border-green-500 text-green-600">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Chat
                  </Button>
                )}
              </div>
            );
          })}
          
          {occupiedSeats.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No one is checked in yet. Be the first!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
