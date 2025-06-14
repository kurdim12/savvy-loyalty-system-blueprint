
import React, { useState } from "react";
import { CafeIconMarker } from "./CafeIconMarker";

const GRID_SIZE = 40; // 1m = 40px for proper scaling
const GRID_W = 30;
const GRID_H = 20;

export const CafeOfficialSeatingPlan: React.FC<{
  onSeatSelect?: (seatId: string) => void;
  selectedSeat?: string | null;
  hideHeader?: boolean;
}> = ({ onSeatSelect, selectedSeat, hideHeader }) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  
  const snap = (n: number) => Math.round(n);

  // Define zones based on specifications
  const indoorZone = {
    x: 0,
    y: 0,
    w: GRID_W,
    h: Math.floor(GRID_H * 2/3), // Top 2/3
  };
  
  const outdoorZone = {
    x: 0,
    y: Math.floor(GRID_H * 2/3),
    w: GRID_W,
    h: Math.floor(GRID_H * 1/3), // Bottom 1/3
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
    <div className="w-full min-h-screen" style={{ backgroundColor: '#f5f0e7' }}>
      {/* Header */}
      {!hideHeader && (
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">RAW SMITH CAFÉ - SEATING PLAN</h2>
          <p className="text-sm text-stone-600">Professional Layout with Grid Snapping</p>
        </div>
      )}

      {/* Main Canvas Container */}
      <div
        className="relative w-full mx-auto border-2 border-stone-400 rounded-lg shadow-2xl overflow-hidden"
        style={{
          aspectRatio: `${GRID_W / GRID_H}`,
          maxWidth: "95vw",
          height: hideHeader ? "100vh" : "calc(100vh - 120px)",
          backgroundImage: "url('/lovable-uploads/okay,where.JPG')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Grid Overlay for Snap-to-Grid */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #666 1px, transparent 1px),
              linear-gradient(to bottom, #666 1px, transparent 1px)
            `,
            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
          }}
        />

        {/* Indoor Zone */}
        <div
          className="absolute border-2 border-stone-600"
          style={{
            left: indoorZone.x * GRID_SIZE,
            top: indoorZone.y * GRID_SIZE,
            width: indoorZone.w * GRID_SIZE,
            height: indoorZone.h * GRID_SIZE,
            backgroundColor: "rgba(224, 223, 220, 0.3)",
            zIndex: 5,
            pointerEvents: "none"
          }}
        >
          <span className="absolute left-4 top-2 text-stone-700 font-bold text-lg bg-white/90 px-3 py-2 rounded">
            🏠 Indoor
          </span>
        </div>

        {/* Outdoor Terrace Zone */}
        <div
          className="absolute border-2 border-green-600"
          style={{
            left: outdoorZone.x * GRID_SIZE,
            top: outdoorZone.y * GRID_SIZE,
            width: outdoorZone.w * GRID_SIZE,
            height: outdoorZone.h * GRID_SIZE,
            backgroundColor: "rgba(231, 239, 233, 0.3)",
            zIndex: 5,
            pointerEvents: "none"
          }}
        >
          <span className="absolute left-4 top-2 text-green-700 font-bold text-lg bg-white/90 px-3 py-2 rounded">
            🌿 Outdoor Terrace
          </span>
        </div>

        {/* RAW SMITH CAFÉ Title */}
        <div
          className="absolute font-black text-center pointer-events-none"
          style={{
            left: snap(GRID_W/2 - 6) * GRID_SIZE,
            top: snap(1) * GRID_SIZE,
            fontSize: "32px",
            color: "#451a03",
            zIndex: 50,
            width: 480,
            textShadow: "2px 2px 4px rgba(255,255,255,0.9)",
            letterSpacing: "0.1em"
          }}
        >
          RAW SMITH CAFÉ
        </div>

        {/* INDOOR FURNITURE */}
        
        {/* Bar Counter - 4 Stools along top wall */}
        {[6, 10, 14, 18].map((x, idx) => (
          <div
            key={`bar-stool-${idx}`}
            onClick={() => handleSeatClick(`bar-stool-${idx + 1}`)}
            onMouseEnter={() => setHoveredSeat(`bar-stool-${idx + 1}`)}
            onMouseLeave={() => setHoveredSeat(null)}
            style={getSeatStyle(`bar-stool-${idx + 1}`)}
          >
            <CafeIconMarker
              icon="BarStool"
              gridX={snap(x)}
              gridY={snap(3)}
              gridSize={GRID_SIZE}
              iconColor="#8B4513"
              zIndex={30}
            />
          </div>
        ))}

        {/* Lounge Nook - Top-left corner */}
        {/* Armchair 1 */}
        <div
          onClick={() => handleSeatClick('lounge-armchair-1')}
          onMouseEnter={() => setHoveredSeat('lounge-armchair-1')}
          onMouseLeave={() => setHoveredSeat(null)}
          style={getSeatStyle('lounge-armchair-1')}
        >
          <CafeIconMarker
            icon="Armchair"
            gridX={snap(2)}
            gridY={snap(5)}
            gridSize={GRID_SIZE}
            iconColor="#166534"
            zIndex={25}
          />
        </div>

        {/* Armchair 2 */}
        <div
          onClick={() => handleSeatClick('lounge-armchair-2')}
          onMouseEnter={() => setHoveredSeat('lounge-armchair-2')}
          onMouseLeave={() => setHoveredSeat(null)}
          style={getSeatStyle('lounge-armchair-2')}
        >
          <CafeIconMarker
            icon="Armchair"
            gridX={snap(2)}
            gridY={snap(7)}
            gridSize={GRID_SIZE}
            iconColor="#166534"
            zIndex={25}
          />
        </div>

        {/* Side Table between armchairs */}
        <CafeIconMarker
          icon="SideTable"
          gridX={snap(4)}
          gridY={snap(6)}
          gridSize={GRID_SIZE}
          iconColor="#92400e"
          zIndex={20}
        />

        {/* Main Seating - 2x2 grid of tables in center */}
        {[
          { x: 12, y: 6, id: 'main-table-1' },
          { x: 16, y: 6, id: 'main-table-2' },
          { x: 12, y: 9, id: 'main-table-3' },
          { x: 16, y: 9, id: 'main-table-4' }
        ].map((table) => (
          <React.Fragment key={table.id}>
            {/* Table */}
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
                iconColor="#451a03"
                zIndex={20} 
              />
            </div>
            
            {/* 2 Chairs facing inward */}
            {[-1.5, 1.5].map((offset, idx) => (
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
                  gridY={snap(table.y)} 
                  gridSize={GRID_SIZE} 
                  iconColor="#1a1a1a"
                  zIndex={20} 
                />
              </div>
            ))}
          </React.Fragment>
        ))}

        {/* OUTDOOR FURNITURE */}

        {/* Terrace Railing along zone divider */}
        <CafeIconMarker
          icon="Table"
          gridX={snap(0)}
          gridY={snap(indoorZone.h)}
          gridW={GRID_W}
          gridH={0.2}
          gridSize={GRID_SIZE}
          iconColor="#8B4513"
          zIndex={15}
          label="Terrace Railing"
        />

        {/* Outdoor Tables - 4 evenly spaced */}
        {[
          { x: 5, y: 15, id: 'outdoor-table-1' },
          { x: 10, y: 15, id: 'outdoor-table-2' },
          { x: 15, y: 15, id: 'outdoor-table-3' },
          { x: 20, y: 15, id: 'outdoor-table-4' }
        ].map((table) => (
          <React.Fragment key={table.id}>
            {/* Table */}
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
                iconColor="#1a1a1a"
                zIndex={15} 
              />
            </div>
            
            {/* 2 Chairs facing café */}
            {[-1, 1].map((offset, idx) => (
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
                  gridY={snap(table.y - 1)} 
                  gridSize={GRID_SIZE} 
                  iconColor="#1a1a1a"
                  zIndex={15} 
                />
              </div>
            ))}
          </React.Fragment>
        ))}

        {/* Planters at terrace corners */}
        {[
          { x: 1, y: 14 },
          { x: 28, y: 14 },
          { x: 1, y: 18 },
          { x: 28, y: 18 }
        ].map((plant, idx) => (
          <CafeIconMarker 
            key={`planter-${idx}`}
            icon="Planter" 
            gridX={snap(plant.x)} 
            gridY={snap(plant.y)} 
            gridSize={GRID_SIZE} 
            iconColor="#16a34a"
            zIndex={20} 
          />
        ))}

        {/* Entrance Door */}
        <CafeIconMarker
          icon="Door"
          gridX={snap(0)}
          gridY={snap(GRID_H/2)}
          gridW={0.5}
          gridH={2}
          gridSize={GRID_SIZE}
          label="Entrance"
          zIndex={35}
        />

        {/* Bar Window Label */}
        <div className="absolute text-stone-800 font-bold text-sm bg-white/90 px-3 py-2 rounded shadow-lg" 
             style={{ 
               left: snap(14) * GRID_SIZE, 
               top: snap(2.5) * GRID_SIZE, 
               zIndex: 40 
             }}>
          🪟 Bar Window
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/95 p-4 rounded-lg shadow-lg text-sm max-w-xs">
          <div className="font-semibold mb-3 text-base">Layout Legend</div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-stone-300 rounded"></div>
              <span>Indoor Zone</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-300 rounded"></div>
              <span>Outdoor Terrace</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-amber-300 rounded"></div>
              <span>Grid: 1m × 1m</span>
            </div>
          </div>
        </div>

        {/* Seat Info Panel */}
        {hoveredSeat && (
          <div className="absolute top-4 left-4 bg-white/95 p-4 rounded-lg shadow-lg text-base max-w-sm">
            <div className="font-semibold text-stone-800 text-lg">{hoveredSeat}</div>
            <div className="text-stone-600 text-sm mt-2">
              {hoveredSeat.includes('bar-stool') && "🪑 Bar counter seating"}
              {hoveredSeat.includes('lounge-armchair') && "🛋️ Comfortable lounge seating"}
              {hoveredSeat.includes('main-table') && "🪑 Main dining area"}
              {hoveredSeat.includes('outdoor-table') && "🌿 Outdoor terrace dining"}
              <br />Grid-snapped positioning for professional layout
            </div>
          </div>
        )}

        {/* Export Quality Indicator */}
        <div className="absolute top-4 right-4 bg-green-600/90 text-white px-3 py-2 rounded-lg text-sm font-semibold">
          📐 Professional Layout - Export Ready
        </div>
      </div>
    </div>
  );
};
