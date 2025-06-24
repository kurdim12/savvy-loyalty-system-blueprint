
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  useGLTF,
  Html,
  ContactShadows
} from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

/* ---------- Helpers ---------- */

function Loader() {
  return (
    <Html center style={{ color: "#fff", fontSize: "14px" }}>
      Loading café interior...
    </Html>
  );
}

/* ---------- Bar ---------- */

function Bar() {
  /* Dimensions in metres (Blender units = metres) */
  const LONG = 3.665;
  const DEPTH = 0.75;
  const HEIGHT = 0.9;
  const RETURN = 1.524;
  const KICK = 0.1;

  return (
    <group>
      {/* Long section */}
      <mesh position={[LONG / 2 - 0.05, HEIGHT / 2, -DEPTH / 2]}>
        <boxGeometry args={[LONG, HEIGHT, DEPTH]} />
        <meshStandardMaterial color="#808080" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Return leg */}
      <mesh position={[-DEPTH / 2, HEIGHT / 2, -(DEPTH + RETURN) / 2]}>
        <boxGeometry args={[DEPTH, HEIGHT, RETURN]} />
        <meshStandardMaterial color="#808080" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Brass kick plates */}
      <mesh position={[LONG / 2 - 0.05, KICK / 2, -DEPTH / 2]}>
        <boxGeometry args={[LONG, KICK, DEPTH + 0.01]} />
        <meshStandardMaterial
          color="#bfa35a"
          roughness={0.25}
          metalness={1}
        />
      </mesh>
      <mesh position={[-DEPTH / 2, KICK / 2, -(DEPTH + RETURN) / 2]}>
        <boxGeometry args={[DEPTH + 0.01, KICK, RETURN]} />
        <meshStandardMaterial
          color="#bfa35a"
          roughness={0.25}
          metalness={1}
        />
      </mesh>
    </group>
  );
}

/* ---------- Furniture Components ---------- */

function Chair(props: any) {
  // Fallback geometry for when GLB models aren't available
  return (
    <group {...props}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.4, 0.05, 0.4]} />
        <meshStandardMaterial color="#2c2c2c" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.6, -0.15]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.05]} />
        <meshStandardMaterial color="#2c2c2c" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Armchair(props: any) {
  return (
    <group {...props}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.6]} />
        <meshStandardMaterial color="#2d5a4a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.6, -0.2]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#2d5a4a" roughness={0.9} />
      </mesh>
      <mesh position={[-0.25, 0.6, 0]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.4]} />
        <meshStandardMaterial color="#2d5a4a" roughness={0.9} />
      </mesh>
      <mesh position={[0.25, 0.6, 0]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.4]} />
        <meshStandardMaterial color="#2d5a4a" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Bench(props: any) {
  return (
    <group {...props}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.2, 0.08, 0.4]} />
        <meshStandardMaterial color="#d2b48c" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#8b7355" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Table(props: any) {
  return (
    <group {...props}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.8, 0.05, 0.8]} />
        <meshStandardMaterial color="#d2b48c" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.375, 0]} castShadow>
        <boxGeometry args={[0.05, 0.75, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
      </mesh>
    </group>
  );
}

/* ---------- Main Scene Component ---------- */

interface PhotoRealistic3DCafeProps {
  onBack?: () => void;
}

