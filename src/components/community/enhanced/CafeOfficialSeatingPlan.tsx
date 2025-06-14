
import React, { useState } from "react";
import clsx from "clsx";
import { Card } from "@/components/ui/card";
import { Armchair, Table } from "lucide-react";

// -- Configuration constants for layout --
const GRID_SIZE = 40; // px, visual square = 1m
const GRID_COLS = 10;
const GRID_ROWS = 9;

type ChairPlacement = {
  table: string; // which table or anchor (see below)
  seat: number;
  x: number;  // grid column
  y: number;  // grid row
  isArmchair?: boolean;
  isBarstool?: boolean;
  icon?: "chair" | "stool" | "armchair";
};

type TableConfig = {
  id: string;
  x: number; // col
  y: number; // row
  type: "indoor" | "outdoor" | "bar" | "lounge";
  label: string;
  icon?: "table";
};

const TABLES: TableConfig[] = [
  // Indoor tables (centered, see image)
  { id: "indoor-table-1", x: 4, y: 3, type: "indoor", label: "Indoor Table 1", icon: "table" },
  { id: "indoor-table-2", x: 2, y: 4, type: "indoor", label: "Indoor Table 2", icon: "table" },
  { id: "indoor-table-3", x: 5, y: 5, type: "indoor", label: "Indoor Table 3", icon: "table" },
  { id: "indoor-table-4", x: 3, y: 7, type: "indoor", label: "Indoor Table 4", icon: "table" },
  // Outdoor tables
  { id: "outdoor-table-1", x: 7, y: 3, type: "outdoor", label: "Outdoor Table 1", icon: "table" },
  { id: "outdoor-table-2", x: 8, y: 5, type: "outdoor", label: "Outdoor Table 2", icon: "table" },
  { id: "outdoor-table-3", x: 7, y: 7, type: "outdoor", label: "Outdoor Table 3", icon: "table" },
  { id: "outdoor-table-4", x: 9, y: 6, type: "outdoor", label: "Outdoor Table 4", icon: "table" },
  // Bar counter
  { id: "bar-counter", x: 7, y: 0, type: "bar", label: "Bar Counter" },
  // Lounge nook
  { id: "lounge", x: 0, y: 2, type: "lounge", label: "Lounge Nook" },
];

const CHAIRS: ChairPlacement[] = [
  // Indoor tables: two chairs per table.
  { table: "indoor-table-1", seat: 0, x: 3, y: 3, icon: "chair" },
  { table: "indoor-table-1", seat: 1, x: 5, y: 3, icon: "chair" },
  { table: "indoor-table-2", seat: 0, x: 2, y: 3, icon: "chair" },
  { table: "indoor-table-2", seat: 1, x: 2, y: 5, icon: "chair" },
  { table: "indoor-table-3", seat: 0, x: 5, y: 4, icon: "chair" },
  { table: "indoor-table-3", seat: 1, x: 5, y: 6, icon: "chair" },
  { table: "indoor-table-4", seat: 0, x: 3, y: 6, icon: "chair" },
  { table: "indoor-table-4", seat: 1, x: 3, y: 8, icon: "chair" },
  // Outdoor tables: two chairs per table.
  { table: "outdoor-table-1", seat: 0, x: 6, y: 3, icon: "chair" },
  { table: "outdoor-table-1", seat: 1, x: 7, y: 2, icon: "chair" },
  { table: "outdoor-table-2", seat: 0, x: 8, y: 4, icon: "chair" },
  { table: "outdoor-table-2", seat: 1, x: 8, y: 6, icon: "chair" },
  { table: "outdoor-table-3", seat: 0, x: 6, y: 7, icon: "chair" },
  { table: "outdoor-table-3", seat: 1, x: 8, y: 7, icon: "chair" },
  { table: "outdoor-table-4", seat: 0, x: 9, y: 5, icon: "chair" },
  { table: "outdoor-table-4", seat: 1, x: 9, y: 7, icon: "chair" },
  // Bar stools (4)
  { table: "bar-counter", seat: 0, x: 7, y: 1, isBarstool: true, icon: "stool" },
  { table: "bar-counter", seat: 1, x: 8, y: 1, isBarstool: true, icon: "stool" },
  { table: "bar-counter", seat: 2, x: 9, y: 1, isBarstool: true, icon: "stool" },
  { table: "bar-counter", seat: 3, x: 10, y: 1, isBarstool: true, icon: "stool" },
  // Lounge nook (2 armchairs)
  { table: "lounge", seat: 0, x: 0, y: 1, isArmchair: true, icon: "armchair" },
  { table: "lounge", seat: 1, x: 1, y: 2, isArmchair: true, icon: "armchair" },
];

