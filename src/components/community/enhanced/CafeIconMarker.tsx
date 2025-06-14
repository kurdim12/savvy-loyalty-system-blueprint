import React from "react";
import { Table, Armchair, DoorOpen } from "lucide-react";

// Supported icons for the floor plan.
export type CafeIconName = "Table" | "Armchair" | "Stool" | "Door" | "Window" | "Chair" | "SideTable";

// Accepts "icon" ("Table", "Armchair", "Stool", "Door", "Window", "Chair", "SideTable"), grid position (x, y, width, height) in meters, optional label and size/hints.
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
  // Map extra icon names to available lucide-react icons.
  let IconComponent: React.ElementType;
  let sizePx = Math.round(Math.min(gridW, gridH) * gridSize * 0.7);

  // The only lucide-react icons available: Table, Armchair, DoorOpen.
  // We must gracefully map others:
  switch (icon) {
    case "Table":
      IconComponent = Table;
      break;
    case "Chair":
      IconComponent = Armchair; // Use Armchair for small chairs.
      sizePx = Math.round(sizePx * 0.82);
      break;
    case "Armchair":
      IconComponent = Armchair;
      break;
    case "Stool":
      IconComponent = Table; // No "Stool" icon, using Table as a placeholder.
      sizePx = Math.round(sizePx * 0.55); // Smaller, to look like a stool.
      break;
    case "SideTable":
      IconComponent = Table;
      sizePx = Math.round(sizePx * 0.68);
      break;
    case "Door":
      IconComponent = DoorOpen; // Only actual supported door icon.
      break;
    case "Window":
      IconComponent = Table; // No "Window" icon, using Table as a placeholder.
      sizePx = Math.round(sizePx * 0.45); // Smaller for a window effect.
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
        <IconComponent size={sizePx} color={iconColor} strokeWidth={2.3} />
      </div>
      {label && (
        <span className="text-xs mt-1 font-semibold tracking-tight text-neutral-700 drop-shadow bg-white/90 rounded px-1 py-0.5">{label}</span>
      )}
    </div>
  );
};
