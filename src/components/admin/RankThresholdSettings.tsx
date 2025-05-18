
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { 
  createSettingsData,
  castDbResult,
  isValidData
} from '@/integrations/supabase/typeUtils';

const RankThresholdSettings = () => {
  const [silver, setSilver] = useState(200);
  const [gold, setGold] = useState(550);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('setting_name', 'rank_thresholds')
        .single();

      if (error) {
        console.error("Error fetching rank thresholds:", error);
        return;
      }

      if (isValidData(data) && data.setting_value) {
        try {
          const { silver: s, gold: g } = data.setting_value as { silver: number, gold: number };
          setSilver(s);
          setGold(g);
        } catch (err) {
          console.error("Error parsing settings:", err);
        }
      }
    };

    fetchSettings();
  }, []);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Check if settings already exist
      const { data: existingSettings, error: fetchError } = await supabase
        .from('settings')
        .select('id')
        .eq('setting_name', 'rank_thresholds')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw fetchError;
      }
      
      // Get the ID if it exists
      let settingsId = null;
      if (existingSettings && existingSettings.id) {
        settingsId = existingSettings.id;
      }

      if (settingsId) {
        // Update existing settings
        const updateData = createSettingsData({
          setting_name: 'rank_thresholds',
          setting_value: { silver: silver, gold: gold }
        });
        
        const { error: updateError } = await supabase
          .from('settings')
          .update(updateData)
          .eq('id', settingsId);
        
        if (updateError) throw updateError;
      } else {
        // Insert new settings
        const insertData = createSettingsData({
          setting_name: 'rank_thresholds',
          setting_value: { silver: silver, gold: gold }
        });
        
        const { error: insertError } = await supabase
          .from('settings')
          .insert([insertData]);
        
        if (insertError) throw insertError;
      }
      
      toast.success('Rank thresholds updated successfully');
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['rankThresholds'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'rankSettings'] });
      
    } catch (error) {
      console.error('Error saving rank thresholds:', error);
      toast.error('Failed to save rank thresholds');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rank Thresholds</CardTitle>
        <CardDescription>
          Configure the point thresholds for each membership tier.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="silver">Silver Threshold</Label>
          <Input
            type="number"
            id="silver"
            placeholder="200"
            value={silver}
            onChange={(e) => setSilver(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gold">Gold Threshold</Label>
          <Input
            type="number"
            id="gold"
            placeholder="550"
            value={gold}
            onChange={(e) => setGold(Number(e.target.value))}
          />
        </div>
        <Button onClick={saveSettings} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Thresholds'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RankThresholdSettings;
