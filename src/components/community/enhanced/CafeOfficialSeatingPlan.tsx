
import React, { useState } from "react";
import { CafeIconMarker } from "./CafeIconMarker";

// Make the grid larger for a bigger, clearer floor plan
const GRID_SIZE = 50; // 1m = 50px for proper scaling
const GRID_W = 30;
const GRID_H = 20;

export const CafeOfficialSeatingPlan: React.FC<{
  onSeatSelect?: (seatId: string) => void;
  selectedSeat?: string | null;
  hideHeader?: boolean;
}> = ({ onSeatSelect, selectedSeat, hideHeader }) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  
  const snap = (n: number) => Math.round(n);

  // Define zones based on the new isometric layout
  const indoorZone = {
    x: 2,
    y: 2,
    w: 20,
    h: 14,
  };
  
  const outdoorZone = {
    x: 2,
    y: 16,
    w: 20,
    h: 6,
  };

  const loungeZone = {
    x: 24,
    y: 16,
    w: 6,
    h: 6,
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
    <div className="w-full" style={{ backgroundColor: '#f5f0e7' }}>
      {/* Header */}
      {!hideHeader && (
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">RAW SMITH CAFÉ - ISOMETRIC LAYOUT</h2>
          <p className="text-sm text-stone-600">Interactive Seating Plan - Click any seat to join the area chat</p>
        </div>
      )}

      {/* Main Canvas Container */}
      <div
        className="relative w-full mx-auto border-2 border-stone-400 rounded-lg shadow-2xl overflow-hidden"
        style={{
          aspectRatio: `${GRID_W / GRID_H}`,
          maxWidth: "95vw",
          height: hideHeader ? "70vh" : "calc(100vh - 120px)",
          backgroundImage: "url('/lovable-uploads/7ddcf203-b9d9-4773-bf53-d70372417ee7.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Indoor Zone */}
        <div
          className="absolute border-2 border-amber-600 rounded-lg"
          style={{
            left: indoorZone.x * GRID_SIZE,
            top: indoorZone.y * GRID_SIZE,
            width: indoorZone.w * GRID_SIZE,
            height: indoorZone.h * GRID_SIZE,
            backgroundColor: "rgba(139, 69, 19, 0.1)",
            zIndex: 5,
            pointerEvents: "none"
          }}
        >
          <span className="absolute left-4 top-2 text-amber-800 font-bold text-sm bg-white/90 px-3 py-2 rounded shadow">
            🏠 Indoor Café
          </span>
        </div>

        {/* Outdoor Terrace Zone */}
        <div
          className="absolute border-2 border-green-600 rounded-lg"
          style={{
            left: outdoorZone.x * GRID_SIZE,
            top: outdoorZone.y * GRID_SIZE,
            width: outdoorZone.w * GRID_SIZE,
            height: outdoorZone.h * GRID_SIZE,
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            zIndex: 5,
            pointerEvents: "none"
          }}
        >
          <span className="absolute left-4 top-2 text-green-800 font-bold text-sm bg-white/90 px-3 py-2 rounded shadow">
            🌿 Outdoor Terrace
          </span>
        </div>

        {/* Lounge Zone */}
        <div
          className="absolute border-2 border-purple-600 rounded-lg"
          style={{
            left: loungeZone.x * GRID_SIZE,
            top: loungeZone.y * GRID_SIZE,
            width: loungeZone.w * GRID_SIZE,
            height: loungeZone.h * GRID_SIZE,
            backgroundColor: "rgba(147, 51, 234, 0.1)",
            zIndex: 5,
            pointerEvents: "none"
          }}
        >
          <span className="absolute left-2 top-2 text-purple-800 font-bold text-xs bg-white/90 px-2 py-1 rounded shadow">
            🛋️ Lounge
          </span>
        </div>

        {/* Bar Counter - Top area with stools */}
        {[6, 8, 10, 12, 14, 16, 18].map((x, idx) => (
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
              gridY={snap(5)}
              gridSize={GRID_SIZE}
              iconColor="#3d2c24"
              zIndex={30}
            />
          </div>
        ))}

        {/* Indoor Tables - 2x2 grid layout */}
        {[
          { x: 6, y: 8, id: 'indoor-table-1' },
          { x: 12, y: 8, id: 'indoor-table-2' },
          { x: 18, y: 8, id: 'indoor-table-3' },
          { x: 6, y: 12, id: 'indoor-table-4' },
          { x: 12, y: 12, id: 'indoor-table-5' },
          { x: 18, y: 12, id: 'indoor-table-6' }
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
                iconColor="#D2691E"
                zIndex={25} 
              />
            </div>
            
            {/* 4 Chairs around each table */}
            {[
              { x: table.x - 1, y: table.y, chairId: 1 },
              { x: table.x + 1, y: table.y, chairId: 2 },
              { x: table.x, y: table.y - 1, chairId: 3 },
              { x: table.x, y: table.y + 1, chairId: 4 }
            ].map((chair) => (
              <div
                key={`${table.id}-chair-${chair.chairId}`}
                onClick={() => handleSeatClick(`${table.id}-chair-${chair.chairId}`)}
                onMouseEnter={() => setHoveredSeat(`${table.id}-chair-${chair.chairId}`)}
                onMouseLeave={() => setHoveredSeat(null)}
                style={getSeatStyle(`${table.id}-chair-${chair.chairId}`)}
              >
                <CafeIconMarker 
                  icon="Chair" 
                  gridX={snap(chair.x)} 
                  gridY={snap(chair.y)} 
                  gridSize={GRID_SIZE} 
                  iconColor="#2c1810"
                  zIndex={25} 
                />
              </div>
            ))}
          </React.Fragment>
        ))}

        {/* Green Lounge Chairs - Left side indoor */}
        {[
          { x: 4, y: 7, id: 'lounge-chair-1' },
          { x: 4, y: 9, id: 'lounge-chair-2' },
          { x: 4, y: 11, id: 'lounge-chair-3' }
        ].map((chair) => (
          <div
            key={chair.id}
            onClick={() => handleSeatClick(chair.id)}
            onMouseEnter={() => setHoveredSeat(chair.id)}
            onMouseLeave={() => setHoveredSeat(null)}
            style={getSeatStyle(chair.id)}
          >
            <CafeIconMarker
              icon="Armchair"
              gridX={snap(chair.x)}
              gridY={snap(chair.y)}
              gridSize={GRID_SIZE}
              iconColor="#228B22"
              zIndex={25}
            />
          </div>
        ))}

        {/* Outdoor Terrace Tables */}
        {[
          { x: 6, y: 18, id: 'outdoor-table-1' },
          { x: 12, y: 18, id: 'outdoor-table-2' },
          { x: 18, y: 18, id: 'outdoor-table-3' }
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
                iconColor="#CD853F"
                zIndex={20} 
              />
            </div>
            
            {/* 2 Chairs per outdoor table */}
            {[
              { x: table.x - 1, y: table.y, chairId: 1 },
              { x: table.x + 1, y: table.y, chairId: 2 }
            ].map((chair) => (
              <div
                key={`${table.id}-chair-${chair.chairId}`}
                onClick={() => handleSeatClick(`${table.id}-chair-${chair.chairId}`)}
                onMouseEnter={() => setHoveredSeat(`${table.id}-chair-${chair.chairId}`)}
                onMouseLeave={() => setHoveredSeat(null)}
                style={getSeatStyle(`${table.id}-chair-${chair.chairId}`)}
              >
                <CafeIconMarker 
                  icon="Chair" 
                  gridX={snap(chair.x)} 
                  gridY={snap(chair.y)} 
                  gridSize={GRID_SIZE} 
                  iconColor="#2c1810"
                  zIndex={20} 
                />
              </div>
            ))}
          </React.Fragment>
        ))}

        {/* Separate Lounge Area */}
        {[
          { x: 25, y: 18, id: 'separate-lounge-1' },
          { x: 27, y: 18, id: 'separate-lounge-2' },
          { x: 25, y: 20, id: 'separate-lounge-3' },
          { x: 27, y: 20, id: 'separate-lounge-4' }
        ].map((chair) => (
          <div
            key={chair.id}
            onClick={() => handleSeatClick(chair.id)}
            onMouseEnter={() => setHoveredSeat(chair.id)}
            onMouseLeave={() => setHoveredSeat(null)}
            style={getSeatStyle(chair.id)}
          >
            <CafeIconMarker
              icon="Armchair"
              gridX={snap(chair.x)}
              gridY={snap(chair.y)}
              gridSize={GRID_SIZE}
              iconColor="#228B22"
              zIndex={20}
            />
          </div>
        ))}

        {/* Plants and Decorations */}
        {[
          { x: 3, y: 6 },
          { x: 21, y: 6 },
          { x: 23, y: 19 }
        ].map((plant, idx) => (
          <CafeIconMarker 
            key={`plant-${idx}`}
            icon="Planter" 
            gridX={snap(plant.x)} 
            gridY={snap(plant.y)} 
            gridSize={GRID_SIZE} 
            iconColor="#228B22"
            zIndex={15} 
          />
        ))}

        {/* Entrance */}
        <CafeIconMarker
          icon="Door"
          gridX={snap(22)}
          gridY={snap(13)}
          gridW={2}
          gridH={2}
          gridSize={GRID_SIZE}
          label="Entrance"
          zIndex={35}
        />

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/95 p-4 rounded-lg shadow-lg text-sm max-w-xs">
          <div className="font-semibold mb-3 text-base">Area Chat Zones</div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-amber-200 border border-amber-600 rounded"></div>
              <span>Indoor Café</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-200 border border-green-600 rounded"></div>
              <span>Outdoor Terrace</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-purple-200 border border-purple-600 rounded"></div>
              <span>Lounge Area</span>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              Click any seat to join that area's chat
            </div>
          </div>
        </div>

        {/* Seat Info Panel */}
        {hoveredSeat && (
          <div className="absolute top-4 left-4 bg-white/95 p-4 rounded-lg shadow-lg text-base max-w-sm">
            <div className="font-semibold text-stone-800 text-lg">{hoveredSeat}</div>
            <div className="text-stone-600 text-sm mt-2">
              {hoveredSeat.includes('bar-stool') && "🪑 Bar counter seating - Perfect for quick coffee and socializing"}
              {hoveredSeat.includes('lounge-chair') && "🛋️ Comfortable lounge seating - Great for relaxed conversations"}
              {hoveredSeat.includes('indoor-table') && "☕ Indoor dining - Ideal for meetings and focused work"}
              {hoveredSeat.includes('outdoor-table') && "🌿 Outdoor terrace - Fresh air and casual dining"}
              {hoveredSeat.includes('separate-lounge') && "🏝️ Private lounge - Quiet space for intimate conversations"}
              <br />
              <span className="text-amber-600 font-medium">Click to join this area's chat!</span>
            </div>
          </div>
        )}

        {/* Live Status Indicator */}
        <div className="absolute top-4 right-4 bg-green-600/90 text-white px-3 py-2 rounded-lg text-sm font-semibold animate-pulse">
          🟢 Live Interactive Layout
        </div>
      </div>
    </div>
  );
};
