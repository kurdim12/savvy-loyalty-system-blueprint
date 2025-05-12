
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { useState } from 'react';
import { User, Award, Gift, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const handleSaveProfile = async () => {
    if (!profile?.id) return;
    
    setIsSaving(true);
    try {
      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone: phone
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF6F0]">
      <Header />
      <main className="flex-1 p-4 md:p-6 container mx-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#8B4513]">My Profile</h1>
            <p className="text-[#6F4E37]">Manage your account settings and preferences</p>
          </div>
          
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="bg-[#FFF8DC] mb-6">
              <TabsTrigger value="personal" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white">
                <User className="h-4 w-4 mr-2" />
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="preferences" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white">
                <Trophy className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white">
                <Award className="h-4 w-4 mr-2" />
                Achievements
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-[#8B4513]/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-[#8B4513]">Personal Information</CardTitle>
                    <CardDescription className="text-[#6F4E37]">Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="text-sm font-medium text-[#6F4E37]">First Name</label>
                        <Input 
                          id="firstName" 
                          value={firstName} 
                          onChange={(e) => setFirstName(e.target.value)}
                          className="border-[#8B4513]/20 focus:border-[#8B4513]" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="text-sm font-medium text-[#6F4E37]">Last Name</label>
                        <Input 
                          id="lastName" 
                          value={lastName} 
                          onChange={(e) => setLastName(e.target.value)}
                          className="border-[#8B4513]/20 focus:border-[#8B4513]" 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-[#6F4E37]">Email</label>
                      <Input 
                        id="email" 
                        value={user?.email || ''} 
                        disabled
                        className="bg-gray-100 border-[#8B4513]/20" 
                      />
                      <p className="text-xs text-[#6F4E37]">Email address cannot be changed</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-[#6F4E37]">Phone Number</label>
                      <Input 
                        id="phone" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(555) 123-4567"
                        className="border-[#8B4513]/20 focus:border-[#8B4513]" 
                      />
                    </div>
                    
                    <Button 
                      onClick={handleSaveProfile} 
                      disabled={isSaving}
                      className="bg-[#8B4513] hover:bg-[#6F4E37] w-full mt-4"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border-[#8B4513]/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-[#8B4513]">Account Information</CardTitle>
                    <CardDescription className="text-[#6F4E37]">Your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-[#6F4E37]">Member Since</div>
                        <div className="text-[#8B4513]">{formatDate(profile?.created_at)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#6F4E37]">Membership Tier</div>
                        <div className="text-[#8B4513] capitalize">{profile?.membership_tier || 'Bronze'}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-[#6F4E37]">Total Visits</div>
                      <div className="text-[#8B4513]">{profile?.visits || 0} visits</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-[#6F4E37]">Current Points</div>
                      <div className="text-[#8B4513] font-bold">{profile?.current_points || 0} points</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-[#6F4E37]">Last Updated</div>
                      <div className="text-[#8B4513]">{formatDate(profile?.updated_at)}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card className="border-[#8B4513]/20">
                <CardHeader>
                  <CardTitle className="text-lg text-[#8B4513]">Communication Preferences</CardTitle>
                  <CardDescription className="text-[#6F4E37]">Manage how we contact you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-[#8B4513]">Email Notifications</h4>
                        <p className="text-sm text-[#6F4E37]">Receive updates about your orders and account.</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" className="border-[#8B4513] text-[#8B4513]">
                          Manage
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-[#8B4513]">SMS Notifications</h4>
                        <p className="text-sm text-[#6F4E37]">Get text messages for order updates and promotions.</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" className="border-[#8B4513] text-[#8B4513]">
                          Manage
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-[#8B4513]">Newsletter</h4>
                        <p className="text-sm text-[#6F4E37]">Stay updated with our latest offerings and news.</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" className="border-[#8B4513] text-[#8B4513]">
                          Subscribe
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="achievements">
              <Card className="border-[#8B4513]/20">
                <CardHeader>
                  <CardTitle className="text-lg text-[#8B4513]">Your Achievements</CardTitle>
                  <CardDescription className="text-[#6F4E37]">See all your accomplishments with Raw Smith Coffee</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-[#FFF8DC] p-4 rounded-lg text-center">
                      <Gift className="h-8 w-8 mx-auto mb-2 text-[#8B4513]" />
                      <h4 className="font-medium text-[#8B4513]">First Purchase</h4>
                      <p className="text-sm text-[#6F4E37]">Completed your first purchase</p>
                    </div>
                    
                    {profile?.membership_tier === 'silver' || profile?.membership_tier === 'gold' ? (
                      <div className="bg-[#FFF8DC] p-4 rounded-lg text-center">
                        <Award className="h-8 w-8 mx-auto mb-2 text-[#8B4513]" />
                        <h4 className="font-medium text-[#8B4513]">Silver Member</h4>
                        <p className="text-sm text-[#6F4E37]">Reached silver membership level</p>
                      </div>
                    ) : (
                      <div className="bg-gray-100 p-4 rounded-lg text-center opacity-50">
                        <Award className="h-8 w-8 mx-auto mb-2 text-[#6F4E37]" />
                        <h4 className="font-medium text-[#6F4E37]">Silver Member</h4>
                        <p className="text-sm text-[#6F4E37]">Reach 200 points to unlock</p>
                      </div>
                    )}
                    
                    {profile?.membership_tier === 'gold' ? (
                      <div className="bg-[#FFF8DC] p-4 rounded-lg text-center">
                        <Trophy className="h-8 w-8 mx-auto mb-2 text-[#8B4513]" />
                        <h4 className="font-medium text-[#8B4513]">Gold Member</h4>
                        <p className="text-sm text-[#6F4E37]">Reached gold membership level</p>
                      </div>
                    ) : (
                      <div className="bg-gray-100 p-4 rounded-lg text-center opacity-50">
                        <Trophy className="h-8 w-8 mx-auto mb-2 text-[#6F4E37]" />
                        <h4 className="font-medium text-[#6F4E37]">Gold Member</h4>
                        <p className="text-sm text-[#6F4E37]">Reach 550 points to unlock</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="py-4 px-6 text-center text-sm text-[#6F4E37] border-t border-[#8B4513]/10">
        &copy; {new Date().getFullYear()} Raw Smith Coffee Loyalty Program
      </footer>
    </div>
  );
};

export default Profile;
