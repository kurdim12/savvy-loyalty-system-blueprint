
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Palette, User, Sparkles, Shirt, Crown } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// 3D Avatar Preview Component
const Avatar3DPreview = ({ 
  skinColor, 
  hairColor, 
  clothingColor, 
  accessory 
}: {
  skinColor: string;
  hairColor: string;
  clothingColor: string;
  accessory: string;
}) => {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.4, 1.2, 16, 32]} />
        <meshStandardMaterial color={clothingColor} metalness={0.1} roughness={0.8} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.1, 1.05, 0.25]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.1, 1.05, 0.25]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Accessory */}
      {accessory === 'crown' && (
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.2, 0.15, 0.1, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
      )}
      
      {accessory === 'hat' && (
        <mesh position={[0, 1.35, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.1, 32]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      )}
    </group>
  );
};

interface AvatarCustomizationHubProps {
  onAvatarCreated: (avatar: any) => void;
  onBack: () => void;
}

export const AvatarCustomizationHub = ({
  onAvatarCreated,
  onBack
}: AvatarCustomizationHubProps) => {
  const [skinColor, setSkinColor] = useState("#FFDBAC");
  const [hairColor, setHairColor] = useState("#8B4513");
  const [clothingColor, setClothingColor] = useState("#4169E1");
  const [accessory, setAccessory] = useState("none");
  const [avatarName, setAvatarName] = useState("");

  const skinColors = ["#FFDBAC", "#F5DEB3", "#DEB887", "#D2B48C", "#CD853F", "#8B7355"];
  const hairColors = ["#8B4513", "#000000", "#FFD700", "#FF6347", "#32CD32", "#9400D3"];
  const clothingColors = ["#4169E1", "#FF6B6B", "#32CD32", "#FFD700", "#FF1493", "#00CED1"];
  const accessories = [
    { id: "none", name: "None", icon: User },
    { id: "crown", name: "Crown", icon: Crown },
    { id: "hat", name: "Hat", icon: Shirt }
  ];

  const handleCreateAvatar = () => {
    const avatar = {
      name: avatarName || "Coffee Lover",
      skinColor,
      hairColor,
      clothingColor,
      accessory,
      created: new Date().toISOString()
    };
    
    onAvatarCreated(avatar);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Create Your Avatar</h1>
            <p className="text-white/70">Design your unique presence in the café</p>
          </div>
          
          <div className="w-24"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 3D Preview */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 h-[600px]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[500px]">
              <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[2, 2, 1]} intensity={1} />
                <Environment preset="studio" />
                
                <Avatar3DPreview
                  skinColor={skinColor}
                  hairColor={hairColor}
                  clothingColor={clothingColor}
                  accessory={accessory}
                />
                
                <OrbitControls
                  enableZoom={true}
                  enablePan={false}
                  minDistance={2}
                  maxDistance={5}
                />
              </Canvas>
            </CardContent>
          </Card>

          {/* Customization Panel */}
          <div className="space-y-6">
            {/* Avatar Name */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Avatar Name
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="text"
                  placeholder="Enter your avatar name..."
                  value={avatarName}
                  onChange={(e) => setAvatarName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </CardContent>
            </Card>

            {/* Skin Color */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Skin Tone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-3">
                  {skinColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSkinColor(color)}
                      className={`w-12 h-12 rounded-full border-4 transition-all ${
                        skinColor === color ? 'border-white scale-110' : 'border-white/30'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hair Color */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Hair Color</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-3">
                  {hairColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setHairColor(color)}
                      className={`w-12 h-12 rounded-full border-4 transition-all ${
                        hairColor === color ? 'border-white scale-110' : 'border-white/30'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Clothing Color */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shirt className="h-5 w-5" />
                  Outfit Color
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-3">
                  {clothingColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setClothingColor(color)}
                      className={`w-12 h-12 rounded-full border-4 transition-all ${
                        clothingColor === color ? 'border-white scale-110' : 'border-white/30'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Accessories */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Accessories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {accessories.map((acc) => {
                    const IconComponent = acc.icon;
                    return (
                      <button
                        key={acc.id}
                        onClick={() => setAccessory(acc.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-center ${
                          accessory === acc.id 
                            ? 'border-purple-400 bg-purple-500/20' 
                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <IconComponent className="h-6 w-6 text-white mx-auto mb-2" />
                        <span className="text-white text-sm">{acc.name}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Create Button */}
            <Button
              onClick={handleCreateAvatar}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 text-lg font-bold rounded-xl transform hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Enter the Café with This Avatar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
