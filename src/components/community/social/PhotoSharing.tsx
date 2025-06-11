
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

interface CoffeePhoto {
  id: string;
  user_id: string;
  created_at: string;
  drink_name: string;
  notes: string;
  origin?: string;
  brewing_method?: string;
  rating?: number;
  profiles: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export const PhotoSharing = () => {
  const { user } = useAuth();
  const [newPhoto, setNewPhoto] = useState({ 
    drink_name: '', 
    notes: '', 
    origin: '',
    brewing_method: '' 
  });
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const queryClient = useQueryClient();

  // Fetch coffee journey entries (using as photo shares)
  const { data: photos = [], isLoading } = useQuery({
    queryKey: ['coffee-photos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coffee_journey')
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
      return data as CoffeePhoto[];
    },
  });

  // Share coffee moment
  const sharePhoto = useMutation({
    mutationFn: async (photoData: typeof newPhoto) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('coffee_journey')
        .insert({
          user_id: user.id,
          drink_name: photoData.drink_name,
          notes: photoData.notes,
          origin: photoData.origin,
          brewing_method: photoData.brewing_method,
          tried_at: new Date().toISOString()
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Coffee moment shared successfully!');
      setNewPhoto({ drink_name: '', notes: '', origin: '', brewing_method: '' });
      setShowUploadDialog(false);
      queryClient.invalidateQueries({ queryKey: ['coffee-photos'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to share coffee moment');
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
                Share Moment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your Coffee Moment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Coffee/Drink Name</label>
                  <Input
                    placeholder="Ethiopian Single Origin"
                    value={newPhoto.drink_name}
                    onChange={(e) => setNewPhoto(prev => ({ ...prev, drink_name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <Textarea
                    placeholder="Share something about this coffee moment..."
                    value={newPhoto.notes}
                    onChange={(e) => setNewPhoto(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Origin (optional)</label>
                  <Input
                    placeholder="Ethiopia, Yirgacheffe"
                    value={newPhoto.origin}
                    onChange={(e) => setNewPhoto(prev => ({ ...prev, origin: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Brewing Method (optional)</label>
                  <Input
                    placeholder="Pour over, Espresso, etc."
                    value={newPhoto.brewing_method}
                    onChange={(e) => setNewPhoto(prev => ({ ...prev, brewing_method: e.target.value }))}
                  />
                </div>
                <Button
                  onClick={() => sharePhoto.mutate(newPhoto)}
                  disabled={sharePhoto.isPending || !newPhoto.drink_name || !newPhoto.notes}
                  className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90"
                >
                  {sharePhoto.isPending ? 'Sharing...' : 'Share Moment'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">
            Loading coffee moments...
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No coffee moments shared yet. Be the first to share your coffee journey!
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
                  <p className="text-sm font-medium text-[#8B4513]">{photo.drink_name}</p>
                  {photo.origin && (
                    <p className="text-sm text-muted-foreground">Origin: {photo.origin}</p>
                  )}
                  {photo.brewing_method && (
                    <p className="text-sm text-muted-foreground">Method: {photo.brewing_method}</p>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatTimeAgo(photo.created_at)}
                </span>
              </div>

              {/* Coffee moment details */}
              <div className="px-4 pb-4">
                <p className="text-sm mb-3">{photo.notes}</p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Button variant="ghost" size="sm" className="hover:text-red-500">
                    <Heart className="h-4 w-4 mr-1" />
                    Like
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Comment
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  {photo.rating && (
                    <div className="ml-auto">
                      <span className="font-medium">Rating: {photo.rating}/5 ⭐</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
