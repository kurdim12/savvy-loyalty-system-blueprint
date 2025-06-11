
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Coffee, Plus, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CoffeeReview {
  id: string;
  user_id: string;
  coffee_name: string;
  rating: number;
  review_text: string;
  origin: string;
  brewing_method: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

export const CoffeeReviews = () => {
  const { user } = useAuth();
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [newReview, setNewReview] = useState({
    coffeeName: '',
    rating: 5,
    reviewText: '',
    origin: '',
    brewingMethod: ''
  });
  const queryClient = useQueryClient();

  // Fetch reviews
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['coffee-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coffee_reviews')
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
      return data as CoffeeReview[];
    },
  });

  // Submit review
  const submitReview = useMutation({
    mutationFn: async (reviewData: typeof newReview) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('coffee_reviews')
        .insert({
          user_id: user.id,
          coffee_name: reviewData.coffeeName,
          rating: reviewData.rating,
          review_text: reviewData.reviewText,
          origin: reviewData.origin,
          brewing_method: reviewData.brewingMethod
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Review submitted successfully!');
      setNewReview({
        coffeeName: '',
        rating: 5,
        reviewText: '',
        origin: '',
        brewingMethod: ''
      });
      setShowReviewDialog(false);
      queryClient.invalidateQueries({ queryKey: ['coffee-reviews'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit review');
    }
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const brewingMethods = [
    'Espresso', 'Pour Over', 'French Press', 'Aeropress', 'Cold Brew', 
    'Drip Coffee', 'Moka Pot', 'Turkish Coffee', 'Siphon', 'Chemex'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[#8B4513]">
              <Coffee className="h-5 w-5" />
              Coffee Reviews
            </CardTitle>
            
            {user && (
              <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-[#8B4513] hover:bg-[#8B4513]/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Write Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Write a Coffee Review</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Coffee Name</label>
                      <Input
                        placeholder="Ethiopian Yirgacheffe"
                        value={newReview.coffeeName}
                        onChange={(e) => setNewReview(prev => ({ ...prev, coffeeName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      {renderStars(newReview.rating, true, (rating) => 
                        setNewReview(prev => ({ ...prev, rating }))
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Origin (optional)</label>
                      <Input
                        placeholder="Ethiopia, Sidamo"
                        value={newReview.origin}
                        onChange={(e) => setNewReview(prev => ({ ...prev, origin: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Brewing Method</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={newReview.brewingMethod}
                        onChange={(e) => setNewReview(prev => ({ ...prev, brewingMethod: e.target.value }))}
                      >
                        <option value="">Select method...</option>
                        {brewingMethods.map((method) => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Review</label>
                      <Textarea
                        placeholder="Share your tasting notes, aroma, flavor profile..."
                        value={newReview.reviewText}
                        onChange={(e) => setNewReview(prev => ({ ...prev, reviewText: e.target.value }))}
                        rows={4}
                      />
                    </div>
                    <Button
                      onClick={() => submitReview.mutate(newReview)}
                      disabled={submitReview.isPending || !newReview.coffeeName || !newReview.reviewText}
                      className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90"
                    >
                      {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Share your coffee experiences and discover new flavors from the community.
          </p>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Loading reviews...</p>
            </CardContent>
          </Card>
        ) : reviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                No reviews yet. Be the first to share your coffee experience!
              </p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Reviewer info */}
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-[#8B4513] text-white">
                        {getInitials(review.profiles.first_name, review.profiles.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">
                        {review.profiles.first_name} {review.profiles.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatTimeAgo(review.created_at)}
                      </p>
                    </div>
                    {renderStars(review.rating)}
                  </div>

                  {/* Coffee details */}
                  <div>
                    <h3 className="font-semibold text-lg text-[#8B4513]">{review.coffee_name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {review.origin && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {review.origin}
                        </Badge>
                      )}
                      {review.brewing_method && (
                        <Badge variant="outline">
                          {review.brewing_method}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Review text */}
                  <p className="text-sm leading-relaxed">{review.review_text}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
