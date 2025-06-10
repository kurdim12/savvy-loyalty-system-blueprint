import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Coffee, BookOpen, Heart, Laptop, Music, MessageSquare, MapPin, Wifi, Volume2 } from 'lucide-react';
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
  { id: 'coffee', label: 'Coffee Tasting', icon: <Coffee className="h-4 w-4" />, color: 'bg-amber-600' },
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
    },
    {
      seatId: 'P1',
      userId: '4',
      userName: 'Jordan P.',
      purpose: 'relax',
      checkedInAt: '2024-01-10T12:00:00Z',
      status: 'open_to_meet'
    }
  ]);

  const [userCurrentSeat, setUserCurrentSeat] = useState<string | null>(null);

  // Realistic coffee shop layout based on typical floor plans
  const tables = [
    // Window seating area
    { id: 'W1', x: 8, y: 15, size: 'small', label: 'Window Table 1', zone: 'window' },
    { id: 'W2', x: 8, y: 25, size: 'small', label: 'Window Table 2', zone: 'window' },
    { id: 'W3', x: 8, y: 35, size: 'small', label: 'Window Table 3', zone: 'window' },
    
    // Central area tables
    { id: 'T1', x: 25, y: 20, size: 'medium', label: 'Round Table 1', zone: 'center' },
    { id: 'T2', x: 45, y: 15, size: 'large', label: 'Community Table', zone: 'center' },
    { id: 'T3', x: 25, y: 40, size: 'medium', label: 'Round Table 3', zone: 'center' },
    { id: 'T4', x: 45, y: 35, size: 'small', label: 'Cozy Table 4', zone: 'center' },
    
    // Back corner cozy area
    { id: 'C1', x: 75, y: 20, size: 'medium', label: 'Corner Booth 1', zone: 'cozy' },
    { id: 'C2', x: 75, y: 35, size: 'medium', label: 'Corner Booth 2', zone: 'cozy' },
    
    // Near entrance quick tables
    { id: 'Q1', x: 25, y: 65, size: 'small', label: 'Quick Table 1', zone: 'entrance' },
    { id: 'Q2', x: 40, y: 65, size: 'small', label: 'Quick Table 2', zone: 'entrance' }
  ];

  const barSeats = [
    { id: 'B1', x: 15, y: 85, label: 'Bar Seat 1' },
    { id: 'B2', x: 25, y: 85, label: 'Bar Seat 2' },
    { id: 'B3', x: 35, y: 85, label: 'Bar Seat 3' },
    { id: 'B4', x: 45, y: 85, label: 'Bar Seat 4' },
    { id: 'B5', x: 55, y: 85, label: 'Bar Seat 5' },
    { id: 'B6', x: 65, y: 85, label: 'Bar Seat 6' }
  ];

  const patioSeats = [
    { id: 'P1', x: 85, y: 15, label: 'Patio Table 1' },
    { id: 'P2', x: 85, y: 30, label: 'Patio Table 2' },
    { id: 'P3', x: 85, y: 45, label: 'Patio Table 3' }
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

    if (userCurrentSeat) {
      setOccupiedSeats(prev => prev.filter(seat => seat.userId !== user.id));
    }

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
    
    toast.success(`Checked into ${getSeatLabel(selectedSeat)}! Others can now see you're here for ${SEAT_PURPOSES.find(p => p.id === selectedPurpose)?.label}`);
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

  const getSeatLabel = (seatId: string) => {
    const table = tables.find(t => t.id === seatId);
    const bar = barSeats.find(b => b.id === seatId);
    const patio = patioSeats.find(p => p.id === seatId);
    return table?.label || bar?.label || patio?.label || seatId;
  };

  const getSeatColor = (seatId: string) => {
    const occupant = getSeatOccupant(seatId);
    if (!occupant) return 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300';
    
    if (occupant.userId === user?.id) return 'bg-blue-400 hover:bg-blue-500 border-blue-600';
    
    const purpose = getPurposeInfo(occupant.purpose);
    return purpose ? purpose.color.replace('bg-', 'bg-') + '/60 hover:' + purpose.color.replace('bg-', 'bg-') + '/80 border-' + purpose.color.replace('bg-', '') + '-400' : 'bg-gray-400 border-gray-500';
  };

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'window': return 'bg-yellow-50';
      case 'center': return 'bg-white';
      case 'cozy': return 'bg-purple-50';
      case 'entrance': return 'bg-blue-50';
      default: return 'bg-gray-50';
    }
  };

  const renderSeat = (seat: any, type: 'table' | 'bar' | 'patio') => {
    const occupant = getSeatOccupant(seat.id);
    const isUserSeat = occupant?.userId === user?.id;
    const sizeClass = type === 'table' ? 
      (seat.size === 'small' ? 'w-12 h-12' : seat.size === 'medium' ? 'w-16 h-16' : 'w-20 h-20') : 
      'w-10 h-10';
    
    return (
      <div
        key={seat.id}
        className={`absolute cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg ${getSeatColor(seat.id)} rounded-2xl border-2 shadow-md flex flex-col items-center justify-center text-xs font-bold ${sizeClass}`}
        style={{
          left: `${seat.x}%`,
          top: `${seat.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
        onClick={() => handleSeatClick(seat.id)}
        title={`${seat.label || seat.id}${occupant ? ` - ${occupant.userName} (${getPurposeInfo(occupant.purpose)?.label})` : ' - Available'}`}
      >
        <div className="text-center">
          <div className="text-xs font-bold text-gray-800 mb-1">{seat.id}</div>
          {occupant && (
            <div className="flex items-center justify-center">
              <div className="text-lg">
                {getPurposeInfo(occupant.purpose)?.icon}
              </div>
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
              <Users className="h-3 w-3 mr-1" />
              {occupiedSeats.length} people here
            </Badge>
            <Badge className="bg-blue-500 text-white">
              <Wifi className="h-3 w-3 mr-1" />
              Free WiFi
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
                  Currently at {getSeatLabel(userCurrentSeat)}
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

      {/* Enhanced Floor Plan */}
      <Card className="h-[600px] relative overflow-hidden bg-gradient-to-br from-[#F5E6D3] to-[#FAF6F0]">
        <CardContent className="p-0 h-full relative">
          {/* Background zones */}
          <div className="absolute inset-0">
            {/* Window zone */}
            <div className="absolute bg-yellow-100/50 rounded-lg" style={{ left: '2%', top: '10%', width: '20%', height: '40%' }} />
            
            {/* Center zone */}
            <div className="absolute bg-white/30 rounded-lg" style={{ left: '20%', top: '10%', width: '45%', height: '50%' }} />
            
            {/* Cozy corner zone */}
            <div className="absolute bg-purple-100/50 rounded-lg" style={{ left: '68%', top: '10%', width: '28%', height: '40%' }} />
            
            {/* Entrance zone */}
            <div className="absolute bg-blue-100/50 rounded-lg" style={{ left: '20%', top: '55%', width: '35%', height: '20%' }} />
            
            {/* Patio zone */}
            <div className="absolute bg-green-100/50 rounded-lg border-2 border-dashed border-green-300" style={{ left: '75%', top: '10%', width: '22%', height: '40%' }} />
          </div>

          {/* Counter/Bar Area */}
          <div 
            className="absolute bg-gradient-to-r from-[#8B4513] to-[#A0522D] rounded-2xl shadow-2xl flex items-center justify-center text-white font-bold border-4 border-[#654321]"
            style={{ left: '10%', top: '80%', width: '60%', height: '12%' }}
          >
            <Coffee className="h-6 w-6 mr-2" />
            COFFEE BAR & COUNTER
            <Volume2 className="h-4 w-4 ml-3 animate-pulse" />
          </div>

          {/* Entrance */}
          <div 
            className="absolute bg-gray-300 rounded-xl shadow-lg flex items-center justify-center text-gray-700 font-bold text-sm border-2 border-gray-400"
            style={{ left: '45%', top: '3%', width: '10%', height: '6%' }}
          >
            ↓ ENTRANCE ↓
          </div>

          {/* Zone Labels */}
          <div className="absolute top-2 left-4 text-xs font-semibold text-yellow-700 bg-yellow-100/80 px-2 py-1 rounded">
            🌅 Window Seating
          </div>
          <div className="absolute top-2 left-1/3 text-xs font-semibold text-gray-700 bg-white/80 px-2 py-1 rounded">
            ☕ Main Area
          </div>
          <div className="absolute top-2 right-20 text-xs font-semibold text-purple-700 bg-purple-100/80 px-2 py-1 rounded">
            🛋️ Cozy Corner
          </div>
          <div className="absolute top-12 right-4 text-xs font-semibold text-green-700 bg-green-100/80 px-2 py-1 rounded">
            🌿 Outdoor Patio
          </div>

          {/* Tables */}
          {tables.map(table => renderSeat(table, 'table'))}

          {/* Bar Seats */}
          {barSeats.map(seat => renderSeat(seat, 'bar'))}

          {/* Patio Seats */}
          {patioSeats.map(seat => renderSeat(seat, 'patio'))}

          {/* Restroom indicator */}
          <div 
            className="absolute bg-gray-200 rounded-lg shadow-md flex items-center justify-center text-gray-600 text-xs font-medium border border-gray-300"
            style={{ left: '75%', top: '75%', width: '8%', height: '8%' }}
          >
            🚻
          </div>

          {/* Kitchen indicator */}
          <div 
            className="absolute bg-red-100 rounded-lg shadow-md flex items-center justify-center text-red-600 text-xs font-medium border border-red-300"
            style={{ left: '75%', top: '82%', width: '15%', height: '8%' }}
          >
            👨‍🍳 Kitchen
          </div>
        </CardContent>
      </Card>

      {/* Check-in Modal */}
      {selectedSeat && (
        <Card className="border-2 border-[#8B4513] bg-white">
          <CardHeader>
            <CardTitle className="text-[#8B4513]">
              Check into {getSeatLabel(selectedSeat)}
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

      {/* Enhanced Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#8B4513]">Seating Areas & Purpose Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Seat Status</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-100 border border-emerald-300 rounded"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 border border-blue-600 rounded"></div>
                  <span className="text-sm">Your seat</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Purpose Colors</h4>
              <div className="grid grid-cols-2 gap-2">
                {SEAT_PURPOSES.map(purpose => (
                  <div key={purpose.id} className="flex items-center gap-2">
                    <div className={`w-4 h-4 ${purpose.color} rounded border`}></div>
                    <span className="text-sm">{purpose.label}</span>
                  </div>
                ))}
              </div>
            </div>
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
                    {getSeatLabel(seat.seatId)}
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
