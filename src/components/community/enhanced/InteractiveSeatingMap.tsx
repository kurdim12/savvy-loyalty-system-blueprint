
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  Search, 
  Maximize, 
  Minimize, 
  Coffee, 
  Users,
  MapPin,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface Seat {
  id: string;
  x: number;
  y: number;
  occupant?: {
    name: string;
    status: 'available' | 'occupied' | 'reserved';
    activity?: string;
  };
}

interface Zone {
  id: string;
  name: string;
  color: string;
  bounds: { x: number; y: number; width: number; height: number };
  seats: Seat[];
  expanded: boolean;
}

const ZONES: Zone[] = [
  {
    id: 'window',
    name: 'Window Seating',
    color: 'rgba(59, 130, 246, 0.1)',
    bounds: { x: 50, y: 50, width: 300, height: 150 },
    seats: Array.from({ length: 12 }, (_, i) => ({
      id: `window-${i + 1}`,
      x: 70 + (i % 4) * 60,
      y: 70 + Math.floor(i / 4) * 40,
      occupant: i < 3 ? {
        name: `User ${i + 1}`,
        status: 'occupied' as const,
        activity: 'Enjoying the view'
      } : undefined
    })),
    expanded: false
  },
  {
    id: 'work',
    name: 'Work Zone',
    color: 'rgba(34, 197, 94, 0.1)',
    bounds: { x: 400, y: 50, width: 350, height: 200 },
    seats: Array.from({ length: 20 }, (_, i) => ({
      id: `work-${i + 1}`,
      x: 420 + (i % 5) * 60,
      y: 70 + Math.floor(i / 5) * 40,
      occupant: i < 8 ? {
        name: `Professional ${i + 1}`,
        status: 'occupied' as const,
        activity: 'Deep work session'
      } : undefined
    })),
    expanded: true
  },
  {
    id: 'cozy',
    name: 'Cozy Corner',
    color: 'rgba(168, 85, 247, 0.1)',
    bounds: { x: 50, y: 250, width: 250, height: 180 },
    seats: Array.from({ length: 8 }, (_, i) => ({
      id: `cozy-${i + 1}`,
      x: 70 + (i % 3) * 70,
      y: 270 + Math.floor(i / 3) * 50,
      occupant: i < 2 ? {
        name: `Cozy ${i + 1}`,
        status: 'occupied' as const,
        activity: 'Relaxing with coffee'
      } : undefined
    })),
    expanded: false
  },
  {
    id: 'quiet',
    name: 'Quiet Zone',
    color: 'rgba(245, 158, 11, 0.1)',
    bounds: { x: 350, y: 300, width: 300, height: 150 },
    seats: Array.from({ length: 10 }, (_, i) => ({
      id: `quiet-${i + 1}`,
      x: 370 + (i % 4) * 65,
      y: 320 + Math.floor(i / 4) * 45,
      occupant: i < 4 ? {
        name: `Reader ${i + 1}`,
        status: 'occupied' as const,
        activity: 'Reading quietly'
      } : undefined
    })),
    expanded: false
  },
  {
    id: 'design',
    name: 'Interior Design Table',
    color: 'rgba(236, 72, 153, 0.1)',
    bounds: { x: 700, y: 250, width: 200, height: 120 },
    seats: Array.from({ length: 6 }, (_, i) => ({
      id: `design-${i + 1}`,
      x: 720 + (i % 2) * 80,
      y: 270 + Math.floor(i / 2) * 40,
      occupant: i < 1 ? {
        name: 'Designer 1',
        status: 'occupied' as const,
        activity: 'Creative brainstorming'
      } : undefined
    })),
    expanded: false
  },
  {
    id: 'counter',
    name: 'Coffee Counter',
    color: 'rgba(139, 69, 19, 0.15)',
    bounds: { x: 800, y: 50, width: 180, height: 100 },
    seats: Array.from({ length: 6 }, (_, i) => ({
      id: `counter-${i + 1}`,
      x: 820 + i * 25,
      y: 80,
      occupant: i < 2 ? {
        name: `Counter ${i + 1}`,
        status: 'occupied' as const,
        activity: 'Quick coffee break'
      } : undefined
    })),
    expanded: false
  }
];

