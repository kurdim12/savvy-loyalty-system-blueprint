
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Star, Coffee, Plus, Calendar, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CoffeeJourneyEntry {
  id: string;
  drink_name: string;
  rating: number;
  notes: string;
  tried_at: string;
  origin: string;
  brewing_method: string;
}

interface CoffeeBadge {
  id: string;
  badge_name: string;
  badge_type: string;
  earned_at: string;
  description: string;
}

export const CoffeeJourneyView = () => {
  const { user } = useAuth();
  const [journeyEntries, setJourneyEntries] = useState<CoffeeJourneyEntry[]>([]);
  const [badges, setBadges] = useState<CoffeeBadge[]>([]);
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    drink_name: '',
    rating: 5,
    notes: '',
    origin: '',
    brewing_method: ''
  });

  useEffect(() => {
    if (user) {
      fetchJourneyEntries();
      fetchBadges();
    }
  }, [user]);

  const fetchJourneyEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('coffee_journey')
        .select('*')
        .eq('user_id', user?.id)
        .order('tried_at', { ascending: false });

      if (error) throw error;
      setJourneyEntries(data || []);
    } catch (error) {
      console.error('Error fetching coffee journey:', error);
    }
  };

  const fetchBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('coffee_education_progress')
        .select('*')
        .eq('user_id', user?.id)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  const addJourneyEntry = async () => {
    if (!newEntry.drink_name) {
      toast.error('Please enter a drink name');
      return;
    }

    try {
      const { error } = await supabase
        .from('coffee_journey')
        .insert([{
          user_id: user?.id,
          ...newEntry
        }]);

      if (error) throw error;

      toast.success('Coffee journey entry added!');
      setNewEntry({
        drink_name: '',
        rating: 5,
        notes: '',
        origin: '',
        brewing_method: ''
      });
      setIsAddingEntry(false);
      fetchJourneyEntries();
    } catch (error) {
      console.error('Error adding journey entry:', error);
      toast.error('Failed to add journey entry');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'origin': return 'bg-green-100 text-green-800';
      case 'brewing': return 'bg-blue-100 text-blue-800';
      case 'tasting': return 'bg-purple-100 text-purple-800';
      case 'social': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Coffee Badges */}
      <Card className="border-[#8B4513]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#8B4513]">
            <Award className="h-5 w-5" />
            Coffee Education Badges
          </CardTitle>
          <CardDescription className="text-[#6F4E37]">
            Achievements earned through your coffee learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          {badges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div key={badge.id} className="flex items-center gap-3 p-3 border rounded-lg border-[#8B4513]/20">
                  <Award className={`h-8 w-8 ${getBadgeColor(badge.badge_type).split(' ')[1]}`} />
                  <div>
                    <h4 className="font-medium text-[#8B4513]">{badge.badge_name}</h4>
                    <p className="text-xs text-[#6F4E37]">{badge.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(badge.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#6F4E37] text-center py-8">
              Start your coffee education journey to earn badges!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Coffee Journey */}
      <Card className="border-[#8B4513]/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-[#8B4513]">
                <Coffee className="h-5 w-5" />
                Coffee Journey
              </CardTitle>
              <CardDescription className="text-[#6F4E37]">
                Track and rate the coffee drinks you've tried
              </CardDescription>
            </div>
            <Dialog open={isAddingEntry} onOpenChange={setIsAddingEntry}>
              <DialogTrigger asChild>
                <Button className="bg-[#8B4513] hover:bg-[#6F4E37]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Coffee Journey Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Drink Name</label>
                    <Input
                      value={newEntry.drink_name}
                      onChange={(e) => setNewEntry({...newEntry, drink_name: e.target.value})}
                      placeholder="e.g., Ethiopian Single Origin Espresso"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Origin</label>
                      <Input
                        value={newEntry.origin}
                        onChange={(e) => setNewEntry({...newEntry, origin: e.target.value})}
                        placeholder="e.g., Ethiopia"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Brewing Method</label>
                      <Input
                        value={newEntry.brewing_method}
                        onChange={(e) => setNewEntry({...newEntry, brewing_method: e.target.value})}
                        placeholder="e.g., Espresso"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Rating</label>
                    <Select 
                      value={newEntry.rating.toString()} 
                      onValueChange={(value) => setNewEntry({...newEntry, rating: parseInt(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            <div className="flex items-center gap-2">
                              {renderStars(rating)}
                              <span>{rating} star{rating !== 1 ? 's' : ''}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea
                      value={newEntry.notes}
                      onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                      placeholder="Share your thoughts about this coffee..."
                      rows={3}
                    />
                  </div>
                  <Button onClick={addJourneyEntry} className="w-full bg-[#8B4513] hover:bg-[#6F4E37]">
                    Add to Journey
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {journeyEntries.length > 0 ? (
            <div className="space-y-4">
              {journeyEntries.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4 border-[#8B4513]/20">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-[#8B4513]">{entry.drink_name}</h4>
                    <div className="flex items-center gap-1">
                      {renderStars(entry.rating)}
                    </div>
                  </div>
                  <div className="flex gap-2 mb-2">
                    {entry.origin && (
                      <Badge variant="outline" className="text-xs">
                        {entry.origin}
                      </Badge>
                    )}
                    {entry.brewing_method && (
                      <Badge variant="outline" className="text-xs">
                        {entry.brewing_method}
                      </Badge>
                    )}
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-[#6F4E37] mb-2">{entry.notes}</p>
                  )}
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(entry.tried_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#6F4E37] text-center py-8">
              Start tracking your coffee journey by adding your first drink!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
