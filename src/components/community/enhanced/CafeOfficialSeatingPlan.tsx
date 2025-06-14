
import React, { useState } from "react";
import clsx from "clsx";
import { Card } from "@/components/ui/card";
import { Coffee, Users } from "lucide-react";

interface CafeOfficialSeatingPlanProps {
  onSeatSelect?: (seatId: string) => void;
  selectedSeat?: string | null;
  hideHeader?: boolean;
}

// Table and seat arrangements are now carefully modeled to match the photo more closely!
const TABLES = [
  // Cozy green armchair corner ("Cozy Corner")
  { id: "cozy-corner", x: 6, y: 68, w: 10, h: 12, type: "cozy", label: "Cozy Corner" },
  // Window tables (appear left)
  { id: "window-1", x: 13, y: 57, w: 8, h: 7, type: "window", label: "Window Table 1" },
  { id: "window-2", x: 22, y: 49, w: 7, h: 7, type: "window", label: "Window Table 2" },
  { id: "window-3", x: 29, y: 41, w: 7, h: 7, type: "window", label: "Window Table 3" },
  // Two central tables
  { id: "center-1", x: 45, y: 56, w: 13, h: 13, type: "center", label: "Center Table 1" },
  { id: "center-2", x: 60, y: 45, w: 13, h: 13, type: "center", label: "Center Table 2" },
  // Patio/outdoor
  { id: "patio", x: 80, y: 65, w: 13, h: 13, type: "outdoor", label: "Patio Table" },
  // Bar (vertical, upper right)
  { id: "bar-left", x: 75, y: 25, w: 8, h: 7, type: "bar", label: "Bar Seat 1" },
  { id: "bar-right", x: 83, y: 32, w: 8, h: 7, type: "bar", label: "Bar Seat 2" },
];

const CHAIRS = [
  // Cozy Corner
  { table: "cozy-corner", pos: [7, 77], color: "bg-green-700" },
  { table: "cozy-corner", pos: [13, 68], color: "bg-green-800" },
  // Window Seats
  { table: "window-1", pos: [11, 53] },
  { table: "window-1", pos: [17, 61] },
  { table: "window-2", pos: [21, 54] },
  { table: "window-2", pos: [26, 49] },
  { table: "window-3", pos: [32, 41] },
  // Central Tables: 4 chairs each
  { table: "center-1", pos: [42, 61] }, // left
  { table: "center-1", pos: [51, 65] }, // right
  { table: "center-1", pos: [46, 53] }, // above
  { table: "center-1", pos: [56, 59] }, // below
  { table: "center-2", pos: [58, 48] }, // left
  { table: "center-2", pos: [66, 49] }, // right
  { table: "center-2", pos: [62, 43] }, // above
  { table: "center-2", pos: [68, 55] }, // below
  // Patio seats
  { table: "patio", pos: [87, 78] },
  { table: "patio", pos: [83, 70] },
  // Bar stools (vertical bar seats)
  { table: "bar-left", pos: [75, 33], shape: "barstool" },
  { table: "bar-right", pos: [87, 38], shape: "barstool" },
];

