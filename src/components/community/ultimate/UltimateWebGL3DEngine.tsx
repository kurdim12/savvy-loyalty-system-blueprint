
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { Mesh, DirectionalLight, AmbientLight, PointLight, SpotLight } from 'three';
import { Environment, OrbitControls, PerspectiveCamera, useEnvironment } from '@react-three/drei';
import * as THREE from 'three';

interface Scene3DProps {
  weather: 'sunny' | 'cloudy' | 'rainy' | 'evening' | 'snowy';
  timeOfDay: number; // 0-24 hours
  userMood: string;
  onSeatSelect: (seatId: string) => void;
}

const CafeEnvironment = ({ weather, timeOfDay, userMood }: Omit<Scene3DProps, 'onSeatSelect'>) => {
  const meshRef = useRef<Mesh>(null);
  const { scene } = useThree();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  // Dynamic lighting based on time of day
  const getLightIntensity = () => {
    if (timeOfDay >= 6 && timeOfDay <= 18) return 1.2; // Day
    if (timeOfDay >= 19 && timeOfDay <= 21) return 0.8; // Evening
    return 0.4; // Night
  };

  const getLightColor = () => {
    if (timeOfDay >= 6 && timeOfDay <= 10) return '#FFE4B5'; // Morning
    if (timeOfDay >= 11 && timeOfDay <= 16) return '#FFFFFF'; // Midday
    if (timeOfDay >= 17 && timeOfDay <= 19) return '#FF6B35'; // Sunset
    return '#4169E1'; // Night
  };

  return (
    <>
      <Environment preset="warehouse" />
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={getLightIntensity()}
        color={getLightColor()}
        castShadow
      />
      <pointLight position={[2, 3, 2]} intensity={0.5} color="#F4A460" />
      <spotLight
        position={[0, 5, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
        castShadow
      />
      
      {/* Cafe Floor */}
      <mesh receiveShadow position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Cafe Walls */}
      <mesh position={[0, 2, -10]} castShadow>
        <boxGeometry args={[20, 6, 0.5]} />
        <meshStandardMaterial color="#DEB887" />
      </mesh>

      {/* Coffee Bar */}
      <mesh position={[0, 0, -8]} castShadow>
        <boxGeometry args={[8, 2, 1]} />
        <meshStandardMaterial color="#654321" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Atmospheric particles */}
      {weather === 'rainy' && (
        <mesh ref={meshRef} position={[0, 5, 0]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshBasicMaterial color="#87CEEB" transparent opacity={0.6} />
        </mesh>
      )}
    </>
  );
};

const InteractiveSeats = ({ onSeatSelect }: { onSeatSelect: (seatId: string) => void }) => {
  const seats = [
    { id: 'table-1', position: [-3, 0, -2] },
    { id: 'table-2', position: [3, 0, -2] },
    { id: 'table-3', position: [-3, 0, 2] },
    { id: 'table-4', position: [3, 0, 2] },
    { id: 'counter-1', position: [0, 0, -6] },
    { id: 'counter-2', position: [2, 0, -6] },
  ];

  return (
    <>
      {seats.map((seat) => (
        <mesh
          key={seat.id}
          position={seat.position as [number, number, number]}
          onClick={() => onSeatSelect(seat.id)}
          castShadow
        >
          <cylinderGeometry args={[0.8, 0.8, 1.5]} />
          <meshStandardMaterial color="#D2B48C" roughness={0.7} />
        </mesh>
      ))}
    </>
  );
};

export const UltimateWebGL3DEngine = ({ weather, timeOfDay, userMood, onSeatSelect }: Scene3DProps) => {
  return (
    <div className="w-full h-screen">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60 }}>
        <CafeEnvironment weather={weather} timeOfDay={timeOfDay} userMood={userMood} />
        <InteractiveSeats onSeatSelect={onSeatSelect} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};
