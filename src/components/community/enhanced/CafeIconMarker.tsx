
import React from "react";
import { Table, Chair, Armchair, SideTable, Stool, Door, Window } from "lucide-react";

// Accepts "icon" ("Table"|"Chair"|...), grid position (x, y, width, height) in meters, optional label and size/hints.
export interface CafeIconMarkerProps {
  icon: "Table" | "Chair" | "Armchair" | "Side Table" | "Stool" | "Door" | "Window";
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
  zIndex=70,
  style,
  rotateDeg = 0
}) => {
  let IconComponent: React.ElementType;
  let sizePx = Math.round(Math.min(gridW, gridH) * gridSize * 0.7);
  switch (icon) {
    case "Table":      IconComponent = Table;   break;
    case "Chair":      IconComponent = Chair;   break;
    case "Armchair":   IconComponent = Armchair; break;
    case "Side Table": IconComponent = SideTable; break;
    case "Stool":      IconComponent = Stool; break;
    case "Door":       IconComponent = Door; break;
    case "Window":     IconComponent = Window; break;
    default:           IconComponent = Table;
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
        ...style
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
        <IconComponent size={sizePx} color={iconColor} strokeWidth={2.4} />
      </div>
      {label && (
        <span className="text-xs mt-1 font-semibold tracking-tight text-neutral-700 drop-shadow bg-white/90 rounded px-1 py-0.5">{label}</span>
      )}
    </div>
  );
};
