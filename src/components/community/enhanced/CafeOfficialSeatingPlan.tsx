import React, { useState } from "react";
import clsx from "clsx";
import { Card } from "@/components/ui/card";

interface CafeOfficialSeatingPlanProps {
  onSeatSelect?: (seatId: string) => void;
  selectedSeat?: string | null;
  hideHeader?: boolean;
}

// Add a type for Chair placements
type ChairPlacement = {
  table: string;
  seat: number;
  x: number;
  y: number;
  isArmchair?: boolean;
  isBarstool?: boolean;
};

const TABLES = [
  // Indoor Central Tables (relative coordinates for isometric layout)
  { id: "indoor-1", x: 30, y: 60, type: "indoor", label: "Table 1" },
  { id: "indoor-2", x: 50, y: 58, type: "indoor", label: "Table 2" },
  { id: "indoor-3", x: 36, y: 80, type: "indoor", label: "Table 3" },
  { id: "indoor-4", x: 56, y: 78, type: "indoor", label: "Table 4" },
  // Outdoor Terrace Tables
  { id: "outdoor-1", x: 76, y: 60, type: "outdoor", label: "Terrace Table 1" },
  { id: "outdoor-2", x: 92, y: 66, type: "outdoor", label: "Terrace Table 2" },
  { id: "outdoor-3", x: 78, y: 82, type: "outdoor", label: "Terrace Table 3" },
  { id: "outdoor-4", x: 94, y: 88, type: "outdoor", label: "Terrace Table 4" },
  // Bar Counter
  { id: "bar", x: 78, y: 28, type: "bar", label: "Bar Counter" },
  // Cozy Armchair Nook ("Lounge")
  { id: "lounge", x: 18, y: 82, type: "lounge", label: "Lounge" },
];

// Modify the CHAIRS array to use the type
const CHAIRS: ChairPlacement[] = [
  // Indoor tables (4 per table, isometric fans)
  ...[0, 1, 2, 3].map(i => ({
    table: "indoor-1",
    seat: i,
    x: [27, 32, 29, 35][i],
    y: [64, 57, 70, 65][i]
  })),
  ...[0, 1, 2, 3].map(i => ({
    table: "indoor-2",
    seat: i,
    x: [47, 52, 49, 57][i],
    y: [63, 57, 73, 67][i]
  })),
  ...[0, 1, 2, 3].map(i => ({
    table: "indoor-3",
    seat: i,
    x: [32, 38, 35, 42][i],
    y: [85, 78, 92, 85][i]
  })),
  ...[0, 1, 2, 3].map(i => ({
    table: "indoor-4",
    seat: i,
    x: [54, 58, 56, 63][i],
    y: [83, 77, 92, 86][i]
  })),
  // Outdoor terrace (3 per table, fanned outward)
  ...[0, 1, 2].map(i => ({
    table: "outdoor-1",
    seat: i,
    x: [76, 79, 73][i],
    y: [64, 61, 67][i]
  })),
  ...[0, 1, 2].map(i => ({
    table: "outdoor-2",
    seat: i,
    x: [92, 95, 90][i],
    y: [70, 67, 73][i]
  })),
  ...[0, 1, 2].map(i => ({
    table: "outdoor-3",
    seat: i,
    x: [78, 82, 75][i],
    y: [86, 83, 89][i]
  })),
  ...[0, 1, 2].map(i => ({
    table: "outdoor-4",
    seat: i,
    x: [94, 98, 90][i],
    y: [92, 89, 96][i]
  })),
  // Bar stools (4)
  ...[0, 1, 2, 3].map(i => ({
    table: "bar",
    seat: i,
    x: 83 + i * 4,
    y: 33 + i * 2,
    isBarstool: true
  })),
  // Lounge armchairs (2)
  { table: "lounge", seat: 0, x: 13, y: 87, isArmchair: true },
  { table: "lounge", seat: 1, x: 21, y: 79, isArmchair: true },
];

const PLANTERS = [
  { x: 5, y: 70, w: 5, h: 18, type: "tall" },    // interior left corner
  { x: 68, y: 22, w: 6, h: 18, type: "bush" },   // next to bar, inside
  { x: 98, y: 98, w: 6, h: 20, type: "tall" },   // outdoor right front
  { x: 7, y: 90, w: 6, h: 18, type: "tall" },    // left front
];

const WALL_ARTS = [
  { x: 16, y: 65, w: 6, h: 13 },
];

// Helper for perspective
const iso = (x: number, y: number) => ({
  left: `calc(${x}% - ${(y-50)*0.34}px)`, 
  top: `calc(${y}% - ${(x-50)*0.17}px)`
});

