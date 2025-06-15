import React, { useState } from "react";
import { CafeIconMarker } from "./CafeIconMarker";
import { CafeFurniture } from "./CafeFurniture";

// ENHANCED 4K/ISOMETRIC — matches provided reference image
export const CafeOfficialSeatingPlan: React.FC<{
  onSeatSelect?: (seatId: string) => void;
  selectedSeat?: string | null;
  hideHeader?: boolean;
  exportMode?: boolean;
}> = ({ onSeatSelect, selectedSeat, hideHeader, exportMode = false }) => {
  const [hoveredSeat, setHoveredSeat] = React.useState<string | null>(null);

  // Increased dramatically for ultra crisp 4K
  const GRID_SIZE = 90;
  const GRID_W = 30; // not square - fits the exact reference
  const GRID_H = 24;

  const snap = (n: number) => Math.round(n * 100) / 100; // 2 decimal precision for pixel-perfect

  const getSeatStyle = (seatId: string) => ({
    cursor: 'pointer',
    transform: hoveredSeat === seatId ? 'scale(1.13)' : 'scale(1)',
    transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
    filter: selectedSeat === seatId ? 'drop-shadow(0 0 20px #d3b16a) brightness(1.15)' : 'none'
  });

  return (
    <div
      className="w-full h-full"
      style={{ backgroundColor: "#efe6db" }}
    >
      {/* Only cafe sign/title, like the 3D visual */}
      <div
        className="absolute w-full text-center z-40"
        style={{
          top: 22, left: 0, fontFamily: "Inter, sans-serif",
          fontWeight: 900, letterSpacing: "0.11em"
        }}
      >
        <span className="text-[2.9vw] sm:text-[2.4vw] md:text-[2vw] lg:text-[1.7vw] xl:text-[1.6vw] 2xl:text-6xl" style={{ color: "#3d301f", textShadow: "1px 3px 16px #fff, 0 2px 2px #beb082" }}>RAW SMITH CAFÉ</span>
      </div>

      {/* Main isometric "room" */}
      <div
        className="relative mx-auto"
        style={{
          width: `calc(${GRID_W * GRID_SIZE}px)`,
          height: `calc(${GRID_H * GRID_SIZE}px)`,
          marginTop: exportMode ? 0 : 60,
          boxShadow: exportMode ? "none" : "0 6vw 4vw -3vw rgba(44,35,10,0.10)",
          background: "#e4dbca",
          border: "8px solid #d0b98c",
          borderRadius: 40,
          overflow: "visible",
        }}
      >
        {/* "Walls" */}
        <div className="absolute bg-[#e5dac6] border border-[#b6a36f]" style={{
          left: 0, top: 0, width: "100%", height: 85, borderRadius: 10, zIndex: 1
        }}/>
        <div className="absolute bg-[#e5dac6] border border-[#b6a36f]" style={{
          right: 0, bottom: 0, width: 62, height: "100%", borderRadius: 8, zIndex: 1
        }}/>

        {/* Front & left windows */}
        <div className="absolute bg-[#29241c] border border-neutral-400" style={{
          left: snap(3.2) * GRID_SIZE, top: snap(2.4) * GRID_SIZE, width: 6 * GRID_SIZE, height: 1.6 * GRID_SIZE, zIndex: 9, borderRadius: 9
        }} />
        <div className="absolute bg-[#222] border-black border" style={{
          left: snap(3.1) * GRID_SIZE, top: snap(8.2) * GRID_SIZE, width: 2.8 * GRID_SIZE, height: 1.3 * GRID_SIZE, zIndex: 6, borderRadius: 9
        }} />

        {/* Bar area and service opening */}
        <div className="absolute bg-[#231c15] border border-[#b6a36f]"
          style={{
            left: snap(17.6) * GRID_SIZE, top: snap(5.9) * GRID_SIZE,
            width: 7 * GRID_SIZE, height: 2.2 * GRID_SIZE,
            borderRadius: 8, zIndex: 18
          }} />
        {/* Entrance door */}
        <div className="absolute border-2 border-neutral-800 bg-[#484038] flex items-end justify-end"
          style={{
            left: snap(23.8) * GRID_SIZE, top: snap(8.5) * GRID_SIZE, width: 3.1 * GRID_SIZE, height: 4.3 * GRID_SIZE,
            zIndex: 18, borderRadius: 11
          }}/>

        {/* Floor tiling pattern */}
        <div className="absolute pointer-events-none w-full h-full" style={{
          background: "repeating-linear-gradient(90deg,#e9dfcc, #e9dfcc 48px, #d8caad 50px, #e9dfcc 99px), repeating-linear-gradient(#e9dfcc, #e9dfcc 48px, #d8caad 50px, #e9dfcc 99px)",
          opacity: .58,
          zIndex: 2,
        }} />

        {/* All furniture, isometric view */}
        <CafeFurniture
          gridSize={GRID_SIZE}
          snap={snap}
          onSeatSelect={onSeatSelect}
          selectedSeat={selectedSeat}
          hoveredSeat={hoveredSeat}
          setHoveredSeat={setHoveredSeat}
          getSeatStyle={getSeatStyle}
        />

        {/* Planter & fence at corners like reference (not interactive) */}
        <div className="absolute" style={{
          left: 20, top: (GRID_H - 2.3) * GRID_SIZE, width: 60, height: 100, borderLeft: "8px solid #928258", borderRadius: 7, zIndex: 8
        }} />
        <div className="absolute" style={{
          right: 18, top: (GRID_H - 2.1) * GRID_SIZE, width: 60, height: 100, borderRight: "8px solid #928258", borderRadius: 7, zIndex: 8
        }} />
        {/* Black fence lines */}
        <div className="absolute left-0 bottom-0 h-2 border-b-4 border-[#857546]" style={{ width: "100%", zIndex: 12 }}/>
        <div className="absolute left-0" style={{ bottom: 30, width: "100%", borderBottom: "4px solid #857546", zIndex: 12 }}/>

        {/* Hover info panel */}
        {hoveredSeat && !exportMode && (
          <div className="absolute left-8 top-8 bg-white/98 p-5 rounded-xl shadow-2xl text-lg max-w-md border border-stone-200 z-50">
            <div className="font-black text-stone-900 text-2xl mb-2">{hoveredSeat}</div>
            <div className="text-stone-700 text-base leading-relaxed">
              {hoveredSeat.startsWith('bar-stool') && "Bar stool: Enjoy your coffee at the bustling bar."}
              {(hoveredSeat.startsWith('table') || hoveredSeat.startsWith('wall-table')) && "Dining table: Relax and dine with friends."}
              {hoveredSeat.startsWith('alcove') && "Lounge seating: Cozy up in an armchair corner."}
              {hoveredSeat.includes('chair') && "Chair: Take a comfy seat."}
              <span className="block text-amber-600 font-semibold mt-2">Click to reserve your spot.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
