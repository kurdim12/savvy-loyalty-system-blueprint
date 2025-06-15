
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface AvatarAnimation {
  name: string;
  duration: number;
  keyframes: {
    time: number;
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: number;
  }[];
}

interface AdvancedAvatarProps {
  position: [number, number, number];
  userId: string;
  emotion: 'happy' | 'sad' | 'excited' | 'calm' | 'focused' | 'surprised';
  activity: 'sitting' | 'standing' | 'walking' | 'typing' | 'drinking' | 'talking';
  isSpeaking: boolean;
  gestureType?: 'wave' | 'point' | 'thumbsUp' | 'thinking' | 'coffee';
  personalityTraits: {
    extroversion: number; // 0-1
    energy: number; // 0-1
    formality: number; // 0-1
  };
}

const avatarAnimations: { [key: string]: AvatarAnimation } = {
  wave: {
    name: 'wave',
    duration: 2000,
    keyframes: [
      { time: 0, rotation: [0, 0, 0] },
      { time: 0.25, rotation: [0, 0, 0.5] },
      { time: 0.5, rotation: [0, 0, -0.3] },
      { time: 0.75, rotation: [0, 0, 0.5] },
      { time: 1, rotation: [0, 0, 0] }
    ]
  },
  typing: {
    name: 'typing',
    duration: 1000,
    keyframes: [
      { time: 0, position: [0, 0, 0] },
      { time: 0.5, position: [0, -0.02, 0] },
      { time: 1, position: [0, 0, 0] }
    ]
  },
  drinking: {
    name: 'drinking',
    duration: 3000,
    keyframes: [
      { time: 0, rotation: [0, 0, 0] },
      { time: 0.3, rotation: [-0.2, 0, 0] },
      { time: 0.7, rotation: [-0.2, 0, 0] },
      { time: 1, rotation: [0, 0, 0] }
    ]
  }
};

