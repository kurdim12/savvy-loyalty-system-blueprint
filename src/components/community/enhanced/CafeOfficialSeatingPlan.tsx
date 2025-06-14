
import React, { useState } from "react";
import { CafeIconMarker } from "./CafeIconMarker";

const GRID_SIZE = 50;
const GRID_W = 24;
const GRID_H = 16;

export const CafeOfficialSeatingPlan: React.FC<{
  onSeatSelect?: (seatId: string) => void;
  selectedSeat?: string | null;
  hideHeader?: boolean;
}> = ({ onSeatSelect, selectedSeat }) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  
  const snap = (n: number) => Math.round(n * 2) / 2;

  // Define the actual Raw Smith Café zones based on photos
  const caveInterior = {
    x: 2,
    y: 2,
    w: 14,
    h: 10,
    shape: "irregular" // The cave-like shape with arched opening
  };
  
  const outdoorTerrace = {
    x: 16,
    y: 2,
    w: 6,
    h: 12
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
    <div className="w-full h-screen bg-gradient-to-br from-stone-100 to-amber-50 p-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-stone-800 mb-2">RAW SMITH CAFÉ</h2>
        <p className="text-stone-600">Authentic Cave Experience - Click any seat to join</p>
      </div>

      {/* Main Floor Plan Container */}
      <div
        className="relative w-full mx-auto border-2 border-stone-400 rounded-xl shadow-2xl"
        style={{
          aspectRatio: `${GRID_W / GRID_H}`,
          maxWidth: "95vw",
          height: "calc(100vh - 200px)",
          background: "linear-gradient(135deg, #f5f0e8 0%, #e8ddd4 100%)",
          overflow: "hidden"
        }}
      >
        {/* Cave Interior Zone - Irregular shape to represent the cave */}
        <div
          className="absolute border-2 border-stone-600 bg-stone-200/30"
          style={{
            left: caveInterior.x * GRID_SIZE,
            top: caveInterior.y * GRID_SIZE,
            width: caveInterior.w * GRID_SIZE,
            height: caveInterior.h * GRID_SIZE,
            borderRadius: "30px 30px 10px 10px",
            zIndex: 5,
            pointerEvents: "none"
          }}
        >
          <span className="absolute left-3 top-2 text-stone-700 font-bold text-sm bg-stone-100/90 px-2 py-1 rounded">
            🕳️ Cave Interior
          </span>
        </div>

        {/* Outdoor Terrace */}
        <div
          className="absolute border-2 border-green-500 bg-green-100/30"
          style={{
            left: outdoorTerrace.x * GRID_SIZE,
            top: outdoorTerrace.y * GRID_SIZE,
            width: outdoorTerrace.w * GRID_SIZE,
            height: outdoorTerrace.h * GRID_SIZE,
            borderRadius: "8px",
            zIndex: 5,
            pointerEvents: "none"
          }}
        >
          <span className="absolute left-2 top-2 text-green-700 font-bold text-sm bg-green-100/90 px-2 py-1 rounded">
            🌿 Outdoor Terrace
          </span>
        </div>

        {/* Coffee Cupping/Tasting Counter - Based on the wooden counter photo */}
        <div 
          className="absolute bg-gradient-to-r from-amber-700 to-amber-600 rounded-lg shadow-lg"
          style={{
            left: snap(4) * GRID_SIZE,
            top: snap(3) * GRID_SIZE,
            width: snap(6) * GRID_SIZE,
            height: snap(2) * GRID_SIZE,
            zIndex: 25,
            border: "3px solid #92400e"
          }}
        />
        <div className="absolute left-4 top-2 text-amber-100 font-bold text-xs bg-amber-800/80 px-2 py-1 rounded" 
             style={{ left: snap(4.5) * GRID_SIZE, top: snap(3.2) * GRID_SIZE, zIndex: 30 }}>
          ☕ Coffee Cupping Station
        </div>

        {/* Signature Green Leather Armchairs - From photos */}
        <div
          onClick={() => handleSeatClick('green-armchair-1')}
          onMouseEnter={() => setHoveredSeat('green-armchair-1')}
          onMouseLeave={() => setHoveredSeat(null)}
          style={getSeatStyle('green-armchair-1')}
        >
          <CafeIconMarker
            icon="Armchair"
            gridX={snap(3)}
            gridY={snap(7)}
            gridSize={GRID_SIZE}
            iconColor="#166534"
            zIndex={25}
          />
        </div>
        
        <div
          onClick={() => handleSeatClick('green-armchair-2')}
          onMouseEnter={() => setHoveredSeat('green-armchair-2')}
          onMouseLeave={() => setHoveredSeat(null)}
          style={getSeatStyle('green-armchair-2')}
        >
          <CafeIconMarker
            icon="Armchair"
            gridX={snap(5.5)}
            gridY={snap(7)}
            gridSize={GRID_SIZE}
            iconColor="#166534"
            zIndex={25}
          />
        </div>

        {/* Small round table between armchairs */}
        <CafeIconMarker
          icon="SideTable"
          gridX={snap(4.2)}
          gridY={snap(7.5)}
          gridSize={GRID_SIZE}
          iconColor="#92400e"
          zIndex={20}
        />

        {/* Cave Interior Tables - Small round and square tables from photos */}
        {[
          { x: 8, y: 5, id: 'cave-table-1', type: 'round' },
          { x: 11, y: 5, id: 'cave-table-2', type: 'square' },
          { x: 8, y: 8, id: 'cave-table-3', type: 'square' },
          { x: 12, y: 8, id: 'cave-table-4', type: 'round' },
          { x: 6, y: 10, id: 'cave-table-5', type: 'square' }
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
                iconColor="#451a03"
                zIndex={20} 
              />
            </div>
            
            {/* Chairs around each table - Black metal chairs as seen in photos */}
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
                  iconColor="#1a1a1a"
                  zIndex={20} 
                />
              </div>
            ))}
          </React.Fragment>
        ))}

        {/* Outdoor Terrace Tables - Black tables from photos */}
        {[
          { x: 17, y: 4, id: 'outdoor-1' },
          { x: 20, y: 4, id: 'outdoor-2' },
          { x: 17, y: 7, id: 'outdoor-3' },
          { x: 20, y: 7, id: 'outdoor-4' },
          { x: 18.5, y: 10, id: 'outdoor-5' }
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
                iconColor="#1a1a1a"
                zIndex={15} 
              />
            </div>
            
            {[-0.7, 0.7].map((offset, idx) => (
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
                  iconColor="#1a1a1a"
                  zIndex={15} 
                />
              </div>
            ))}
          </React.Fragment>
        ))}

        {/* Plants - Throughout the space as seen in photos */}
        {[
          { x: 2.5, y: 9 },
          { x: 14, y: 6 },
          { x: 15.5, y: 11 },
          { x: 21.5, y: 3 },
          { x: 9, y: 11 }
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

        {/* Coffee Display Wall - Based on the wall-mounted containers photo */}
        <div 
          className="absolute bg-gradient-to-b from-amber-200 to-amber-300 border-2 border-amber-400"
          style={{
            left: snap(2.5) * GRID_SIZE,
            top: snap(2.5) * GRID_SIZE,
            width: snap(1) * GRID_SIZE,
            height: snap(4) * GRID_SIZE,
            zIndex: 30
          }}
        />
        <div className="absolute text-amber-800 font-bold text-xs bg-amber-100 px-1 py-0.5 rounded" 
             style={{ left: snap(2.6) * GRID_SIZE, top: snap(2.7) * GRID_SIZE, zIndex: 35 }}>
          ☕ Coffee Display
        </div>

        {/* Entrance */}
        <CafeIconMarker
          icon="Door"
          gridX={snap(0.5)}
          gridY={snap(GRID_H/2)}
          gridW={0.5}
          gridH={2}
          gridSize={GRID_SIZE}
          label="Entrance"
          zIndex={35}
        />

        {/* Raw Smith Branding */}
        <div
          className="absolute font-black tracking-widest text-center pointer-events-none"
          style={{
            left: snap((GRID_W/2 - 4) * GRID_SIZE),
            top: snap(0.5 * GRID_SIZE),
            fontSize: "2rem",
            color: "#451a03",
            zIndex: 40,
            width: 200,
            textShadow: "2px 2px 4px rgba(255,255,255,0.8)"
          }}
        >
          RAW SMITH
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/95 p-3 rounded-lg shadow-lg text-xs">
          <div className="font-semibold mb-2">Seating Areas</div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-stone-300 rounded"></div>
            <span>Cave Interior</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-green-300 rounded"></div>
            <span>Outdoor Terrace</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-300 rounded"></div>
            <span>Coffee Cupping</span>
          </div>
        </div>

        {/* Seat Info Panel */}
        {hoveredSeat && (
          <div className="absolute top-4 left-4 bg-white/95 p-3 rounded-lg shadow-lg text-sm max-w-xs">
            <div className="font-semibold text-stone-800">{hoveredSeat}</div>
            <div className="text-stone-600 text-xs mt-1">
              {hoveredSeat.includes('green-armchair') && "🛋️ Signature green leather seating"}
              {hoveredSeat.includes('cave-table') && "🕳️ Intimate cave atmosphere"}
              {hoveredSeat.includes('outdoor') && "🌿 Fresh air & street views"}
              {hoveredSeat.includes('cupping') && "☕ Coffee tasting experience"}
              <br />Click to join this authentic Raw Smith experience
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
