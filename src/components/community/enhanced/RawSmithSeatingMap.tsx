
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Move, ChevronLeft, ChevronRight } from 'lucide-react';

interface Avatar {
  id: string;
  name: string;
  tableId: string;
  seatNumber: number;
  image: string;
}

interface Table {
  id: string;
  x: number;
  y: number;
  zone: 'indoor' | 'outdoor';
  seats: number;
}

const AVATARS: Avatar[] = [
  {
    id: 'muneeb',
    name: 'Muneeb',
    tableId: 'M-1',
    seatNumber: 1,
    image: '/lovable-uploads/39132ee6-42b3-4b01-870f-94e48824564e.png'
  },
  {
    id: 'ahmed',
    name: 'Ahmed',
    tableId: 'A-2',
    seatNumber: 2,
    image: '/lovable-uploads/0c863e72-077f-47c9-834c-6e18a265b32e.png'
  },
  {
    id: 'joy',
    name: 'Joy',
    tableId: 'J-3',
    seatNumber: 3,
    image: '/lovable-uploads/ab6d4d21-cc4f-44b8-b6de-88a3f7d02997.png'
  }
];

const INDOOR_TABLES: Table[] = [
  { id: 'M-1', x: 25, y: 45, zone: 'indoor', seats: 4 },
  { id: 'table-2', x: 45, y: 45, zone: 'indoor', seats: 4 },
  { id: 'J-3', x: 65, y: 45, zone: 'indoor', seats: 4 },
  { id: 'A-2', x: 25, y: 65, zone: 'indoor', seats: 4 },
  { id: 'table-5', x: 45, y: 65, zone: 'indoor', seats: 4 },
  { id: 'table-6', x: 65, y: 65, zone: 'indoor', seats: 4 }
];

const OUTDOOR_TABLES: Table[] = [
  { id: 'outdoor-1', x: 15, y: 80, zone: 'outdoor', seats: 2 },
  { id: 'outdoor-2', x: 35, y: 80, zone: 'outdoor', seats: 2 },
  { id: 'outdoor-3', x: 55, y: 80, zone: 'outdoor', seats: 2 }
];

