
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Coffee } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import placeholderImage from '@/assets/coffee-placeholder-icon.jpg';

interface RewardImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export const RewardImage = ({ src, alt, className = "" }: RewardImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Helper function to get the full image URL from Supabase storage
  const getImageUrl = (imagePath?: string | null) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a storage path, get the public URL
    const { data } = supabase.storage
      .from('reward-images')
      .getPublicUrl(imagePath);
    
    return data.publicUrl;
  };

  const imageUrl = getImageUrl(src);

  if (!imageUrl || hasError) {
    return (
      <div className={`relative ${className}`}>
        <img
          src={placeholderImage}
          alt="Coffee placeholder"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img
        src={imageUrl}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
};
