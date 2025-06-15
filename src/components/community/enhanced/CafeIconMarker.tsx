import React from "react";
import { Table, Armchair, DoorOpen, Chair, Sprout, Circle } from "lucide-react";

// Supported ux map. These types are ok to define! (You may want to display 'BarStool', etc in your UI)
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

// Map all icons to only available ones; fallbacks for missing icons as needed
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
  let IconComponent: React.ElementType = Table; // default
  let sizePx = Math.round(Math.min(gridW, gridH) * gridSize * 0.7);

  switch (icon) {
    case "Table":
      IconComponent = Table;
      break;
    case "Armchair":
      IconComponent = Armchair;
      break;
    case "BarStool":
      // Use Circle for a better stool representation
      IconComponent = Circle;
      sizePx = Math.round(sizePx * 0.6);
      break;
    case "Chair":
      // Use the actual Chair icon now
      IconComponent = Chair;
      sizePx = Math.round(sizePx * 0.85);
      break;
    case "SideTable":
      // Fallback to a smaller Table for side tables
      IconComponent = Table;
      sizePx = Math.round(sizePx * 0.45);
      break;
    case "Planter":
      // Use Sprout for a more accurate plant icon
      IconComponent = Sprout;
      iconColor = "#16a34a"; // Keep green color for planters
      break;
    case "Door":
      IconComponent = DoorOpen;
      break;
    default:
      IconComponent = Table;
      break;
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
