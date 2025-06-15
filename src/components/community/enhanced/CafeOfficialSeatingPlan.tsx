
import React, { useState } from "react";
import { CafeIconMarker } from "./CafeIconMarker";

// Enhanced for 4K display - much larger grid for crisp details
const GRID_SIZE = 80; // Increased from 50px to 80px for 4K clarity
const GRID_W = 40; // Wider canvas
const GRID_H = 28; // Taller canvas

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
    transform: hoveredSeat === seatId ? 'scale(1.15)' : 'scale(1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    filter: selectedSeat === seatId ? 'drop-shadow(0 0 12px #f59e0b) brightness(1.2)' : 'none'
  });

  return (
    <div className="w-full h-full" style={{ backgroundColor: '#f8f5f0' }}>
      {/* 4K Quality Header */}
      {!hideHeader && !exportMode && (
        <div className="text-center py-6">
          <h2 className="text-4xl font-black text-stone-800 mb-3 tracking-wider">RAW SMITH CAFÉ</h2>
          <p className="text-lg text-stone-600 font-medium">4K Interactive Seating Experience</p>
        </div>
      )}

      {/* Main 4K Canvas Container */}
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          width: exportMode ? '100%' : 'auto',
          height: exportMode ? '100%' : (hideHeader ? "85vh" : "calc(100vh - 160px)"),
          maxWidth: exportMode ? 'none' : "98vw",
          aspectRatio: `${GRID_W / GRID_H}`,
          border: exportMode ? 'none' : '3px solid #8b7355',
          borderRadius: exportMode ? '0' : '1rem',
          boxShadow: exportMode ? 'none' : '0 30px 60px -15px rgba(0, 0, 0, 0.3)',
          backgroundColor: '#f5f1eb',
          backgroundImage: exportMode ? 'none' : 'radial-gradient(circle at 50% 50%, rgba(139, 115, 85, 0.05) 0%, transparent 70%)'
        }}
      >
        {/* Enhanced Café Building Structure with 3D effect */}
        <div
          className="absolute border-4 border-stone-800"
          style={{
            left: snap(3) * GRID_SIZE,
            top: snap(3) * GRID_SIZE,
            width: snap(34) * GRID_SIZE,
            height: snap(22) * GRID_SIZE,
            backgroundColor: "rgba(248, 245, 240, 0.95)",
            zIndex: 1,
            pointerEvents: "none",
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.15)'
          }}
        />

        {/* Premium Indoor Area */}
        <div
          className="absolute border-3 border-stone-700"
          style={{
            left: snap(3) * GRID_SIZE,
            top: snap(3) * GRID_SIZE,
            width: snap(34) * GRID_SIZE,
            height: snap(14) * GRID_SIZE,
            backgroundColor: "rgba(250, 247, 242, 0.8)",
            zIndex: 2,
            pointerEvents: "none",
            boxShadow: 'inset 0 2px 6px rgba(139, 115, 85, 0.1)'
          }}
        >
          <span className="absolute left-6 top-4 text-stone-800 font-black text-2xl bg-white/95 px-4 py-3 rounded-lg shadow-lg">
            🏠 Premium Indoor Seating
          </span>
        </div>

        {/* Luxury Outdoor Terrace */}
        <div
          className="absolute border-3 border-emerald-700"
          style={{
            left: snap(3) * GRID_SIZE,
            top: snap(17) * GRID_SIZE,
            width: snap(34) * GRID_SIZE,
            height: snap(8) * GRID_SIZE,
            backgroundColor: "rgba(236, 247, 239, 0.7)",
            zIndex: 2,
            pointerEvents: "none",
            boxShadow: 'inset 0 2px 6px rgba(5, 150, 105, 0.1)'
          }}
        >
          <span className="absolute left-6 top-4 text-emerald-800 font-black text-2xl bg-white/95 px-4 py-3 rounded-lg shadow-lg">
            🌿 Garden Terrace
          </span>
        </div>

        {/* 4K Quality Title */}
        <div
          className="absolute font-black text-center pointer-events-none"
          style={{
            left: snap(12) * GRID_SIZE,
            top: snap(0.8) * GRID_SIZE,
            fontSize: "42px",
            color: "#3c2415",
            zIndex: 50,
            width: 600,
            textShadow: "3px 3px 6px rgba(255,255,255,0.9), 1px 1px 2px rgba(0,0,0,0.1)",
            letterSpacing: "0.15em"
          }}
        >
          RAW SMITH CAFÉ
        </div>

        {/* ENHANCED INDOOR FURNITURE - Premium Layout */}
        
        {/* Main Service Bar Counter - Extended */}
        <CafeIconMarker
          icon="Table"
          gridX={snap(26)}
          gridY={snap(6)}
          gridW={8}
          gridH={2}
          gridSize={GRID_SIZE}
          iconColor="#8b4513"
          zIndex={20}
        />
        
        {/* Premium Bar Stools - 6 stools for better capacity */}
        {[22, 24, 26, 28, 30, 32].map((x, idx) => (
          <div
            key={`bar-stool-${idx}`}
            onClick={() => handleSeatClick(`premium-bar-${idx + 1}`)}
            onMouseEnter={() => setHoveredSeat(`premium-bar-${idx + 1}`)}
            onMouseLeave={() => setHoveredSeat(null)}
            style={getSeatStyle(`premium-bar-${idx + 1}`)}
          >
            <CafeIconMarker
              icon="BarStool"
              gridX={snap(x)}
              gridY={snap(9)}
              gridSize={GRID_SIZE}
              iconColor="#654321"
              zIndex={30}
            />
          </div>
        ))}

        {/* Luxury Window Lounge Area - Left side */}
        {[
          { x: 6, y: 7, id: 'window-lounge-1' },
          { x: 9, y: 7, id: 'window-lounge-2' },
          { x: 6, y: 10, id: 'window-lounge-3' },
          { x: 9, y: 10, id: 'window-lounge-4' }
        ].map((seat) => (
          <div
            key={seat.id}
            onClick={() => handleSeatClick(seat.id)}
            onMouseEnter={() => setHoveredSeat(seat.id)}
            onMouseLeave={() => setHoveredSeat(null)}
            style={getSeatStyle(seat.id)}
          >
            <CafeIconMarker
              icon="Armchair"
              gridX={snap(seat.x)}
              gridY={snap(seat.y)}
              gridSize={GRID_SIZE}
              iconColor="#1a5f1a"
              zIndex={25}
            />
          </div>
        ))}

        {/* Coffee tables for window area */}
        <CafeIconMarker
          icon="SideTable"
          gridX={snap(7.5)}
          gridY={snap(8.5)}
          gridSize={GRID_SIZE}
          iconColor="#8b4513"
          zIndex={20}
        />

        {/* Premium Indoor Dining - 4 tables arrangement */}
        {[
          { x: 14, y: 10, id: 'premium-table-1' },
          { x: 19, y: 10, id: 'premium-table-2' },
          { x: 14, y: 13, id: 'premium-table-3' },
          { x: 19, y: 13, id: 'premium-table-4' }
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
                iconColor="#a0522d"
                zIndex={20} 
              />
            </div>
            
            {/* 4 Chairs per table for premium experience */}
            {[
              { x: -2, y: 0 }, { x: 2, y: 0 }, { x: 0, y: -2 }, { x: 0, y: 2 }
            ].map((offset, idx) => (
              <div
                key={`${table.id}-chair-${idx}`}
                onClick={() => handleSeatClick(`${table.id}-chair-${idx + 1}`)}
                onMouseEnter={() => setHoveredSeat(`${table.id}-chair-${idx + 1}`)}
                onMouseLeave={() => setHoveredSeat(null)}
                style={getSeatStyle(`${table.id}-chair-${idx + 1}`)}
              >
                <CafeIconMarker 
                  icon="Chair" 
                  gridX={snap(table.x + offset.x)} 
                  gridY={snap(table.y + offset.y)} 
                  gridSize={GRID_SIZE} 
                  iconColor="#3c2415"
                  zIndex={20} 
                />
              </div>
            ))}
          </React.Fragment>
        ))}

        {/* LUXURY OUTDOOR FURNITURE - Garden Experience */}
        
        {/* Outdoor dining tables - 8 tables in premium arrangement */}
        {[
          { x: 8, y: 19, id: 'garden-table-1' },
          { x: 13, y: 19, id: 'garden-table-2' },
          { x: 18, y: 19, id: 'garden-table-3' },
          { x: 23, y: 19, id: 'garden-table-4' },
          { x: 8, y: 22, id: 'garden-table-5' },
          { x: 13, y: 22, id: 'garden-table-6' },
          { x: 18, y: 22, id: 'garden-table-7' },
          { x: 23, y: 22, id: 'garden-table-8' }
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
            {[-2, 2].map((offset, idx) => (
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

        {/* Enhanced Garden Elements */}
        {[
          { x: 4, y: 17 }, { x: 36, y: 17 }, { x: 4, y: 24 }, { x: 36, y: 24 },
          { x: 26, y: 17 }, { x: 31, y: 17 }, { x: 28, y: 24 }, { x: 33, y: 24 }
        ].map((plant, idx) => (
          <CafeIconMarker 
            key={`luxury-planter-${idx}`}
            icon="Planter" 
            gridX={snap(plant.x)} 
            gridY={snap(plant.y)} 
            gridSize={GRID_SIZE} 
            zIndex={20} 
          />
        ))}

        {/* Large Windows - Enhanced */}
        <div className="absolute pointer-events-none border-4 border-stone-500 bg-sky-200/60" 
             style={{
               left: snap(3) * GRID_SIZE,
               top: snap(5) * GRID_SIZE,
               width: snap(1) * GRID_SIZE,
               height: snap(8) * GRID_SIZE,
               zIndex: 5,
               boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
             }} />

        <div className="absolute pointer-events-none border-4 border-stone-500 bg-sky-200/60" 
             style={{
               left: snap(14) * GRID_SIZE,
               top: snap(3) * GRID_SIZE,
               width: snap(16) * GRID_SIZE,
               height: snap(1) * GRID_SIZE,
               zIndex: 5,
               boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
             }} />

        {/* Grand Entrance */}
        <CafeIconMarker
          icon="Door"
          gridX={snap(32)}
          gridY={snap(14)}
          gridW={3}
          gridH={3}
          gridSize={GRID_SIZE}
          label="Grand Entrance"
          zIndex={35}
        />

        {/* Service Counter Label - Enhanced */}
        <div className="absolute text-stone-900 font-black text-lg bg-amber-100/95 px-4 py-3 rounded-lg shadow-xl border-2 border-amber-200" 
             style={{ 
               left: snap(26) * GRID_SIZE, 
               top: snap(4) * GRID_SIZE, 
               zIndex: 40 
             }}>
          ☕ Premium Service Bar
        </div>

        {/* 4K Quality Legend */}
        {!exportMode && (
          <div className="absolute bottom-6 right-6 bg-white/98 p-6 rounded-xl shadow-2xl text-base max-w-sm border border-stone-200">
            <div className="font-black mb-4 text-xl text-stone-800">Seating Zones</div>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 bg-stone-400 rounded-lg shadow-sm"></div>
                <span className="font-semibold">Premium Indoor</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 bg-emerald-400 rounded-lg shadow-sm"></div>
                <span className="font-semibold">Garden Terrace</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 bg-amber-400 rounded-lg shadow-sm"></div>
                <span className="font-semibold">Window Lounge</span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Seat Info Panel */}
        {hoveredSeat && !exportMode && (
          <div className="absolute top-6 left-6 bg-white/98 p-6 rounded-xl shadow-2xl text-lg max-w-md border border-stone-200">
            <div className="font-black text-stone-900 text-2xl mb-3">{hoveredSeat}</div>
            <div className="text-stone-700 text-base leading-relaxed">
              {hoveredSeat.includes('premium-bar') && "☕ Premium bar seating with personalized service"}
              {hoveredSeat.includes('window-lounge') && "🛋️ Luxury window lounge with city views"}
              {hoveredSeat.includes('premium-table') && "🍽️ Premium indoor dining experience"}
              {hoveredSeat.includes('garden-table') && "🌿 Al fresco garden dining under the stars"}
              <br />
              <span className="text-amber-600 font-semibold">✨ Click to reserve your unique spot</span>
            </div>
          </div>
        )}

        {/* 4K Export Quality Badge */}
        {!exportMode && (
          <div className="absolute top-6 right-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-xl text-lg font-black shadow-lg">
            🎯 4K Interactive Experience
          </div>
        )}
      </div>
    </div>
  );
};
