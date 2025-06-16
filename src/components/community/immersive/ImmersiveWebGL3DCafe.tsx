import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Text, useGLTF, Sparkles, Stars, Cloud } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Settings, Users, Volume2, VolumeX } from 'lucide-react';
import * as THREE from 'three';

// Animated Coffee Cup Component
const FloatingCoffeeCup = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[0.3, 0.2, 0.4, 32]} />
      <meshStandardMaterial color="#8B4513" metalness={0.3} roughness={0.7} />
      {/* Steam effect */}
      <Sparkles count={20} scale={0.5} size={2} speed={0.5} color="#ffffff" />
    </mesh>
  );
};

// Interactive Table Component
const InteractiveTable = ({ 
  position, 
  occupied, 
  onSitDown 
}: { 
  position: [number, number, number]; 
  occupied: boolean;
  onSitDown: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={position}>
      {/* Table */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <meshStandardMaterial 
          color={hovered ? "#D2B48C" : "#8B7355"} 
          metalness={0.2} 
          roughness={0.8} 
        />
      </mesh>
      
      {/* Table Base */}
      <mesh position={[0, 0.375, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.75, 16]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      
      {/* Chairs */}
      {[0, Math.PI/2, Math.PI, 3*Math.PI/2].map((rotation, index) => (
        <group key={index} rotation={[0, rotation, 0]} position={[1.2, 0, 0]}>
          <mesh
            position={[0, 0.4, 0]}
            onClick={onSitDown}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
          >
            <boxGeometry args={[0.4, 0.8, 0.4]} />
            <meshStandardMaterial 
              color={occupied ? "#FF6B6B" : hovered ? "#87CEEB" : "#8B4513"} 
              emissive={hovered ? "#4169E1" : "#000000"}
              emissiveIntensity={hovered ? 0.2 : 0}
            />
          </mesh>
          
          {/* Chair back */}
          <mesh position={[0, 0.9, -0.15]}>
            <boxGeometry args={[0.4, 0.6, 0.1]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          
          {/* Holographic sit indicator */}
          {hovered && !occupied && (
            <Text
              position={[0, 1.5, 0]}
              fontSize={0.2}
              color="#00FFFF"
              anchorX="center"
              anchorY="middle"
            >
              Click to Sit
            </Text>
          )}
        </group>
      ))}
      
      {/* Floating coffee cup if occupied */}
      {occupied && <FloatingCoffeeCup position={[0.3, 1, 0.3]} />}
    </group>
  );
};

// Atmospheric Lighting Component
const AtmosphericLighting = () => {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });
  
  return (
    <>
      <ambientLight intensity={0.4} color="#FFE4B5" />
      <directionalLight 
        ref={lightRef}
        position={[10, 10, 5]} 
        intensity={1.2} 
        color="#FFA500"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#FF6347" />
      <spotLight 
        position={[5, 8, 3]} 
        angle={0.3} 
        penumbra={0.5} 
        intensity={1} 
        color="#87CEEB"
        castShadow
      />
    </>
  );
};

// Avatar Component
const UserAvatar = ({ 
  position, 
  color = "#FF6B6B" 
}: { 
  position: [number, number, number]; 
  color?: string;
}) => {
  const avatarRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (avatarRef.current) {
      avatarRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
  });
  
  return (
    <group ref={avatarRef} position={position}>
      {/* Body */}
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.3, 1, 16, 32]} />
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.9} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#FFDBAC" />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.1, 1.85, 0.2]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.1, 1.85, 0.2]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Particle effect */}
      <Sparkles count={10} scale={1} size={1} speed={0.3} color="#FFD700" />
    </group>
  );
};

interface ImmersiveWebGL3DCafeProps {
  userAvatar: any;
  voiceEnabled: boolean;
  immersiveMode: boolean;
  onExitCafe: () => void;
}

export const ImmersiveWebGL3DCafe = ({
  userAvatar,
  voiceEnabled,
  immersiveMode,
  onExitCafe
}: ImmersiveWebGL3DCafeProps) => {
  const [currentTable, setCurrentTable] = useState<number | null>(null);
  const [showUI, setShowUI] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const tables = [
    { position: [-4, 0, -2] as [number, number, number], occupied: false },
    { position: [4, 0, -2] as [number, number, number], occupied: true },
    { position: [-4, 0, 4] as [number, number, number], occupied: false },
    { position: [4, 0, 4] as [number, number, number], occupied: true },
    { position: [0, 0, 0] as [number, number, number], occupied: false },
  ];

  const handleSitDown = (tableIndex: number) => {
    setCurrentTable(tableIndex);
  };

  return (
    <div className="relative w-full h-full">
      {/* UI Overlay */}
      {showUI && (
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
          <Card className="bg-black/30 backdrop-blur-lg border-white/20 text-white">
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">🏛️ Raw Smith Cinematic Café</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>12 online</span>
                </div>
                <div className="flex items-center gap-1">
                  {voiceEnabled ? <Volume2 className="h-4 w-4 text-green-400" /> : <VolumeX className="h-4 w-4" />}
                  <span>Voice Chat</span>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setSoundEnabled(!soundEnabled)}
              variant="outline"
              className="bg-black/30 backdrop-blur-lg border-white/20 text-white"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => setShowUI(!showUI)}
              variant="outline"
              className="bg-black/30 backdrop-blur-lg border-white/20 text-white"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              onClick={onExitCafe}
              variant="outline"
              className="bg-black/30 backdrop-blur-lg border-white/20 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      )}

      {/* 3D Scene */}
      <Canvas
        camera={{ position: [0, 8, 12], fov: 60 }}
        shadows
        className="w-full h-full"
      >
        <AtmosphericLighting />
        
        {/* Environment */}
        <Environment preset="warehouse" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#8B7355" roughness={0.8} metalness={0.1} />
        </mesh>
        
        {/* Walls */}
        <mesh position={[-10, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[20, 6]} />
          <meshStandardMaterial color="#D2B48C" />
        </mesh>
        <mesh position={[10, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[20, 6]} />
          <meshStandardMaterial color="#D2B48C" />
        </mesh>
        <mesh position={[0, 3, -10]}>
          <planeGeometry args={[20, 6]} />
          <meshStandardMaterial color="#D2B48C" />
        </mesh>
        
        {/* Interactive Tables */}
        {tables.map((table, index) => (
          <InteractiveTable
            key={index}
            position={table.position}
            occupied={table.occupied}
            onSitDown={() => handleSitDown(index)}
          />
        ))}
        
        {/* User Avatar */}
        <UserAvatar position={[0, 0, 6]} />
        
        {/* Other Avatars */}
        <UserAvatar position={[4, 0, -1.5]} color="#4169E1" />
        <UserAvatar position={[-4, 0, 4.5]} color="#32CD32" />
        
        {/* Floating Elements */}
        <Cloud position={[0, 6, -5]} speed={0.1} opacity={0.3} />
        
        {/* Café Sign */}
        <Text
          position={[0, 5, -9.5]}
          fontSize={1}
          color="#8B4513"
          anchorX="center"
          anchorY="middle"
          font="/fonts/bold-font.woff"
        >
          RAW SMITH CAFÉ
        </Text>
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      
      {/* Bottom Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <Card className="bg-black/30 backdrop-blur-lg border-white/20 text-white">
          <div className="px-6 py-3 text-center">
            <p className="text-sm">
              🖱️ Click and drag to look around • 🪑 Click chairs to sit • 💬 Voice chat automatically enabled near others
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
