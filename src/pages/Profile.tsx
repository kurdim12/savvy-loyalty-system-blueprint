
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { BirthdaySelector } from '@/components/profile/BirthdaySelector';
import { CoffeePersonalityForm } from '@/components/profile/CoffeePersonalityForm';
import { SocialPreferencesForm } from '@/components/profile/SocialPreferencesForm';
import { CoffeeJourneyView } from '@/components/profile/CoffeeJourneyView';
import { ConnectionsView } from '@/components/profile/ConnectionsView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Coffee, Users, Star, Settings } from 'lucide-react';

const Profile = () => {
  const { profile, updateProfile } = useAuth();
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        email,
        bio,
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getMembershipColor = (tier: string) => {
    switch (tier) {
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF6F0]">
      <Header />
      <main className="flex-1 p-4 md:p-6 container mx-auto">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={profile?.avatar_url || '/placeholder.svg'}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-[#8B4513]"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#8B4513]">
                {profile?.first_name} {profile?.last_name}
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge className={getMembershipColor(profile?.membership_tier || 'bronze')}>
                  {profile?.membership_tier?.toUpperCase()} Member
                </Badge>
                <Badge variant="outline" className="text-[#8B4513]">
                  {profile?.current_points || 0} Points
                </Badge>
              </div>
              {profile?.current_mood && (
                <p className="text-[#6F4E37] mt-2">Currently feeling: {profile.current_mood}</p>
              )}
              {profile?.current_drink && (
                <p className="text-[#6F4E37]">Enjoying: {profile.current_drink}</p>
              )}
            </div>
          </div>

          {/* Profile Tabs */}
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="coffee" className="flex items-center gap-2">
                <Coffee className="h-4 w-4" />
                Coffee Profile
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Social
              </TabsTrigger>
              <TabsTrigger value="journey" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Journey
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card className="border-[#8B4513]/20">
                <CardHeader>
                  <CardTitle className="text-[#8B4513]">Personal Information</CardTitle>
                  <CardDescription className="text-[#6F4E37]">Update your basic profile details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateBasicInfo} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#6F4E37]">First Name</label>
                        <Input
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="border-[#8B4513]/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#6F4E37]">Last Name</label>
                        <Input
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="border-[#8B4513]/20"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#6F4E37]">Email</label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-[#8B4513]/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#6F4E37]">Bio</label>
                      <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell others about yourself..."
                        className="border-[#8B4513]/20"
                        rows={3}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isUpdating}
                      className="bg-[#8B4513] hover:bg-[#6F4E37]"
                    >
                      {isUpdating ? 'Updating...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <BirthdaySelector />
            </TabsContent>

            <TabsContent value="coffee">
              <CoffeePersonalityForm />
            </TabsContent>

            <TabsContent value="social">
              <SocialPreferencesForm />
            </TabsContent>

            <TabsContent value="journey">
              <CoffeeJourneyView />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="border-[#8B4513]/20">
                <CardHeader>
                  <CardTitle className="text-[#8B4513]">Communication Preferences</CardTitle>
                  <CardDescription className="text-[#6F4E37]">Manage how we contact you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="emailNotif" 
                        className="rounded border-[#8B4513]/20 text-[#8B4513] focus:ring-[#8B4513]"
                      />
                      <label htmlFor="emailNotif" className="text-sm text-[#6F4E37]">
                        Email notifications for special offers
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="newsletterNotif" 
                        className="rounded border-[#8B4513]/20 text-[#8B4513] focus:ring-[#8B4513]" 
                      />
                      <label htmlFor="newsletterNotif" className="text-sm text-[#6F4E37]">
                        Weekly newsletter
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="reminderNotif" 
                        className="rounded border-[#8B4513]/20 text-[#8B4513] focus:ring-[#8B4513]" 
                      />
                      <label htmlFor="reminderNotif" className="text-sm text-[#6F4E37]">
                        Loyalty program updates
                      </label>
                    </div>
                    <Button className="mt-4 bg-[#8B4513] hover:bg-[#6F4E37]">
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-[#8B4513]/20">
                <CardHeader>
                  <CardTitle className="text-[#8B4513]">Account Settings</CardTitle>
                  <CardDescription className="text-[#6F4E37]">Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full border-[#8B4513]/20 text-[#8B4513]">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50">
                      Delete Account
                    </Button>
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
