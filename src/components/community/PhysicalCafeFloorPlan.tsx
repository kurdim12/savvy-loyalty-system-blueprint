import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Coffee, BookOpen, Heart, Laptop, Music, MessageSquare, MapPin, Wifi, Volume2, Flame, Bean } from 'lucide-react';
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
  { id: 'work', label: 'Deep Work', icon: <Laptop className="h-4 w-4" />, color: 'bg-slate-600' },
  { id: 'social', label: 'Coffee & Chat', icon: <Users className="h-4 w-4" />, color: 'bg-amber-600' },
  { id: 'relax', label: 'Slow Coffee', icon: <Heart className="h-4 w-4" />, color: 'bg-rose-500' },
  { id: 'read', label: 'Reading Corner', icon: <BookOpen className="h-4 w-4" />, color: 'bg-emerald-600' },
  { id: 'coffee', label: 'Coffee Tasting', icon: <Coffee className="h-4 w-4" />, color: 'bg-orange-600' },
  { id: 'music', label: 'Acoustic Vibes', icon: <Music className="h-4 w-4" />, color: 'bg-purple-600' }
];

export const PhysicalCafeFloorPlan = () => {
  const { user } = useAuth();
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<string>('');
  const [occupiedSeats, setOccupiedSeats] = useState<OccupiedSeat[]>([
    {
      seatId: 'BR1',
      userId: '1',
      userName: 'Elena',
      purpose: 'coffee',
      checkedInAt: '2024-01-10T10:30:00Z',
      status: 'open_to_meet'
    },
    {
      seatId: 'CT2',
      userId: '2',
      userName: 'Marcus',
      purpose: 'work',
      checkedInAt: '2024-01-10T11:15:00Z',
      status: 'do_not_disturb'
    },
    {
      seatId: 'RC3',
      userId: '3',
      userName: 'Sophia',
      purpose: 'read',
      checkedInAt: '2024-01-10T09:45:00Z',
      status: 'available'
    },
    {
      seatId: 'LT4',
      userId: '4',
      userName: 'Kai',
      purpose: 'social',
      checkedInAt: '2024-01-10T12:00:00Z',
      status: 'looking_for_chat'
    }
  ]);

  const [userCurrentSeat, setUserCurrentSeat] = useState<string | null>(null);

  // Unique coffee shop layout - no kitchen, all about coffee experience
  const brewingBar = [
    { id: 'BR1', x: 15, y: 75, label: 'Espresso Bar Seat 1', type: 'brewing' },
    { id: 'BR2', x: 25, y: 75, label: 'Espresso Bar Seat 2', type: 'brewing' },
    { id: 'BR3', x: 35, y: 75, label: 'Pour Over Counter 1', type: 'brewing' },
    { id: 'BR4', x: 45, y: 75, label: 'Pour Over Counter 2', type: 'brewing' },
    { id: 'BR5', x: 55, y: 75, label: 'Cold Brew Station', type: 'brewing' }
  ];

  const communityTables = [
    { id: 'CT1', x: 25, y: 35, size: 'large', label: 'Community Table', type: 'community' },
    { id: 'CT2', x: 45, y: 35, size: 'large', label: 'Sharing Table', type: 'community' },
    { id: 'CT3', x: 65, y: 35, size: 'medium', label: 'Group Spot', type: 'community' }
  ];

  const readingNooks = [
    { id: 'RC1', x: 15, y: 20, label: 'Window Reading Nook', type: 'reading' },
    { id: 'RC2', x: 15, y: 50, label: 'Cozy Reading Corner', type: 'reading' },
    { id: 'RC3', x: 85, y: 20, label: 'Quiet Book Spot', type: 'reading' },
    { id: 'RC4', x: 85, y: 50, label: 'Literature Corner', type: 'reading' }
  ];

  const laptopTables = [
    { id: 'LT1', x: 35, y: 15, label: 'Focus Table 1', type: 'laptop' },
    { id: 'LT2', x: 55, y: 15, label: 'Focus Table 2', type: 'laptop' },
    { id: 'LT3', x: 75, y: 15, label: 'Solo Work Spot', type: 'laptop' },
    { id: 'LT4', x: 35, y: 55, label: 'Study Table', type: 'laptop' },
    { id: 'LT5', x: 55, y: 55, label: 'Creative Desk', type: 'laptop' }
  ];

  const loungeSeats = [
    { id: 'LS1', x: 75, y: 65, label: 'Velvet Armchair', type: 'lounge' },
    { id: 'LS2', x: 85, y: 65, label: 'Leather Sofa Spot', type: 'lounge' },
    { id: 'LS3', x: 25, y: 20, label: 'Vintage Chair', type: 'lounge' },
    { id: 'LS4', x: 75, y: 40, label: 'Conversation Couch', type: 'lounge' }
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
    const allSeats = [...brewingBar, ...communityTables, ...readingNooks, ...laptopTables, ...loungeSeats];
    const seat = allSeats.find(s => s.id === seatId);
    return seat?.label || seatId;
  };

  const getSeatColor = (seatId: string, seatType: string) => {
    const occupant = getSeatOccupant(seatId);
    if (!occupant) {
      // Different colors for different seat types when empty
      switch (seatType) {
        case 'brewing': return 'bg-amber-100 hover:bg-amber-200 border-amber-300';
        case 'reading': return 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300';
        case 'laptop': return 'bg-blue-100 hover:bg-blue-200 border-blue-300';
        case 'lounge': return 'bg-purple-100 hover:bg-purple-200 border-purple-300';
        case 'community': return 'bg-orange-100 hover:bg-orange-200 border-orange-300';
        default: return 'bg-gray-100 hover:bg-gray-200 border-gray-300';
      }
    }
    
    if (occupant.userId === user?.id) return 'bg-rose-400 hover:bg-rose-500 border-rose-600';
    
    const purpose = getPurposeInfo(occupant.purpose);
    return purpose ? purpose.color.replace('bg-', 'bg-') + '/70 hover:' + purpose.color.replace('bg-', 'bg-') + '/90 border-' + purpose.color.replace('bg-', '') + '-500' : 'bg-gray-400 border-gray-500';
  };

  const renderSeat = (seat: any, seatType: string) => {
    const occupant = getSeatOccupant(seat.id);
    const isUserSeat = occupant?.userId === user?.id;
    
    let sizeClass = 'w-14 h-14';
    if (seat.size === 'large') sizeClass = 'w-20 h-16';
    else if (seat.size === 'medium') sizeClass = 'w-16 h-14';
    else if (seatType === 'brewing') sizeClass = 'w-12 h-12';
    else if (seatType === 'lounge') sizeClass = 'w-16 h-16';
    
    return (
      <div
        key={seat.id}
        className={`absolute cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl ${getSeatColor(seat.id, seatType)} rounded-xl border-2 shadow-lg flex flex-col items-center justify-center text-xs font-bold ${sizeClass}`}
        style={{
          left: `${seat.x}%`,
          top: `${seat.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
        onClick={() => handleSeatClick(seat.id)}
        title={`${seat.label}${occupant ? ` - ${occupant.userName} (${getPurposeInfo(occupant.purpose)?.label})` : ' - Available'}`}
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
      <Card className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-amber-700/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <Coffee className="h-6 w-6" />
            Artisan Coffee House Floor Plan
            <Badge className="bg-amber-600 text-white">
              <Users className="h-3 w-3 mr-1" />
              {occupiedSeats.length} coffee lovers here
            </Badge>
            <Badge className="bg-emerald-600 text-white">
              <Wifi className="h-3 w-3 mr-1" />
              Free WiFi
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* User Status */}
      {userCurrentSeat && (
        <Card className="bg-rose-50 border-rose-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className="bg-rose-500 text-white">
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

      {/* Enhanced Coffee House Floor Plan */}
      <Card className="h-[700px] relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <CardContent className="p-0 h-full relative">
          {/* Coffee House Background Design */}
          <div className="absolute inset-0">
            {/* Main brewing area background */}
            <div className="absolute bg-gradient-to-t from-amber-200/60 to-amber-100/40 rounded-t-3xl shadow-inner" 
                 style={{ left: '8%', top: '68%', width: '55%', height: '25%' }} />
            
            {/* Window seating zones */}
            <div className="absolute bg-gradient-to-r from-yellow-100/60 to-amber-100/40 rounded-lg shadow-sm" 
                 style={{ left: '5%', top: '10%', width: '25%', height: '50%' }} />
            
            {/* Central community area */}
            <div className="absolute bg-gradient-to-br from-orange-100/50 to-amber-100/30 rounded-2xl shadow-sm" 
                 style={{ left: '25%', top: '25%', width: '50%', height: '35%' }} />
            
            {/* Reading corners */}
            <div className="absolute bg-gradient-to-bl from-emerald-100/50 to-green-100/30 rounded-xl shadow-sm" 
                 style={{ left: '78%', top: '10%', width: '20%', height: '45%' }} />
            
            {/* Lounge area */}
            <div className="absolute bg-gradient-to-tl from-purple-100/40 to-pink-100/30 rounded-2xl shadow-sm" 
                 style={{ left: '70%', top: '55%', width: '28%', height: '25%' }} />
          </div>

          {/* Coffee Brewing Bar - The Heart of the Café */}
          <div 
            className="absolute bg-gradient-to-t from-amber-800 via-amber-700 to-amber-600 rounded-t-3xl shadow-2xl flex items-center justify-center text-white font-bold border-4 border-amber-900"
            style={{ left: '10%', top: '70%', width: '50%', height: '20%' }}
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coffee className="h-8 w-8" />
                <Flame className="h-6 w-6 text-orange-300 animate-pulse" />
                <Bean className="h-6 w-6 text-amber-200" />
              </div>
              <div className="text-lg font-bold">ARTISAN BREWING BAR</div>
              <div className="text-xs text-amber-200">Fresh roasted • Pour over • Espresso</div>
            </div>
          </div>

          {/* Coffee Storage & Equipment Display */}
          <div 
            className="absolute bg-gradient-to-r from-amber-700 to-orange-700 rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-sm border-2 border-amber-800"
            style={{ left: '65%', top: '72%', width: '20%', height: '15%' }}
          >
            <div className="text-center">
              <Bean className="h-6 w-6 mx-auto mb-1 text-orange-200" />
              <div>BEAN ROASTERY</div>
              <div className="text-xs text-orange-200">Fresh Daily</div>
            </div>
          </div>

          {/* Entrance */}
          <div 
            className="absolute bg-amber-200 rounded-xl shadow-lg flex items-center justify-center text-amber-800 font-bold text-sm border-2 border-amber-300"
            style={{ left: '45%', top: '3%', width: '10%', height: '8%' }}
          >
            ↓ ENTRANCE ↓
          </div>

          {/* Area Labels with Coffee Theme */}
          <div className="absolute top-2 left-4 text-xs font-semibold text-amber-800 bg-yellow-100/90 px-3 py-2 rounded-full shadow-sm">
            ☀️ Morning Light Reading
          </div>
          <div className="absolute top-2 left-1/3 text-xs font-semibold text-orange-800 bg-orange-100/90 px-3 py-2 rounded-full shadow-sm">
            🤝 Community Coffee Tables
          </div>
          <div className="absolute top-2 right-4 text-xs font-semibold text-emerald-800 bg-emerald-100/90 px-3 py-2 rounded-full shadow-sm">
            📚 Quiet Study Corners
          </div>
          <div className="absolute bottom-20 right-4 text-xs font-semibold text-purple-800 bg-purple-100/90 px-3 py-2 rounded-full shadow-sm">
            🛋️ Comfort Lounge
          </div>
          <div className="absolute bottom-2 left-1/4 text-xs font-semibold text-amber-800 bg-amber-100/90 px-3 py-2 rounded-full shadow-sm">
            ☕ Watch Your Coffee Being Made
          </div>

          {/* Render all seating areas */}
          {brewingBar.map(seat => renderSeat(seat, 'brewing'))}
          {communityTables.map(seat => renderSeat(seat, 'community'))}
          {readingNooks.map(seat => renderSeat(seat, 'reading'))}
          {laptopTables.map(seat => renderSeat(seat, 'laptop'))}
          {loungeSeats.map(seat => renderSeat(seat, 'lounge'))}

          {/* Coffee Bean Decorative Elements */}
          <div className="absolute top-12 left-12 w-6 h-6 bg-amber-700 rounded-full opacity-20"></div>
          <div className="absolute top-20 right-20 w-4 h-4 bg-orange-600 rounded-full opacity-20"></div>
          <div className="absolute bottom-32 left-20 w-5 h-5 bg-amber-600 rounded-full opacity-20"></div>
        </CardContent>
      </Card>

      {/* Check-in Modal */}
      {selectedSeat && (
        <Card className="border-2 border-amber-600 bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-amber-800">
              Join the Coffee Community at {getSeatLabel(selectedSeat)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                What brings you to our coffee house today?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SEAT_PURPOSES.map(purpose => (
                  <Button
                    key={purpose.id}
                    variant={selectedPurpose === purpose.id ? "default" : "outline"}
                    className={`justify-start gap-2 ${selectedPurpose === purpose.id ? purpose.color + ' text-white hover:opacity-90' : 'hover:border-amber-400'}`}
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
                className="bg-amber-700 hover:bg-amber-800 text-white flex-1"
              >
                Join the Coffee Community
              </Button>
              <Button 
                onClick={() => setSelectedSeat(null)}
                variant="outline"
                className="flex-1"
              >
                Maybe Later
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-amber-800">Coffee House Seating Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Seat Status</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-100 border border-emerald-300 rounded"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-rose-400 border border-rose-600 rounded"></div>
                  <span className="text-sm">Your spot</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Coffee Experience Zones</h4>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-100 border border-amber-300 rounded"></div>
                  <span className="text-sm">Brewing Bar - Watch coffee being made</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
                  <span className="text-sm">Community Tables - Meet fellow coffee lovers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-100 border border-emerald-300 rounded"></div>
                  <span className="text-sm">Reading Nooks - Quiet coffee moments</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                  <span className="text-sm">Focus Tables - Work with coffee</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded"></div>
                  <span className="text-sm">Lounge - Relax and savor</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currently Here */}
      <Card>
        <CardHeader>
          <CardTitle className="text-amber-800 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Coffee Lovers Currently Here
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {occupiedSeats.map(seat => {
            const purpose = getPurposeInfo(seat.purpose);
            const isUser = seat.userId === user?.id;
            
            return (
              <div key={seat.seatId} className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <Badge className={`${purpose?.color} text-white`}>
                    {getSeatLabel(seat.seatId)}
                  </Badge>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-amber-800">
                        {isUser ? 'You' : seat.userName}
                      </span>
                      <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                        {purpose?.label}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      Enjoying coffee since {new Date(seat.checkedInAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                {!isUser && seat.status === 'looking_for_chat' && (
                  <Button size="sm" variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Coffee Chat
                  </Button>
                )}
              </div>
            );
          })}
          
          {occupiedSeats.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Coffee className="h-12 w-12 mx-auto mb-4 opacity-30 text-amber-400" />
              <p>The coffee house awaits your arrival!</p>
              <p className="text-sm mt-2">Be the first to check in and start the coffee community.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
