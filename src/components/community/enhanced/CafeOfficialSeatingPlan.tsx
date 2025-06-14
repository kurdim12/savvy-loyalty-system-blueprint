
import React, { useState } from "react";
import clsx from "clsx";
import { Card } from "@/components/ui/card";
import { Coffee, Users } from "lucide-react";

interface CafeOfficialSeatingPlanProps {
  onSeatSelect?: (seatId: string) => void;
  selectedSeat?: string | null;
  hideHeader?: boolean;
}

const TABLES = [
  { id: "window-corner", x: 7, y: 12, w: 16, h: 15, type: "cozy", label: "Cozy Corner" }, // green chair
  { id: "center1", x: 28, y: 18, w: 14, h: 14, type: "center", label: "Table 1" },
  { id: "center2", x: 46, y: 20, w: 14, h: 14, type: "center", label: "Table 2" },
  { id: "patio", x: 67, y: 33, w: 13, h: 13, type: "outdoor", label: "Patio Table" },
  { id: "bar1", x: 72, y: 13, w: 10, h: 7, type: "bar", label: "Bar Seat 1" },
  { id: "bar2", x: 72, y: 21, w: 10, h: 7, type: "bar", label: "Bar Seat 2" },
];

const CHAIRS = [
  // Center tables: 4 chairs each
  { table: "center1", pos: [27, 19] },
  { table: "center1", pos: [33, 17] },
  { table: "center1", pos: [29, 27] },
  { table: "center1", pos: [38, 23] },
  { table: "center2", pos: [47, 28] },
  { table: "center2", pos: [53, 19] },
  { table: "center2", pos: [45, 16] },
  { table: "center2", pos: [58, 27] },
  // Patio: 2 chairs
  { table: "patio", pos: [70, 40] },
  { table: "patio", pos: [75, 34] },
  // Cozy corner: 2 green armchairs
  { table: "window-corner", pos: [10, 22], color: "bg-green-800" },
  { table: "window-corner", pos: [17, 18], color: "bg-green-700" },
  // Bar stools
  { table: "bar1", pos: [78, 14], shape: "barstool" },
  { table: "bar2", pos: [78, 22], shape: "barstool" },
];

const PLANTS = [
  { x: 3.5, y: 8 },
  { x: 10, y: 39 },
  { x: 85, y: 15 },
  { x: 90, y: 39 },
];

export const CafeOfficialSeatingPlan: React.FC<CafeOfficialSeatingPlanProps> = ({
  onSeatSelect,
  selectedSeat,
  hideHeader,
}) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[510px] max-w-4xl mx-auto">
      {/* Header */}
      {!hideHeader && (
        <div className="absolute top-2 left-2 z-10">
          <Card className="bg-white/80 backdrop-blur-md border-stone-300/60 shadow-md px-4 py-2">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-stone-700 tracking-wide">Official Café Seating Plan</h2>
              <div className="flex items-center gap-2 text-stone-500 text-xs">
                <Coffee className="h-4 w-4" /> RAW SMITH interior layout
              </div>
              <p className="text-stone-400 text-xs">Click a seat or table to join!</p>
            </div>
          </Card>
        </div>
      )}

      {/* Room Walls (isometric) */}
      <div className="absolute inset-0">
        {/* Left & back wall */}
        <div className="absolute left-0 top-0 w-[66%] h-[56%] bg-stone-300 rounded-tl-2xl rounded-br-md shadow-2xl" style={{
          transform: "skewY(-22deg) skewX(-15deg)",
        }} />
        <div className="absolute right-0 top-0 w-[36%] h-[90%] bg-stone-200" style={{
          transform: "skewY(18deg) skewX(-6deg)",
        }} />
      </div>
      {/* Main floor space */}
      <div className="absolute inset-0 bg-neutral-100/90 rounded-2xl" />

      {/* Plants (in pots) */}
      {PLANTS.map((plant, idx) => (
        <div
          key={idx}
          className="absolute"
          style={{
            left: `${plant.x}%`,
            top: `${plant.y}%`,
          }}
        >
          <div className="w-8 h-16 rounded-b-2xl rounded-t-xl bg-emerald-900 flex flex-col items-center shadow-md">
            <div className="w-5 h-8 bg-green-700 rounded-t-full mt-0.5" />
          </div>
        </div>
      ))}

      {/* Bar counter (right wall) */}
      <div className="absolute bg-[#262626] rounded-lg shadow-xl"
        style={{
          left: "73%",
          top: "7%",
          width: "13%",
          height: "25%",
          borderTop: "6px solid #b4a383",
        }}>
        {/* bar wood */}
        <div className="absolute left-0 w-full bg-yellow-900 h-3 rounded-t-md" />
      </div>

      {/* Tables */}
      {TABLES.map((table) => (
        <div key={table.id}>
          <button
            className={clsx(
              "absolute transition-all duration-200 outline-none focus:ring-2 ring-amber-400 rounded-lg group",
              selectedSeat === table.id ? "ring-4 z-10" : hovered === table.id ? "ring-2 ring-amber-300" : "",
            )}
            style={{
              left: `${table.x}%`,
              top: `${table.y}%`,
              width: `${table.w}%`,
              height: `${table.h}%`,
            }}
            aria-label={table.label}
            onMouseEnter={() => setHovered(table.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSeatSelect?.(table.id)}
          >
            {/* Table top */}
            <div className={clsx(
              "w-full h-full rounded-md flex items-center justify-center",
              table.type === "bar" ? "bg-yellow-900/80 border-amber-600 border-2" : "bg-yellow-900/80 border-amber-400 border-4"
            )}>
              <span className="text-xs text-white font-semibold opacity-80 drop-shadow">{table.label}</span>
            </div>
          </button>
        </div>
      ))}

      {/* Chairs */}
      {CHAIRS.map((chair, idx) => (
        <button
          key={idx}
          className={clsx(
            "absolute cursor-pointer transition-all duration-150",
            chair.shape === "barstool"
              ? "rounded-md bg-stone-600 w-5 h-9 left-0.5 shadow"
              : (chair.color || "bg-stone-800") + " w-6 h-6 rounded-full shadow",
            hovered === `${chair.table}-chair-${idx}` ? "ring-2 ring-emerald-300" : "",
          )}
          style={{
            left: `${chair.pos[0]}%`,
            top: `${chair.pos[1]}%`,
            zIndex: 2,
          }}
          aria-label={`${chair.table} chair ${idx + 1}`}
          onMouseEnter={() => setHovered(`${chair.table}-chair-${idx}`)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSeatSelect?.(`${chair.table}-chair-${idx}`)}
        />
      ))}

      {/* Patio fence */}
      <div className="absolute rounded-xl" style={{
        left: "64%",
        top: "33%",
        width: "29%",
        height: "28%",
        border: "5px solid #aca087",
        borderTop: "none",
        borderLeft: "none",
        borderBottomRightRadius: "40px",
      }} />

      {/* RAW SMITH sign */}
      <div className="absolute right-6 top-4 font-extrabold text-2xl text-[#292826] tracking-widest drop-shadow" style={{
        transform: "rotate(-9deg) skewX(-5deg)"
      }}>
        RAW SMITH
      </div>
    </div>
  );
};
