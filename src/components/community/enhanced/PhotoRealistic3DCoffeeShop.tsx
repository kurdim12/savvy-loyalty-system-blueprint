
import React, { useState, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Text3D, Box, Plane } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Maximize2, Minimize2, RotateCcw } from 'lucide-react';

// Materials and textures
const ConcreteWall = ({ position, args, color = '#e0e0e0' }: any) => (
  <Box position={position} args={args}>
    <meshStandardMaterial 
      color={color} 
      roughness={0.8} 
      metalness={0.1}
      normalScale={[0.5, 0.5]}
    />
  </Box>
);

const WoodTable = ({ position, args, color = '#8B4513' }: any) => (
  <Box position={position} args={args}>
    <meshStandardMaterial 
      color={color} 
      roughness={0.3} 
      metalness={0.0}
    />
  </Box>
);

const MetalChair = ({ position }: any) => {
  return (
    <group position={position}>
      {/* Seat */}
      <Box position={[0, 1, 0]} args={[0.4, 0.05, 0.4]}>
        <meshStandardMaterial color="#2a2a2a" roughness={0.1} metalness={0.8} />
      </Box>
      {/* Back */}
      <Box position={[0, 1.4, -0.15]} args={[0.4, 0.8, 0.05]}>
        <meshStandardMaterial color="#2a2a2a" roughness={0.1} metalness={0.8} />
      </Box>
      {/* Legs */}
      {[-0.15, 0.15].map((x, i) => 
        [-0.15, 0.15].map((z, j) => (
          <Box key={`${i}-${j}`} position={[x, 0.5, z]} args={[0.03, 1, 0.03]}>
            <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.9} />
          </Box>
        ))
      )}
    </group>
  );
};

const BarStool = ({ position }: any) => {
  return (
    <group position={position}>
      {/* Seat */}
      <Box position={[0, 1.2, 0]} args={[0.35, 0.05, 0.35]}>
        <meshStandardMaterial color="#2a2a2a" roughness={0.1} metalness={0.8} />
      </Box>
      {/* Central pole */}
      <Box position={[0, 0.6, 0]} args={[0.05, 1.2, 0.05]}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.9} />
      </Box>
      {/* Base */}
      <Box position={[0, 0.1, 0]} args={[0.4, 0.05, 0.4]}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.9} />
      </Box>
    </group>
  );
};

const LoungeChair = ({ position, rotation = [0, 0, 0] }: any) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat cushion */}
      <Box position={[0, 0.5, 0]} args={[0.6, 0.1, 0.6]}>
        <meshStandardMaterial color="#2d5a3d" roughness={0.8} metalness={0.0} />
      </Box>
      {/* Back cushion */}
      <Box position={[0, 0.8, -0.25]} args={[0.6, 0.6, 0.1]}>
        <meshStandardMaterial color="#2d5a3d" roughness={0.8} metalness={0.0} />
      </Box>
      {/* Wooden frame */}
      <Box position={[0, 0.3, 0]} args={[0.65, 0.05, 0.65]}>
        <meshStandardMaterial color="#8B4513" roughness={0.3} metalness={0.0} />
      </Box>
      {/* Legs */}
      {[-0.25, 0.25].map((x, i) => 
        [-0.25, 0.25].map((z, j) => (
          <Box key={`${i}-${j}`} position={[x, 0.15, z]} args={[0.05, 0.3, 0.05]}>
            <meshStandardMaterial color="#CD853F" roughness={0.1} metalness={0.7} />
          </Box>
        ))
      )}
    </group>
  );
};

const EspressoMachine = ({ position }: any) => {
  return (
    <group position={position}>
      {/* Main body */}
      <Box position={[0, 0.3, 0]} args={[0.4, 0.6, 0.3]}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.8} />
      </Box>
      {/* Steam wand */}
      <Box position={[0.15, 0.5, 0.1]} args={[0.02, 0.3, 0.02]}>
        <meshStandardMaterial color="#C0C0C0" roughness={0.1} metalness={0.9} />
      </Box>
      {/* Group head */}
      <Box position={[0, 0.4, 0.2]} args={[0.15, 0.1, 0.1]}>
        <meshStandardMaterial color="#2a2a2a" roughness={0.1} metalness={0.8} />
      </Box>
    </group>
  );
};