// Decorative plants as in the reference image
const PLANTS = [
  { x: 5, y: 40 },
  { x: 15, y: 79 },
  { x: 75, y: 19 },
  { x: 90, y: 68 },
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
              <h2 className="text-xl font-bold text-stone-700 tracking-wide font-playfair">
                Official Café Seating Plan
              </h2>
              <div className="flex items-center gap-2 text-stone-500 text-xs">
                <Coffee className="h-4 w-4" /> RAW SMITH - isometric interior
              </div>
              <p className="text-stone-400 text-xs">Click a seat or table to join!</p>
            </div>
          </Card>
        </div>
      )}

      {/* Background Walls with Isometric/angled effect to match reference */}
      <div className="absolute inset-0">
        {/* Left wall */}
        <div
          className="absolute left-0 top-[8%] w-[20%] h-[80%] bg-stone-300/70 rounded-tl-3xl"
          style={{ transform: "skewY(-16deg) skewX(-13deg)" }}
        />
        {/* Back wall */}
        <div
          className="absolute right-0 top-0 w-[65%] h-[56%] bg-stone-200/95 rounded-t-2xl shadow-2xl"
          style={{ transform: "skewY(12deg) skewX(-11deg)" }}
        />
        {/* Main floor space with faint wood effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#e7dbcd] via-[#e3c7a6] to-[#f1e5d3] rounded-2xl border-amber-300/50 border" />
      </div>

      {/* Plants */}
      {PLANTS.map((plant, idx) => (
        <div
          key={idx}
          className="absolute"
          style={{
            left: `${plant.x}%`,
            top: `${plant.y}%`,
          }}
        >
          <div className="w-9 h-16 rounded-b-2xl rounded-t-xl bg-emerald-900 flex flex-col items-center shadow-md">
            <div className="w-5 h-8 bg-green-700 rounded-t-full mt-0.5" />
          </div>
        </div>
      ))}

      {/* Bar counter (vertical, right) */}
      <div
        className="absolute rounded-xl shadow-xl bg-[#c9ab74] border border-amber-700"
        style={{
          left: "73%",
          top: "25%",
          width: "15%",
          height: "22%",
          borderTop: "5px solid #b49b7f",
        }}
      >
        <div className="absolute left-0 top-1 w-full bg-yellow-900 h-3 rounded-t-md" />
      </div>

      {/* Patio fence, curvier style */}
      <div
        className="absolute rounded-2xl border border-[#aca087]"
        style={{
          left: "77%",
          top: "67%",
          width: "17%",
          height: "19%",
          borderTop: "none",
          borderLeft: "none",
          borderBottomRightRadius: "40px",
          borderWidth: "5px",
          boxShadow: "0 4px 12px #b2a48266",
        }}
      />

      {/* Isometric patio wood */}
      <div
        className="absolute rounded-2xl"
        style={{
          left: "80%",
          top: "66%",
          width: "12%",
          height: "13%",
          background:
            "repeating-linear-gradient(135deg, #e3bc85, #e3bc85 6px, #e1ad71 6px, #e1ad71 15px)",
          opacity: 0.9,
        }}
      />

      {/* MAIN TABLES */}
      {TABLES.map((table) => (
        <button
          key={table.id}
          className={clsx(
            "absolute transition-all duration-200 outline-none focus:ring-2 ring-amber-400 rounded-lg group",
            selectedSeat === table.id
              ? "ring-4 z-10"
              : hovered === table.id
              ? "ring-2 ring-amber-300"
              : ""
          )}
          style={{
            left: `${table.x}%`,
            top: `${table.y}%`,
            width: `${table.w}%`,
            height: `${table.h}%`,
            zIndex: 3,
          }}
          aria-label={table.label}
          onMouseEnter={() => setHovered(table.id)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSeatSelect?.(table.id)}
        >
          <div
            className={clsx(
              "w-full h-full rounded-md flex items-center justify-center border-4 text-xs font-semibold drop-shadow",
              table.type === "bar"
                ? "bg-yellow-900/90 border-amber-700"
                : table.type === "cozy"
                ? "bg-green-900/90 border-emerald-600"
                : table.type === "outdoor"
                ? "bg-[#ebe2d4]/90 border-[#c6bc97]"
                : "bg-yellow-900/90 border-amber-400"
            )}
          >
            <span
              className={clsx(
                "text-white font-semibold opacity-85",
                table.type === "cozy" ? "text-green-200" : "",
                table.type === "outdoor" ? "text-yellow-900" : ""
              )}
            >
              {table.label}
            </span>
          </div>
        </button>
      ))}

      {/* CHAIRS */}
      {CHAIRS.map((chair, idx) => (
        <button
          key={idx}
          className={clsx(
            "absolute cursor-pointer transition-all duration-150",
            chair.shape === "barstool"
              ? "rounded-sm bg-stone-700 w-4 h-8 left-0.5 shadow"
              : (chair.color || "bg-stone-800") +
                " w-5 h-5 rounded-full shadow-lg border-2 border-stone-700 hover:border-green-500"
          )}
          style={{
            left: `${chair.pos[0]}%`,
            top: `${chair.pos[1]}%`,
            zIndex: 4,
          }}
          aria-label={`${chair.table} chair ${idx + 1}`}
          onMouseEnter={() => setHovered(`${chair.table}-chair-${idx}`)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSeatSelect?.(`${chair.table}-chair-${idx}`)}
        />
      ))}

      {/* RAW SMITH - signage (top right) */}
      <div
        className="absolute right-8 top-3 font-extrabold text-2xl text-[#292826] tracking-widest drop-shadow font-playfair"
        style={{ transform: "rotate(-8deg) skewX(-5deg)" }}
      >
        RAW SMITH
      </div>
    </div>
  );
};
