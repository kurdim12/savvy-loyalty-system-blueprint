
import React from "react";
import { CafeIconMarker } from "./CafeIconMarker";

const GRID_SIZE = 48; // Reduced for better fit
const GRID_W = 16; // Reduced width
const GRID_H = 12; // Reduced height
const SIDE_MARGIN = 1;

// Updated background image reference
const BACKGROUND_IMAGE = "/lovable-uploads/d6d50dca-17f8-4715-bb02-fa8c3aead240.png";

const COLOR_INDOOR = "rgba(240,240,240,0.08)";
const COLOR_OUTDOOR = "rgba(220,200,180,0.05)";

export const CafeOfficialSeatingPlan: React.FC<{
  onSeatSelect?: (seatId: string) => void;
  selectedSeat?: string | null;
  hideHeader?: boolean;
}> = ({ onSeatSelect }) => {
  const snap = (n: number) => Math.round(n * 2) / 2; // 0.5m precision

  // Adjusted zones to match reference image proportions
  const indoorZone = {
    x: 0,
    y: 0,
    w: GRID_W,
    h: Math.round(GRID_H * 0.75) // 75% indoor
  };
  
  const outdoorZone = {
    x: 0,
    y: Math.round(GRID_H * 0.75),
    w: GRID_W,
    h: GRID_H - Math.round(GRID_H * 0.75) // 25% outdoor
  };

  const handleSeatClick = (seatId: string) => {
    if (onSeatSelect) {
      onSeatSelect(seatId);
    }
  };

  return (
    <div
      className="relative w-full mx-auto"
      style={{
        aspectRatio: `${GRID_W / GRID_H}`,
        maxWidth: "100%",
        height: "auto",
        minHeight: 400,
        maxHeight: "80vh",
        background: "#f5f0e8"
      }}
    >
      {/* Background Image - Isometric reference */}
      <img
        src={BACKGROUND_IMAGE}
        alt="RAW SMITH Café reference"
        className="absolute inset-0 w-full h-full object-contain opacity-20 pointer-events-none select-none"
        style={{ zIndex: 1 }}
        draggable={false}
      />

      {/* Zone Overlays */}
      <div
        className="absolute"
        style={{
          left: indoorZone.x * GRID_SIZE,
          top: indoorZone.y * GRID_SIZE,
          width: indoorZone.w * GRID_SIZE,
          height: indoorZone.h * GRID_SIZE,
          background: COLOR_INDOOR,
          zIndex: 5,
          pointerEvents: "none"
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 8,
            top: 8,
            color: "#333",
            fontWeight: 600,
            fontSize: 14,
            background: "rgba(255,255,255,0.7)",
            padding: "0.2em 0.5em",
            borderRadius: 4,
          }}
        >
          Indoor
        </span>
      </div>

      <div
        className="absolute"
        style={{
          left: outdoorZone.x * GRID_SIZE,
          top: outdoorZone.y * GRID_SIZE,
          width: outdoorZone.w * GRID_SIZE,
          height: outdoorZone.h * GRID_SIZE,
          background: COLOR_OUTDOOR,
          zIndex: 5,
          pointerEvents: "none"
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 8,
            top: 8,
            color: "#5a4a3a",
            fontWeight: 600,
            fontSize: 14,
            background: "rgba(255,245,230,0.7)",
            padding: "0.2em 0.5em",
            borderRadius: 4,
          }}
        >
          Outdoor
        </span>
      </div>

      {/* Grid Lines */}
      {[...Array(GRID_H + 1)].map((_, i) => (
        <div
          key={"row-" + i}
          className="absolute left-0 w-full border-t border-black/10"
          style={{
            top: i * GRID_SIZE,
            zIndex: 10
          }}
        />
      ))}
      {[...Array(GRID_W + 1)].map((_, i) => (
        <div
          key={"col-" + i}
          className="absolute top-0 h-full border-l border-black/10"
          style={{
            left: i * GRID_SIZE,
            zIndex: 10
          }}
        />
      ))}

      {/* Bar Counter - Back Wall */}
      <div 
        className="absolute"
        style={{
          left: snap(GRID_W * 0.25) * GRID_SIZE,
          top: snap(0.5) * GRID_SIZE,
          width: snap(GRID_W * 0.5) * GRID_SIZE,
          height: snap(1) * GRID_SIZE,
          background: "#2a2a2a",
          borderRadius: 8,
          border: "2px solid #1a1a1a",
          zIndex: 25,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
        }}
      />

      {/* Bar Stools - 4 across the counter */}
      {[0, 1, 2, 3].map(i => (
        <div
          key={`barstool-${i}`}
          onClick={() => handleSeatClick(`barstool-${i}`)}
          style={{ cursor: 'pointer' }}
        >
          <CafeIconMarker
            icon="BarStool"
            gridX={snap(GRID_W * 0.3 + i * 1.5)}
            gridY={snap(1.8)}
            gridSize={GRID_SIZE}
            iconColor="#2a2a2a"
            zIndex={30}
          />
        </div>
      ))}

      {/* Left Corner - Green Armchairs and Side Table (matching reference) */}
      <div
        onClick={() => handleSeatClick('lounge-chair-1')}
        style={{ cursor: 'pointer' }}
      >
        <CafeIconMarker
          icon="Armchair"
          gridX={snap(1.5)}
          gridY={snap(2.5)}
          gridSize={GRID_SIZE}
          iconColor="#2d5a3d"
          zIndex={25}
        />
      </div>
      
      <div
        onClick={() => handleSeatClick('lounge-chair-2')}
        style={{ cursor: 'pointer' }}
      >
        <CafeIconMarker
          icon="Armchair"
          gridX={snap(1.5)}
          gridY={snap(4)}
          gridSize={GRID_SIZE}
          iconColor="#2d5a3d"
          zIndex={25}
        />
      </div>

      <CafeIconMarker
        icon="SideTable"
        gridX={snap(2.8)}
        gridY={snap(3.2)}
        gridSize={GRID_SIZE}
        iconColor="#8B4513"
        zIndex={25}
      />

      {/* Main Dining Tables - Arranged as in reference image */}
      {[
        { x: 5, y: 3, id: 'table-1' },
        { x: 8.5, y: 3, id: 'table-2' },
        { x: 12, y: 3, id: 'table-3' },
        { x: 5, y: 5.5, id: 'table-4' },
        { x: 8.5, y: 5.5, id: 'table-5' },
        { x: 12, y: 5.5, id: 'table-6' }
      ].map((table, idx) => (
        <React.Fragment key={table.id}>
          <div
            onClick={() => handleSeatClick(table.id)}
            style={{ cursor: 'pointer' }}
          >
            <CafeIconMarker 
              icon="Table" 
              gridX={snap(table.x)} 
              gridY={snap(table.y)} 
              gridSize={GRID_SIZE} 
              iconColor="#8B4513"
              zIndex={20} 
            />
          </div>
          
          {/* Two chairs per table */}
          <div
            onClick={() => handleSeatClick(`${table.id}-chair-1`)}
            style={{ cursor: 'pointer' }}
          >
            <CafeIconMarker 
              icon="Chair" 
              gridX={snap(table.x - 0.8)} 
              gridY={snap(table.y + 0.1)} 
              gridSize={GRID_SIZE} 
              iconColor="#333"
              zIndex={20} 
            />
          </div>
          
          <div
            onClick={() => handleSeatClick(`${table.id}-chair-2`)}
            style={{ cursor: 'pointer' }}
          >
            <CafeIconMarker 
              icon="Chair" 
              gridX={snap(table.x + 0.8)} 
              gridY={snap(table.y + 0.1)} 
              gridSize={GRID_SIZE} 
              iconColor="#333"
              zIndex={20} 
            />
          </div>
        </React.Fragment>
      ))}

      {/* Outdoor Terrace Section */}
      {/* Terrace Railing */}
      <div 
        className="absolute"
        style={{
          left: 0,
          top: (outdoorZone.y - 0.15) * GRID_SIZE,
          width: GRID_W * GRID_SIZE,
          height: 0.3 * GRID_SIZE,
          background: "#1a1a1a",
          borderRadius: 4,
          zIndex: 30,
        }}
      />

      {/* Outdoor Tables - 3 tables as shown in reference */}
      {[
        { x: 3, y: outdoorZone.y + 1.5, id: 'outdoor-1' },
        { x: 7, y: outdoorZone.y + 1.5, id: 'outdoor-2' },
        { x: 11, y: outdoorZone.y + 1.5, id: 'outdoor-3' }
      ].map((table) => (
        <React.Fragment key={table.id}>
          <div
            onClick={() => handleSeatClick(table.id)}
            style={{ cursor: 'pointer' }}
          >
            <CafeIconMarker 
              icon="Table" 
              gridX={snap(table.x)} 
              gridY={snap(table.y)} 
              gridSize={GRID_SIZE} 
              iconColor="#8B4513"
              zIndex={15} 
            />
          </div>
          
          <div
            onClick={() => handleSeatClick(`${table.id}-chair-1`)}
            style={{ cursor: 'pointer' }}
          >
            <CafeIconMarker 
              icon="Chair" 
              gridX={snap(table.x - 0.7)} 
              gridY={snap(table.y + 0.1)} 
              gridSize={GRID_SIZE} 
              iconColor="#333"
              zIndex={15} 
            />
          </div>
          
          <div
            onClick={() => handleSeatClick(`${table.id}-chair-2`)}
            style={{ cursor: 'pointer' }}
          >
            <CafeIconMarker 
              icon="Chair" 
              gridX={snap(table.x + 0.7)} 
              gridY={snap(table.y + 0.1)} 
              gridSize={GRID_SIZE} 
              iconColor="#333"
              zIndex={15} 
            />
          </div>
        </React.Fragment>
      ))}

      {/* Corner Planters */}
      <CafeIconMarker 
        icon="Planter" 
        gridX={snap(0.5)} 
        gridY={snap(outdoorZone.y + 0.5)} 
        gridSize={GRID_SIZE} 
        iconColor="#2d5a3d"
        zIndex={20} 
      />
      
      <CafeIconMarker 
        icon="Planter" 
        gridX={snap(GRID_W - 1.5)} 
        gridY={snap(outdoorZone.y + 0.5)} 
        gridSize={GRID_SIZE} 
        iconColor="#2d5a3d"
        zIndex={20} 
      />

      <CafeIconMarker 
        icon="Planter" 
        gridX={snap(0.5)} 
        gridY={snap(GRID_H - 1)} 
        gridSize={GRID_SIZE} 
        iconColor="#2d5a3d"
        zIndex={20} 
      />
      
      <CafeIconMarker 
        icon="Planter" 
        gridX={snap(GRID_W - 1.5)} 
        gridY={snap(GRID_H - 1)} 
        gridSize={GRID_SIZE} 
        iconColor="#2d5a3d"
        zIndex={20} 
      />

      {/* Entrance Door */}
      <CafeIconMarker
        icon="Door"
        gridX={snap(GRID_W/2 - 1)}
        gridY={snap(indoorZone.h - 0.5)}
        gridW={2}
        gridH={0.5}
        gridSize={GRID_SIZE}
        label="Entrance"
        zIndex={35}
      />

      {/* Bar Window */}
      <CafeIconMarker
        icon="Door"
        gridX={snap(GRID_W * 0.15)}
        gridY={snap(indoorZone.h - 0.3)}
        gridW={2.5}
        gridH={0.4}
        gridSize={GRID_SIZE}
        label="Bar Window"
        zIndex={35}
      />

      {/* RAW SMITH Branding */}
      <div
        className="absolute font-black tracking-widest text-center"
        style={{
          left: snap((GRID_W/2 - 2.5) * GRID_SIZE),
          top: snap((indoorZone.h - 2.5) * GRID_SIZE),
          fontSize: "1.8rem",
          color: "#1a1a1a",
          zIndex: 40,
          width: 200,
          textShadow: "1px 1px 2px rgba(255,255,255,0.8)"
        }}
      >
        RAW SMITH
      </div>
    </div>
  );
};