export const InteractiveSeatingMap = () => {
  const [zones, setZones] = useState<Zone[]>(ZONES);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoom = (delta: number) => {
    setScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleZoneToggle = (zoneId: string) => {
    setZones(prev => prev.map(zone => 
      zone.id === zoneId 
        ? { ...zone, expanded: !zone.expanded }
        : zone
    ));
  };

  const handleSeatClick = (seatId: string) => {
    setSelectedSeat(seatId);
    console.log('Seat selected:', seatId);
  };

  const handleMiniMapZoneClick = (zone: Zone) => {
    const centerX = zone.bounds.x + zone.bounds.width / 2;
    const centerY = zone.bounds.y + zone.bounds.height / 2;
    setPan({ x: -centerX * scale + 400, y: -centerY * scale + 300 });
    setScale(1.5);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const filteredSeats = zones.flatMap(zone => zone.seats).filter(seat =>
    seat.occupant?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      ref={containerRef}
      className={`relative w-full bg-gradient-to-br from-stone-50 to-amber-50 border rounded-lg overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50' : 'h-[80vh]'
      }`}
    >
      {/* Toolbar */}
      <div className={`absolute top-4 left-4 z-20 transition-all duration-300 ${
        toolbarCollapsed ? 'w-12' : 'w-64'
      }`}>
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-semibold text-stone-800 ${toolbarCollapsed ? 'hidden' : 'block'}`}>
              Controls
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setToolbarCollapsed(!toolbarCollapsed)}
            >
              {toolbarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          
          {!toolbarCollapsed && (
            <div className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 text-sm"
                />
              </div>

              {/* Zoom Controls */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleZoom(0.2)}
                  className="flex-1"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleZoom(-0.2)}
                  className="flex-1"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </div>

              {/* Fullscreen Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-full"
              >
                {isFullscreen ? <Minimize className="h-4 w-4 mr-2" /> : <Maximize className="h-4 w-4 mr-2" />}
                {isFullscreen ? 'Exit' : 'Fullscreen'}
              </Button>

              {/* Zone List */}
              <div className="space-y-1">
                <h4 className="text-xs font-medium text-gray-600">Zones</h4>
                {zones.map(zone => (
                  <button
                    key={zone.id}
                    onClick={() => handleZoneToggle(zone.id)}
                    className="w-full text-left p-2 rounded text-sm hover:bg-gray-100 flex items-center justify-between"
                  >
                    <span>{zone.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {zone.seats.filter(s => s.occupant).length}/{zone.seats.length}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mini Map */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border p-3">
          <h4 className="text-xs font-medium text-gray-600 mb-2">Mini Map</h4>
          <svg width="120" height="80" className="border rounded">
            {zones.map(zone => (
              <rect
                key={zone.id}
                x={zone.bounds.x / 10}
                y={zone.bounds.y / 6}
                width={zone.bounds.width / 10}
                height={zone.bounds.height / 6}
                fill={zone.color}
                stroke={zone.expanded ? '#8B4513' : '#D1D5DB'}
                strokeWidth={zone.expanded ? 2 : 1}
                className="cursor-pointer hover:opacity-80"
                onClick={() => handleMiniMapZoneClick(zone)}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Main SVG Canvas */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 1000 500"
        className="cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}>
          {/* Zone Backgrounds */}
          {zones.map(zone => (
            <g key={zone.id}>
              <rect
                x={zone.bounds.x}
                y={zone.bounds.y}
                width={zone.bounds.width}
                height={zone.bounds.height}
                fill={zone.color}
                stroke={zone.expanded ? '#8B4513' : 'transparent'}
                strokeWidth={zone.expanded ? 2 : 0}
                rx={8}
                className="transition-all duration-300"
              />
              
              {/* Zone Header */}
              <rect
                x={zone.bounds.x}
                y={zone.bounds.y - 25}
                width={zone.bounds.width}
                height={25}
                fill="rgba(255, 255, 255, 0.9)"
                stroke="#8B4513"
                strokeWidth={1}
                rx={4}
                className="cursor-pointer"
                onClick={() => handleZoneToggle(zone.id)}
              />
              
              <text
                x={zone.bounds.x + 10}
                y={zone.bounds.y - 8}
                fontSize="12"
                fill="#8B4513"
                fontWeight="600"
                className="pointer-events-none select-none"
              >
                {zone.name} ({zone.seats.filter(s => s.occupant).length}/{zone.seats.length})
              </text>

              {/* Seats */}
              {zone.expanded && zone.seats.map(seat => {
                const isHighlighted = searchTerm && seat.occupant?.name.toLowerCase().includes(searchTerm.toLowerCase());
                const isOccupied = !!seat.occupant;
                const isSelected = selectedSeat === seat.id;
                const isHovered = hoveredSeat === seat.id;
                
                return (
                  <g key={seat.id}>
                    <circle
                      cx={seat.x}
                      cy={seat.y}
                      r={16}
                      fill={isOccupied ? '#8B4513' : '#F5F5DC'}
                      stroke={isSelected ? '#F59E0B' : isOccupied ? '#654321' : '#D1D5DB'}
                      strokeWidth={isSelected ? 3 : 2}
                      opacity={searchTerm && !isHighlighted ? 0.3 : 1}
                      className="cursor-pointer transition-all duration-200"
                      onClick={() => handleSeatClick(seat.id)}
                      onMouseEnter={() => setHoveredSeat(seat.id)}
                      onMouseLeave={() => setHoveredSeat(null)}
                    />
                    
                    <Coffee
                      x={seat.x - 8}
                      y={seat.y - 8}
                      width={16}
                      height={16}
                      className={`pointer-events-none ${isOccupied ? 'text-white' : 'text-stone-600'}`}
                    />
                    
                    {isOccupied && (
                      <circle
                        cx={seat.x + 12}
                        cy={seat.y - 12}
                        r={6}
                        fill="#22C55E"
                        stroke="white"
                        strokeWidth={2}
                      />
                    )}
                  </g>
                );
              })}
            </g>
          ))}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredSeat && (
        <div className="absolute bottom-20 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border max-w-xs z-30">
          {(() => {
            const seat = zones.flatMap(z => z.seats).find(s => s.id === hoveredSeat);
            return seat ? (
              <div>
                <div className="font-semibold text-stone-800 mb-1">Seat {seat.id}</div>
                {seat.occupant ? (
                  <div>
                    <div className="text-sm text-stone-600">{seat.occupant.name}</div>
                    <div className="text-xs text-gray-500">{seat.occupant.activity}</div>
                    <Badge className="mt-1 bg-green-500 text-white">Occupied</Badge>
                  </div>
                ) : (
                  <Badge className="bg-blue-500 text-white">Available</Badge>
                )}
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* Status Bar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border px-4 py-2 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-stone-600" />
            <span className="text-sm text-stone-600">
              {zones.flatMap(z => z.seats).filter(s => s.occupant).length} occupied
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-stone-600" />
            <span className="text-sm text-stone-600">
              Zoom: {Math.round(scale * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
