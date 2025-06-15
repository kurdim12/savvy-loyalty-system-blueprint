
import React, { useState } from "react";

// Precise coordinate mapping for the isometric layout
const SEATING_ZONES = [
  // Bar Counter Stools
  { id: 'bar-stool-1', x: 15, y: 20, w: 4, h: 4, type: 'bar', zone: 'indoor' },
  { id: 'bar-stool-2', x: 20, y: 20, w: 4, h: 4, type: 'bar', zone: 'indoor' },
  { id: 'bar-stool-3', x: 25, y: 20, w: 4, h: 4, type: 'bar', zone: 'indoor' },
  { id: 'bar-stool-4', x: 30, y: 20, w: 4, h: 4, type: 'bar', zone: 'indoor' },
  { id: 'bar-stool-5', x: 35, y: 20, w: 4, h: 4, type: 'bar', zone: 'indoor' },
  
  // Indoor Tables (Left Side)
  { id: 'table-1', x: 10, y: 35, w: 8, h: 6, type: 'table', zone: 'indoor', capacity: 4 },
  { id: 'table-2', x: 25, y: 35, w: 8, h: 6, type: 'table', zone: 'indoor', capacity: 4 },
  { id: 'table-3', x: 40, y: 35, w: 8, h: 6, type: 'table', zone: 'indoor', capacity: 4 },
  
  // Indoor Tables (Right Side)
  { id: 'table-4', x: 10, y: 50, w: 8, h: 6, type: 'table', zone: 'indoor', capacity: 4 },
  { id: 'table-5', x: 25, y: 50, w: 8, h: 6, type: 'table', zone: 'indoor', capacity: 4 },
  { id: 'table-6', x: 40, y: 50, w: 8, h: 6, type: 'table', zone: 'indoor', capacity: 4 },
  
  // Outdoor Terrace Tables
  { id: 'outdoor-1', x: 12, y: 70, w: 6, h: 5, type: 'table', zone: 'outdoor', capacity: 2 },
  { id: 'outdoor-2', x: 22, y: 70, w: 6, h: 5, type: 'table', zone: 'outdoor', capacity: 2 },
  { id: 'outdoor-3', x: 32, y: 70, w: 6, h: 5, type: 'table', zone: 'outdoor', capacity: 2 },
  { id: 'outdoor-4', x: 42, y: 70, w: 6, h: 5, type: 'table', zone: 'outdoor', capacity: 2 },
  
  // Lounge Area
  { id: 'lounge-chair-1', x: 60, y: 35, w: 5, h: 5, type: 'lounge', zone: 'lounge' },
  { id: 'lounge-chair-2', x: 68, y: 35, w: 5, h: 5, type: 'lounge', zone: 'lounge' },
  { id: 'lounge-chair-3', x: 60, y: 45, w: 5, h: 5, type: 'lounge', zone: 'lounge' },
  { id: 'lounge-chair-4', x: 68, y: 45, w: 5, h: 5, type: 'lounge', zone: 'lounge' },
  
  // Corner Booth
  { id: 'corner-booth', x: 60, y: 60, w: 12, h: 8, type: 'booth', zone: 'lounge', capacity: 6 }
];

const ZONE_COLORS = {
  indoor: { bg: 'rgba(139, 69, 19, 0.1)', border: '#8B4513', name: '🏠 Indoor Café' },
  outdoor: { bg: 'rgba(34, 197, 94, 0.1)', border: '#22C55E', name: '🌿 Outdoor Terrace' },
  lounge: { bg: 'rgba(147, 51, 234, 0.1)', border: '#9333EA', name: '🛋️ Lounge Area' }
};

const SEAT_DESCRIPTIONS = {
  bar: "🪑 Bar counter seating - Perfect for quick coffee and casual conversations",
  table: "☕ Table seating - Ideal for meetings, work, and dining",
  lounge: "🛋️ Comfortable lounge seating - Great for relaxed conversations",
  booth: "🏝️ Private booth - Quiet space for intimate conversations"
};

