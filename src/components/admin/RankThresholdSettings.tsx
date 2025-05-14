
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

interface RankThresholds {
  silver: number;
  gold: number;
}

const DEFAULT_THRESHOLDS = {
  silver: 200,
  gold: 550
};

export function RankThresholdSettings() {
  const queryClient = useQueryClient();
  const [thresholds, setThresholds] = useState<RankThresholds>(DEFAULT_THRESHOLDS);
  const [isEditing, setIsEditing] = useState(false);
  const [originalThresholds, setOriginalThresholds] = useState<RankThresholds>(DEFAULT_THRESHOLDS);

  // Fetch current rank threshold settings
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['admin', 'rankThresholds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('setting_name', 'rank_thresholds')
        .single();
      
      if (error) {
        // If not found, we'll use defaults
        if (error.code === 'PGRST116') {
          return DEFAULT_THRESHOLDS;
        }
        console.error("Error fetching rank thresholds:", error);
        throw error;
      }
      
      // Ensure the data.setting_value conforms to our RankThresholds interface
      const rawValue = data?.setting_value as Json;
      if (typeof rawValue === 'object' && rawValue !== null && !Array.isArray(rawValue) && 
          'silver' in rawValue && 'gold' in rawValue) {
        return {
          silver: Number(rawValue.silver),
          gold: Number(rawValue.gold)
        };
      }
      
      return DEFAULT_THRESHOLDS;
    }
  });

  // Update settings when data is loaded
  useEffect(() => {
    if (settingsData) {
      setThresholds(settingsData);
      setOriginalThresholds(settingsData);
    }
  }, [settingsData]);

  // Save settings mutation
  const saveSettings = useMutation({
    mutationFn: async () => {
      // Check if settings already exist
      const { data: existingSettings, error: checkError } = await supabase
        .from('settings')
        .select('id')
        .eq('setting_name', 'rank_thresholds')
        .single();
      
      let result;
      
      // Convert thresholds to a format that's compatible with the Json type
      const jsonThresholds = {
        silver: thresholds.silver,
        gold: thresholds.gold
      } as Json;
      
      // If settings exist, update them
      if (existingSettings?.id) {
        result = await supabase
          .from('settings')
          .update({
            setting_value: jsonThresholds,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingSettings.id);
      } else {
        // Otherwise insert new settings
        result = await supabase
          .from('settings')
          .insert({
            setting_name: 'rank_thresholds',
            setting_value: jsonThresholds
          });
      }
      
      if (result.error) throw result.error;
      
      return true;
    },
    onSuccess: () => {
      toast.success('Rank thresholds updated successfully');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['admin', 'rankThresholds'] });
      // Also invalidate any queries that might depend on these thresholds
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update rank thresholds: ${error.message}`);
    }
  });

  const handleSave = () => {
    // Validate thresholds
    if (thresholds.silver <= 0 || thresholds.gold <= 0) {
      toast.error('Thresholds must be positive numbers');
      return;
    }
    
    if (thresholds.gold <= thresholds.silver) {
      toast.error('Gold threshold must be higher than Silver threshold');
      return;
    }
    
    saveSettings.mutate();
  };

  const handleCancel = () => {
    setThresholds(originalThresholds);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership Rank Thresholds</CardTitle>
        <CardDescription>
          Configure the point thresholds for each membership tier
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-700 border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="silverThreshold">Bronze to Silver Threshold</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="silverThreshold"
                    type="number"
                    value={thresholds.silver}
                    onChange={(e) => setThresholds({...thresholds, silver: parseInt(e.target.value) || 0})}
                    disabled={!isEditing}
                    min="1"
                  />
                  <span className="text-sm text-muted-foreground">points</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goldThreshold">Silver to Gold Threshold</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="goldThreshold"
                    type="number"
                    value={thresholds.gold}
                    onChange={(e) => setThresholds({...thresholds, gold: parseInt(e.target.value) || 0})}
                    disabled={!isEditing}
                    min="1"
                  />
                  <span className="text-sm text-muted-foreground">points</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saveSettings.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-amber-700 hover:bg-amber-800"
                    onClick={handleSave}
                    disabled={saveSettings.isPending}
                  >
                    {saveSettings.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                >
                  Edit Thresholds
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RankThresholdSettings;