export const AdvancedAvatarSystem = ({
  position,
  userId,
  emotion,
  activity,
  isSpeaking,
  gestureType,
  personalityTraits
}: AdvancedAvatarProps) => {
  const avatarGroupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const eyesRef = useRef<THREE.Group>(null);

  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);
  const [animationStartTime, setAnimationStartTime] = useState(0);
  const [blinkTimer, setBlinkTimer] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  // Emotion-based color mapping
  const getEmotionData = () => {
    switch (emotion) {
      case 'happy':
        return { color: '#FFD700', auraColor: '#FFF700', intensity: 0.8 };
      case 'excited':
        return { color: '#FF6B35', auraColor: '#FF8C42', intensity: 1.2 };
      case 'calm':
        return { color: '#4A90E2', auraColor: '#7BB3F0', intensity: 0.4 };
      case 'focused':
        return { color: '#9B59B6', auraColor: '#B987C7', intensity: 0.6 };
      case 'surprised':
        return { color: '#E74C3C', auraColor: '#F1948A', intensity: 1.0 };
      case 'sad':
        return { color: '#5D6D7E', auraColor: '#85929E', intensity: 0.3 };
      default:
        return { color: '#FFDBAC', auraColor: '#F4E4BC', intensity: 0.5 };
    }
  };

  // Personality-influenced movement patterns
  const getPersonalityMovement = (time: number) => {
    const { extroversion, energy, formality } = personalityTraits;
    
    return {
      bounciness: energy * 0.05 + 0.01,
      frequency: (extroversion * 2 + energy) * 0.5 + 0.5,
      amplitude: (1 - formality) * 0.1 + 0.02,
      idleMovement: extroversion * 0.03
    };
  };

  // Advanced gesture system
  useEffect(() => {
    if (gestureType && avatarAnimations[gestureType]) {
      setCurrentAnimation(gestureType);
      setAnimationStartTime(Date.now());
      
      // Auto-clear animation after duration
      setTimeout(() => {
        setCurrentAnimation(null);
      }, avatarAnimations[gestureType].duration);
    }
  }, [gestureType]);

  // Activity-based automatic animations
  useEffect(() => {
    if (activity === 'typing') {
      setCurrentAnimation('typing');
      const interval = setInterval(() => {
        setAnimationStartTime(Date.now());
      }, 1200);
      return () => clearInterval(interval);
    } else if (activity === 'drinking') {
      const interval = setInterval(() => {
        setCurrentAnimation('drinking');
        setAnimationStartTime(Date.now());
        setTimeout(() => setCurrentAnimation(null), 3000);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [activity]);

  // Blinking system
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);
    
    return () => clearInterval(blinkInterval);
  }, []);

  useFrame((state) => {
    if (!avatarGroupRef.current) return;

    const time = state.clock.elapsedTime;
    const personality = getPersonalityMovement(time);
    const emotionData = getEmotionData();

    // Base breathing and idle animations
    if (bodyRef.current) {
      bodyRef.current.scale.y = 1 + Math.sin(time * 2) * personality.bounciness;
      
      // Personality-based idle movement
      if (!currentAnimation) {
        bodyRef.current.rotation.y = Math.sin(time * personality.frequency) * personality.idleMovement;
      }
    }

    // Advanced head movement
    if (headRef.current) {
      // Speaking animation
      if (isSpeaking) {
        headRef.current.rotation.x = Math.sin(time * 8) * 0.1;
        headRef.current.scale.setScalar(1 + Math.sin(time * 6) * 0.05);
      } else {
        // Subtle head bob
        headRef.current.rotation.x = Math.sin(time * 0.5) * 0.05;
      }

      // Emotion-based head positioning
      switch (emotion) {
        case 'excited':
          headRef.current.position.y = 1.9 + Math.sin(time * 4) * 0.1;
          break;
        case 'sad':
          headRef.current.rotation.x = -0.2;
          break;
        case 'surprised':
          headRef.current.scale.setScalar(1.1);
          break;
        default:
          headRef.current.position.y = 1.9;
      }
    }

    // Eye blinking and gaze
    if (eyesRef.current) {
      if (isBlinking) {
        eyesRef.current.scale.y = 0.1;
      } else {
        eyesRef.current.scale.y = 1;
        // Subtle eye movement
        eyesRef.current.position.x = Math.sin(time * 0.3) * 0.02;
      }
    }

    // Arm animations based on activity
    if (leftArmRef.current && rightArmRef.current) {
      switch (activity) {
        case 'typing':
          leftArmRef.current.rotation.x = -0.5 + Math.sin(time * 8) * 0.2;
          rightArmRef.current.rotation.x = -0.5 + Math.sin(time * 8 + Math.PI) * 0.2;
          break;
        case 'drinking':
          if (currentAnimation === 'drinking') {
            rightArmRef.current.rotation.x = -1.2;
            rightArmRef.current.rotation.z = 0.5;
          }
          break;
        case 'talking':
          leftArmRef.current.rotation.x = Math.sin(time * 3) * 0.3;
          rightArmRef.current.rotation.x = Math.sin(time * 3.5) * 0.3;
          break;
        default:
          // Relaxed position
          leftArmRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
          rightArmRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
      }
    }

    // Custom animation keyframe interpolation
    if (currentAnimation && avatarAnimations[currentAnimation]) {
      const elapsed = Date.now() - animationStartTime;
      const progress = Math.min(elapsed / avatarAnimations[currentAnimation].duration, 1);
      
      const animation = avatarAnimations[currentAnimation];
      const currentKeyframe = animation.keyframes.find((kf, index) => {
        const nextKf = animation.keyframes[index + 1];
        return progress >= kf.time && (!nextKf || progress < nextKf.time);
      });

      if (currentKeyframe && rightArmRef.current) {
        if (currentKeyframe.rotation) {
          rightArmRef.current.rotation.fromArray(currentKeyframe.rotation);
        }
        if (currentKeyframe.position) {
          rightArmRef.current.position.fromArray(currentKeyframe.position);
        }
      }
    }

    // Aura intensity based on emotion and activity
    const auraIntensity = emotionData.intensity * (isSpeaking ? 1.5 : 1);
    if (avatarGroupRef.current) {
      avatarGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial && child.userData.isAura) {
          child.material.opacity = (auraIntensity * 0.2) + Math.sin(time * 3) * 0.1;
        }
      });
    }
  });

  const emotionData = getEmotionData();

  return (
    <group ref={avatarGroupRef} position={position}>
      {/* Advanced Body with Skeletal Structure */}
      <mesh ref={bodyRef} position={[0, 1, 0]} castShadow>
        <capsuleGeometry args={[0.35, 1.2, 16, 32]} />
        <meshStandardMaterial 
          color="#4169E1" 
          roughness={0.4} 
          metalness={0.1}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Highly Detailed Head */}
      <mesh ref={headRef} position={[0, 1.9, 0]} castShadow>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial 
          color={emotionData.color}
          roughness={0.2}
          metalness={0.05}
        />
      </mesh>

      {/* Advanced Eye System */}
      <group ref={eyesRef} position={[0, 1.95, 0.22]}>
        <mesh position={[-0.12, 0, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0.12, 0, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        {/* Eye pupils with gaze tracking */}
        <mesh position={[-0.12, 0, 0.02]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.12, 0, 0.02]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Dynamic Hair */}
      <mesh position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Articulated Arms */}
      <mesh ref={leftArmRef} position={[-0.6, 1.3, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
        <meshStandardMaterial color="#FFDBAC" roughness={0.5} />
      </mesh>
      <mesh ref={rightArmRef} position={[0.6, 1.3, 0]} rotation={[0, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.1, 0.6, 8, 16]} />
        <meshStandardMaterial color="#FFDBAC" roughness={0.5} />
      </mesh>

      {/* Activity-Based Props */}
      {activity === 'drinking' && (
        <mesh position={[0.4, 1.1, 0.2]}>
          <cylinderGeometry args={[0.05, 0.04, 0.15, 16]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      )}

      {activity === 'typing' && (
        <mesh position={[0, 0.8, 0.3]}>
          <boxGeometry args={[0.3, 0.02, 0.2]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      )}

      {/* Speaking Visual Effects */}
      {isSpeaking && (
        <group position={[0, 2.3, 0]}>
          <points>
            <sphereGeometry args={[0.5, 32, 32]} />
            <pointsMaterial 
              size={0.03} 
              color="#00FFFF" 
              transparent 
              opacity={0.8}
            />
          </points>
        </group>
      )}

      {/* Personality-Based Aura */}
      <mesh position={[0, 1, 0]} userData={{ isAura: true }}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial 
          color={emotionData.auraColor}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Mood Indicator */}
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        size={0.08}
        height={0.01}
        position={[0, 2.6, 0]}
        rotation={[0, Math.PI, 0]}
      >
        {emotion.toUpperCase()}
        <meshStandardMaterial 
          color={emotionData.color} 
          emissive={emotionData.color} 
          emissiveIntensity={0.3} 
        />
      </Text3D>

      {/* Social Status Ring */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.3, 32]} />
        <meshBasicMaterial 
          color={personalityTraits.extroversion > 0.5 ? "#00FF00" : "#0080FF"}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};
