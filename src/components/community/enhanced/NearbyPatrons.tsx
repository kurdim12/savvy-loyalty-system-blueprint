
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, User } from 'lucide-react';

interface Patron {
  id: string;
  name: string;
  mood: string;
  activity: string;
  position: { x: number; y: number };
}

interface NearbyPatronsProps {
  patrons: Patron[];
}

export const NearbyPatrons = ({ patrons }: NearbyPatronsProps) => {
  const [selectedPatron, setSelectedPatron] = useState<Patron | null>(null);

  return (
    <>
      {/* Patron Avatars in the scene */}
      {patrons.map((patron) => (
        <div
          key={patron.id}
          className="absolute cursor-pointer transform transition-all duration-200 hover:scale-110 z-15"
          style={{
            left: `${patron.position.x}%`,
            top: `${patron.position.y}%`
          }}
          onClick={() => setSelectedPatron(patron)}
        >
          <div className="relative">
            {/* Patron Avatar */}
            <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full border-2 border-white/50 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
              <span className="text-lg">{patron.mood}</span>
            </div>
            
            {/* Activity Status Bubble */}
            <div className="absolute -top-2 -right-2 bg-[#8B4513] text-white text-xs px-2 py-1 rounded-full shadow-sm">
              <MessageCircle className="h-3 w-3" />
            </div>
            
            {/* Hover Info */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity">
              <div className="bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                <div className="font-medium">{patron.name}</div>
                <div className="text-gray-300">{patron.activity}</div>
              </div>
              <div className="w-2 h-2 bg-black/80 transform rotate-45 absolute top-full left-1/2 -translate-x-1/2 -translate-y-1" />
            </div>
          </div>
        </div>
      ))}

      {/* Patron Profile Modal */}
      {selectedPatron && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedPatron(null)}>
          <Card className="bg-white max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#8B4513] to-[#D2B48C] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-3xl">{selectedPatron.mood}</span>
                </div>
                
                <h3 className="text-xl font-bold text-[#8B4513] mb-2">{selectedPatron.name}</h3>
                <p className="text-gray-600 mb-4">{selectedPatron.activity}</p>
                
                <div className="space-y-2 mb-4">
                  <Badge className="bg-blue-100 text-blue-800">Regular Customer</Badge>
                  <Badge className="bg-green-100 text-green-800">Coffee Enthusiast</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#8B4513]/90 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">Chat</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Profile</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Patrons Overview */}
      <div className="absolute top-20 right-4 z-20">
        <Card className="bg-white/90 backdrop-blur-sm border-white/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-[#8B4513]" />
              <span className="text-sm font-medium text-[#8B4513]">Nearby</span>
            </div>
            <div className="space-y-1">
              {patrons.map((patron) => (
                <div 
                  key={patron.id} 
                  className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-100 rounded p-1"
                  onClick={() => setSelectedPatron(patron)}
                >
                  <span>{patron.mood}</span>
                  <span className="font-medium">{patron.name.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
