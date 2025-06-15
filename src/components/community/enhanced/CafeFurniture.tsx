
import React from "react";
import { CafeIconMarker } from "./CafeIconMarker";

// Taken from image geometry. All coordinates and types are pixel-perfect to uploaded plan.
export const CafeFurniture: React.FC<{
  gridSize: number;
  snap: (n: number) => number;
  onSeatSelect?: (seatId: string) => void;
  selectedSeat?: string | null;
  hoveredSeat: string | null;
  setHoveredSeat: (val: string | null) => void;
  getSeatStyle: (seatId: string) => React.CSSProperties;
}> = ({
  gridSize,
  snap,
  onSeatSelect,
  selectedSeat,
  hoveredSeat,
  setHoveredSeat,
  getSeatStyle,
}) => {
  // Bar stools positions: 4 stools by the counter
  const barStools = [
    { x: 18.5, y: 7.5, id: 'bar-stool-1' },
    { x: 20,   y: 7.5, id: 'bar-stool-2' },
    { x: 21.5, y: 7.5, id: 'bar-stool-3' },
    { x: 23,   y: 7.5, id: 'bar-stool-4' },
  ];
  // Café tables with chairs (4 sets)
  const tables = [
    { x: 10.2, y: 13.2, id: 'table-1' },
    { x: 16.3, y: 13.2, id: 'table-2' },
    { x: 10.2, y: 17.7, id: 'table-3' },
    { x: 16.3, y: 17.7, id: 'table-4' },
  ];
  // Each table gets 2 chairs, left & right
  function tableChairsPos({ x, y, id }: { x: number, y: number, id: string }) {
    return [
      { x: x - 1.7, y, id: `${id}-chair-1` },
      { x: x + 1.7, y, id: `${id}-chair-2` },
    ];
  }
  // Lounge seating (window alcove, left)
  const armchairs = [
    { x: 5.6, y: 13.25, id: 'alcove-chair-1', rotateDeg: -10 },
    { x: 7.5, y: 15,    id: 'alcove-chair-2', rotateDeg: 10 },
  ];
  const loungeTable = { x: 6.6, y: 14, id: 'alcove-table' };

  // Small wall table (under window)
  const wallTable = { x: 6.8, y: 11.1, id: "wall-table" };
  const wallChair = { x: 8.5, y: 11.1, id: "wall-chair" };

  // Potted plant locations per corners
  const planters = [
    { x: 23, y: 22, id: 'planter-1' },
    { x: 6.8, y: 7.8, id: 'planter-2' }
  ];

  return (
    <>
      {/* Bar Counter (fixed, unclickable) */}
      <CafeIconMarker
        icon="Table"
        gridX={18.2}
        gridY={6}
        gridW={6.2}
        gridH={1.2}
        gridSize={gridSize}
        iconColor="#be9351"
        zIndex={30}
        style={{ borderRadius: 6, filter: 'brightness(0.98)' }}
      />

      {/* 4 Bar stools */}
      {barStools.map((stool, idx) => (
        <div
          key={stool.id}
          onClick={() => onSeatSelect && onSeatSelect(stool.id)}
          onMouseEnter={() => setHoveredSeat(stool.id)}
          onMouseLeave={() => setHoveredSeat(null)}
          style={getSeatStyle(stool.id)}
        >
          <CafeIconMarker
            icon="BarStool"
            gridX={snap(stool.x)}
            gridY={snap(stool.y)}
            gridSize={gridSize}
            iconColor="#29241c"
            zIndex={32}
          />
        </div>
      ))}

      {/* Tables and chairs */}
      {tables.map((tbl, tblIdx) => (
        <React.Fragment key={tbl.id}>
          <div
            onClick={() => onSeatSelect && onSeatSelect(tbl.id)}
            onMouseEnter={() => setHoveredSeat(tbl.id)}
            onMouseLeave={() => setHoveredSeat(null)}
            style={getSeatStyle(tbl.id)}
          >
            <CafeIconMarker
              icon="Table"
              gridX={snap(tbl.x)}
              gridY={snap(tbl.y)}
              gridSize={gridSize}
              iconColor="#be9351"
              zIndex={22}
            />
          </div>
          {tableChairsPos(tbl).map((chair, chIdx) => (
            <div
              key={chair.id}
              onClick={() => onSeatSelect && onSeatSelect(chair.id)}
              onMouseEnter={() => setHoveredSeat(chair.id)}
              onMouseLeave={() => setHoveredSeat(null)}
              style={getSeatStyle(chair.id)}
            >
              <CafeIconMarker
                icon="Chair"
                gridX={snap(chair.x)}
                gridY={snap(chair.y)}
                gridSize={gridSize}
                iconColor="#232114"
                zIndex={22}
              />
            </div>
          ))}
        </React.Fragment>
      ))}

      {/* Lounge/alcove chairs (+ round table) */}
      {armchairs.map((arm, idx) => (
        <div
          key={arm.id}
          onClick={() => onSeatSelect && onSeatSelect(arm.id)}
          onMouseEnter={() => setHoveredSeat(arm.id)}
          onMouseLeave={() => setHoveredSeat(null)}
          style={getSeatStyle(arm.id)}
        >
          <CafeIconMarker
            icon="Armchair"
            gridX={snap(arm.x)}
            gridY={snap(arm.y)}
            gridSize={gridSize}
            iconColor="#325338"
            rotateDeg={arm.rotateDeg}
            zIndex={20}
          />
        </div>
      ))}
      <CafeIconMarker
        icon="SideTable"
        gridX={snap(loungeTable.x)}
        gridY={snap(loungeTable.y)}
        gridSize={gridSize}
        iconColor="#222"
        zIndex={19}
      />

      {/* Small wall table & chair */}
      <CafeIconMarker
        icon="SideTable"
        gridX={snap(wallTable.x)}
        gridY={snap(wallTable.y)}
        gridSize={gridSize}
        iconColor="#be9351"
        zIndex={15}
      />
      <CafeIconMarker
        icon="Chair"
        gridX={snap(wallChair.x)}
        gridY={snap(wallChair.y)}
        gridSize={gridSize}
        iconColor="#232114"
        zIndex={15}
      />

      {/* Potted Planters */}
      {planters.map(p => (
        <CafeIconMarker
          key={p.id}
          icon="Planter"
          gridX={snap(p.x)}
          gridY={snap(p.y)}
          gridSize={gridSize}
          zIndex={25}
        />
      ))}
    </>
  );
};
