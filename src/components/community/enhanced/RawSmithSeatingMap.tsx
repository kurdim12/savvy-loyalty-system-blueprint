
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface Avatar {
  id: string;
  name: string;
  tableId: string;
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
    image: '/lovable-uploads/39132ee6-42b3-4b01-870f-94e48824564e.png'
  },
  {
    id: 'ahmed',
    name: 'Ahmed',
    tableId: 'A-2',
    image: '/lovable-uploads/0c863e72-077f-47c9-834c-6e18a265b32e.png'
  },
  {
    id: 'joy',
    name: 'Joy',
    tableId: 'J-3',
    image: '/lovable-uploads/ab6d4d21-cc4f-44b8-b6de-88a3f7d02997.png'
  }
];

const INDOOR_TABLES: Table[] = [
  { id: 'M-1', x: 25, y: 45, zone: 'indoor', seats: 4 },
  { id: 'table-2', x: 50, y: 45, zone: 'indoor', seats: 4 },
  { id: 'J-3', x: 75, y: 45, zone: 'indoor', seats: 4 },
  { id: 'A-2', x: 25, y: 65, zone: 'indoor', seats: 4 },
  { id: 'table-5', x: 50, y: 65, zone: 'indoor', seats: 4 },
  { id: 'table-6', x: 75, y: 65, zone: 'indoor', seats: 4 }
];

const OUTDOOR_TABLES: Table[] = [
  { id: 'outdoor-1', x: 20, y: 85, zone: 'outdoor', seats: 2 },
  { id: 'outdoor-2', x: 50, y: 85, zone: 'outdoor', seats: 2 },
  { id: 'outdoor-3', x: 80, y: 85, zone: 'outdoor', seats: 2 }
];

export const RawSmithSeatingMap = () => {
  const [scale, setScale] = useState(1);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);

  const handleZoom = (delta: number) => {
    setScale(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const resetView = () => {
    setScale(1);
  };

  const getAvatarForTable = (tableId: string) => {
    return AVATARS.find(avatar => avatar.tableId === tableId);
  };

  const renderTable = (table: Table) => {
    const avatar = getAvatarForTable(table.id);
    const isHovered = hoveredTable === table.id;
    
    return (
      <g key={table.id}>
        {/* Table */}
        <circle
          cx={table.x}
          cy={table.y}
          r="6"
          fill="#8B4513"
          stroke="#654321"
          strokeWidth="1"
          className="transition-all duration-200"
          style={{
            filter: isHovered ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none'
          }}
          onMouseEnter={() => setHoveredTable(table.id)}
          onMouseLeave={() => setHoveredTable(null)}
        />
        
        {/* Chair positions */}
        {Array.from({ length: table.seats }, (_, i) => {
          const angle = (i * 360) / table.seats;
          const chairX = table.x + Math.cos((angle * Math.PI) / 180) * 12;
          const chairY = table.y + Math.sin((angle * Math.PI) / 180) * 12;
          
          return (
            <circle
              key={`${table.id}-chair-${i}`}
              cx={chairX}
              cy={chairY}
              r="3"
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
              cy={table.y - 15}
              r="8"
              fill="white"
              stroke="#22C55E"
              strokeWidth="1.5"
            />
            <image
              href={avatar.image}
              x={table.x - 6}
              y={table.y - 21}
              width="12"
              height="12"
              clipPath="circle(6px at 6px 6px)"
            />
          </g>
        )}
        
        {/* Table ID */}
        <text
          x={table.x}
          y={table.y + 20}
          textAnchor="middle"
          fontSize="3"
          fill="#8B4513"
          fontWeight="bold"
        >
          {table.id}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full h-[80vh] bg-gradient-to-br from-stone-50 to-amber-50 relative overflow-hidden rounded-lg border border-stone-200">
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg shadow-md border p-3">
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(0.2)}
            className="w-full"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleZoom(-0.2)}
            className="w-full"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetView}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="w-full h-full">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{
            transform: `scale(${scale})`
          }}
        >
          {/* Background */}
          <rect width="100" height="100" fill="url(#cafeGradient)" />
          
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="cafeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FAF6F0" />
              <stop offset="100%" stopColor="#F5E6D3" />
            </linearGradient>
          </defs>

          {/* Coffee Bar */}
          <rect
            x="10"
            y="15"
            width="80"
            height="12"
            fill="#2C2C2C"
            rx="2"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
          />
          
          {/* Barista Position */}
          <circle
            cx="50"
            cy="21"
            r="4"
            fill="white"
            stroke="#8B4513"
            strokeWidth="1"
          />
          <text
            x="50"
            y="25"
            textAnchor="middle"
            fontSize="2.5"
            fill="#8B4513"
            fontWeight="bold"
          >
            Muneeb (Barista)
          </text>

          {/* Indoor Zone Background */}
          <rect
            x="15"
            y="35"
            width="70"
            height="35"
            fill="rgba(139, 69, 19, 0.05)"
            rx="4"
            stroke="rgba(139, 69, 19, 0.1)"
            strokeWidth="1"
          />
          
          {/* Indoor Zone Label */}
          <text
            x="20"
            y="40"
            fontSize="3"
            fill="#8B4513"
            fontWeight="bold"
          >
            Indoor Seating
          </text>

          {/* Indoor Tables */}
          {INDOOR_TABLES.map(renderTable)}

          {/* Outdoor Zone Background */}
          <rect
            x="10"
            y="75"
            width="80"
            height="20"
            fill="rgba(34, 197, 94, 0.05)"
            rx="4"
            stroke="rgba(34, 197, 94, 0.1)"
            strokeWidth="1"
          />
          
          {/* Outdoor Zone Label */}
          <text
            x="15"
            y="80"
            fontSize="3"
            fill="#22C55E"
            fontWeight="bold"
          >
            Outdoor Terrace
          </text>

          {/* Outdoor Tables */}
          {OUTDOOR_TABLES.map(renderTable)}
        </svg>
      </div>

      {/* Tooltip */}
      {hoveredTable && (
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border max-w-xs z-30">
          {(() => {
            const table = [...INDOOR_TABLES, ...OUTDOOR_TABLES].find(t => t.id === hoveredTable);
            const avatar = getAvatarForTable(hoveredTable);
            return table ? (
              <div>
                <div className="font-semibold text-stone-800 mb-1">Table {table.id}</div>
                <div className="text-sm text-stone-600 mb-1">
                  {table.zone === 'indoor' ? 'Indoor' : 'Outdoor'} • {table.seats} seats
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

      {/* Status */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border px-3 py-2">
          <div className="text-sm text-stone-600">
            Zoom: {Math.round(scale * 100)}% | {AVATARS.length} users online
          </div>
        </div>
      </div>
    </div>
  );
};