export const CafeOfficialSeatingPlan: React.FC<CafeOfficialSeatingPlanProps> = ({
  onSeatSelect,
  selectedSeat,
  hideHeader
}) => {
  const [hovered, setHovered] = useState<string | null>(null);

  // Walls and structure, using isometric perspective (hardcoded sizing)
  return (
    <div className="relative w-full h-[540px] max-w-2xl mx-auto rounded-xl overflow-visible bg-none select-none">
      {/* Header */}
      {!hideHeader && (
        <div className="absolute z-20 left-4 top-4">
          <Card className="bg-white/80 border-stone-300/40 shadow px-6 py-2">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-stone-700 tracking-wide font-playfair">Official RAW SMITH Seating Plan</h2>
              <p className="text-stone-400 text-xs">Choose any seat or table to join!</p>
            </div>
          </Card>
        </div>
      )}

      {/* Big wall back (concrete) */}
      <div className="absolute left-0 top-0 z-0"
        style={{
          width: "70%",
          height: "60%",
          background: "linear-gradient(145deg,#e0ded9 70%,#b2b0ac 100%)",
          borderTopLeftRadius: "48px",
          borderRight: "16px solid #a39e98",
          borderTop: "8px solid #bcb9b2",
          filter: "blur(0.3px)"
        }}
      />
      {/* Left concrete wall with "rough" edge */}
      <div className="absolute left-0 top-0 z-0"
        style={{
          width: "23%",
          height: "98%",
          borderLeft: "6px solid #acaaa3",
          background: "linear-gradient(130deg,#d2d1ce 60%,#b2b0ac 100%)"
        }}
      />
      {/* Floor slab (angled) */}
      <div className="absolute left-0 bottom-0 z-0"
        style={{
          width: "99%",
          height: "84%",
          background: "linear-gradient(100deg,#e7e6e2 80%,#bbb6ae 100%)",
          borderRadius: "30px 36px 48px 42px",
          boxShadow: "0 18px 42px #aaa7a492"
        }}
      />
      {/* Black window area (rough edge) */}
      <div className="absolute bg-black left-[6%] top-[19%]" style={{
        width: "11%",
        height: "25%",
        borderRadius: "20px 40px 36px 44px"
      }} />
      {/* Window ripped wall inner shade */}
      <div className="absolute left-[7%] top-[20%] z-5"
        style={{
          width: "10%",
          height: "22%",
          background: "linear-gradient(135deg,#b4b4b1 60%,#f0f0ec 100%)",
          borderRadius: "24px 35px 31px 41px"
        }}
      />
      {/* Glass door frame & signage */}
      <div className="absolute bg-black/90 z-10" style={{
        left: "66%",
        top: "10%",
        width: "27%",
        height: "32%",
        borderRadius: "0 0 24px 24px",
        boxShadow: "0 8px 18px #19181829"
      }} />
      {/* RAW SMITH sign */}
      <div className="absolute z-20 font-black font-playfair text-3xl drop-shadow text-[#292826]" style={{
        left: "70.7%",
        top: "3.5%",
        letterSpacing: "0.2em"
      }}>
        RAW SMITH
      </div>

      {/* Bar counter area */}
      <div className="absolute z-10" style={{
        left: "78%",
        top: "22%",
        width: "16%",
        height: "11%",
        background: "linear-gradient(170deg,#c7a269_88,#eed9b0 100%)",
        border: "4px solid #ad946b",
        borderRadius: "12px 20px 28px 16px",
        boxShadow: "0 4px 10px #5e502811"
      }} />
      {/* Bar front shading */}
      <div className="absolute z-10" style={{
        left: "78%",
        top: "29%",
        width: "16%",
        height: "4%",
        background: "linear-gradient(180deg,#bc9647 80%,#826634 100%)",
        opacity: 0.7,
        borderRadius: "0 0 13px 13px"
      }} />

      {/* Outdoor terrace slab */}
      <div className="absolute z-5" style={{
        left: "75%",
        bottom: "0%",
        width: "25%",
        height: "48%",
        background: "linear-gradient(110deg,#f2ede3 90%,#cfc8ba 100%)",
        borderRadius: "30px 22px 36px 24px",
        border: "8px solid #19181850"
      }} />

      {/* Terrace black railing */}
      <div className="absolute z-20" style={{
        left: "74%",
        bottom: "6%",
        width: "24%",
        height: "40%",
        border: "4px solid #232323",
        borderRadius: "13px"
      }} />

      {/* Door handle as a little circle */}
      <div className="absolute rounded-full bg-black z-20"
        style={{ left: "93.5%", top: "36%", width: "1.3%", height: "2%" }}
      />

      {/* Wall art */}
      {WALL_ARTS.map((art, i) => (
        <div className="absolute z-10 rounded-xl border-2 border-black/40 flex items-center justify-center"
          style={{
            left: `${art.x}%`, top: `${art.y}%`, width: `${art.w}%`, height: `${art.h}%`,
            background: "linear-gradient(45deg,#efefef 90%,#eee8d8 100%)"
          }}
          key={i}
        >
          <span className="text-black/30 text-lg">◐</span>
        </div>
      ))}

      {/* Potted Planters */}
      {PLANTERS.map((p, idx) => (
        <div
          className={`absolute z-30 ${p.type === "tall" ? "" : ""}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.w}%`,
            height: `${p.h}%`
          }}
          key={idx}
        >
          <div className="absolute left-1/2 bottom-0 flex flex-col items-center"
            style={{ transform: "translateX(-50%)" }}>
            <div className="w-10 h-10 rounded-b-2xl rounded-t-xl bg-green-900 shadow-md" />
            <div className="w-8 h-7 bg-emerald-700 rounded-t-full mt-[-10px] shadow" />
            <div className="w-7 h-4 bg-green-900/80 rounded-full border border-amber-900" />
          </div>
        </div>
      ))}

      {/* TABLES */}
      {TABLES.map((table, idx) => (
        <button
          key={table.id}
          aria-label={table.label}
          className={clsx(
            "absolute rounded-md z-30 outline-none focus:ring-4 ring-amber-400 group shadow-lg",
            selectedSeat === table.id
              ? "ring-4"
              : hovered === table.id
                ? "ring-2 ring-amber-400"
                : ""
          )}
          style={{
            left: `calc(${table.x}% - 2%)`,
            top: `calc(${table.y}% - 2%)`,
            width: table.type === "bar" ? "13%" : table.type === "lounge" ? "7%" : "8%",
            height: table.type === "bar" ? "6.5%" : table.type === "lounge" ? "7%" : "8%",
            background: (
              table.type === "bar"
                ? "linear-gradient(95deg,#b9955c 80%,#e6c58d 100%)"
                : table.type === "lounge"
                  ? "linear-gradient(100deg,#406240 80%,#78856e 100%)"
                  : table.type === "outdoor"
                    ? "linear-gradient(120deg,#d9a95d 60%,#bab8a9 100%)"
                    : "linear-gradient(120deg,#b9955c 80%,#eae0bf 100%)"
            ),
            border: table.type === "bar"
              ? "3px solid #4c3b14"
              : table.type === "lounge"
                ? "3px solid #27653d"
                : "3px solid #313131",
            boxShadow: "0 2px 7px #1a1a1a14"
          }}
          onMouseEnter={() => setHovered(table.id)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSeatSelect?.(table.id)}
        >
          {table.type === "bar"
            ? <div className="text-xs text-stone-900 font-semibold tracking-widest">BAR</div>
            : table.type === "lounge"
              ? <div className="text-xs text-green-200 font-bold drop-shadow">LOUNGE</div>
              : table.type === "outdoor"
                ? <div className="text-[11px] text-yellow-900 font-semibold">OUTDOOR</div>
                : null}
        </button>
      ))}

      {/* CHAIRS */}
      {CHAIRS.map((chair, cidx) => (
        <button
          key={chair.table + "-" + chair.seat}
          aria-label={`Chair ${chair.seat + 1} (${chair.table})`}
          onMouseEnter={() => setHovered(`${chair.table}-chair-${chair.seat}`)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSeatSelect?.(`${chair.table}-chair-${chair.seat}`)}
          className={clsx(
            "absolute z-40 transition-all duration-130 cursor-pointer shadow",
            chair.isArmchair
              ? "w-8 h-8 rounded-[15px] bg-green-800 border-4 border-amber-900"
              : chair.isBarstool
                ? "w-4 h-8 rounded bg-stone-900 border-2 border-yellow-900"
                : "w-5 h-5 rounded-full bg-stone-950 border-2 border-stone-500"
          )}
          style={{
            left: `${chair.x}%`,
            top: `${chair.y}%`,
          }}
        />
      ))}

      {/* OUTDOOR SEATING: show fake subtle sunlight */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{
          left: "77%",
          bottom: "12%",
          width: "18%",
          height: "32%",
          background: "radial-gradient(ellipse 70% 90% at 60% 60%, #fff6e24e 85%, #fff0e008 100%)",
          borderRadius: "30px"
        }}
      />

      {/* Soft drop shadow for the whole scene */}
      <div className="absolute -bottom-1 left-10 w-[85%] h-12 rounded-full bg-black/10 blur-lg z-0 pointer-events-none" />

    </div>
  );
};