const CoffeeShopInterior = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(5, 3, 8);
    camera.lookAt(0, 1, 0);
  }, [camera]);

  return (
    <group>
      {/* Floor */}
      <Plane position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} args={[20, 20]}>
        <meshStandardMaterial color="#4a4a4a" roughness={0.1} metalness={0.3} />
      </Plane>

      {/* Exterior Facade */}
      <group position={[-6, 0, 0]}>
        {/* Main wall */}
        <ConcreteWall position={[0, 2, 0]} args={[0.2, 4, 8]} color="#f5f5f5" />
        
        {/* Service window frame */}
        <Box position={[0.15, 2.5, -1]} args={[0.1, 1.2, 1.8]}>
          <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.8} />
        </Box>
        
        {/* Window opening */}
        <Box position={[0.2, 2.5, -1]} args={[0.05, 1, 1.6]}>
          <meshStandardMaterial transparent opacity={0.3} color="#87ceeb" />
        </Box>

        {/* Exterior counter */}
        <Box position={[0.4, 1.1, -1]} args={[0.6, 0.1, 1.8]}>
          <meshStandardMaterial color="#d3d3d3" roughness={0.3} metalness={0.1} />
        </Box>

        {/* Exterior bar stools */}
        <BarStool position={[1, 0, -1.5]} />
        <BarStool position={[1, 0, -0.5]} />

        {/* Coffee signage */}
        <group position={[0.3, 3.5, -1]}>
          <Text3D 
            font="/fonts/helvetiker_regular.typeface.json"
            size={0.3}
            height={0.05}
            curveSegments={12}
          >
            COFFEE
            <meshStandardMaterial color="#1a1a1a" />
          </Text3D>
        </group>
      </group>

      {/* Glass door */}
      <group position={[-5.5, 0, 2]}>
        <Box position={[0, 2, 0]} args={[0.05, 4, 0.05]}>
          <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.8} />
        </Box>
        <Box position={[0, 2, 0]} args={[0.02, 3.5, 1.8]}>
          <meshStandardMaterial transparent opacity={0.3} color="#87ceeb" />
        </Box>
      </group>

      {/* Interior walls */}
      <ConcreteWall position={[-5, 2, 0]} args={[0.2, 4, 8]} />
      <ConcreteWall position={[0, 2, -4]} args={[10, 4, 0.2]} />
      <ConcreteWall position={[5, 2, 0]} args={[0.2, 4, 8]} />

      {/* Archway with exposed plaster */}
      <group position={[-1, 0, 0]}>
        <Box position={[0, 2, 0]} args={[0.3, 4, 1]}>
          <meshStandardMaterial color="#6b8db5" roughness={0.9} metalness={0.0} />
        </Box>
        {/* Rough edges */}
        <Box position={[0.1, 2.2, 0.3]} args={[0.1, 0.3, 0.2]}>
          <meshStandardMaterial color="#d4af37" roughness={0.8} metalness={0.3} />
        </Box>
      </group>

      {/* Main bar counter */}
      <group position={[2, 0, -2]}>
        <Box position={[0, 1, 0]} args={[4, 0.1, 0.8]}>
          <meshStandardMaterial color="#d3d3d3" roughness={0.3} metalness={0.1} />
        </Box>
        
        {/* Under-counter LED strip */}
        <Box position={[0, 0.95, 0.3]} args={[3.8, 0.02, 0.1]}>
          <meshStandardMaterial color="#ffdd44" emissive="#ffdd44" emissiveIntensity={0.5} />
        </Box>

        {/* Bar equipment */}
        <EspressoMachine position={[-1, 1.1, -0.2]} />
        
        {/* Coffee bags display */}
        <Box position={[1, 1.5, -0.3]} args={[1.5, 0.05, 0.2]}>
          <meshStandardMaterial color="#8B4513" roughness={0.3} metalness={0.0} />
        </Box>

        {/* Bar stools */}
        <BarStool position={[-1.5, 0, 1.2]} />
        <BarStool position={[-0.5, 0, 1.2]} />
        <BarStool position={[0.5, 0, 1.2]} />
        <BarStool position={[1.5, 0, 1.2]} />
      </group>

      {/* Window seating area */}
      <group position={[-3, 0, -1]}>
        <WoodTable position={[0, 0.7, 0]} args={[0.8, 0.05, 0.8]} />
        <MetalChair position={[-0.5, 0, 0.5]} />
        <MetalChair position={[0.5, 0, -0.5]} />
        
        {/* Small plant */}
        <Box position={[0.3, 0.8, 0.3]} args={[0.1, 0.2, 0.1]}>
          <meshStandardMaterial color="#228B22" />
        </Box>
      </group>

      {/* Lounge area beyond arch */}
      <group position={[1, 0, 2]}>
        <LoungeChair position={[-0.8, 0, 0]} rotation={[0, Math.PI / 4, 0]} />
        <LoungeChair position={[0.8, 0, 0]} rotation={[0, -Math.PI / 4, 0]} />
        
        {/* Round side table */}
        <Box position={[0, 0.4, 0]} args={[0.4, 0.05, 0.4]}>
          <meshStandardMaterial color="#1a1a1a" roughness={0.1} metalness={0.8} />
        </Box>
        
        {/* Table lamp */}
        <Box position={[0, 0.7, 0]} args={[0.05, 0.3, 0.05]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        <Box position={[0, 0.85, 0]} args={[0.15, 0.1, 0.15]}>
          <meshStandardMaterial color="#f5deb3" emissive="#ffdd44" emissiveIntensity={0.2} />
        </Box>
      </group>

      {/* Additional dining area */}
      <group position={[3, 0, 2]}>
        <WoodTable position={[0, 0.7, 0]} args={[0.8, 0.05, 0.8]} />
        <MetalChair position={[-0.5, 0, 0.5]} />
        <MetalChair position={[0.5, 0, -0.5]} />
      </group>

      {/* Cupping bar */}
      <group position={[4, 0, -1]}>
        <WoodTable position={[0, 1, 0]} args={[1.5, 0.05, 0.4]} color="#DEB887" />
        
        {/* Cupping bowls */}
        {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
          <group key={i}>
            <Box position={[x, 1.1, -0.1]} args={[0.08, 0.03, 0.08]}>
              <meshStandardMaterial color="#ffffff" />
            </Box>
            <Box position={[x, 1.1, 0.1]} args={[0.08, 0.03, 0.08]}>
              <meshStandardMaterial color="#ffffff" />
            </Box>
          </group>
        ))}
        
        {/* Coffee scale */}
        <Box position={[0.5, 1.08, 0]} args={[0.15, 0.05, 0.12]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
      </group>

      {/* Ceiling lighting */}
      <group position={[0, 3.8, 0]}>
        {/* Linear LED fixture */}
        <Box position={[2, 0, -2]} args={[3, 0.05, 0.1]}>
          <meshStandardMaterial color="#1a1a1a" />
        </Box>
        <Box position={[2, -0.05, -2]} args={[2.8, 0.02, 0.08]}>
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
        </Box>
        
        {/* Pendant light */}
        <group position={[-1, -0.5, 0]}>
          <Box position={[0, 0, 0]} args={[0.02, 0.5, 0.02]}>
            <meshStandardMaterial color="#1a1a1a" />
          </Box>
          <Box position={[0, -0.3, 0]} args={[0.2, 0.2, 0.2]}>
            <meshStandardMaterial color="#f5deb3" emissive="#ffdd44" emissiveIntensity={0.3} />
          </Box>
        </group>
      </group>

      {/* Planters and greenery */}
      <group position={[-4, 0, -3]}>
        <Box position={[0, 0.5, 0]} args={[0.3, 1, 0.3]}>
          <meshStandardMaterial color="#654321" />
        </Box>
        <Box position={[0, 1.2, 0]} args={[0.1, 0.8, 0.1]}>
          <meshStandardMaterial color="#228B22" />
        </Box>
      </group>

      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[-5, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#ffdd44" />
    </group>
  );
};