export const CafeOfficialSeatingPlan: React.FC<{
  onSeatSelect?: (seatId: string) => void;
  selectedSeat?: string | null;
  hideHeader?: boolean;
  onlineUsers?: Array<{ seatId: string; name: string; mood: string }>;
}> = ({ onSeatSelect, selectedSeat, hideHeader, onlineUsers = [] }) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  const [showZoneLabels, setShowZoneLabels] = useState(true);

  const handleSeatClick = (seatId: string) => {
    if (onSeatSelect) {
      onSeatSelect(seatId);
    }
  };

  const getSeatOccupancy = (seatId: string) => {
    return onlineUsers.filter(user => user.seatId === seatId);
  };

  const getZoneStats = (zone: string) => {
    const zoneSeats = SEATING_ZONES.filter(seat => seat.zone === zone);
    const occupiedSeats = zoneSeats.filter(seat => getSeatOccupancy(seat.id).length > 0);
    return {
      total: zoneSeats.length,
      occupied: occupiedSeats.length,
      available: zoneSeats.length - occupiedSeats.length
    };
  };

  return (
    <div className="w-full" style={{ backgroundColor: '#f5f0e7' }}>
      {/* Header */}
      {!hideHeader && (
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">RAW SMITH CAFÉ - INTERACTIVE SEATING</h2>
          <p className="text-sm text-stone-600">Click any seat to join the area chat and connect with nearby coffee lovers</p>
          
          {/* Zone Statistics */}
          <div className="flex justify-center gap-6 mt-4">
            {Object.entries(ZONE_COLORS).map(([zone, config]) => {
              const stats = getZoneStats(zone);
              return (
                <div key={zone} className="text-center">
                  <div className="text-lg font-semibold" style={{ color: config.border }}>
                    {config.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {stats.occupied}/{stats.total} occupied
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Interactive Canvas */}
      <div
        className="relative w-full mx-auto border-2 border-stone-400 rounded-lg shadow-2xl overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{
          aspectRatio: "4/3",
          maxWidth: "95vw",
          height: hideHeader ? "70vh" : "calc(100vh - 200px)",
          backgroundImage: "url('/lovable-uploads/7ddcf203-b9d9-4773-bf53-d70372417ee7.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Zone Overlay Labels */}
        {showZoneLabels && Object.entries(ZONE_COLORS).map(([zone, config]) => {
          const zoneSeats = SEATING_ZONES.filter(seat => seat.zone === zone);
          if (zoneSeats.length === 0) return null;
          
          const avgX = zoneSeats.reduce((sum, seat) => sum + seat.x, 0) / zoneSeats.length;
          const avgY = zoneSeats.reduce((sum, seat) => sum + seat.y, 0) / zoneSeats.length;
          
          return (
            <div
              key={zone}
              className="absolute bg-white/95 px-3 py-2 rounded-lg shadow-lg text-sm font-semibold pointer-events-none"
              style={{
                left: `${avgX}%`,
                top: `${avgY - 8}%`,
                transform: 'translate(-50%, -50%)',
                color: config.border,
                border: `2px solid ${config.border}`,
                zIndex: 10
              }}
            >
              {config.name}
            </div>
          );
        })}

        {/* Interactive Seating Zones */}
        {SEATING_ZONES.map((seat) => {
          const occupants = getSeatOccupancy(seat.id);
          const isOccupied = occupants.length > 0;
          const isSelected = selectedSeat === seat.id;
          const isHovered = hoveredSeat === seat.id;
          
          return (
            <div
              key={seat.id}
              className="absolute cursor-pointer transition-all duration-200 hover:scale-105"
              style={{
                left: `${seat.x}%`,
                top: `${seat.y}%`,
                width: `${seat.w}%`,
                height: `${seat.h}%`,
                backgroundColor: isSelected 
                  ? 'rgba(245, 158, 11, 0.4)' 
                  : isHovered 
                    ? 'rgba(245, 158, 11, 0.2)' 
                    : 'rgba(139, 69, 19, 0.1)',
                border: isSelected 
                  ? '3px solid #f59e0b' 
                  : isHovered 
                    ? '2px solid #f59e0b' 
                    : '1px solid rgba(139, 69, 19, 0.3)',
                borderRadius: '8px',
                zIndex: isHovered || isSelected ? 25 : 15,
                backdropFilter: 'blur(1px)'
              }}
              onClick={() => handleSeatClick(seat.id)}
              onMouseEnter={() => setHoveredSeat(seat.id)}
              onMouseLeave={() => setHoveredSeat(null)}
            >
              {/* Occupancy Indicators */}
              {isOccupied && (
                <div className="absolute -top-2 -right-2 flex flex-wrap gap-1">
                  {occupants.slice(0, 3).map((user, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 bg-green-500 rounded-full border-2 border-white text-white text-xs flex items-center justify-center font-bold shadow-lg"
                      title={`${user.name} - ${user.mood}`}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {occupants.length > 3 && (
                    <div className="w-6 h-6 bg-gray-500 rounded-full border-2 border-white text-white text-xs flex items-center justify-center font-bold">
                      +{occupants.length - 3}
                    </div>
                  )}
                </div>
              )}
              
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute inset-0 border-4 border-amber-400 rounded-lg animate-pulse" />
              )}
            </div>
          );
        })}

        {/* Live Status Indicator */}
        <div className="absolute top-4 right-4 bg-green-600/90 text-white px-3 py-2 rounded-lg text-sm font-semibold animate-pulse flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          Live Interactive Layout
        </div>

        {/* Controls */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <button
            onClick={() => setShowZoneLabels(!showZoneLabels)}
            className="bg-white/90 hover:bg-white px-3 py-2 rounded-lg text-sm font-medium text-stone-700 shadow-lg transition-colors"
          >
            {showZoneLabels ? 'Hide' : 'Show'} Zone Labels
          </button>
        </div>

        {/* Seat Info Panel */}
        {hoveredSeat && (
          <div className="absolute bottom-4 left-4 bg-white/95 p-4 rounded-lg shadow-lg text-base max-w-sm border-l-4 border-amber-500">
            <div className="font-semibold text-stone-800 text-lg mb-2">{hoveredSeat}</div>
            <div className="text-stone-600 text-sm mb-2">
              {SEAT_DESCRIPTIONS[SEATING_ZONES.find(s => s.id === hoveredSeat)?.type || 'table']}
            </div>
            <div className="text-amber-600 font-medium text-sm">
              👆 Click to join this area's chat!
            </div>
            {getSeatOccupancy(hoveredSeat).length > 0 && (
              <div className="text-green-600 text-xs mt-1">
                🟢 {getSeatOccupancy(hoveredSeat).length} people here now
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/95 p-4 rounded-lg shadow-lg text-sm max-w-xs">
          <div className="font-semibold mb-3 text-base">How to Use</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-200 border-2 border-amber-500 rounded"></div>
              <span>Click any seat to join area chat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>Green dots = people online</span>
            </div>
            <div className="text-gray-600 mt-2">
              Real-time updates • Mobile friendly
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
