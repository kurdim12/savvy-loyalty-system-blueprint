
import React, { useState } from "react";
import { CafeIconMarker } from "./CafeIconMarker";

const GRID_SIZE = 60; // Increased for better visibility
const GRID_W = 20; // Wider grid
const GRID_H = 16; // Taller grid
const SIDE_MARGIN = 1;

// Updated background image reference
const BACKGROUND_IMAGE = "/lovable-uploads/d6d50dca-17f8-4715-bb02-fa8c3aead240.png";

const COLOR_INDOOR = "rgba(240,240,240,0.12)";
const COLOR_OUTDOOR = "rgba(220,200,180,0.08)";
const COLOR_VIP = "rgba(184,134,11,0.1)";

export const CafeOfficialSeatingPlan: React.FC<{
  onSeatSelect?: (seatId: string) => void;
  selectedSeat?: string | null;
  hideHeader?: boolean;
}> = ({ onSeatSelect, selectedSeat }) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  
  const snap = (n: number) => Math.round(n * 2) / 2; // 0.5m precision

  // Unique zone layout
  const mainIndoorZone = {
    x: 2,
    y: 1,
    w: GRID_W - 4,
    h: Math.round(GRID_H * 0.6)
  };
  
  const vipLounge = {
    x: 1,
    y: 1,
    w: 3,
    h: 6
  };
  
  const outdoorTerrace = {
    x: 0,
    y: Math.round(GRID_H * 0.65),
    w: GRID_W,
    h: GRID_H - Math.round(GRID_H * 0.65)
  };

  const handleSeatClick = (seatId: string) => {
    if (onSeatSelect) {
      onSeatSelect(seatId);
    }
  };

  const getSeatStyle = (seatId: string) => ({
    cursor: 'pointer',
    transform: hoveredSeat === seatId ? 'scale(1.1)' : 'scale(1)',
    transition: 'transform 0.2s ease',
    filter: selectedSeat === seatId ? 'drop-shadow(0 0 8px #f59e0b)' : 'none'
  });

  return (
    <div className="w-full h-screen bg-gradient-to-br from-amber-50 to-stone-100 p-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-stone-800 mb-2">RAW SMITH CAFÉ</h2>
        <p className="text-stone-600">Interactive Floor Plan - Click any seat to join</p>
      </div>

      {/* Main Floor Plan Container */}
      <div
        className="relative w-full mx-auto border-2 border-stone-300 rounded-xl shadow-2xl"
        style={{
          aspectRatio: `${GRID_W / GRID_H}`,
          maxWidth: "95vw",
          height: "calc(100vh - 200px)",
          background: "linear-gradient(135deg, #f5f0e8 0%, #e8ddd4 100%)",
          overflow: "hidden"
        }}
      >
        {/* Background Image */}
        <img
          src={BACKGROUND_IMAGE}
          alt="RAW SMITH Café reference"
          className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none select-none"
          style={{ zIndex: 1 }}
          draggable={false}
        />

        {/* Zone Overlays */}
        {/* VIP Lounge */}
        <div
          className="absolute border-2 border-amber-400 rounded-lg"
          style={{
            left: vipLounge.x * GRID_SIZE,
            top: vipLounge.y * GRID_SIZE,
            width: vipLounge.w * GRID_SIZE,
            height: vipLounge.h * GRID_SIZE,
            background: COLOR_VIP,
            zIndex: 5,
            pointerEvents: "none"
          }}
        >
          <span className="absolute left-2 top-2 text-amber-700 font-bold text-sm bg-amber-100 px-2 py-1 rounded">
            VIP Lounge
          </span>
        </div>

        {/* Main Indoor Area */}
        <div
          className="absolute border border-stone-300 rounded-lg"
          style={{
            left: mainIndoorZone.x * GRID_SIZE,
            top: mainIndoorZone.y * GRID_SIZE,
            width: mainIndoorZone.w * GRID_SIZE,
            height: mainIndoorZone.h * GRID_SIZE,
            background: COLOR_INDOOR,
            zIndex: 5,
            pointerEvents: "none"
          }}
        >
          <span className="absolute left-2 top-2 text-stone-700 font-semibold text-sm bg-white/80 px-2 py-1 rounded">
            Main Dining Area
          </span>
        </div>

        {/* Outdoor Terrace */}
        <div
          className="absolute border-2 border-green-400 rounded-lg"
          style={{
            left: outdoorTerrace.x * GRID_SIZE,
            top: outdoorTerrace.y * GRID_SIZE,
            width: outdoorTerrace.w * GRID_SIZE,
            height: outdoorTerrace.h * GRID_SIZE,
            background: COLOR_OUTDOOR,
            zIndex: 5,
            pointerEvents: "none"
          }}
        >
          <span className="absolute left-2 top-2 text-green-700 font-semibold text-sm bg-green-100 px-2 py-1 rounded">
            Garden Terrace
          </span>
        </div>

        {/* Central Bar Counter - L-shaped */}
        <div 
          className="absolute bg-gradient-to-r from-stone-800 to-stone-700 rounded-lg shadow-lg"
          style={{
            left: snap(8) * GRID_SIZE,
            top: snap(2) * GRID_SIZE,
            width: snap(6) * GRID_SIZE,
            height: snap(1.5) * GRID_SIZE,
            zIndex: 25,
            border: "3px solid #1a1a1a"
          }}
        />
        <div 
          className="absolute bg-gradient-to-r from-stone-800 to-stone-700 rounded-lg shadow-lg"
          style={{
            left: snap(13) * GRID_SIZE,
            top: snap(2) * GRID_SIZE,
            width: snap(1.5) * GRID_SIZE,
            height: snap(4) * GRID_SIZE,
            zIndex: 25,
            border: "3px solid #1a1a1a"
          }}
        />

        {/* Bar Stools - Around the L-shaped counter */}
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={`barstool-${i}`}
            onClick={() => handleSeatClick(`barstool-${i}`)}
            onMouseEnter={() => setHoveredSeat(`barstool-${i}`)}
            onMouseLeave={() => setHoveredSeat(null)}
            style={getSeatStyle(`barstool-${i}`)}
          >
            <CafeIconMarker
              icon="BarStool"
              gridX={snap(8.5 + i * 1.2)}
              gridY={snap(4)}
              gridSize={GRID_SIZE}
              iconColor="#2a2a2a"
              zIndex={30}
            />
          </div>
        ))}

        {/* VIP Lounge Seating - Luxury armchairs */}
        <div
          onClick={() => handleSeatClick('vip-chair-1')}
          onMouseEnter={() => setHoveredSeat('vip-chair-1')}
          onMouseLeave={() => setHoveredSeat(null)}
          style={getSeatStyle('vip-chair-1')}
        >
          <CafeIconMarker
            icon="Armchair"
            gridX={snap(1.5)}
            gridY={snap(2)}
            gridSize={GRID_SIZE}
            iconColor="#b45309"
            zIndex={25}
          />
        </div>
        
        <div
          onClick={() => handleSeatClick('vip-chair-2')}
          onMouseEnter={() => setHoveredSeat('vip-chair-2')}
          onMouseLeave={() => setHoveredSeat(null)}
          style={getSeatStyle('vip-chair-2')}
        >
          <CafeIconMarker
            icon="Armchair"
            gridX={snap(1.5)}
            gridY={snap(4)}
            gridSize={GRID_SIZE}
            iconColor="#b45309"
            zIndex={25}
          />
        </div>

        {/* VIP Coffee Table */}
        <CafeIconMarker
          icon="SideTable"
          gridX={snap(2.8)}
          gridY={snap(3)}
          gridSize={GRID_SIZE}
          iconColor="#92400e"
          zIndex={25}
        />

        {/* Main Dining Tables - Creative arrangement */}
        {[
          { x: 4, y: 4, id: 'window-table-1' },
          { x: 6.5, y: 4, id: 'window-table-2' },
          { x: 4, y: 6.5, id: 'center-table-1' },
          { x: 6.5, y: 6.5, id: 'center-table-2' },
          { x: 9, y: 6.5, id: 'corner-table-1' },
          { x: 11.5, y: 6.5, id: 'corner-table-2' },
          { x: 14, y: 4, id: 'wall-table-1' },
          { x: 16.5, y: 4, id: 'wall-table-2' },
          { x: 14, y: 7, id: 'booth-table-1' },
          { x: 16.5, y: 7, id: 'booth-table-2' }
        ].map((table) => (
          <React.Fragment key={table.id}>
            <div
              onClick={() => handleSeatClick(table.id)}
              onMouseEnter={() => setHoveredSeat(table.id)}
              onMouseLeave={() => setHoveredSeat(null)}
              style={getSeatStyle(table.id)}
            >
              <CafeIconMarker 
                icon="Table" 
                gridX={snap(table.x)} 
                gridY={snap(table.y)} 
                gridSize={GRID_SIZE} 
                iconColor="#8B4513"
                zIndex={20} 
              />
            </div>
            
            {/* Chairs around each table */}
            {[-0.9, 0.9].map((offset, idx) => (
              <div
                key={`${table.id}-chair-${idx}`}
                onClick={() => handleSeatClick(`${table.id}-chair-${idx + 1}`)}
                onMouseEnter={() => setHoveredSeat(`${table.id}-chair-${idx + 1}`)}
                onMouseLeave={() => setHoveredSeat(null)}
                style={getSeatStyle(`${table.id}-chair-${idx + 1}`)}
              >
                <CafeIconMarker 
                  icon="Chair" 
                  gridX={snap(table.x + offset)} 
                  gridY={snap(table.y + 0.1)} 
                  gridSize={GRID_SIZE} 
                  iconColor="#333"
                  zIndex={20} 
                />
              </div>
            ))}
          </React.Fragment>
        ))}

        {/* Outdoor Garden Tables */}
        {[
          { x: 3, y: outdoorTerrace.y + 2, id: 'garden-1' },
          { x: 7, y: outdoorTerrace.y + 2, id: 'garden-2' },
          { x: 11, y: outdoorTerrace.y + 2, id: 'garden-3' },
          { x: 15, y: outdoorTerrace.y + 2, id: 'garden-4' },
          { x: 5, y: outdoorTerrace.y + 4, id: 'patio-1' },
          { x: 13, y: outdoorTerrace.y + 4, id: 'patio-2' }
        ].map((table) => (
          <React.Fragment key={table.id}>
            <div
              onClick={() => handleSeatClick(table.id)}
              onMouseEnter={() => setHoveredSeat(table.id)}
              onMouseLeave={() => setHoveredSeat(null)}
              style={getSeatStyle(table.id)}
            >
              <CafeIconMarker 
                icon="Table" 
                gridX={snap(table.x)} 
                gridY={snap(table.y)} 
                gridSize={GRID_SIZE} 
                iconColor="#8B4513"
                zIndex={15} 
              />
            </div>
            
            {[-0.8, 0.8].map((offset, idx) => (
              <div
                key={`${table.id}-chair-${idx}`}
                onClick={() => handleSeatClick(`${table.id}-chair-${idx + 1}`)}
                onMouseEnter={() => setHoveredSeat(`${table.id}-chair-${idx + 1}`)}
                onMouseLeave={() => setHoveredSeat(null)}
                style={getSeatStyle(`${table.id}-chair-${idx + 1}`)}
              >
                <CafeIconMarker 
                  icon="Chair" 
                  gridX={snap(table.x + offset)} 
                  gridY={snap(table.y + 0.1)} 
                  gridSize={GRID_SIZE} 
                  iconColor="#333"
                  zIndex={15} 
                />
              </div>
            ))}
          </React.Fragment>
        ))}

        {/* Decorative Plants */}
        {[
          { x: 0.5, y: outdoorTerrace.y + 0.5 },
          { x: GRID_W - 1, y: outdoorTerrace.y + 0.5 },
          { x: 0.5, y: GRID_H - 1 },
          { x: GRID_W - 1, y: GRID_H - 1 },
          { x: 18, y: 2 },
          { x: 18, y: 8 }
        ].map((plant, idx) => (
          <CafeIconMarker 
            key={`plant-${idx}`}
            icon="Planter" 
            gridX={snap(plant.x)} 
            gridY={snap(plant.y)} 
            gridSize={GRID_SIZE} 
            iconColor="#16a34a"
            zIndex={20} 
          />
        ))}

        {/* Entrance */}
        <CafeIconMarker
          icon="Door"
          gridX={snap(GRID_W/2 - 1.5)}
          gridY={snap(GRID_H - 0.5)}
          gridW={3}
          gridH={0.5}
          gridSize={GRID_SIZE}
          label="Main Entrance"
          zIndex={35}
        />

        {/* Service Window */}
        <CafeIconMarker
          icon="Door"
          gridX={snap(15)}
          gridY={snap(0.2)}
          gridW={2}
          gridH={0.3}
          gridSize={GRID_SIZE}
          label="Service"
          zIndex={35}
        />

        {/* Cafe Branding */}
        <div
          className="absolute font-black tracking-widest text-center pointer-events-none"
          style={{
            left: snap((GRID_W/2 - 3) * GRID_SIZE),
            top: snap(0.5 * GRID_SIZE),
            fontSize: "2.5rem",
            color: "#78350f",
            zIndex: 40,
            width: 300,
            textShadow: "2px 2px 4px rgba(255,255,255,0.8)"
          }}
        >
          RAW SMITH
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-lg shadow-lg text-xs">
          <div className="font-semibold mb-2">Seating Areas</div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-amber-200 rounded"></div>
            <span>VIP Lounge</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-stone-200 rounded"></div>
            <span>Main Dining</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <span>Garden Terrace</span>
          </div>
        </div>

        {/* Seat Info Panel */}
        {hoveredSeat && (
          <div className="absolute top-4 left-4 bg-white/95 p-3 rounded-lg shadow-lg text-sm max-w-xs">
            <div className="font-semibold text-stone-800">{hoveredSeat}</div>
            <div className="text-stone-600 text-xs mt-1">
              Click to join this seat • Available now
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
