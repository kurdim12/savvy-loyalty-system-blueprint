
import React from "react";
import { Table, Armchair, DoorOpen, BarStool, SideTable, Chair, Planter } from "lucide-react";

// Supported icons strictly as allowed.
export type CafeIconName = "Table" | "Armchair" | "BarStool" | "Door" | "Chair" | "SideTable" | "Planter";

// Accepts "icon", grid position (x, y, width, height) in meters, optional label and size/hints.
export interface CafeIconMarkerProps {
  icon: CafeIconName;
  gridX: number;
  gridY: number;
  gridW?: number; // Can default to 1 (1m)
  gridH?: number;
  gridSize: number; // px per 1m
  label?: string;
  iconColor?: string;
  zIndex?: number;
  style?: React.CSSProperties;
  rotateDeg?: number;
}

// Proper icon mapping.
export const CafeIconMarker: React.FC<CafeIconMarkerProps> = ({
  icon,
  gridX,
  gridY,
  gridW = 1,
  gridH = 1,
  gridSize,
  label,
  iconColor = "#111",
  zIndex = 70,
  style,
  rotateDeg = 0,
}) => {
  let IconComponent: React.ElementType;
  let sizePx = Math.round(Math.min(gridW, gridH) * gridSize * 0.7);

  switch (icon) {
    case "Table":
      IconComponent = Table;
      break;
    case "Chair":
      IconComponent = Chair;
      sizePx = Math.round(sizePx * 0.82);
      break;
    case "Armchair":
      IconComponent = Armchair;
      break;
    case "BarStool":
      IconComponent = BarStool;
      sizePx = Math.round(sizePx * 0.66);
      break;
    case "SideTable":
      IconComponent = SideTable;
      sizePx = Math.round(sizePx * 0.7);
      break;
    case "Planter":
      IconComponent = Planter;
      sizePx = Math.round(sizePx * 1.0);
      break;
    case "Door":
      IconComponent = DoorOpen;
      break;
    default:
      IconComponent = Table;
  }
  return (
    <div
      className="absolute flex flex-col items-center pointer-events-auto select-none"
      style={{
        left: gridX * gridSize,
        top: gridY * gridSize,
        width: gridW * gridSize,
        height: gridH * gridSize,
        zIndex,
        ...style,
      }}
      draggable={false}
    >
      <div
        style={{
          width: sizePx,
          height: sizePx,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `rotate(${rotateDeg}deg)`,
        }}
      >
        <IconComponent size={sizePx} color={iconColor} strokeWidth={2.1} />
      </div>
      {label && (
        <span className="text-xs mt-1 font-semibold tracking-tight text-neutral-700 bg-white/90 rounded px-1 py-0.5">{label}</span>
      )}
    </div>
  );
};
