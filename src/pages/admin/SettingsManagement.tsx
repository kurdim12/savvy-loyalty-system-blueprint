
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Save, RefreshCw, AlertTriangle } from 'lucide-react';

interface SystemSettings {
  manualOverride: boolean;
  birthdayBonus: boolean;
  strategicReset: boolean;
}

const SettingsManagement = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    manualOverride: false,
    birthdayBonus: false,
    strategicReset: false
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [initialSettings, setInitialSettings] = useState<SystemSettings | null>(null);
  
  // Fetch settings
  const { data: fetchedSettings, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      try {
        // In a real implementation, we would have a settings table
        // For now we'll mock fetching settings
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('setting_name', 'system_settings')
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw error;
        }
        
        // If settings exist in DB, use them, otherwise use defaults
        if (data?.setting_value) {
          return data.setting_value as SystemSettings;
        }
        
        // Default settings
        return {
          manualOverride: false,
          birthdayBonus: true,
          strategicReset: false
        };
      } catch (error) {
        console.error('Error fetching settings:', error);
        // Default settings if there's an error
        return {
          manualOverride: false,
          birthdayBonus: true,
          strategicReset: false
        };
      }
    }
  });
  
  // Update settings when they're fetched
  useEffect(() => {
    if (fetchedSettings) {
      setSettings(fetchedSettings);
      setInitialSettings(fetchedSettings);
      setHasChanges(false);
    }
  }, [fetchedSettings]);
  
  // Save settings mutation
  const saveSettings = useMutation({
    mutationFn: async (newSettings: SystemSettings) => {
      try {
        // Check if settings record exists
        const { data: existingSettings, error: fetchError } = await supabase
          .from('settings')
          .select('id')
          .eq('setting_name', 'system_settings')
          .single();
        
        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }
        
        let error;
        
        // Update or insert settings
        if (existingSettings?.id) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('settings')
            .update({ setting_value: newSettings })
            .eq('id', existingSettings.id);
          
          error = updateError;
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('settings')
            .insert({ 
              setting_name: 'system_settings',
              setting_value: newSettings
            });
          
          error = insertError;
        }
        
        if (error) {
          throw error;
        }
        
        return newSettings;
      } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Settings updated successfully');
      setHasChanges(false);
      refetch(); // Refresh settings
    },
    onError: (error) => {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    }
  });
  
  const handleSaveSettings = () => {
    saveSettings.mutate(settings);
  };
  
  const handleChange = (key: keyof SystemSettings, value: boolean) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // Compare with initial settings to determine if there are changes
      if (initialSettings) {
        const hasChanged = Object.keys(newSettings).some(
          k => newSettings[k as keyof SystemSettings] !== initialSettings[k as keyof SystemSettings]
        );
        setHasChanges(hasChanged);
      }
      
      return newSettings;
    });
  };
  
  const handleReset = () => {
    if (initialSettings) {
      setSettings(initialSettings);
      setHasChanges(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500">Configure system settings and preferences</p>
          </div>
          <div className="flex space-x-2">
            {hasChanges && (
              <Button
                variant="outline"
                onClick={handleReset}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Changes
              </Button>
            )}
            <Button
              onClick={handleSaveSettings}
              disabled={!hasChanges || saveSettings.isPending}
              className="bg-amber-700 hover:bg-amber-800"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>
        
        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>
              Configure core loyalty program settings and behaviors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-36">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
              </div>
            ) : (
              <>
                {/* Manual Rank Override */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Allow Manual Rank Override</Label>
                    <p className="text-sm text-muted-foreground">
                      Admins can manually set customer membership tiers regardless of point totals.
                    </p>
                  </div>
                  <Switch
                    checked={settings.manualOverride}
                    onCheckedChange={(value) => handleChange('manualOverride', value)}
                  />
                </div>
                
                {/* Birthday Bonus */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Birthday Bonus Enabled</Label>
                    <p className="text-sm text-muted-foreground">
                      Customers automatically receive bonus points on their birthdays.
                    </p>
                  </div>
                  <Switch
                    checked={settings.birthdayBonus}
                    onCheckedChange={(value) => handleChange('birthdayBonus', value)}
                  />
                </div>
                
                {/* Strategic Reset */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Strategic Reward Reset</Label>
                    <p className="text-sm text-muted-foreground">
                      Points and rewards will reset at the end of each calendar year.
                    </p>
                    {settings.strategicReset && (
                      <div className="flex items-center text-yellow-700 bg-yellow-50 p-2 rounded mt-2 text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Warning: This will reset all customer points annually
                      </div>
                    )}
                  </div>
                  <Switch
                    checked={settings.strategicReset}
                    onCheckedChange={(value) => handleChange('strategicReset', value)}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Admin Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Information</CardTitle>
            <CardDescription>
              Details about the admin panel and system information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Admin Panel Version</span>
                <span className="text-sm">1.0.0</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm font-medium">Last Settings Update</span>
                <span className="text-sm">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm font-medium">Database Status</span>
                <span className="text-sm text-green-600 font-medium">Connected</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default SettingsManagement;
