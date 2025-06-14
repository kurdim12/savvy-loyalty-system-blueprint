
import React from "react";
import { CafeIconMarker } from "./CafeIconMarker";

const GRID_SIZE = 56; // px per 1m
const GRID_W = 20;
const GRID_H = 15;
const SIDE_MARGIN = 5;
// USE the user-uploaded floor plan image.
const BACKGROUND_IMAGE = "/lovable-uploads/c997f6ab-0f6d-4528-aedf-ca1401ad2e6d.png";

const COLOR_INDOOR = "rgba(245,245,245,0.05)";
const COLOR_OUTDOOR = "rgba(245,230,210,0.02)";

export const CafeOfficialSeatingPlan: React.FC<{
  onSeatSelect?: (seatId: string) => void;
  selectedSeat?: string | null;
  hideHeader?: boolean;
}> = () => {
  // Helper grid snap
  const snap = (n: number) => Math.round(n);

  // Zones
  const indoorZone = {
    x: SIDE_MARGIN,
    y: 0,
    w: GRID_W - 2 * SIDE_MARGIN,
    h: Math.round(GRID_H * 2 / 3)
  };
  const outdoorZone = {
    x: SIDE_MARGIN,
    y: Math.round(GRID_H * 2 / 3),
    w: GRID_W - 2 * SIDE_MARGIN,
    h: GRID_H - Math.round(GRID_H * 2 / 3)
  };

  // TERRACE railing workaround: just a styled div, full width.
  const railingHeight = 0.25;

  return (
    <div
      className="relative w-full h-full"
      style={{
        aspectRatio: `${GRID_W / GRID_H}`,
        minHeight: 480,
        overflow: "hidden",
        background: "#f2e8db"
      }}
    >
      {/* === 1. BG PLAN IMAGE (fit → cover, locked, no white margins) === */}
      <img
        src={BACKGROUND_IMAGE}
        alt="RAW SMITH Café plan"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        style={{ zIndex: 1 }}
        draggable={false}
      />

      {/* === 2. ZONES overlays (no margins) === */}
      {/* Indoor */}
      <div
        className="absolute"
        style={{
          left: indoorZone.x * GRID_SIZE,
          top: indoorZone.y * GRID_SIZE,
          width: indoorZone.w * GRID_SIZE,
          height: indoorZone.h * GRID_SIZE,
          background: COLOR_INDOOR,
          zIndex: 10,
          pointerEvents: "none"
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 6,
            top: 7,
            color: "#444",
            fontWeight: 600,
            fontSize: 16,
            background: "rgba(255,255,255, 0.35)",
            padding: "0.18em 0.55em",
            borderRadius: 6,
          }}
        >
          Indoor
        </span>
      </div>
      {/* Outdoor */}
      <div
        className="absolute"
        style={{
          left: outdoorZone.x * GRID_SIZE,
          top: outdoorZone.y * GRID_SIZE,
          width: outdoorZone.w * GRID_SIZE,
          height: outdoorZone.h * GRID_SIZE,
          background: COLOR_OUTDOOR,
          zIndex: 10,
          pointerEvents: "none"
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 6,
            top: 7,
            color: "#554e34",
            fontWeight: 600,
            fontSize: 16,
            background: "rgba(255,245,230, 0.18)",
            padding: "0.17em 0.56em",
            borderRadius: 6,
          }}
        >
          Outdoor
        </span>
      </div>

      {/* === 3. 1m GRID LINES === */}
      {[...Array(GRID_H + 1)].map((_, i) => (
        <div
          key={"row-" + i}
          className="absolute left-0 w-full border-t border-black/20"
          style={{
            top: i * GRID_SIZE,
            zIndex: 20
          }}
        />
      ))}
      {[...Array(GRID_W + 1)].map((_, i) => (
        <div
          key={"col-" + i}
          className="absolute top-0 h-full border-l border-black/15"
          style={{
            left: i * GRID_SIZE,
            zIndex: 20
          }}
        />
      ))}

      {/* Bar counter (rectangle against top wall, dark color) */}
      <div className="absolute"
        style={{
          left: snap(GRID_W / 2 - 4) * GRID_SIZE,
          top: snap(0.3 * GRID_SIZE),
          width: 8 * GRID_SIZE,
          height: 1.2 * GRID_SIZE,
          background: "#18181a",
          borderRadius: 14,
          border: "3.5px solid #111",
          zIndex: 41,
          boxShadow: "0 2px 10px #0002"
        }}
      />

      {/* Bar Stools (4) evenly spaced */}
      {[0, 1, 2, 3].map(i => (
        <CafeIconMarker
          key={"barstool-" + i}
          icon="BarStool"
          gridX={snap(GRID_W / 2 - 2.5 + i * 1.75)}
          gridY={snap(1.25)}
          gridW={1}
          gridH={1}
          gridSize={GRID_SIZE}
          iconColor="#111"
          zIndex={45}
        />
      ))}

      {/* Lounge nook: 2x Armchair, 1x SideTable */}
      <CafeIconMarker
        icon="Armchair"
        gridX={SIDE_MARGIN + 1}
        gridY={1}
        gridW={1}
        gridH={1}
        gridSize={GRID_SIZE}
        iconColor="#316452"
        zIndex={44}
      />
      <CafeIconMarker
        icon="Armchair"
        gridX={SIDE_MARGIN + 2}
        gridY={2}
        gridW={1}
        gridH={1}
        gridSize={GRID_SIZE}
        iconColor="#316452"
        zIndex={44}
      />
      <CafeIconMarker
        icon="SideTable"
        gridX={SIDE_MARGIN + 1.6}
        gridY={1.48}
        gridW={1}
        gridH={1}
        gridSize={GRID_SIZE}
        iconColor="#222"
        zIndex={44}
      />

      {/* Center 2x2 tables each with 2 chairs */}
      {[
        { x: snap(GRID_W/2 - 3), y: snap(indoorZone.h / 2 - 1.3) },
        { x: snap(GRID_W/2 + 1.5), y: snap(indoorZone.h / 2 - 1.3) },
        { x: snap(GRID_W/2 - 3), y: snap(indoorZone.h / 2 + 1.3) },
        { x: snap(GRID_W/2 + 1.5), y: snap(indoorZone.h / 2 + 1.3) }
      ].map((pos, idx) => (
        <React.Fragment key={"central-table-" + idx}>
          <CafeIconMarker icon="Table" gridX={pos.x} gridY={pos.y} gridW={1} gridH={1} gridSize={GRID_SIZE} zIndex={42} />
          {/* Each table: 2 chairs, left and right */}
          <CafeIconMarker icon="Chair" gridX={pos.x - 0.85} gridY={pos.y + 0.2} gridW={1} gridH={1} gridSize={GRID_SIZE} zIndex={42} />
          <CafeIconMarker icon="Chair" gridX={pos.x + 0.85} gridY={pos.y + 0.2} gridW={1} gridH={1} gridSize={GRID_SIZE} zIndex={42} />
        </React.Fragment>
      ))}

      {/* --- OUTDOOR --- */}
      {/* Terrace railing across dividing line */}
      <div className="absolute"
        style={{
          left: outdoorZone.x * GRID_SIZE,
          top: (outdoorZone.y - railingHeight) * GRID_SIZE,
          width: outdoorZone.w * GRID_SIZE,
          height: railingHeight * GRID_SIZE,
          background: "#23201c",
          borderRadius: 7,
          border: "2px solid #222",
          zIndex: 36,
          boxShadow: "0 2px 9px #0003",
        }}
      />

      {/* Four outdoor tables (evenly spaced horizontally) */}
      {[0, 1, 2, 3].map(idx => {
        const outdoorTableX = SIDE_MARGIN + 2.3 + idx * 3.8;
        const outdoorTableY = outdoorZone.y + 2.9;
        return (
          <React.Fragment key={"outdoor-table-" + idx}>
            <CafeIconMarker icon="Table" gridX={outdoorTableX} gridY={outdoorTableY} gridW={1} gridH={1} gridSize={GRID_SIZE} zIndex={33} />
            {/* Each table: 2 chairs, left/right (facing inward) */}
            <CafeIconMarker icon="Chair" gridX={outdoorTableX - 0.75} gridY={outdoorTableY + 0.18} gridW={1} gridH={1} gridSize={GRID_SIZE} zIndex={33} />
            <CafeIconMarker icon="Chair" gridX={outdoorTableX + 0.75} gridY={outdoorTableY + 0.18} gridW={1} gridH={1} gridSize={GRID_SIZE} zIndex={33} />
          </React.Fragment>
        );
      })}

      {/* Planter icons in each outdoor slab corner */}
      <CafeIconMarker icon="Planter" gridX={SIDE_MARGIN + 0.1} gridY={outdoorZone.y + 0.1} gridW={1} gridH={1.2} gridSize={GRID_SIZE} iconColor="#365531" zIndex={40} />
      <CafeIconMarker icon="Planter" gridX={SIDE_MARGIN + outdoorZone.w - 1.2} gridY={outdoorZone.y + 0.1} gridW={1} gridH={1.2} gridSize={GRID_SIZE} iconColor="#365531" zIndex={40} />
      <CafeIconMarker icon="Planter" gridX={SIDE_MARGIN + 0.1} gridY={outdoorZone.y + outdoorZone.h - 1.2} gridW={1} gridH={1.2} gridSize={GRID_SIZE} iconColor="#365531" zIndex={40} />
      <CafeIconMarker icon="Planter" gridX={SIDE_MARGIN + outdoorZone.w - 1.2} gridY={outdoorZone.y + outdoorZone.h - 1.2} gridW={1} gridH={1.2} gridSize={GRID_SIZE} iconColor="#365531" zIndex={40} />

      {/* Sliding-door (entrance) */}
      <CafeIconMarker
        icon="Door"
        gridX={snap(GRID_W/2 - 1)}
        gridY={indoorZone.h - 0.82}
        gridW={2}
        gridH={0.7}
        gridSize={GRID_SIZE}
        zIndex={99}
        label="Entrance"
      />
      {/* Fold-up window (bar window) */}
      <CafeIconMarker
        icon="Door"
        gridX={snap(GRID_W/2 - 5)}
        gridY={indoorZone.h - 0.55}
        gridW={3}
        gridH={0.6}
        gridSize={GRID_SIZE}
        zIndex={99}
        label="Bar Window"
      />

      {/* RAW SMITH Branding */}
      <div
        className="absolute font-black tracking-widest drop-shadow text-center"
        style={{
          left: snap((GRID_W/2 - 3.5) * GRID_SIZE),
          top: snap((indoorZone.h - 2.0) * GRID_SIZE),
          fontSize: "2.1rem",
          color: "#111",
          zIndex: 120,
          width: 220,
        }}
      >
        RAW SMITH
      </div>
    </div>
  );
};