const PLANTERS = [
  { x: 0, y: 0 },
  { x: 0, y: 8 },
  { x: 10, y: 0 },
  { x: 10, y: 8 },
];

export const CafeOfficialSeatingPlan: React.FC<{
  onSeatSelect?: (seatId: string) => void;
  selectedSeat?: string | null;
  hideHeader?: boolean;
}> = ({ onSeatSelect, selectedSeat, hideHeader }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-xl mx-auto"
      style={{ aspectRatio: "10 / 9", minHeight: 360, background: "#eee", fontFamily: "inherit" }}
    >
      {/* Main grid - reference to 1m×1m */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Indoor zone */}
        <div
          className="absolute"
          style={{
            left: 0, top: 0,
            width: `${GRID_SIZE * 7}px`,
            height: `${GRID_SIZE * 9}px`,
            background: "#e3e3e3"
          }}
        />
        {/* Outdoor (terrace) zone */}
        <div
          className="absolute"
          style={{
            left: `${GRID_SIZE * 7}px`, top: 0,
            width: `${GRID_SIZE * 3}px`,
            height: `${GRID_SIZE * 9}px`,
            background: "#faf0e2"
          }}
        />
        {/* Grid lines */}
        {[...Array(GRID_ROWS + 1)].map((_, i) => (
          <div
            key={"row-" + i}
            className="absolute left-0 w-full border-t border-neutral-300 border-dashed"
            style={{
              top: `${i * GRID_SIZE}px`,
              zIndex: 1,
            }}
          />
        ))}
        {[...Array(GRID_COLS + 1)].map((_, i) => (
          <div
            key={"col-" + i}
            className="absolute top-0 h-full border-l border-neutral-300 border-dashed"
            style={{
              left: `${i * GRID_SIZE}px`,
              zIndex: 1,
            }}
          />
        ))}
      </div>

      {/* ZONES labels */}
      <div
        className="absolute left-2 top-2 z-40 text-xs px-2 py-1 bg-white/80 rounded shadow"
        style={{ color: "#555", fontWeight: 700 }}
      >
        Indoor
      </div>
      <div
        className="absolute"
        style={{
          left: `${GRID_SIZE * 7 + 8}px`, top: "12px"
        }}
      >
        <div className="text-xs px-2 py-1 bg-white/80 rounded shadow"
          style={{ color: "#a88649", fontWeight: 700 }}
        >
          Outdoor
        </div>
      </div>

      {/* RAW SMITH Sign */}
      <div
        className="absolute z-50 font-black tracking-widest drop-shadow"
        style={{
          left: `${GRID_SIZE * 6 - 6}px`,
          top: `${GRID_SIZE * 0.1}px`,
          fontSize: "1.65rem",
          color: "#111"
        }}
      >
        RAW SMITH
      </div>

      {/* Entrance label */}
      <div
        className="absolute z-40 bg-black text-white text-xs px-2 py-0.5 rounded"
        style={{
          left: `${GRID_SIZE * 7.8}px`,
          top: `${GRID_SIZE * 1.1}px`
        }}
      >
        Entrance
      </div>
      {/* Bar Window label */}
      <div
        className="absolute z-40 bg-black text-white text-xs px-2 py-0.5 rounded"
        style={{
          left: `${GRID_SIZE * 0.5}px`,
          top: `${GRID_SIZE * 2.1}px`
        }}
      >
        Bar Window
      </div>

      {/* Walls (as thick black border lines) */}
      <div className="absolute top-0 left-0 h-full"
        style={{
          width: 6,
          background: "#222"
        }}
      />
      <div className="absolute left-0 top-0 w-full"
        style={{
          height: 6,
          background: "#222"
        }}
      />
      <div className="absolute"
        style={{
          left: `${GRID_SIZE * GRID_COLS}px`,
          top: 0,
          width: 6,
          height: `${GRID_SIZE * GRID_ROWS}px`,
          background: "#222"
        }}
      />
      <div className="absolute"
        style={{
          left: 0,
          top: `${GRID_SIZE * GRID_ROWS}px`,
          width: `${GRID_SIZE * GRID_COLS + 6}px`,
          height: 6,
          background: "#222"
        }}
      />

      {/* Bar zone wall (see image) */}
      <div className="absolute z-10"
        style={{
          left: `${GRID_SIZE * 7.1}px`,
          top: `${GRID_SIZE * 0.2}px`,
          width: "10px",
          height: `${GRID_SIZE * 3.7}px`,
          background: "#232323"
        }}
      />

      {/* Railing (terrace) */}
      {/* Outer and inner thick railing */}
      <div className="absolute z-40"
        style={{
          left: `${GRID_SIZE * 7 - 3}px`,
          top: "0px",
          width: "6px",
          height: `${GRID_SIZE * 9 + 6}px`,
          background: "#222"
        }}
      />
      <div className="absolute z-40"
        style={{
          left: `${GRID_SIZE * 7 + 38}px`,
          top: "0px",
          width: "6px",
          height: `${GRID_SIZE * 9 + 6}px`,
          background: "#222"
        }}
      />
      <div className="absolute z-40"
        style={{
          left: `${GRID_SIZE * 7 - 3}px`,
          top: `${GRID_SIZE * 9}px`,
          width: `${GRID_SIZE * 3 + 9}px`,
          height: "6px",
          background: "#222"
        }}
      />

      {/* Planters in 4 corners */}
      {PLANTERS.map((p, idx) => (
        <div
          key={idx}
          className="absolute z-30 flex flex-col items-center"
          style={{
            left: `${p.x * GRID_SIZE + 8}px`,
            top: `${p.y * GRID_SIZE + 10}px`
          }}
        >
          <div className="w-6 h-12 rounded-full bg-[#57604a] border-2 border-black" />
          <div className="w-6 h-3 bg-[#b4b098] rounded-b-xl border border-black mt-[-6px]" />
        </div>
      ))}

      {/* Tables, Bar, Lounge */}
      {TABLES.map((table) => {
        if (table.type === "bar") {
          // Render as thick rectangle
          return (
            <div key={table.id}
              className="absolute z-30 flex flex-row items-end"
              style={{
                left: `${table.x * GRID_SIZE + 3}px`,
                top: `${table.y * GRID_SIZE + 20}px`,
                width: `${GRID_SIZE * 3 - 10}px`,
                height: `${GRID_SIZE - 10}px`,
                background: "linear-gradient(135deg,#b49d7e 84%,#eed9b0 100%)",
                border: "3px solid #333",
                borderRadius: 9,
                boxShadow: "0 2px 8px #2222"
              }}
            >
              <div className="absolute left-3 top-2 text-black text-xs font-bold" style={{letterSpacing:2}}>Bar</div>
            </div>
          );
        }
        if (table.type === "lounge") {
          // Side table as circle
          return (
            <div key={table.id}
              className="absolute z-30 flex items-center justify-center"
              style={{
                left: `${table.x * GRID_SIZE + 32}px`,
                top: `${table.y * GRID_SIZE + 16}px`,
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                border: "3px solid #18181a",
                background: "#222"
              }}
            >
              <Table size={20} strokeWidth={2.2} className="text-white" />
            </div>
          );
        }
        // Tables: Lucide "Table" icon on colored base
        return (
          <button
            type="button"
            key={table.id}
            tabIndex={0}
            aria-label={table.label}
            className={clsx(
              "absolute z-30 flex items-center justify-center shadow-md outline-none",
              selectedSeat === table.id
                ? "ring-4 ring-amber-500"
                : hovered === table.id
                  ? "ring-2 ring-amber-300"
                  : ""
            )}
            style={{
              left: `${table.x * GRID_SIZE + 7}px`,
              top: `${table.y * GRID_SIZE + 16}px`,
              width: `${GRID_SIZE - 12}px`,
              height: `${GRID_SIZE - 8}px`,
              background: table.type === "indoor" ? "#d8bb88" : "#f4e7d3",
              border: "2.5px solid #111",
              borderRadius: 8,
              transition: "box-shadow .17s",
            }}
            onMouseEnter={() => setHovered(table.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSeatSelect?.(table.id)}
          >
            <Table size={26} strokeWidth={2.2} className="text-black" />
          </button>
        );
      })}

      {/* Bar stools, chairs, lounge armchairs */}
      {CHAIRS.map((chair, cidx) => {
        let IconElem = null;
        let color = "#111";
        let bg = "#ededed";
        let border = "2px solid #111";
        if (chair.icon === "armchair") {
          IconElem = <Armchair size={23} strokeWidth={2.2} className="text-green-800" />;
          bg = "#c0e2b7";
          border = "2.5px solid #25653d";
        } else if (chair.icon === "stool") {
          IconElem = <div style={{width:21, height:21, borderRadius:6, border:"2.2px solid #222", background:"#b69a7a", display:"flex",alignItems:"center",justifyContent:"center"}}></div>;
          bg = "#eed9b0";
          border = "2.2px solid #ad946b";
        } else {
          // chair
          IconElem = (
            <div style={{
              width: 18, height: 18, borderRadius: 4,
              border: "2px solid #111", background: "#333"
            }}/>
          );
        }
        return (
          <button
            key={chair.table + "-" + chair.seat}
            aria-label={
              chair.isArmchair
                ? "Lounge armchair"
                : chair.isBarstool
                  ? "Bar stool"
                  : "Chair"
            }
            onMouseEnter={() => setHovered(`${chair.table}-chair-${chair.seat}`)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSeatSelect?.(`${chair.table}-chair-${chair.seat}`)}
            tabIndex={0}
            className={clsx(
              "absolute z-40 animate-fade-in cursor-pointer transition-all duration-150 p-0 flex items-center justify-center",
              chair.isArmchair
                ? "rounded-[9px] shadow"
                : chair.isBarstool
                  ? "rounded bg-yellow-950"
                  : "rounded"
            )}
            style={{
              left: `${(chair.x) * GRID_SIZE + 13}px`,
              top: `${(chair.y) * GRID_SIZE + 23}px`,
              width: chair.isBarstool
                ? "23px"
                : chair.isArmchair
                  ? "27px"
                  : "20px",
              height: chair.isBarstool
                ? "25px"
                : chair.isArmchair
                  ? "27px"
                  : "20px",
              background: bg,
              border: border,
              outline: selectedSeat === `${chair.table}-chair-${chair.seat}` ? "3px solid #e5b24d" : "",
              boxShadow: hovered === `${chair.table}-chair-${chair.seat}` ? "0 2px 10px #edcdab99" : "0 1px 4px #9993"
            }}
          >
            {IconElem}
          </button>
        );
      })}

      {/* Lounge corner: render a potted plant between armchairs */}
      <div className="absolute z-30" style={{
        left: `${GRID_SIZE * 0.5 + 28}px`,
        top: `${GRID_SIZE * 0.3 + 24}px`
      }}>
        <div className="w-7 h-12 rounded-full bg-green-900 border-2 border-black" />
        <div className="w-7 h-3 bg-[#b4b098] rounded-b-xl border border-black mt-[-6px]" />
      </div>

      {/* Minimalist wall art (frame on wall above lounge) */}
      <div className="absolute z-30"
        style={{
          left: `${GRID_SIZE * 2 + 14}px`,
          top: `${GRID_SIZE * 0.7 + 6}px`,
          width: "32px",
          height: "32px",
          border: "2.2px solid #433a3c",
          borderRadius: "10px",
          background: "#fffce9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
        <span className="text-[20px] text-[#383434]">◩</span>
      </div>

      {/* Rough window mock */}
      <div className="absolute z-20"
        style={{
          left: `${GRID_SIZE * 0.2 - 4}px`,
          top: `${GRID_SIZE * 0.8}px`,
          width: `${GRID_SIZE * 2.3}px`,
          height: `${GRID_SIZE * 1.75}px`,
          borderRadius: "29px 25px 33px 18px/36px 27px 16px 23px",
          border: "5px solid #262829",
          background: "linear-gradient(133deg,#bbbdb2 90%,#e4e7de 100%)",
          boxShadow: "0 1.5px 15px #2a2a2a2c"
        }}
      />

      {/* Sliding glass door frame (entrance) */}
      <div className="absolute z-50"
        style={{
          left: `${GRID_SIZE * 7.55 - 7}px`,
          top: `${GRID_SIZE * 0.45}px`,
          width: `${GRID_SIZE * 2.2}px`,
          height: `${GRID_SIZE * 2.6}px`,
          border: "7px solid #181819",
          borderRadius: 16,
          background: "#1112",
        }}
      />

      {/* Decorative gradient overlay for realism */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 42% 30%,#f4ecd0 16%,#ffffff00 89%)"
        }}
      />

      {/* Soft drop shadow */}
      <div className="absolute left-10 w-[85%] h-10 rounded-full bg-black/10 blur-lg z-0 pointer-events-none"
        style={{
          bottom: "-16px"
        }}
      />
      {/* Header */}
      {!hideHeader && (
        <div className="absolute z-50 left-4 top-4">
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