interface PhotoRealistic3DCoffeeShopProps {
  onBack?: () => void;
}

export const PhotoRealistic3DCoffeeShop: React.FC<PhotoRealistic3DCoffeeShopProps> = ({ onBack }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraReset, setCameraReset] = useState(0);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const resetCamera = () => {
    setCameraReset(prev => prev + 1);
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'w-full h-screen'} bg-gradient-to-br from-stone-100 to-amber-50`}>
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
        <Card className="bg-white/90 backdrop-blur-sm border-white/50">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold text-stone-800 mb-1">Photorealistic Coffee Shop</h2>
            <p className="text-stone-600 text-sm">
              Industrial-minimalist design with seamless interior-exterior flow
            </p>
            <div className="text-xs text-stone-500 mt-1">
              Drag to rotate • Scroll to zoom • Right-click to pan
            </div>
          </CardContent>
        </Card>
        
        <div className="flex gap-2">
          <Button
            onClick={resetCamera}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-white/50"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            onClick={toggleFullscreen}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-white/50"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          {onBack && (
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="bg-white/90 backdrop-blur-sm border-white/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [5, 3, 8], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
        key={cameraReset}
      >
        <Suspense fallback={null}>
          <CoffeeShopInterior />
          <OrbitControls 
            enablePan 
            enableZoom 
            enableRotate 
            minDistance={3}
            maxDistance={15}
            maxPolarAngle={Math.PI / 2}
          />
          <Environment preset="apartment" />
        </Suspense>
      </Canvas>

      {/* Scene Info */}
      <div className="absolute bottom-4 left-4 z-20">
        <Card className="bg-black/80 backdrop-blur-sm border-white/20">
          <CardContent className="p-3">
            <div className="text-white text-xs space-y-1">
              <div className="font-bold mb-2">Scene Elements:</div>
              <div>• Exterior service window with bar stools</div>
              <div>• Glass door entrance</div>
              <div>• L-shaped concrete bar with espresso machine</div>
              <div>• Window seating with metal chairs</div>
              <div>• Lounge area with leather chairs</div>
              <div>• Cupping bar with ceramic bowls</div>
              <div>• Industrial lighting and planters</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
