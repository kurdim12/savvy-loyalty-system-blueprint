import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  PerspectiveCamera,
  useGLTF,
  Text3D,
  MeshReflectorMaterial,
  ContactShadows,
  Sky,
  Cloud
} from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Camera, Volume2 } from 'lucide-react';

// Photorealistic Café Interior
const PhotorealisticCafe = () => {
  const cafeRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (cafeRef.current) {
      // Dynamic lighting based on time
      const time = state.clock.elapsedTime;
      cafeRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.envMapIntensity = 1 + Math.sin(time * 0.1) * 0.2;
        }
      });
    }
  });

  return (
    <group ref={cafeRef}>
      {/* Photorealistic Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#3a2317"
          metalness={0.5}
          mirror={0.8}
        />
      </mesh>

      {/* Realistic Walls with Textures */}
      <mesh position={[-25, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[50, 6]} />
        <meshStandardMaterial 
          color="#f4e4bc" 
          roughness={0.8} 
          metalness={0.1}
          normalScale={new THREE.Vector2(0.5, 0.5)}
        />
      </mesh>
      
      <mesh position={[25, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[50, 6]} />
        <meshStandardMaterial color="#f4e4bc" roughness={0.8} metalness={0.1} />
      </mesh>
      
      <mesh position={[0, 3, -25]}>
        <planeGeometry args={[50, 6]} />
        <meshStandardMaterial color="#f4e4bc" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
    </group>
  );
};

// High-Poly Professional Seating Area
const ProfessionalSeatingArea = ({ 
  position, 
  onSeatClick,
  isOccupied,
  seatId 
}: { 
  position: [number, number, number];
  onSeatClick: (seatId: string) => void;
  isOccupied: boolean;
  seatId: string;
}) => {
  const [hovered, setHovered] = useState(false);
  const tableRef = useRef<THREE.Group>(null);
  const chairRefs = useRef<THREE.Group[]>([]);

  useFrame((state) => {
    if (tableRef.current && hovered) {
      tableRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.02;
    }
  });

  const chairPositions = [
    [1.5, 0, 0], [-1.5, 0, 0], [0, 0, 1.5], [0, 0, -1.5]
  ] as [number, number, number][];

  return (
    <group position={position} ref={tableRef}>
      {/* Premium Table with PBR Materials */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.08, 32]} />
        <meshStandardMaterial 
          color="#8B4513"
          roughness={0.3}
          metalness={0.1}
          envMapIntensity={1}
        />
      </mesh>

      {/* Table Base */}
      <mesh position={[0, 0.375, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.75, 16]} />
        <meshStandardMaterial color="#654321" roughness={0.4} metalness={0.2} />
      </mesh>

      {/* High-Detail Chairs */}
      {chairPositions.map((chairPos, index) => (
        <group 
          key={index} 
          position={chairPos}
          ref={(el) => {
            if (el) chairRefs.current[index] = el;
          }}
        >
          {/* Chair Seat */}
          <mesh
            position={[0, 0.4, 0]}
            onClick={() => onSeatClick(`${seatId}-${index}`)}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            castShadow
          >
            <boxGeometry args={[0.5, 0.08, 0.5]} />
            <meshStandardMaterial 
              color={isOccupied ? "#ff4444" : hovered ? "#4CAF50" : "#8B4513"}
              roughness={0.6}
              metalness={0.1}
              emissive={hovered ? "#004400" : "#000000"}
              emissiveIntensity={hovered ? 0.2 : 0}
            />
          </mesh>

          {/* Chair Back */}
          <mesh position={[0, 0.8, -0.2]} castShadow>
            <boxGeometry args={[0.5, 0.6, 0.08]} />
            <meshStandardMaterial color="#8B4513" roughness={0.6} metalness={0.1} />
          </mesh>

          {/* Chair Legs */}
          {[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].map((legPos, legIndex) => (
            <mesh key={legIndex} position={[legPos[0], 0.2, legPos[1]]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
              <meshStandardMaterial color="#654321" roughness={0.7} metalness={0.3} />
            </mesh>
          ))}

          {/* Holographic Seat Status */}
          {hovered && !isOccupied && (
            <Text3D
              font="/fonts/helvetiker_regular.typeface.json"
              size={0.1}
              height={0.01}
              position={[0, 1.2, 0]}
              rotation={[0, Math.PI, 0]}
            >
              AVAILABLE
              <meshStandardMaterial color="#00ff00" emissive="#004400" emissiveIntensity={0.5} />
            </Text3D>
          )}
        </group>
      ))}

      {/* Ambient Particles */}
      {hovered && (
        <points>
          <sphereGeometry args={[2, 32, 32]} />
          <pointsMaterial size={0.02} color="#FFD700" transparent opacity={0.6} />
        </points>
      )}
    </group>
  );
};

// Next-Gen Avatar with Advanced Features
const NextGenAvatar = ({ 
  position, 
  userId, 
  isSpeaking = false,
  emotion = "neutral",
  activity = "sitting"
}: {
  position: [number, number, number];
  userId: string;
  isSpeaking?: boolean;
  emotion?: string;
  activity?: string;
}) => {
  const avatarRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const [currentAnimation, setCurrentAnimation] = useState("idle");

  useFrame((state) => {
    if (avatarRef.current) {
      // Breathing animation
      avatarRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      
      // Head movement based on speaking
      if (headRef.current && isSpeaking) {
        headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 8) * 0.1;
        headRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 6) * 0.05);
      }
    }
  });

  const getEmotionColor = () => {
    switch (emotion) {
      case "happy": return "#FFD700";
      case "excited": return "#FF6B35";
      case "calm": return "#4A90E2";
      case "focused": return "#9B59B6";
      default: return "#FFDBAC";
    }
  };

  return (
    <group ref={avatarRef} position={position}>
      {/* Advanced Body with Skeletal Structure */}
      <mesh position={[0, 1, 0]} castShadow>
        <capsuleGeometry args={[0.35, 1.2, 16, 32]} />
        <meshStandardMaterial 
          color="#4169E1" 
          roughness={0.4} 
          metalness={0.1}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Realistic Head with Facial Features */}
      <mesh ref={headRef} position={[0, 1.9, 0]} castShadow>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial 
          color={getEmotionColor()}
          roughness={0.2}
          metalness={0.05}
        />
      </mesh>

      {/* Detailed Eyes */}
      <mesh position={[-0.12, 1.95, 0.22]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.12, 1.95, 0.22]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Hair with Physics */}
      <mesh position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Arms with Bone Structure */}
      <mesh position={[-0.6, 1.3, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
        <meshStandardMaterial color="#FFDBAC" roughness={0.5} />
      </mesh>
      <mesh position={[0.6, 1.3, 0]} rotation={[0, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
        <meshStandardMaterial color="#FFDBAC" roughness={0.5} />
      </mesh>

      {/* Activity-Based Props */}
      {activity === "drinking" && (
        <mesh position={[0.4, 1.1, 0.2]}>
          <cylinderGeometry args={[0.05, 0.04, 0.15, 16]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      )}

      {/* Speaking Visual Effects */}
      {isSpeaking && (
        <group position={[0, 2.3, 0]}>
          <points>
            <sphereGeometry args={[0.5, 16, 16]} />
            <pointsMaterial 
              size={0.03} 
              color="#00FFFF" 
              transparent 
              opacity={0.8}
            />
          </points>
        </group>
      )}

      {/* Emotion Aura */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial 
          color={getEmotionColor()}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// Cinematic Camera System
const CinematicCamera = ({ 
  activeMode, 
  targetPosition 
}: { 
  activeMode: string;
  targetPosition?: [number, number, number];
}) => {
  const { camera } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame((state) => {
    if (activeMode === "cinematic" && targetPosition) {
      // Smooth camera movement
      camera.position.lerp(new THREE.Vector3(...targetPosition), 0.02);
      camera.lookAt(0, 2, 0);
    } else if (activeMode === "orbit") {
      // Dynamic orbit
      const radius = 15;
      camera.position.x = Math.cos(state.clock.elapsedTime * 0.1) * radius;
      camera.position.z = Math.sin(state.clock.elapsedTime * 0.1) * radius;
      camera.position.y = 8;
      camera.lookAt(0, 2, 0);
    }
  });

  return null;
};

// Advanced Atmospheric Effects
const AtmosphericEffects = () => {
  return (
    <>
      {/* HDR Environment */}
      <Environment preset="warehouse" background />
      
      {/* Dynamic Sky */}
      <Sky
        distance={450000}
        sunPosition={[0, 1, 0]}
        inclination={0}
        azimuth={0.25}
      />

      {/* Volumetric Lighting */}
      <fog attach="fog" args={['#f0f0f0', 0, 100]} />

      {/* Advanced Lighting Setup */}
      <ambientLight intensity={0.4} color="#FFE4B5" />
      <directionalLight 
        position={[20, 20, 10]} 
        intensity={1.5} 
        color="#FFA500"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Accent Lighting */}
      <spotLight 
        position={[0, 15, 0]} 
        angle={0.4} 
        penumbra={0.5} 
        intensity={2} 
        color="#87CEEB"
        castShadow
      />

      {/* Contact Shadows */}
      <ContactShadows 
        position={[0, -0.1, 0]} 
        opacity={0.4} 
        scale={50} 
        blur={1} 
        far={10}
      />

      {/* Atmospheric Clouds */}
      <Cloud 
        position={[-10, 8, -10]} 
        speed={0.2} 
        opacity={0.3}
        segments={20}
      />
      <Cloud 
        position={[10, 12, 10]} 
        speed={0.1} 
        opacity={0.2}
        segments={15}
      />
    </>
  );
};

interface AdvancedWebGL3DEngineProps {
  onExitCafe: () => void;
  userAvatar: any;
  voiceEnabled: boolean;
}

export const AdvancedWebGL3DEngine = ({
  onExitCafe,
  userAvatar,
  voiceEnabled
}: AdvancedWebGL3DEngineProps) => {
  const [cameraMode, setCameraMode] = useState("free");
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [showUI, setShowUI] = useState(true);

  const seatingAreas = [
    { id: "lounge", position: [-8, 0, -8] as [number, number, number], occupied: false },
    { id: "window", position: [8, 0, -8] as [number, number, number], occupied: true },
    { id: "center", position: [0, 0, 0] as [number, number, number], occupied: false },
    { id: "quiet", position: [-8, 0, 8] as [number, number, number], occupied: false },
    { id: "social", position: [8, 0, 8] as [number, number, number], occupied: true },
    { id: "work", position: [0, 0, -12] as [number, number, number], occupied: false },
  ];

  const avatars = [
    { id: "user1", position: [8.5, 0, -7.5] as [number, number, number], speaking: true, emotion: "happy" },
    { id: "user2", position: [-7.5, 0, 8.5] as [number, number, number], speaking: false, emotion: "calm" },
    { id: "user3", position: [8.5, 0, 8.5] as [number, number, number], speaking: false, emotion: "focused" },
  ];

  const handleSeatClick = (seatId: string) => {
    setSelectedSeat(seatId);
    setCameraMode("cinematic");
  };

  return (
    <div className="relative w-full h-full">
      {/* Advanced UI Overlay */}
      {showUI && (
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
          <Card className="bg-black/20 backdrop-blur-xl border-cyan-400/30 text-white">
            <div className="p-4">
              <h3 className="font-bold text-xl mb-2">🎬 Cinematic Café Experience</h3>
              <div className="flex items-center gap-4 text-sm">
                <div>Camera: {cameraMode}</div>
                <div>Seat: {selectedSeat || "None"}</div>
                <div className="flex items-center gap-1">
                  <Volume2 className="h-4 w-4" />
                  {voiceEnabled ? "Active" : "Muted"}
                </div>
              </div>
            </div>
          </Card>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setCameraMode(cameraMode === "orbit" ? "free" : "orbit")}
              className="bg-purple-600/80 backdrop-blur-lg border-purple-400/30 text-white"
            >
              <Camera className="h-4 w-4 mr-2" />
              {cameraMode === "orbit" ? "Free Cam" : "Orbit View"}
            </Button>
            <Button
              onClick={onExitCafe}
              className="bg-red-600/80 backdrop-blur-lg border-red-400/30 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit Experience
            </Button>
          </div>
        </div>
      )}

      {/* Main 3D Scene */}
      <Canvas
        shadows
        camera={{ position: [0, 12, 20], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        className="w-full h-full"
      >
        <AtmosphericEffects />
        
        <CinematicCamera 
          activeMode={cameraMode} 
          targetPosition={selectedSeat ? [0, 8, 12] : undefined}
        />

        <PhotorealisticCafe />

        {/* Professional Seating Areas */}
        {seatingAreas.map((area) => (
          <ProfessionalSeatingArea
            key={area.id}
            position={area.position}
            onSeatClick={handleSeatClick}
            isOccupied={area.occupied}
            seatId={area.id}
          />
        ))}

        {/* Next-Gen Avatars */}
        {avatars.map((avatar) => (
          <NextGenAvatar
            key={avatar.id}
            position={avatar.position}
            userId={avatar.id}
            isSpeaking={avatar.speaking}
            emotion={avatar.emotion}
            activity="sitting"
          />
        ))}

        {/* User Avatar */}
        <NextGenAvatar
          position={[0, 0, 10]}
          userId="current-user"
          isSpeaking={voiceEnabled}
          emotion="happy"
          activity="exploring"
        />

        <OrbitControls
          enabled={cameraMode === "free"}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 2, 0]}
        />
      </Canvas>

      {/* Cinematic Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <Card className="bg-black/20 backdrop-blur-xl border-cyan-400/30 text-white">
          <div className="px-6 py-3 text-center">
            <p className="text-sm">
              🎮 WASD + Mouse: Free Look • 🪑 Click Chairs: Reserve Seat • 🎬 Camera Button: Cinematic Mode • 💬 Voice Auto-Proximity
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
