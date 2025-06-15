
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface CafeEntranceTransitionProps {
  onEnter: () => void;
  // Optionally receive a SeatingPlan component to show after entering
  SeatingPlan?: React.ReactNode;
}

export const CafeEntranceTransition: React.FC<CafeEntranceTransitionProps> = ({
  onEnter,
  SeatingPlan
}) => {
  const [entered, setEntered] = useState(false);
  const [zooming, setZooming] = useState(false);
  const zoomTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Optional: auto-enter after delay if you prefer auto entry
    // zoomTimeout.current = setTimeout(handleEnter, 3200);
    // return () => zoomTimeout.current && clearTimeout(zoomTimeout.current);
  }, []);

  const handleEnter = () => {
    if (zooming || entered) return;
    setZooming(true);
    // Wait for CSS zoom animation before switching view
    setTimeout(() => {
      setEntered(true);
      setZooming(false);
      onEnter?.();
    }, 1200);
  };

  // Entrance overlay
  if (!entered) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900">
        <div
          className={`
            relative w-full h-full flex items-center justify-center transition-transform duration-[1100ms] will-change-transform
            ${zooming ? "scale-[2.2]" : "scale-100"}
            origin-center
          `}
          style={{
            background:
              "radial-gradient(circle at 50% 70%, rgba(255,240,220,0.15), rgba(50,30,10,0.85) 90%)"
          }}
        >
          {/* Static entrance image */}
          <img
            src="/lovable-uploads/4fba4e0f-0dfa-43ef-a304-3b94769f0351.png"
            alt="Raw Smith Café Entrance"
            className="w-full h-full object-cover object-center"
            draggable={false}
            style={{
              pointerEvents: "none",
              userSelect: "none",
              filter: "brightness(0.95) contrast(1)"
            }}
          />
          {/* Overlay: Raw Smith Café logo in the scene's label position */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 text-4xl font-black text-amber-200 drop-shadow-lg tracking-widest z-10 pointer-events-none"
              style={{
                textShadow: "0 3px 12px #4B3B19, 0 1px 0px #fff"
              }}
          >
            Raw Smith Café
          </div>
          {/* Enter button or auto-hint */}
          {!zooming && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20">
              <Button
                onClick={handleEnter}
                className="bg-amber-700 hover:bg-amber-600 text-white text-lg px-7 py-3 rounded-full shadow-lg animate-fade-in"
                size="lg"
              >
                Enter Café
              </Button>
              <div className="text-white text-sm opacity-80 animate-pulse">
                Click or tap to enter
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Once entered, reveal the seating plan or pass through children
  return (
    SeatingPlan 
      ? <div className="w-full h-full">{SeatingPlan}</div> 
      : null
  );
};

export default CafeEntranceTransition;
