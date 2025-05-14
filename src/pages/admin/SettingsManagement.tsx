
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import RankThresholdSettings from '@/components/admin/RankThresholdSettings';
import { 
  Coffee, Percent, Award, Bell, Settings, Shield, Mail, DollarSign, Share2
} from 'lucide-react';
import { toast } from 'sonner';

const SettingsManagement = () => {
  const [emailNotifications, setEmailNotifications] = useState({
    welcome: true,
    pointsEarned: true,
    rankUpgrade: true,
    birthdayReward: true,
    promotions: false
  });

  const [pointsSettings, setPointsSettings] = useState({
    signupBonus: 10,
    referralBonus: 25,
    dollarsToPoints: 1,
    expirationDays: 365,
    minimumRedemption: 50
  });

  const [displaySettings, setDisplaySettings] = useState({
    showReferralLink: true,
    enableCommunityGoals: true,
    requireVerification: false,
    enableSMS: false
  });

  const handleSaveEmailSettings = () => {
    toast.success("Email notification settings saved");
    // In a real implementation, you would save these settings to the database
  };

  const handleSavePointsSettings = () => {
    toast.success("Points system settings saved");
    // In a real implementation, you would save these settings to the database
  };

  const handleSaveDisplaySettings = () => {
    toast.success("Display settings saved");
    // In a real implementation, you would save these settings to the database
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-500">Configure global settings for the loyalty program</p>
        </div>

        <Tabs defaultValue="ranks" className="space-y-4">
          <TabsList className="grid grid-cols-4 md:w-fit">
            <TabsTrigger value="ranks" className="flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Membership</span> Ranks
            </TabsTrigger>
            <TabsTrigger value="points" className="flex items-center gap-1.5">
              <Percent className="h-4 w-4" />
              Points System
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1.5">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="display" className="flex items-center gap-1.5">
              <Settings className="h-4 w-4" />
              Display
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ranks" className="space-y-4">
            <RankThresholdSettings />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-700" />
                  Rank Benefits
                </CardTitle>
                <CardDescription>
                  Configure benefits for each membership tier
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge className="h-6 w-6 rounded-full p-1 bg-amber-100 text-amber-700 border-amber-300 flex items-center justify-center">B</Badge>
                        <h3 className="text-lg font-medium">Bronze Benefits</h3>
                      </div>
                      <Badge variant="outline" className="bg-amber-50">Default</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-12 items-center">
                        <Label htmlFor="bronze-discount" className="col-span-4">Discount Rate:</Label>
                        <div className="col-span-6">
                          <div className="flex items-center">
                            <Input type="number" id="bronze-discount" defaultValue="10" className="w-16" />
                            <span className="ml-2">%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-12 items-center">
                        <Label htmlFor="bronze-promotions" className="col-span-4">Access to Promotions:</Label>
                        <div className="col-span-6">
                          <Switch id="bronze-promotions" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge className="h-6 w-6 rounded-full p-1 bg-gray-200 text-gray-700 border-gray-400 flex items-center justify-center">S</Badge>
                        <h3 className="text-lg font-medium">Silver Benefits</h3>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-12 items-center">
                        <Label htmlFor="silver-discount" className="col-span-4">Discount Rate:</Label>
                        <div className="col-span-6">
                          <div className="flex items-center">
                            <Input type="number" id="silver-discount" defaultValue="15" className="w-16" />
                            <span className="ml-2">%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-12 items-center">
                        <Label htmlFor="silver-promotions" className="col-span-4">Access to Promotions:</Label>
                        <div className="col-span-6">
                          <Switch id="silver-promotions" defaultChecked />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-12 items-center">
                        <Label htmlFor="silver-early-access" className="col-span-4">Early Access:</Label>
                        <div className="col-span-6">
                          <Switch id="silver-early-access" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full flex items-center justify-center text-yellow-500">
                          <Award className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-medium">Gold Benefits</h3>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-12 items-center">
                        <Label htmlFor="gold-discount" className="col-span-4">Discount Rate:</Label>
                        <div className="col-span-6">
                          <div className="flex items-center">
                            <Input type="number" id="gold-discount" defaultValue="25" className="w-16" />
                            <span className="ml-2">%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-12 items-center">
                        <Label htmlFor="gold-promotions" className="col-span-4">Access to Promotions:</Label>
                        <div className="col-span-6">
                          <Switch id="gold-promotions" defaultChecked />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-12 items-center">
                        <Label htmlFor="gold-early-access" className="col-span-4">Early Access:</Label>
                        <div className="col-span-6">
                          <Switch id="gold-early-access" defaultChecked />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-12 items-center">
                        <Label htmlFor="gold-free-coffee" className="col-span-4">Monthly Free Coffee:</Label>
                        <div className="col-span-6">
                          <Switch id="gold-free-coffee" defaultChecked />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-12 items-center">
                        <Label htmlFor="gold-priority" className="col-span-4">Priority Service:</Label>
                        <div className="col-span-6">
                          <Switch id="gold-priority" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Benefit Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="points">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-amber-700" />
                  Points System Configuration
                </CardTitle>
                <CardDescription>
                  Configure how points are earned and redeemed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <h3 className="text-sm font-medium flex items-center gap-1.5">
                      <Coffee className="h-4 w-4" />
                      Drink-Based Points
                    </h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="white-tradition">White Tradition</Label>
                        <Input id="white-tradition" type="number" defaultValue="4" />
                        <p className="text-xs text-muted-foreground">Points earned per drink</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="black-tradition">Black Tradition</Label>
                        <Input id="black-tradition" type="number" defaultValue="3" />
                        <p className="text-xs text-muted-foreground">Points earned per drink</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="raw-signature">Raw Signature</Label>
                        <Input id="raw-signature" type="number" defaultValue="5" />
                        <p className="text-xs text-muted-foreground">Points earned per drink</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="raw-specialty">Raw Specialty</Label>
                        <Input id="raw-specialty" type="number" defaultValue="6" />
                        <p className="text-xs text-muted-foreground">Points earned per drink</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid gap-4">
                    <h3 className="text-sm font-medium flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4" />
                      Purchase-Based Points
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="dollarsToPoints">
                          Points per Dollar Spent
                        </Label>
                        <Input 
                          id="dollarsToPoints" 
                          type="number"
                          value={pointsSettings.dollarsToPoints}
                          onChange={(e) => setPointsSettings({
                            ...pointsSettings,
                            dollarsToPoints: parseInt(e.target.value) || 1
                          })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Number of points earned for each dollar spent
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minimumRedemption">
                          Minimum Redemption Points
                        </Label>
                        <Input 
                          id="minimumRedemption" 
                          type="number"
                          value={pointsSettings.minimumRedemption}
                          onChange={(e) => setPointsSettings({
                            ...pointsSettings,
                            minimumRedemption: parseInt(e.target.value) || 50
                          })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Minimum points required for any redemption
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid gap-4">
                    <h3 className="text-sm font-medium flex items-center gap-1.5">
                      <Award className="h-4 w-4" />
                      Bonus Points
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="signupBonus">
                          Signup Bonus
                        </Label>
                        <Input 
                          id="signupBonus" 
                          type="number"
                          value={pointsSettings.signupBonus}
                          onChange={(e) => setPointsSettings({
                            ...pointsSettings,
                            signupBonus: parseInt(e.target.value) || 0
                          })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Points awarded when a user creates an account
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="referralBonus">
                          Referral Bonus
                        </Label>
                        <Input 
                          id="referralBonus" 
                          type="number"
                          value={pointsSettings.referralBonus}
                          onChange={(e) => setPointsSettings({
                            ...pointsSettings,
                            referralBonus: parseInt(e.target.value) || 0
                          })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Points awarded for each successful referral
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expirationDays">
                          Points Expiration (Days)
                        </Label>
                        <Input 
                          id="expirationDays" 
                          type="number"
                          value={pointsSettings.expirationDays}
                          onChange={(e) => setPointsSettings({
                            ...pointsSettings,
                            expirationDays: parseInt(e.target.value) || 365
                          })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Number of days until points expire (0 = never)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSavePointsSettings}>Save Points Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-amber-700" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure system notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <h3 className="text-sm font-medium flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      Email Notifications
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 items-center">
                        <Label htmlFor="welcome-email">Welcome Email</Label>
                        <Switch 
                          id="welcome-email" 
                          checked={emailNotifications.welcome}
                          onCheckedChange={(checked) => setEmailNotifications({
                            ...emailNotifications,
                            welcome: checked
                          })}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 items-center">
                        <Label htmlFor="points-earned">Points Earned Notifications</Label>
                        <Switch 
                          id="points-earned" 
                          checked={emailNotifications.pointsEarned}
                          onCheckedChange={(checked) => setEmailNotifications({
                            ...emailNotifications,
                            pointsEarned: checked
                          })}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 items-center">
                        <Label htmlFor="rank-upgrade">Rank Upgrade Notifications</Label>
                        <Switch 
                          id="rank-upgrade" 
                          checked={emailNotifications.rankUpgrade}
                          onCheckedChange={(checked) => setEmailNotifications({
                            ...emailNotifications,
                            rankUpgrade: checked
                          })}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 items-center">
                        <Label htmlFor="birthday-reward">Birthday Reward</Label>
                        <Switch 
                          id="birthday-reward" 
                          checked={emailNotifications.birthdayReward}
                          onCheckedChange={(checked) => setEmailNotifications({
                            ...emailNotifications,
                            birthdayReward: checked
                          })}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 items-center">
                        <Label htmlFor="promotions">Marketing & Promotions</Label>
                        <Switch 
                          id="promotions" 
                          checked={emailNotifications.promotions}
                          onCheckedChange={(checked) => setEmailNotifications({
                            ...emailNotifications,
                            promotions: checked
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid gap-4">
                    <h3 className="text-sm font-medium">Email Configuration</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="sender-name">Sender Name</Label>
                        <Input id="sender-name" defaultValue="Raw Smith Coffee" />
                        <p className="text-xs text-muted-foreground">
                          Name displayed in the "From" field
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sender-email">Sender Email</Label>
                        <Input id="sender-email" defaultValue="loyalty@rawsmith.com" />
                        <p className="text-xs text-muted-foreground">
                          Email address used for sending notifications
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSaveEmailSettings}>Save Notification Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="display">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-amber-700" />
                  Display & Features Settings
                </CardTitle>
                <CardDescription>
                  Configure customer-facing features and display options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <h3 className="text-sm font-medium flex items-center gap-1.5">
                      <Share2 className="h-4 w-4" />
                      Feature Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 items-center">
                        <Label htmlFor="referral-link">Show Referral Link</Label>
                        <Switch 
                          id="referral-link" 
                          checked={displaySettings.showReferralLink}
                          onCheckedChange={(checked) => setDisplaySettings({
                            ...displaySettings,
                            showReferralLink: checked
                          })}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 items-center">
                        <Label htmlFor="enable-community">Enable Community Goals</Label>
                        <Switch 
                          id="enable-community" 
                          checked={displaySettings.enableCommunityGoals}
                          onCheckedChange={(checked) => setDisplaySettings({
                            ...displaySettings,
                            enableCommunityGoals: checked
                          })}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 items-center">
                        <Label htmlFor="require-verification">Require Email Verification</Label>
                        <Switch 
                          id="require-verification" 
                          checked={displaySettings.requireVerification}
                          onCheckedChange={(checked) => setDisplaySettings({
                            ...displaySettings,
                            requireVerification: checked
                          })}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 items-center">
                        <Label htmlFor="enable-sms">Enable SMS Notifications</Label>
                        <Switch 
                          id="enable-sms" 
                          checked={displaySettings.enableSMS}
                          onCheckedChange={(checked) => setDisplaySettings({
                            ...displaySettings,
                            enableSMS: checked
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid gap-4">
                    <h3 className="text-sm font-medium flex items-center gap-1.5">
                      <Shield className="h-4 w-4" />
                      Security Settings
                    </h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 items-center">
                        <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                        <div>
                          <Select defaultValue="60">
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Select timeout" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                              <SelectItem value="120">2 hours</SelectItem>
                              <SelectItem value="240">4 hours</SelectItem>
                              <SelectItem value="720">12 hours</SelectItem>
                              <SelectItem value="1440">24 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSaveDisplaySettings}>Save Display Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SettingsManagement;
