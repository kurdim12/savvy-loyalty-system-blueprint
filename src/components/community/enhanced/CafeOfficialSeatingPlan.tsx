
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
  exportMode?: boolean;
}> = ({ onSeatSelect, selectedSeat, hideHeader, exportMode = false }) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  
  const snap = (n: number) => Math.round(n);

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
    <div className="w-full h-full" style={{ backgroundColor: '#f5f0e7' }}>
      {/* Header */}
      {!hideHeader && !exportMode && (
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">RAW SMITH CAFÉ - SEATING PLAN</h2>
          <p className="text-sm text-stone-600">Professional Layout</p>
        </div>
      )}

      {/* Main Canvas Container */}
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          width: exportMode ? '100%' : 'auto',
          height: exportMode ? '100%' : (hideHeader ? "60vh" : "calc(100vh - 120px)"),
          maxWidth: exportMode ? 'none' : "95vw",
          aspectRatio: `${GRID_W / GRID_H}`,
          border: exportMode ? 'none' : '2px solid #a8a29e',
          borderRadius: exportMode ? '0' : '0.5rem',
          boxShadow: exportMode ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          backgroundColor: '#f0ebe4'
        }}
      >
        {/* Café Building Structure */}
        <div
          className="absolute border-4 border-stone-700"
          style={{
            left: snap(2) * GRID_SIZE,
            top: snap(2) * GRID_SIZE,
            width: snap(26) * GRID_SIZE,
            height: snap(16) * GRID_SIZE,
            backgroundColor: "rgba(240, 235, 220, 0.9)",
            zIndex: 1,
            pointerEvents: "none"
          }}
        />

        {/* Indoor Area */}
        <div
          className="absolute border-2 border-stone-600"
          style={{
            left: snap(2) * GRID_SIZE,
            top: snap(2) * GRID_SIZE,
            width: snap(26) * GRID_SIZE,
            height: snap(10) * GRID_SIZE,
            backgroundColor: "rgba(245, 240, 230, 0.7)",
            zIndex: 2,
            pointerEvents: "none"
          }}
        >
          <span className="absolute left-4 top-2 text-stone-700 font-bold text-lg bg-white/90 px-3 py-2 rounded">
            🏠 Indoor Seating
          </span>
        </div>

        {/* Outdoor Terrace Area */}
        <div
          className="absolute border-2 border-green-600"
          style={{
            left: snap(2) * GRID_SIZE,
            top: snap(12) * GRID_SIZE,
            width: snap(26) * GRID_SIZE,
            height: snap(6) * GRID_SIZE,
            backgroundColor: "rgba(231, 239, 233, 0.5)",
            zIndex: 2,
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
            left: snap(8) * GRID_SIZE,
            top: snap(0.5) * GRID_SIZE,
            fontSize: "28px",
            color: "#451a03",
            zIndex: 50,
            width: 400,
            textShadow: "2px 2px 4px rgba(255,255,255,0.9)",
            letterSpacing: "0.1em"
          }}
        >
          RAW SMITH CAFÉ
        </div>

        {/* INDOOR FURNITURE - Based on reference image layout */}
        
        {/* Bar Counter with Stools - Front center area */}
        <CafeIconMarker
          icon="Table"
          gridX={snap(20)}
          gridY={snap(4)}
          gridW={6}
          gridH={1}
          gridSize={GRID_SIZE}
          iconColor="#8b4513"
          zIndex={20}
        />
        
        {/* Bar Stools - 4 stools along the bar */}
        {[18, 20, 22, 24].map((x, idx) => (
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
              gridY={snap(6)}
              gridSize={GRID_SIZE}
              iconColor="#3d2c24"
              zIndex={30}
            />
          </div>
        ))}

        {/* Window Seating Area - Left side */}
        <div
          onClick={() => handleSeatClick('window-armchair-1')}
          onMouseEnter={() => setHoveredSeat('window-armchair-1')}
          onMouseLeave={() => setHoveredSeat(null)}
          style={getSeatStyle('window-armchair-1')}
        >
          <CafeIconMarker
            icon="Armchair"
            gridX={snap(4)}
            gridY={snap(5)}
            gridSize={GRID_SIZE}
            iconColor="#166534"
            zIndex={25}
          />
        </div>

        <div
          onClick={() => handleSeatClick('window-armchair-2')}
          onMouseEnter={() => setHoveredSeat('window-armchair-2')}
          onMouseLeave={() => setHoveredSeat(null)}
          style={getSeatStyle('window-armchair-2')}
        >
          <CafeIconMarker
            icon="Armchair"
            gridX={snap(6)}
            gridY={snap(5)}
            gridSize={GRID_SIZE}
            iconColor="#166534"
            zIndex={25}
          />
        </div>

        {/* Side table between armchairs */}
        <CafeIconMarker
          icon="SideTable"
          gridX={snap(5)}
          gridY={snap(7)}
          gridSize={GRID_SIZE}
          iconColor="#8b4513"
          zIndex={20}
        />

        {/* Indoor dining tables - 2 tables in the main area */}
        {[
          { x: 10, y: 8, id: 'indoor-table-1' },
          { x: 15, y: 8, id: 'indoor-table-2' }
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
                iconColor="#8b4513"
                zIndex={20} 
              />
            </div>
            
            {/* 2 Chairs per table */}
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
                  iconColor="#2c1810"
                  zIndex={20} 
                />
              </div>
            ))}
          </React.Fragment>
        ))}

        {/* OUTDOOR FURNITURE - Based on reference image */}
        
        {/* Outdoor dining tables - 6 tables in a 3x2 grid layout */}
        {[
          { x: 6, y: 14, id: 'outdoor-table-1' },
          { x: 12, y: 14, id: 'outdoor-table-2' },
          { x: 18, y: 14, id: 'outdoor-table-3' },
          { x: 6, y: 16, id: 'outdoor-table-4' },
          { x: 12, y: 16, id: 'outdoor-table-5' },
          { x: 18, y: 16, id: 'outdoor-table-6' }
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
                iconColor="#8b4513"
                zIndex={15} 
              />
            </div>
            
            {/* 2 Chairs per outdoor table */}
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
                  iconColor="#2c1810"
                  zIndex={15} 
                />
              </div>
            ))}
          </React.Fragment>
        ))}

        {/* Plants/Planters - Corner decorations */}
        {[
          { x: 3, y: 12 },
          { x: 26, y: 12 },
          { x: 3, y: 17 },
          { x: 26, y: 17 }
        ].map((plant, idx) => (
          <CafeIconMarker 
            key={`planter-${idx}`}
            icon="Planter" 
            gridX={snap(plant.x)} 
            gridY={snap(plant.y)} 
            gridSize={GRID_SIZE} 
            zIndex={20} 
          />
        ))}

        {/* Windows - Left and front side */}
        <div className="absolute pointer-events-none border-4 border-stone-400 bg-sky-100/50" 
             style={{
               left: snap(2) * GRID_SIZE,
               top: snap(3) * GRID_SIZE,
               width: snap(1) * GRID_SIZE,
               height: snap(6) * GRID_SIZE,
               zIndex: 5
             }} />

        <div className="absolute pointer-events-none border-4 border-stone-400 bg-sky-100/50" 
             style={{
               left: snap(10) * GRID_SIZE,
               top: snap(2) * GRID_SIZE,
               width: snap(10) * GRID_SIZE,
               height: snap(1) * GRID_SIZE,
               zIndex: 5
             }} />

        {/* Entrance Door */}
        <CafeIconMarker
          icon="Door"
          gridX={snap(24)}
          gridY={snap(10)}
          gridW={2}
          gridH={2}
          gridSize={GRID_SIZE}
          label="Entrance"
          zIndex={35}
        />

        {/* Service Counter Label */}
        <div className="absolute text-stone-800 font-bold text-sm bg-white/90 px-3 py-2 rounded shadow-lg" 
             style={{ 
               left: snap(20) * GRID_SIZE, 
               top: snap(3) * GRID_SIZE, 
               zIndex: 40 
             }}>
          Service Counter
        </div>

        {/* Legend */}
        {!exportMode && (
          <div className="absolute bottom-4 right-4 bg-white/95 p-4 rounded-lg shadow-lg text-sm max-w-xs">
            <div className="font-semibold mb-3 text-base">Seating Areas</div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-stone-300 rounded"></div>
                <span>Indoor Dining</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-300 rounded"></div>
                <span>Outdoor Terrace</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-300 rounded"></div>
                <span>Window Seating</span>
              </div>
            </div>
          </div>
        )}

        {/* Seat Info Panel */}
        {hoveredSeat && !exportMode && (
          <div className="absolute top-4 left-4 bg-white/95 p-4 rounded-lg shadow-lg text-base max-w-sm">
            <div className="font-semibold text-stone-800 text-lg">{hoveredSeat}</div>
            <div className="text-stone-600 text-sm mt-2">
              {hoveredSeat.includes('bar-stool') && "🪑 Bar counter seating with service"}
              {hoveredSeat.includes('window-armchair') && "🛋️ Comfortable window seating"}
              {hoveredSeat.includes('indoor-table') && "🪑 Indoor dining table"}
              {hoveredSeat.includes('outdoor-table') && "🌿 Outdoor terrace dining"}
              <br />Click to select this seat
            </div>
          </div>
        )}

        {/* Export Quality Indicator */}
        {!exportMode && (
          <div className="absolute top-4 right-4 bg-green-600/90 text-white px-3 py-2 rounded-lg text-sm font-semibold">
            📐 Café Layout - Export Ready
          </div>
        )}
      </div>
    </div>
  );
};
