
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera, Heart, MessageSquare, Share, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PhotoShare {
  id: string;
  user_id: string;
  photo_url: string;
  caption: string;
  location: string;
  likes_count: number;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  isLiked?: boolean;
}

export const PhotoSharing = () => {
  const { user } = useAuth();
  const [newPhoto, setNewPhoto] = useState({ caption: '', location: '', photoUrl: '' });
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const queryClient = useQueryClient();

  // Fetch photos
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['photo-shares'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photo_shares')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;

      // Check which photos the current user has liked
      if (user?.id) {
        const photoIds = data.map(p => p.id);
        const { data: likes } = await supabase
          .from('photo_likes')
          .select('photo_id')
          .in('photo_id', photoIds)
          .eq('user_id', user.id);
        
        const likedPhotoIds = new Set(likes?.map(l => l.photo_id) || []);
        
        return data.map(photo => ({
          ...photo,
          isLiked: likedPhotoIds.has(photo.id)
        })) as PhotoShare[];
      }
      
      return data as PhotoShare[];
    },
  });

  // Share photo
  const sharePhoto = useMutation({
    mutationFn: async (photoData: { caption: string; location: string; photoUrl: string }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('photo_shares')
        .insert({
          user_id: user.id,
          photo_url: photoData.photoUrl,
          caption: photoData.caption,
          location: photoData.location
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Photo shared successfully!');
      setNewPhoto({ caption: '', location: '', photoUrl: '' });
      setShowUploadDialog(false);
      queryClient.invalidateQueries({ queryKey: ['photo-shares'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to share photo');
    }
  });

  // Like/unlike photo
  const toggleLike = useMutation({
    mutationFn: async ({ photoId, isLiked }: { photoId: string; isLiked: boolean }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      if (isLiked) {
        const { error } = await supabase
          .from('photo_likes')
          .delete()
          .eq('photo_id', photoId)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('photo_likes')
          .insert({
            photo_id: photoId,
            user_id: user.id
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photo-shares'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update like');
    }
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-[#8B4513]">
            <Camera className="h-5 w-5" />
            Coffee Moments
          </CardTitle>
          
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#8B4513] hover:bg-[#8B4513]/90">
                <Upload className="h-4 w-4 mr-2" />
                Share Photo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Coffee Moment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Photo URL</label>
                  <Input
                    placeholder="Paste image URL..."
                    value={newPhoto.photoUrl}
                    onChange={(e) => setNewPhoto(prev => ({ ...prev, photoUrl: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Caption</label>
                  <Textarea
                    placeholder="Share something about this moment..."
                    value={newPhoto.caption}
                    onChange={(e) => setNewPhoto(prev => ({ ...prev, caption: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location (optional)</label>
                  <Input
                    placeholder="Where was this taken?"
                    value={newPhoto.location}
                    onChange={(e) => setNewPhoto(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <Button
                  onClick={() => sharePhoto.mutate(newPhoto)}
                  disabled={sharePhoto.isPending || !newPhoto.photoUrl || !newPhoto.caption}
                  className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90"
                >
                  {sharePhoto.isPending ? 'Sharing...' : 'Share Photo'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">
            Loading photos...
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No photos shared yet. Be the first to share a coffee moment!
          </div>
        ) : (
          photos.map((photo) => (
            <div key={photo.id} className="border rounded-lg overflow-hidden">
              {/* User info */}
              <div className="p-4 flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-[#8B4513] text-white">
                    {getInitials(photo.profiles.first_name, photo.profiles.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{photo.profiles.first_name} {photo.profiles.last_name}</p>
                  {photo.location && (
                    <p className="text-sm text-muted-foreground">{photo.location}</p>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatTimeAgo(photo.created_at)}
                </span>
              </div>

              {/* Photo */}
              <img
                src={photo.photo_url}
                alt={photo.caption}
                className="w-full max-h-96 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />

              {/* Actions and caption */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLike.mutate({ photoId: photo.id, isLiked: photo.isLiked || false })}
                    className={photo.isLiked ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}
                    disabled={!user || toggleLike.isPending}
                  >
                    <Heart className={`h-5 w-5 mr-1 ${photo.isLiked ? 'fill-current' : ''}`} />
                    {photo.likes_count}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-5 w-5 mr-1" />
                    Comment
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="h-5 w-5 mr-1" />
                    Share
                  </Button>
                </div>
                
                <p className="text-sm">
                  <span className="font-medium">{photo.profiles.first_name}</span> {photo.caption}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
