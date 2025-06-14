
import React, { useState } from "react";
import { CafeIconMarker } from "./CafeIconMarker";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

const GRID_SIZE = 80; // Larger for better visibility
const GRID_W = 24; // Wider grid
const GRID_H = 18; // Taller grid

// Updated background image reference
const BACKGROUND_IMAGE = "/lovable-uploads/d6d50dca-17f8-4715-bb02-fa8c3aead240.png";

const COLOR_INDOOR = "rgba(240,240,240,0.15)";
const COLOR_OUTDOOR = "rgba(220,200,180,0.12)";
const COLOR_VIP = "rgba(184,134,11,0.15)";
const COLOR_QUIET = "rgba(99, 102, 241, 0.1)";

export const CafeOfficialSeatingPlan: React.FC<{
  onSeatSelect?: (seatId: string) => void;
  selectedSeat?: string | null;
  hideHeader?: boolean;
  onBack?: () => void;
}> = ({ onSeatSelect, selectedSeat, onBack }) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  
  const snap = (n: number) => Math.round(n * 2) / 2; // 0.5m precision

  // Enhanced zone layout for unique cafe design
  const vipLounge = {
    x: 1,
    y: 2,
    w: 5,
    h: 6
  };
  
  const mainIndoorZone = {
    x: 7,
    y: 1,
    w: GRID_W - 8,
    h: Math.round(GRID_H * 0.65)
  };
  
  const quietStudyZone = {
    x: 1,
    y: 9,
    w: 6,
    h: 6
  };
  
  const outdoorTerrace = {
    x: 8,
    y: Math.round(GRID_H * 0.7),
    w: GRID_W - 8,
    h: GRID_H - Math.round(GRID_H * 0.7) - 1
  };

  const handleSeatClick = (seatId: string) => {
    if (onSeatSelect) {
      onSeatSelect(seatId);
    }
  };

  const getSeatStyle = (seatId: string) => ({
    cursor: 'pointer',
    transform: hoveredSeat === seatId ? 'scale(1.15)' : 'scale(1)',
    transition: 'transform 0.3s ease',
    filter: selectedSeat === seatId ? 'drop-shadow(0 0 12px #f59e0b)' : 'none',
    zIndex: hoveredSeat === seatId ? 100 : 'auto'
  });

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-stone-100 to-green-50 overflow-hidden">
      {/* Full-screen header controls */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-stone-800">RAW SMITH CAFÉ</h1>
              <p className="text-stone-600 text-sm">Interactive Floor Plan - Full Experience</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleZoomOut}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-stone-600 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              onClick={handleZoomIn}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleRotate}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Floor Plan Container - Full Screen */}
      <div className="absolute inset-0 pt-20 pb-4 px-4">
        <div
          className="relative w-full h-full mx-auto border-2 border-stone-300 rounded-xl shadow-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #f5f0e8 0%, #e8ddd4 50%, #f0f4f0 100%)",
          }}
        >
          {/* Zoomable and rotatable container */}
          <div
            className="absolute inset-0 origin-center transition-transform duration-300"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              width: '100%',
              height: '100%'
            }}
          >
            {/* Background Image */}
            <img
              src={BACKGROUND_IMAGE}
              alt="RAW SMITH Café reference"
              className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none"
              style={{ zIndex: 1 }}
              draggable={false}
            />

            {/* Zone Overlays */}
            {/* VIP Lounge */}
            <div
              className="absolute border-2 border-amber-400 rounded-xl"
              style={{
                left: `${(vipLounge.x / GRID_W) * 100}%`,
                top: `${(vipLounge.y / GRID_H) * 100}%`,
                width: `${(vipLounge.w / GRID_W) * 100}%`,
                height: `${(vipLounge.h / GRID_H) * 100}%`,
                background: COLOR_VIP,
                zIndex: 5,
                pointerEvents: "none"
              }}
            >
              <span className="absolute left-3 top-3 text-amber-700 font-bold text-sm bg-amber-100 px-3 py-1 rounded-full shadow-sm">
                ✨ VIP Lounge
              </span>
            </div>

            {/* Main Indoor Area */}
            <div
              className="absolute border-2 border-stone-400 rounded-xl"
              style={{
                left: `${(mainIndoorZone.x / GRID_W) * 100}%`,
                top: `${(mainIndoorZone.y / GRID_H) * 100}%`,
                width: `${(mainIndoorZone.w / GRID_W) * 100}%`,
                height: `${(mainIndoorZone.h / GRID_H) * 100}%`,
                background: COLOR_INDOOR,
                zIndex: 5,
                pointerEvents: "none"
              }}
            >
              <span className="absolute left-3 top-3 text-stone-700 font-bold text-sm bg-white/90 px-3 py-1 rounded-full shadow-sm">
                ☕ Main Dining Hall
              </span>
            </div>

            {/* Quiet Study Zone */}
            <div
              className="absolute border-2 border-indigo-400 rounded-xl"
              style={{
                left: `${(quietStudyZone.x / GRID_W) * 100}%`,
                top: `${(quietStudyZone.y / GRID_H) * 100}%`,
                width: `${(quietStudyZone.w / GRID_W) * 100}%`,
                height: `${(quietStudyZone.h / GRID_H) * 100}%`,
                background: COLOR_QUIET,
                zIndex: 5,
                pointerEvents: "none"
              }}
            >
              <span className="absolute left-3 top-3 text-indigo-700 font-bold text-sm bg-indigo-100 px-3 py-1 rounded-full shadow-sm">
                📚 Quiet Study Zone
              </span>
            </div>

            {/* Outdoor Terrace */}
            <div
              className="absolute border-2 border-green-400 rounded-xl"
              style={{
                left: `${(outdoorTerrace.x / GRID_W) * 100}%`,
                top: `${(outdoorTerrace.y / GRID_H) * 100}%`,
                width: `${(outdoorTerrace.w / GRID_W) * 100}%`,
                height: `${(outdoorTerrace.h / GRID_H) * 100}%`,
                background: COLOR_OUTDOOR,
                zIndex: 5,
                pointerEvents: "none"
              }}
            >
              <span className="absolute left-3 top-3 text-green-700 font-bold text-sm bg-green-100 px-3 py-1 rounded-full shadow-sm">
                🌿 Garden Terrace
              </span>
            </div>

            {/* Central L-shaped Bar Counter */}
            <div 
              className="absolute bg-gradient-to-r from-stone-900 to-stone-800 rounded-lg shadow-2xl"
              style={{
                left: `${(10 / GRID_W) * 100}%`,
                top: `${(3 / GRID_H) * 100}%`,
                width: `${(8 / GRID_W) * 100}%`,
                height: `${(2 / GRID_H) * 100}%`,
                zIndex: 25,
                border: "4px solid #1a1a1a"
              }}
            />
            <div 
              className="absolute bg-gradient-to-r from-stone-900 to-stone-800 rounded-lg shadow-2xl"
              style={{
                left: `${(16 / GRID_W) * 100}%`,
                top: `${(3 / GRID_H) * 100}%`,
                width: `${(2 / GRID_W) * 100}%`,
                height: `${(5 / GRID_H) * 100}%`,
                zIndex: 25,
                border: "4px solid #1a1a1a"
              }}
            />

            {/* Bar Stools - Around the L-shaped counter */}
            {[0, 1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={`barstool-${i}`}
                onClick={() => handleSeatClick(`barstool-${i}`)}
                onMouseEnter={() => setHoveredSeat(`barstool-${i}`)}
                onMouseLeave={() => setHoveredSeat(null)}
                style={{
                  ...getSeatStyle(`barstool-${i}`),
                  position: 'absolute',
                  left: `${((10.5 + i * 1.1) / GRID_W) * 100}%`,
                  top: `${(5.5 / GRID_H) * 100}%`,
                  width: `${(0.8 / GRID_W) * 100}%`,
                  height: `${(0.8 / GRID_H) * 100}%`,
                  zIndex: 30
                }}
              >
                <CafeIconMarker
                  icon="BarStool"
                  gridX={0}
                  gridY={0}
                  gridSize={100}
                  iconColor="#2a2a2a"
                  zIndex={30}
                />
              </div>
            ))}

            {/* VIP Lounge Seating - Luxury arrangements */}
            {[
              { id: 'vip-chair-1', x: 2, y: 3 },
              { id: 'vip-chair-2', x: 4, y: 3 },
              { id: 'vip-chair-3', x: 2, y: 6 },
              { id: 'vip-chair-4', x: 4, y: 6 }
            ].map((seat) => (
              <div
                key={seat.id}
                onClick={() => handleSeatClick(seat.id)}
                onMouseEnter={() => setHoveredSeat(seat.id)}
                onMouseLeave={() => setHoveredSeat(null)}
                style={{
                  ...getSeatStyle(seat.id),
                  position: 'absolute',
                  left: `${(seat.x / GRID_W) * 100}%`,
                  top: `${(seat.y / GRID_H) * 100}%`,
                  width: `${(1.2 / GRID_W) * 100}%`,
                  height: `${(1.2 / GRID_H) * 100}%`,
                  zIndex: 25
                }}
              >
                <CafeIconMarker
                  icon="Armchair"
                  gridX={0}
                  gridY={0}
                  gridSize={100}
                  iconColor="#b45309"
                  zIndex={25}
                />
              </div>
            ))}

            {/* VIP Coffee Tables */}
            <div
              style={{
                position: 'absolute',
                left: `${(3 / GRID_W) * 100}%`,
                top: `${(4.5 / GRID_H) * 100}%`,
                width: `${(1 / GRID_W) * 100}%`,
                height: `${(1 / GRID_H) * 100}%`,
                zIndex: 20
              }}
            >
              <CafeIconMarker
                icon="SideTable"
                gridX={0}
                gridY={0}
                gridSize={100}
                iconColor="#92400e"
                zIndex={20}
              />
            </div>

            {/* Main Dining Tables - Diverse arrangements */}
            {[
              { x: 8, y: 3, id: 'window-table-1' },
              { x: 11, y: 3, id: 'window-table-2' },
              { x: 14, y: 3, id: 'window-table-3' },
              { x: 8, y: 6, id: 'center-table-1' },
              { x: 11, y: 6, id: 'center-table-2' },
              { x: 14, y: 6, id: 'center-table-3' },
              { x: 17, y: 6, id: 'corner-table-1' },
              { x: 20, y: 6, id: 'corner-table-2' },
              { x: 8, y: 9, id: 'booth-table-1' },
              { x: 11, y: 9, id: 'booth-table-2' },
              { x: 17, y: 3, id: 'wall-table-1' },
              { x: 20, y: 3, id: 'wall-table-2' }
            ].map((table) => (
              <React.Fragment key={table.id}>
                <div
                  onClick={() => handleSeatClick(table.id)}
                  onMouseEnter={() => setHoveredSeat(table.id)}
                  onMouseLeave={() => setHoveredSeat(null)}
                  style={{
                    ...getSeatStyle(table.id),
                    position: 'absolute',
                    left: `${(table.x / GRID_W) * 100}%`,
                    top: `${(table.y / GRID_H) * 100}%`,
                    width: `${(1.2 / GRID_W) * 100}%`,
                    height: `${(1.2 / GRID_H) * 100}%`,
                    zIndex: 20
                  }}
                >
                  <CafeIconMarker 
                    icon="Table" 
                    gridX={0}
                    gridY={0}
                    gridSize={100}
                    iconColor="#8B4513"
                    zIndex={20} 
                  />
                </div>
                
                {/* Chairs around each table */}
                {[-1, 1].map((offsetX, idx) => (
                  <div
                    key={`${table.id}-chair-x-${idx}`}
                    onClick={() => handleSeatClick(`${table.id}-chair-x-${idx + 1}`)}
                    onMouseEnter={() => setHoveredSeat(`${table.id}-chair-x-${idx + 1}`)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    style={{
                      ...getSeatStyle(`${table.id}-chair-x-${idx + 1}`),
                      position: 'absolute',
                      left: `${((table.x + offsetX * 0.8) / GRID_W) * 100}%`,
                      top: `${(table.y / GRID_H) * 100}%`,
                      width: `${(0.8 / GRID_W) * 100}%`,
                      height: `${(0.8 / GRID_H) * 100}%`,
                      zIndex: 20
                    }}
                  >
                    <CafeIconMarker 
                      icon="Chair" 
                      gridX={0}
                      gridY={0}
                      gridSize={100}
                      iconColor="#333"
                      zIndex={20} 
                    />
                  </div>
                ))}
                {[-1, 1].map((offsetY, idx) => (
                  <div
                    key={`${table.id}-chair-y-${idx}`}
                    onClick={() => handleSeatClick(`${table.id}-chair-y-${idx + 1}`)}
                    onMouseEnter={() => setHoveredSeat(`${table.id}-chair-y-${idx + 1}`)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    style={{
                      ...getSeatStyle(`${table.id}-chair-y-${idx + 1}`),
                      position: 'absolute',
                      left: `${(table.x / GRID_W) * 100}%`,
                      top: `${((table.y + offsetY * 0.8) / GRID_H) * 100}%`,
                      width: `${(0.8 / GRID_W) * 100}%`,
                      height: `${(0.8 / GRID_H) * 100}%`,
                      zIndex: 20
                    }}
                  >
                    <CafeIconMarker 
                      icon="Chair" 
                      gridX={0}
                      gridY={0}
                      gridSize={100}
                      iconColor="#333"
                      zIndex={20} 
                    />
                  </div>
                ))}
              </React.Fragment>
            ))}

            {/* Quiet Study Zone - Individual work stations */}
            {[
              { x: 2, y: 11, id: 'study-1' },
              { x: 4.5, y: 11, id: 'study-2' },
              { x: 2, y: 13, id: 'study-3' },
              { x: 4.5, y: 13, id: 'study-4' }
            ].map((station) => (
              <div
                key={station.id}
                onClick={() => handleSeatClick(station.id)}
                onMouseEnter={() => setHoveredSeat(station.id)}
                onMouseLeave={() => setHoveredSeat(null)}
                style={{
                  ...getSeatStyle(station.id),
                  position: 'absolute',
                  left: `${(station.x / GRID_W) * 100}%`,
                  top: `${(station.y / GRID_H) * 100}%`,
                  width: `${(1 / GRID_W) * 100}%`,
                  height: `${(1 / GRID_H) * 100}%`,
                  zIndex: 20
                }}
              >
                <CafeIconMarker 
                  icon="Chair" 
                  gridX={0}
                  gridY={0}
                  gridSize={100}
                  iconColor="#4f46e5"
                  zIndex={20} 
                />
              </div>
            ))}

            {/* Outdoor Garden Tables */}
            {[
              { x: 10, y: 13, id: 'garden-1' },
              { x: 13, y: 13, id: 'garden-2' },
              { x: 16, y: 13, id: 'garden-3' },
              { x: 19, y: 13, id: 'garden-4' },
              { x: 11.5, y: 15, id: 'patio-1' },
              { x: 17.5, y: 15, id: 'patio-2' }
            ].map((table) => (
              <React.Fragment key={table.id}>
                <div
                  onClick={() => handleSeatClick(table.id)}
                  onMouseEnter={() => setHoveredSeat(table.id)}
                  onMouseLeave={() => setHoveredSeat(null)}
                  style={{
                    ...getSeatStyle(table.id),
                    position: 'absolute',
                    left: `${(table.x / GRID_W) * 100}%`,
                    top: `${(table.y / GRID_H) * 100}%`,
                    width: `${(1.2 / GRID_W) * 100}%`,
                    height: `${(1.2 / GRID_H) * 100}%`,
                    zIndex: 15
                  }}
                >
                  <CafeIconMarker 
                    icon="Table" 
                    gridX={0}
                    gridY={0}
                    gridSize={100}
                    iconColor="#16a34a"
                    zIndex={15} 
                  />
                </div>
                
                {[-0.8, 0.8].map((offset, idx) => (
                  <div
                    key={`${table.id}-chair-${idx}`}
                    onClick={() => handleSeatClick(`${table.id}-chair-${idx + 1}`)}
                    onMouseEnter={() => setHoveredSeat(`${table.id}-chair-${idx + 1}`)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    style={{
                      ...getSeatStyle(`${table.id}-chair-${idx + 1}`),
                      position: 'absolute',
                      left: `${((table.x + offset) / GRID_W) * 100}%`,
                      top: `${(table.y / GRID_H) * 100}%`,
                      width: `${(0.8 / GRID_W) * 100}%`,
                      height: `${(0.8 / GRID_H) * 100}%`,
                      zIndex: 15
                    }}
                  >
                    <CafeIconMarker 
                      icon="Chair" 
                      gridX={0}
                      gridY={0}
                      gridSize={100}
                      iconColor="#16a34a"
                      zIndex={15} 
                    />
                  </div>
                ))}
              </React.Fragment>
            ))}

            {/* Decorative Elements */}
            {[
              { x: 0.5, y: 12.5, color: "#16a34a" },
              { x: 7, y: 12.5, color: "#16a34a" },
              { x: 22, y: 2, color: "#16a34a" },
              { x: 22, y: 8, color: "#16a34a" },
              { x: 22, y: 14, color: "#16a34a" },
              { x: 0.5, y: 1, color: "#16a34a" }
            ].map((plant, idx) => (
              <div
                key={`plant-${idx}`}
                style={{
                  position: 'absolute',
                  left: `${(plant.x / GRID_W) * 100}%`,
                  top: `${(plant.y / GRID_H) * 100}%`,
                  width: `${(0.8 / GRID_W) * 100}%`,
                  height: `${(0.8 / GRID_H) * 100}%`,
                  zIndex: 10
                }}
              >
                <CafeIconMarker 
                  icon="Planter" 
                  gridX={0}
                  gridY={0}
                  gridSize={100}
                  iconColor={plant.color}
                  zIndex={10} 
                />
              </div>
            ))}

            {/* Main Entrance */}
            <div
              style={{
                position: 'absolute',
                left: `${((GRID_W/2 - 2) / GRID_W) * 100}%`,
                top: `${((GRID_H - 0.5) / GRID_H) * 100}%`,
                width: `${(4 / GRID_W) * 100}%`,
                height: `${(0.5 / GRID_H) * 100}%`,
                zIndex: 35
              }}
            >
              <CafeIconMarker
                icon="Door"
                gridX={0}
                gridY={0}
                gridSize={100}
                label="🚪 Main Entrance"
                zIndex={35}
              />
            </div>

            {/* Cafe Branding - Centered */}
            <div
              className="absolute font-black tracking-widest text-center pointer-events-none select-none"
              style={{
                left: `${((GRID_W/2 - 4) / GRID_W) * 100}%`,
                top: `${(0.5 / GRID_H) * 100}%`,
                fontSize: `${3 / GRID_W * 100}vw`,
                color: "#78350f",
                zIndex: 40,
                width: `${(8 / GRID_W) * 100}%`,
                textShadow: "3px 3px 6px rgba(255,255,255,0.9)",
                transform: 'perspective(500px) rotateX(15deg)'
              }}
            >
              RAW SMITH CAFÉ
            </div>
          </div>

          {/* Enhanced Legend - Fixed position */}
          <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-white/50 text-sm z-50">
            <div className="font-bold mb-3 text-stone-800">🗺️ Seating Areas</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-200 rounded-full border border-amber-400"></div>
                <span>✨ VIP Lounge</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-stone-200 rounded-full border border-stone-400"></div>
                <span>☕ Main Dining</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-indigo-200 rounded-full border border-indigo-400"></div>
                <span>📚 Quiet Study</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-200 rounded-full border border-green-400"></div>
                <span>🌿 Garden Terrace</span>
              </div>
            </div>
          </div>

          {/* Enhanced Seat Info Panel */}
          {hoveredSeat && (
            <div className="absolute top-24 left-6 bg-white/98 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-white/50 text-sm max-w-sm z-50">
              <div className="font-bold text-stone-800 text-lg mb-2">{hoveredSeat}</div>
              <div className="text-stone-600 mb-2">
                🪑 Click to join this seat • ✅ Available now
              </div>
              <div className="text-xs text-stone-500">
                Perfect for: {hoveredSeat.includes('vip') ? '🥂 Premium experience' : 
                            hoveredSeat.includes('study') ? '📖 Focused work' :
                            hoveredSeat.includes('garden') ? '🌱 Outdoor relaxation' :
                            '☕ Coffee & conversation'}
              </div>
            </div>
          )}

          {/* Live Status Indicators */}
          <div className="absolute top-24 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-white/50 text-sm z-50">
            <div className="font-bold mb-3 text-stone-800">🔴 Live Status</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>👥 Current Patrons</span>
                <span className="font-bold text-green-600">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🪑 Available Seats</span>
                <span className="font-bold text-blue-600">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span>⏰ Peak Hours</span>
                <span className="font-bold text-orange-600">2-4 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
