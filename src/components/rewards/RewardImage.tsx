
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Coffee } from 'lucide-react';

interface RewardImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export const RewardImage = ({ src, alt, className = "" }: RewardImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center ${className}`}>
        <Coffee className="h-8 w-8 text-amber-600" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img
        src={src}
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