export const RawSmithSeatingMap = () => {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [toolbarCollapsed, setToolbarCollapsed] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPanMode, setIsPanMode] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoom = (delta: number) => {
    setScale(prev => Math.max(0.5, Math.min(2.5, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPanMode) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isPanMode) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getAvatarForTable = (tableId: string, seatNumber: number = 1) => {
    return AVATARS.find(avatar => avatar.tableId === tableId && avatar.seatNumber === seatNumber);
  };

  const renderTable = (table: Table) => {
    const avatar = getAvatarForTable(table.id);
    const isHovered = hoveredElement === table.id;
    
    return (
      <g key={table.id}>
        {/* Table */}
        <circle
          cx={table.x}
          cy={table.y}
          r="8"
          fill="#8B4513"
          stroke="#654321"
          strokeWidth="1"
          className="transition-all duration-200"
          style={{
            filter: isHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }}
          onMouseEnter={() => setHoveredElement(table.id)}
          onMouseLeave={() => setHoveredElement(null)}
        />
        
        {/* Chair positions */}
        {Array.from({ length: table.seats }, (_, i) => {
          const angle = (i * 360) / table.seats;
          const chairX = table.x + Math.cos((angle * Math.PI) / 180) * 15;
          const chairY = table.y + Math.sin((angle * Math.PI) / 180) * 15;
          
          return (
            <circle
              key={`${table.id}-chair-${i}`}
              cx={chairX}
              cy={chairY}
              r="4"
              fill="#DEB887"
              stroke="#8B7355"
              strokeWidth="0.5"
            />
          );
        })}
        
        {/* Avatar if present */}
        {avatar && (
          <g>
            <circle
              cx={table.x}
              cy={table.y - 20}
              r="12"
              fill="white"
              stroke="#22C55E"
              strokeWidth="2"
            />
            <image
              href={avatar.image}
              x={table.x - 10}
              y={table.y - 30}
              width="20"
              height="20"
              clipPath="circle(10px at 10px 10px)"
            />
          </g>
        )}
      </g>
    );
  };

  return (
    <div className="w-full h-[80vh] bg-gradient-to-br from-stone-100 to-amber-50 relative overflow-hidden rounded-lg border border-stone-300">
      {/* Toolbar */}
      <div className={`absolute top-4 left-4 z-20 transition-all duration-300 ${
        toolbarCollapsed ? 'w-12' : 'w-48'
      }`}>
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-semibold text-stone-800 text-sm ${toolbarCollapsed ? 'hidden' : 'block'}`}>
              Controls
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setToolbarCollapsed(!toolbarCollapsed)}
            >
              {toolbarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
          
          {!toolbarCollapsed && (
            <div className="space-y-3">
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

              {/* Pan Toggle */}
              <Button
                variant={isPanMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsPanMode(!isPanMode)}
                className="w-full"
              >
                <Move className="h-4 w-4 mr-2" />
                {isPanMode ? 'Pan Mode ON' : 'Pan Mode'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas */}
      <div
        ref={containerRef}
        className={`w-full h-full ${isPanMode ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`
          }}
        >
          {/* Background */}
          <rect width="100" height="100" fill="url(#cafeGradient)" />
          
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="cafeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FAF6F0" />
              <stop offset="100%" stopColor="#F5E6D3" />
            </linearGradient>
            <linearGradient id="counterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2C2C2C" />
              <stop offset="100%" stopColor="#1A1A1A" />
            </linearGradient>
          </defs>

          {/* Coffee Bar Counter */}
          <g>
            {/* Counter Base */}
            <rect
              x="10"
              y="15"
              width="80"
              height="15"
              fill="url(#counterGradient)"
              rx="2"
              style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
            />
            
            {/* Backsplash */}
            <rect
              x="12"
              y="8"
              width="76"
              height="7"
              fill="#1A1A1A"
              rx="1"
            />
            
            {/* Floating Shelves */}
            <rect x="15" y="5" width="25" height="2" fill="#8B4513" rx="1" />
            <rect x="45" y="5" width="25" height="2" fill="#8B4513" rx="1" />
            <rect x="75" y="5" width="10" height="2" fill="#8B4513" rx="1" />
            
            {/* Coffee Equipment */}
            <rect x="20" y="17" width="8" height="10" fill="#333" rx="1" />
            <rect x="35" y="17" width="6" height="8" fill="#444" rx="1" />
            <rect x="50" y="17" width="4" height="6" fill="#666" rx="0.5" />
            
            {/* Barista Position */}
            <circle
              cx="50"
              cy="35"
              r="6"
              fill="#8B4513"
              stroke="#654321"
              strokeWidth="1"
            />
            <text
              x="50"
              y="39"
              textAnchor="middle"
              fontSize="3"
              fill="white"
              fontWeight="bold"
            >
              BARISTA
            </text>
          </g>

          {/* Window Frame (for outdoor view) */}
          <g>
            <rect
              x="5"
              y="70"
              width="90"
              height="25"
              fill="rgba(255,255,255,0.1)"
              stroke="#8B4513"
              strokeWidth="1"
              rx="2"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
            />
            <line x1="50" y1="70" x2="50" y2="95" stroke="#8B4513" strokeWidth="0.5" />
            <line x1="5" y1="82.5" x2="95" y2="82.5" stroke="#8B4513" strokeWidth="0.5" />
          </g>

          {/* Indoor Zone Background */}
          <rect
            x="15"
            y="40"
            width="70"
            height="30"
            fill="rgba(139, 69, 19, 0.05)"
            rx="4"
            onMouseEnter={() => setHoveredElement('indoor-zone')}
            onMouseLeave={() => setHoveredElement(null)}
          />

          {/* Indoor Tables */}
          {INDOOR_TABLES.map(renderTable)}

          {/* Outdoor Zone (visible through window) */}
          <rect
            x="10"
            y="75"
            width="80"
            height="15"
            fill="rgba(34, 197, 94, 0.1)"
            rx="2"
            onMouseEnter={() => setHoveredElement('outdoor-zone')}
            onMouseLeave={() => setHoveredElement(null)}
          />

          {/* Outdoor Tables */}
          {OUTDOOR_TABLES.map(renderTable)}

          {/* Zone Labels (appear on hover) */}
          {hoveredElement === 'indoor-zone' && (
            <text
              x="50"
              y="43"
              textAnchor="middle"
              fontSize="4"
              fill="#8B4513"
              fontWeight="bold"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
            >
              🏠 Indoor Seating
            </text>
          )}
          
          {hoveredElement === 'outdoor-zone' && (
            <text
              x="50"
              y="78"
              textAnchor="middle"
              fontSize="4"
              fill="#22C55E"
              fontWeight="bold"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
            >
              🌿 Outdoor Terrace
            </text>
          )}
        </svg>
      </div>

      {/* Tooltip */}
      {hoveredElement && hoveredElement.includes('table') && (
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border max-w-xs z-30">
          {(() => {
            const table = [...INDOOR_TABLES, ...OUTDOOR_TABLES].find(t => t.id === hoveredElement);
            const avatar = getAvatarForTable(hoveredElement);
            return table ? (
              <div>
                <div className="font-semibold text-stone-800 mb-1">Table {table.id}</div>
                <div className="text-sm text-stone-600 mb-1">
                  {table.zone === 'indoor' ? '🏠 Indoor' : '🌿 Outdoor'} • {table.seats} seats
                </div>
                {avatar ? (
                  <div className="flex items-center gap-2">
                    <img src={avatar.image} alt={avatar.name} className="w-6 h-6 rounded-full" />
                    <span className="text-sm text-green-600 font-medium">{avatar.name} is here</span>
                  </div>
                ) : (
                  <span className="text-sm text-blue-600">Available</span>
                )}
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* Status Bar */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border px-4 py-2 flex items-center gap-4">
          <div className="text-sm text-stone-600">
            Zoom: {Math.round(scale * 100)}%
          </div>
          <div className="text-sm text-stone-600">
            {AVATARS.length} users online
          </div>
        </div>
      </div>
    </div>
  );
};