export const PhotoRealistic3DCafe = ({ onBack }: PhotoRealistic3DCafeProps) => {
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-stone-900 to-zinc-900">
      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        {onBack && (
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white text-sm max-w-xs">
        <h3 className="font-semibold mb-2">3D Navigation</h3>
        <div className="space-y-1 text-xs">
          <p><RotateCcw className="inline h-3 w-3 mr-1" />Click + drag to rotate</p>
          <p><ZoomIn className="inline h-3 w-3 mr-1" />Scroll to zoom</p>
          <p><ZoomOut className="inline h-3 w-3 mr-1" />Right-click + drag to pan</p>
        </div>
      </div>

      {/* Scene Info */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white max-w-sm">
        <h3 className="font-semibold mb-2">RawSmith Coffee Interior</h3>
        <p className="text-sm text-gray-300 mb-2">
          L-shaped concrete bar with brass accents, industrial seating, and warm ambient lighting.
        </p>
        <div className="text-xs text-gray-400 space-y-1">
          <p>• Concrete floors and walls</p>
          <p>• Black metal furniture</p>
          <p>• Teal accent seating</p>
          <p>• Professional lighting</p>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [4, 2, 6], fov: 45 }}
        gl={{ antialias: true }}
        style={{ width: "100%", height: "100vh" }}
      >
        <Suspense fallback={<Loader />}>
          {/* Environment lighting */}
          <Environment
            preset="night"
            background
          />

          {/* Additional ambient lighting */}
          <ambientLight intensity={0.3} />

          {/* Floor - polished concrete */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[12, 12]} />
            <meshStandardMaterial color="#4a4a4a" roughness={0.1} metalness={0.3} />
          </mesh>

          {/* Back wall - concrete */}
          <mesh position={[0, 1.5, -5]} receiveShadow>
            <boxGeometry args={[12, 3, 0.2]} />
            <meshStandardMaterial color="#606060" roughness={0.8} />
          </mesh>

          {/* Side wall */}
          <mesh position={[-6, 1.5, 0]} receiveShadow>
            <boxGeometry args={[0.2, 3, 10]} />
            <meshStandardMaterial color="#606060" roughness={0.8} />
          </mesh>

          {/* Window wall - large glass panels */}
          <mesh position={[6, 1.5, 0]} receiveShadow>
            <boxGeometry args={[0.1, 3, 10]} />
            <meshStandardMaterial 
              color="#1a1a1a" 
              roughness={0.1} 
              metalness={0.8}
              transparent 
              opacity={0.8} 
            />
          </mesh>

          {/* L-shaped bar */}
          <Bar />

          {/* Seating arrangement */}
          <Table position={[2.5, 0, -1]} />
          <Chair position={[2, 0, -0.6]} />
          <Chair position={[3, 0, -0.6]} />
          <Chair position={[2, 0, -1.4]} />
          <Chair position={[3, 0, -1.4]} />

          <Table position={[1, 0, 1.5]} />
          <Chair position={[0.6, 0, 1.2]} />
          <Chair position={[1.4, 0, 1.2]} />

          <Bench position={[3.5, 0, 2]} rotation={[0, 0, 0]} />

          {/* Teal armchair in corner */}
          <Armchair position={[-2, 0, 2]} rotation={[0, Math.PI / 4, 0]} />

          {/* Additional table near window */}
          <Table position={[4.5, 0, 0.5]} />
          <Chair position={[4.2, 0, 0.2]} />
          <Chair position={[4.8, 0, 0.8]} />

          {/* Ceiling spotlights */}
          <spotLight
            position={[1, 3, 0]}
            angle={0.4}
            penumbra={0.5}
            intensity={2}
            castShadow
            color="#ffe6c4"
          />
          <spotLight
            position={[3, 3, -1]}
            angle={0.4}
            penumbra={0.5}
            intensity={2}
            castShadow
            color="#ffe6c4"
          />
          <spotLight
            position={[-1, 3, 1]}
            angle={0.4}
            penumbra={0.5}
            intensity={1.5}
            castShadow
            color="#ffe6c4"
          />

          {/* Warm accent lighting */}
          <pointLight
            position={[4, 1.5, 1]}
            intensity={1}
            color="#ff8c42"
            distance={3}
          />

          {/* Bar area lighting */}
          <pointLight
            position={[1, 1.2, -1]}
            intensity={1.5}
            color="#ffe6c4"
            distance={4}
          />

          {/* Soft contact shadows */}
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.4}
            scale={12}
            blur={2}
            far={6}
          />

          {/* Camera controls */}
          <OrbitControls 
            target={[1, 0.8, -0.5]} 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={15}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
