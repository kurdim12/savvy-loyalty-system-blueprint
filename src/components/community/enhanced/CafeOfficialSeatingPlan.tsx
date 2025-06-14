import React, { useState } from "react";
import clsx from "clsx";
import { Card } from "@/components/ui/card";
import { Armchair, Table } from "lucide-react";
import { CafeIconMarker } from "./CafeIconMarker";

const GRID_SIZE = 56; // px per 1m, for a larger, sharper grid
const GRID_W = 20; // meters across
const GRID_H = 15; // meters tall
const SIDE_MARGIN = 5; // m on each side
// Uploaded PNG - use as full-canvas background!
const BACKGROUND_IMAGE = "/lovable-uploads/680bf950-de42-45c2-bcfd-0e9b786df840.png";

export const CafeOfficialSeatingPlan: React.FC<{
  onSeatSelect?: (seatId: string) => void;
  selectedSeat?: string | null;
  hideHeader?: boolean;
}> = ({ onSeatSelect, selectedSeat, hideHeader }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  // 1. Zones overlays
  const indoorZone = {
    x: 0,
    y: 0,
    w: GRID_W,
    h: Math.round(GRID_H * 2/3),
    color: "#edededbb"
  }
  const outdoorZone = {
    x: 0,
    y: Math.round(GRID_H * 2/3),
    w: GRID_W,
    h: GRID_H - Math.round(GRID_H * 2/3),
    color: "#efe5d3d9"
  }

  // Helper grid snap: don't render half-pixels
  const snap = (n: number) => Math.round(n);

  return (
    <div
      className="relative w-full h-full"
      style={{
        aspectRatio: `${GRID_W/GRID_H}`,
        minHeight: 480,
        fontFamily: "inherit",
        boxShadow: "0 2px 40px #2222",
        overflow: "hidden"
      }}
    >
      {/* === 1. BG PLAN IMAGE === */}
      <img
        src={BACKGROUND_IMAGE}
        alt="RAW SMITH Café plan"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        style={{ zIndex: 1 }}
        draggable={false}
      />

      {/* === 2. ZONES overlays (no margins) === */}
      <div
        className="absolute"
        style={{
          left: indoorZone.x * GRID_SIZE,
          top: indoorZone.y * GRID_SIZE,
          width: indoorZone.w * GRID_SIZE,
          height: indoorZone.h * GRID_SIZE,
          background: indoorZone.color,
          zIndex: 10
        }}
      />
      <div
        className="absolute"
        style={{
          left: outdoorZone.x * GRID_SIZE,
          top: outdoorZone.y * GRID_SIZE,
          width: outdoorZone.w * GRID_SIZE,
          height: outdoorZone.h * GRID_SIZE,
          background: outdoorZone.color,
          zIndex: 10
        }}
      />

      {/* === 3. Grid Lines === */}
      {[...Array(GRID_H+1)].map((_, i) => (
        <div
          key={"row-"+i}
          className="absolute left-0 w-full border-t border-black/30"
          style={{
            top: i * GRID_SIZE, zIndex: 20
          }}
        />
      ))}
      {[...Array(GRID_W+1)].map((_, i) => (
        <div
          key={"col-"+i}
          className="absolute top-0 h-full border-l border-black/25"
          style={{
            left: i * GRID_SIZE, zIndex: 20
          }}
        />
      ))}


      {/* --- 4. Furniture (INDOOR) --- */}
      {/* -- Bar counter (8m, 4 stools, top wall) -- */}
      <div className="absolute"
        style={{
          left: snap((GRID_W/2 - 4) * GRID_SIZE),
          top: snap(0.3 * GRID_SIZE),
          width: 8 * GRID_SIZE,
          height: 1.2 * GRID_SIZE,
          background: "#1a1a1b",
          borderRadius: 12,
          border: "3.5px solid #111",
          boxShadow: "0 2px 10px #0002",
          zIndex: 41,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}
      />

      {/* Stools (center and spaced) */}
      {[0, 1, 2, 3].map(i => (
        <CafeIconMarker
          key={"indoor-stool-"+i}
          icon="Stool"
          gridX={snap(GRID_W/2 - 2.6 + i*1.9)}
          gridY={snap(1.32)}
          gridW={1}
          gridH={1}
          gridSize={GRID_SIZE}
          iconColor="#111"
          zIndex={45}
        />
      ))}

      {/* -- Lounge nook, top left -- */}
      <CafeIconMarker icon="Armchair" gridX={1} gridY={1} gridW={1} gridH={1} gridSize={GRID_SIZE} iconColor="#25653d" zIndex={44}/>
      <CafeIconMarker icon="Armchair" gridX={2} gridY={2} gridW={1} gridH={1} gridSize={GRID_SIZE} iconColor="#25653d" zIndex={44}/>
      <CafeIconMarker icon="Side Table" gridX={1.6} gridY={1.5} gridW={1} gridH={1} gridSize={GRID_SIZE} iconColor="#222" zIndex={44}/>

      {/* -- Main indoor seating: 2x2 tables, each with 2 chairs -- */}
      {[
        {x:7, y:5.5}, {x:11.5, y:5.5},
        {x:7, y:9},   {x:11.5, y:9}
      ].map((pos, idx) => (
        <React.Fragment key={"indoor-table-"+idx}>
          <CafeIconMarker icon="Table" gridX={pos.x} gridY={pos.y} gridW={1} gridH={1} gridSize={GRID_SIZE} zIndex={42}/>
          {/* chairs for each, left/right */}
          <CafeIconMarker icon="Chair" gridX={pos.x-0.85} gridY={pos.y+0.2} gridW={1} gridH={1} gridSize={GRID_SIZE} zIndex={42}/>
          <CafeIconMarker icon="Chair" gridX={pos.x+0.85} gridY={pos.y+0.2} gridW={1} gridH={1} gridSize={GRID_SIZE} zIndex={42}/>
        </React.Fragment>
      ))}

      {/* --- 5. Furniture (OUTDOOR) --- */}
      {/* Outdoor terrace: 4 tables, spaced */}
      {[0,1,2,3].map(idx=>{
        const x = 3.5 + idx*4;
        const y = outdoorZone.y + 2.8;
        return (
          <React.Fragment key={"outdoor-table-"+idx}>
            <CafeIconMarker icon="Table" gridX={x} gridY={y} gridW={1} gridH={1} gridSize={GRID_SIZE} zIndex={33}/>
            <CafeIconMarker icon="Chair" gridX={x-0.75} gridY={y+0.2} gridW={1} gridH={1} gridSize={GRID_SIZE} zIndex={33}/>
            <CafeIconMarker icon="Chair" gridX={x+0.75} gridY={y+0.2} gridW={1} gridH={1} gridSize={GRID_SIZE} zIndex={33}/>
          </React.Fragment>
        )
      })}

      {/* --- 6. DOORS & WINDOWS --- */}
      {/* Sliding Door */}
      <CafeIconMarker
        icon="Door"
        gridX={GRID_W/2 - 1}
        gridY={indoorZone.h-0.85}
        gridW={2}
        gridH={0.7}
        gridSize={GRID_SIZE}
        zIndex={99}
      />
      {/* Bar Window (3m), to left of door */}
      <CafeIconMarker
        icon="Window"
        gridX={GRID_W/2 - 5}
        gridY={indoorZone.h-0.55}
        gridW={3}
        gridH={0.6}
        gridSize={GRID_SIZE}
        zIndex={99}
      />

      {/* --- 7. LABELS & BRANDING --- */}
      {/* "Entrance" label above sliding door */}
      <div className="absolute text-black font-bold text-sm px-3 py-1 rounded bg-white/90 text-center shadow"
        style={{
          left: snap((GRID_W/2 - 0.5) * GRID_SIZE),
          top: snap((indoorZone.h-1.3) * GRID_SIZE),
          zIndex: 120,
          width: 90
        }}
      >Entrance</div>
      {/* "Bar Window" label above window */}
      <div className="absolute text-black font-bold text-sm px-2 py-1 rounded bg-white/90 text-center shadow"
        style={{
          left: snap((GRID_W/2 - 3.8) * GRID_SIZE),
          top: snap((indoorZone.h-1.0) * GRID_SIZE),
          zIndex: 120,
          width: 112
        }}
      >Bar Window</div>
      {/* RAW SMITH logo above bar window, centered */}
      <div className="absolute font-black tracking-widest drop-shadow"
        style={{
          left: snap((GRID_W/2 - 3.5) * GRID_SIZE),
          top: snap((indoorZone.h-2.0) * GRID_SIZE),
          fontSize: "2.2rem",
          color: "#111",
          zIndex: 140,
          width: 220,
          textAlign: "center"
        }}
      >RAW SMITH</div>

      {/* Header Card (optional) */}
      {!hideHeader && (
        <div className="absolute left-6 top-6 z-150">
          <Card className="bg-white/80 border-stone-300/40 shadow px-6 py-2">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-stone-700 tracking-wide font-playfair">Official RAW SMITH Seating Plan</h2>
              <p className="text-stone-400 text-xs">Choose any seat or table to join!</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
