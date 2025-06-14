import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Coffee, Music, Wifi, ArrowLeft, MapPin, Maximize2 } from 'lucide-react';
import { Enhanced3DSeatingView } from './Enhanced3DSeatingView';
import { CafeOfficialSeatingPlan } from "./CafeOfficialSeatingPlan";

interface SeatArea {
  id: string;
  name: string;
  type: 'cosmic' | 'vinyl' | 'zen' | 'workspace' | 'social' | 'window' | 'counter';
  capacity: number;
  occupied: number;
  users: Array<{
    name: string;
    mood: string;
    activity: string;
  }>;
  position: { x: number; y: number; width: number; height: number };
  theme: {
    gradient: string;
    accent: string;
    music: string;
  };
}

interface UniqueSeatingAreaProps {
  onSeatSelect: (seatId: string) => void;
  onViewChange: (view: string) => void;
}

export const UniqueSeatingArea = ({ onSeatSelect, onViewChange }: UniqueSeatingAreaProps) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  const [show3DView, setShow3DView] = useState(false);

  const seatAreas: SeatArea[] = [
    {
      id: 'cosmic-corner',
      name: 'Cosmic Corner',
      type: 'cosmic',
      capacity: 4,
      occupied: 2,
      users: [
        { name: 'Luna', mood: '🌙', activity: 'Stargazing vibes' },
        { name: 'Nova', mood: '✨', activity: 'Deep thoughts' }
      ],
      position: { x: 5, y: 10, width: 25, height: 20 },
      theme: {
        gradient: 'from-purple-900/40 to-indigo-900/40',
        accent: 'border-purple-400/50',
        music: '🌌 Ambient Space'
      }
    },
    {
      id: 'vinyl-lounge',
      name: 'Vinyl Lounge',
      type: 'vinyl',
      capacity: 6,
      occupied: 4,
      users: [
        { name: 'Jazz', mood: '🎵', activity: 'Vinyl discovery' },
        { name: 'Blues', mood: '🎶', activity: 'Music sharing' },
        { name: 'Rock', mood: '🎸', activity: 'Album reviews' },
        { name: 'Soul', mood: '💿', activity: 'Groove session' }
      ],
      position: { x: 35, y: 10, width: 30, height: 25 },
      theme: {
        gradient: 'from-amber-900/40 to-orange-900/40',
        accent: 'border-amber-400/50',
        music: '🎵 Classic Vinyl'
      }
    },
    {
      id: 'zen-garden',
      name: 'Zen Garden',
      type: 'zen',
      capacity: 3,
      occupied: 1,
      users: [
        { name: 'Sage', mood: '🧘', activity: 'Meditation' }
      ],
      position: { x: 70, y: 10, width: 25, height: 20 },
      theme: {
        gradient: 'from-emerald-900/40 to-teal-900/40',
        accent: 'border-emerald-400/50',
        music: '🌿 Nature Sounds'
      }
    },
    {
      id: 'window-table-1',
      name: 'Street View Window',
      type: 'window',
      capacity: 2,
      occupied: 1,
      users: [
        { name: 'Alex', mood: '☕', activity: 'People watching' }
      ],
      position: { x: 5, y: 35, width: 20, height: 15 },
      theme: {
        gradient: 'from-sky-900/40 to-blue-900/40',
        accent: 'border-sky-400/50',
        music: '☁️ Cafe Jazz'
      }
    },
    {
      id: 'social-hub',
      name: 'Social Hub',
      type: 'social',
      capacity: 8,
      occupied: 5,
      users: [
        { name: 'Maya', mood: '🗣️', activity: 'Group chat' },
        { name: 'Sam', mood: '😄', activity: 'Making friends' },
        { name: 'River', mood: '🤝', activity: 'Networking' },
        { name: 'Taylor', mood: '💭', activity: 'Brainstorming' },
        { name: 'Casey', mood: '☕', activity: 'Coffee meetup' }
      ],
      position: { x: 30, y: 40, width: 35, height: 25 },
      theme: {
        gradient: 'from-pink-900/40 to-rose-900/40',
        accent: 'border-pink-400/50',
        music: '🎉 Upbeat Social'
      }
    },
    {
      id: 'workspace-zone',
      name: 'Focus Workspace',
      type: 'workspace',
      capacity: 6,
      occupied: 3,
      users: [
        { name: 'Dev', mood: '💻', activity: 'Coding session' },
        { name: 'Writer', mood: '✍️', activity: 'Creative writing' },
        { name: 'Designer', mood: '🎨', activity: 'Design work' }
      ],
      position: { x: 70, y: 35, width: 25, height: 20 },
      theme: {
        gradient: 'from-slate-900/40 to-gray-900/40',
        accent: 'border-slate-400/50',
        music: '🎧 Focus Beats'
      }
    },
    {
      id: 'counter-seats',
      name: 'Coffee Counter',
      type: 'counter',
      capacity: 5,
      occupied: 3,
      users: [
        { name: 'Barista', mood: '☕', activity: 'Coffee chat' },
        { name: 'Emma', mood: '📱', activity: 'Quick break' },
        { name: 'Chris', mood: '🍰', activity: 'Pastry tasting' }
      ],
      position: { x: 15, y: 70, width: 70, height: 15 },
      theme: {
        gradient: 'from-amber-900/40 to-yellow-900/40',
        accent: 'border-amber-400/50',
        music: '☕ Barista Beats'
      }
    }
  ];

  const getOccupancyColor = (occupied: number, capacity: number) => {
    const ratio = occupied / capacity;
    if (ratio < 0.5) return 'text-green-400';
    if (ratio < 0.8) return 'text-yellow-400';
    return 'text-red-400';
  };

  const [floorPlanMode, setFloorPlanMode] = useState<"official" | "3d">("official");

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-white">
              <MapPin className="h-5 w-5" />
              Choose Your Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-white/80 text-sm">Each zone offers unique vibes and community</p>
          </CardContent>
        </Card>
        <div className="flex gap-2">
          <Button
            onClick={() => setFloorPlanMode(floorPlanMode === "official" ? "3d" : "official")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {floorPlanMode === "official" ? (
              <>
                <Maximize2 className="h-4 w-4 mr-2" />
                3D View
              </>
            ) : (
              <>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Official Plan
              </>
            )}
          </Button>
          <Button
            onClick={() => onViewChange("overview")}
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hub
          </Button>
        </div>
      </div>

      {/* Main Floor Plan */}
      <div className="absolute inset-0 pt-24 pb-4 px-4">
        <div className="relative w-full h-full">
          {floorPlanMode === "official" ? (
            <CafeOfficialSeatingPlan onSeatSelect={onSeatSelect} />
          ) : (
            // Fallback to previous immersive 3D
            <Enhanced3DSeatingView onBack={() => setFloorPlanMode("official")} />
          )}
        </div>
      </div>
      {/* Area Details Popup */}
      {hoveredSeat && (
        <div className="absolute bottom-20 left-8 z-30 max-w-sm">
          <Card className="bg-black/80 backdrop-blur-xl border-white/20">
            <CardContent className="p-4">
              {(() => {
                const area = seatAreas.find(a => a.id === hoveredSeat);
                if (!area) return null;
                
                return (
                  <>
                    <h3 className="text-white font-bold mb-2">{area.name}</h3>
                    <div className="text-white/80 text-sm mb-3">{area.theme.music}</div>
                    <div className="space-y-1 mb-3">
                      {area.users.map((user, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <span className="text-base">{user.mood}</span>
                          <span className="text-white font-medium">{user.name}</span>
                          <span className="text-white/60">- {user.activity}</span>
                        </div>
                      ))}
                    </div>
                    <Badge className="bg-purple-600/80 text-white border-purple-400/50">
                      Click to join this zone
                    </Badge>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
