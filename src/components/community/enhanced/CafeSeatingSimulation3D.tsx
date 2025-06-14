
import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Plane, Sphere, Environment } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Coffee, Wifi, Volume2 } from 'lucide-react';
import * as THREE from 'three';

interface SeatAreaProps {
  position: [number, number, number];
  color: string;
  occupied: boolean;
  type: 'indoor' | 'outdoor';
  name: string;
  onClick: () => void;
}

const SeatArea = ({ position, color, occupied, type, name, onClick }: SeatAreaProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={position} onClick={onClick}>
      {/* Table */}
      <Box
        ref={meshRef}
        args={[1.5, 0.1, 1.5]}
        position={[0, 0.75, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.8} />
      </Box>
      
      {/* Chairs */}
      {[[-0.6, 0, -0.6], [0.6, 0, -0.6], [-0.6, 0, 0.6], [0.6, 0, 0.6]].map((chairPos, index) => (
        <Box
          key={index}
          args={[0.4, 0.8, 0.4]}
          position={[chairPos[0], 0.4, chairPos[2]]}
        >
          <meshStandardMaterial 
            color={occupied && index < 2 ? "#8B4513" : "#D2B48C"} 
            metalness={0.2} 
            roughness={0.7} 
          />
        </Box>
      ))}
      
      {/* Area Label */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color={hovered ? "#FF6B6B" : "#333"}
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      
      {/* Occupancy Indicator */}
      <Sphere
        args={[0.1]}
        position={[0, 1.5, 0]}
      >
        <meshStandardMaterial 
          color={occupied ? "#FF4444" : "#44FF44"} 
          emissive={occupied ? "#FF0000" : "#00FF00"}
          emissiveIntensity={0.2}
        />
      </Sphere>
    </group>
  );
};

const CaveWall = ({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) => {
  return (
    <Box
      args={[4, 6, 0.5]}
      position={position}
      rotation={rotation}
    >
      <meshStandardMaterial 
        color="#8B7355" 
        roughness={0.9}
        normalScale={[0.5, 0.5]}
      />
    </Box>
  );
};

const CoffeeCounter = () => {
  return (
    <group position={[0, 0, -8]}>
      {/* Counter */}
      <Box args={[6, 1.2, 1.5]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#654321" metalness={0.1} roughness={0.8} />
      </Box>
      
      {/* Coffee Machine */}
      <Box args={[1, 1.5, 0.8]} position={[-1.5, 1.5, 0]}>
        <meshStandardMaterial color="#2C2C2C" metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Counter Stools */}
      {[-2, -0.5, 1, 2.5].map((x, index) => (
        <group key={index} position={[x, 0, 1.5]}>
          <Box args={[0.4, 1, 0.4]} position={[0, 0.5, 0]}>
            <meshStandardMaterial color="#8B4513" />
          </Box>
          <Sphere args={[0.3]} position={[0, 1.2, 0]}>
            <meshStandardMaterial color="#D2B48C" />
          </Sphere>
        </group>
      ))}
    </group>
  );
};

const OutdoorArea = () => {
  return (
    <group position={[10, 0, 0]}>
      {/* Outdoor Floor */}
      <Plane args={[8, 8]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#87CEEB" />
      </Plane>
      
      {/* Plants */}
      {[[-3, 0, -3], [3, 0, -3], [-3, 0, 3], [3, 0, 3]].map((pos, index) => (
        <group key={index} position={pos as [number, number, number]}>
          <Box args={[0.3, 1.5, 0.3]} position={[0, 0.75, 0]}>
            <meshStandardMaterial color="#228B22" />
          </Box>
        </group>
      ))}
    </group>
  );
};

interface CafeSeatingSimulation3DProps {
  onSeatSelect: (seatId: string) => void;
}

const CafeSeatingSimulation3D = ({ onSeatSelect }: CafeSeatingSimulation3DProps) => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 10, 15]);

  const seatAreas = [
    // Indoor Areas
    {
      id: 'cave-corner-1',
      name: 'Cave Corner',
      position: [-6, 0, -3] as [number, number, number],
      color: '#8B7355',
      occupied: true,
      type: 'indoor' as const,
      users: 2,
      capacity: 4
    },
    {
      id: 'window-spot',
      name: 'Window Spot',
      position: [-6, 0, 3] as [number, number, number],
      color: '#D2B48C',
      occupied: false,
      type: 'indoor' as const,
      users: 0,
      capacity: 2
    },
    {
      id: 'center-table',
      name: 'Center Hub',
      position: [0, 0, 0] as [number, number, number],
      color: '#CD853F',
      occupied: true,
      type: 'indoor' as const,
      users: 3,
      capacity: 4
    },
    {
      id: 'cozy-nook',
      name: 'Cozy Nook',
      position: [6, 0, -3] as [number, number, number],
      color: '#8B7355',
      occupied: false,
      type: 'indoor' as const,
      users: 0,
      capacity: 2
    },
    
    // Outdoor Areas
    {
      id: 'outdoor-table-1',
      name: 'Garden View',
      position: [8, 0, -2] as [number, number, number],
      color: '#F4A460',
      occupied: true,
      type: 'outdoor' as const,
      users: 2,
      capacity: 4
    },
    {
      id: 'outdoor-table-2',
      name: 'Street Side',
      position: [12, 0, 2] as [number, number, number],
      color: '#DEB887',
      occupied: false,
      type: 'outdoor' as const,
      users: 0,
      capacity: 2
    }
  ];

  const handleSeatClick = (areaId: string) => {
    setSelectedArea(areaId);
    onSeatSelect(areaId);
  };

  const switchView = (view: 'overview' | 'indoor' | 'outdoor') => {
    switch (view) {
      case 'overview':
        setCameraPosition([0, 15, 20]);
        break;
      case 'indoor':
        setCameraPosition([-2, 8, 10]);
        break;
      case 'outdoor':
        setCameraPosition([10, 8, 10]);
        break;
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-amber-50 to-stone-100">
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Coffee className="h-5 w-5 text-amber-600" />
              3D Cafe Explorer
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-2 mb-3">
              <Button size="sm" onClick={() => switchView('overview')}>
                Overview
              </Button>
              <Button size="sm" onClick={() => switchView('indoor')} variant="outline">
                Indoor
              </Button>
              <Button size="sm" onClick={() => switchView('outdoor')} variant="outline">
                Outdoor
              </Button>
            </div>
            <div className="text-xs text-gray-600">
              Click and drag to rotate • Scroll to zoom
            </div>
          </CardContent>
        </Card>

        {selectedArea && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="space-y-2">
                <h3 className="font-semibold text-amber-800">
                  {seatAreas.find(a => a.id === selectedArea)?.name}
                </h3>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">
                    {seatAreas.find(a => a.id === selectedArea)?.users}/
                    {seatAreas.find(a => a.id === selectedArea)?.capacity}
                  </span>
                  <Badge className="ml-2">
                    {seatAreas.find(a => a.id === selectedArea)?.type}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Panel */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-amber-600">
                  {seatAreas.filter(a => a.type === 'indoor').length}
                </div>
                <div className="text-xs">Indoor Areas</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {seatAreas.filter(a => a.type === 'outdoor').length}
                </div>
                <div className="text-xs">Outdoor Areas</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {seatAreas.reduce((sum, a) => sum + a.users, 0)}
                </div>
                <div className="text-xs">Active Users</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {seatAreas.reduce((sum, a) => sum + a.capacity, 0)}
                </div>
                <div className="text-xs">Total Capacity</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3D Scene */}
      <Canvas
        camera={{ position: cameraPosition, fov: 60 }}
        shadows
      >
        <Environment preset="cafe" />
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#FFA500" />

        {/* Floor */}
        <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <meshStandardMaterial color="#F5E6D3" roughness={0.8} />
        </Plane>

        {/* Cave Walls */}
        <CaveWall position={[-10, 3, 0]} />
        <CaveWall position={[0, 3, -10]} rotation={[0, Math.PI / 2, 0]} />
        
        {/* Coffee Counter */}
        <CoffeeCounter />
        
        {/* Outdoor Area */}
        <OutdoorArea />

        {/* Seating Areas */}
        {seatAreas.map((area) => (
          <SeatArea
            key={area.id}
            position={area.position}
            color={area.color}
            occupied={area.occupied}
            type={area.type}
            name={area.name}
            onClick={() => handleSeatClick(area.id)}
          />
        ))}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default CafeSeatingSimulation3D;
