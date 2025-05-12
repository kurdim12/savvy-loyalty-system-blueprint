
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { BirthdaySelector } from '@/components/profile/BirthdaySelector';

const Profile = () => {
  const { profile, updateProfile } = useAuth();
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        email,
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF6F0]">
      <Header />
      <main className="flex-1 p-4 md:p-6 container mx-auto">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#8B4513]">My Profile</h1>
            <p className="text-[#6F4E37]">Manage your personal information and preferences</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information Card */}
            <Card className="border-[#8B4513]/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#8B4513]">Personal Information</CardTitle>
                <CardDescription className="text-[#6F4E37]">Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-[#6F4E37]">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="border-[#8B4513]/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-[#6F4E37]">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="border-[#8B4513]/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-[#6F4E37]">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-[#8B4513]/20"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isUpdating}
                    className="bg-[#8B4513] hover:bg-[#6F4E37] mt-2"
                  >
                    {isUpdating ? 'Updating...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {/* Birthday Card */}
            <BirthdaySelector />

            {/* Communication Preferences */}
            <Card className="border-[#8B4513]/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#8B4513]">Communication Preferences</CardTitle>
                <CardDescription className="text-[#6F4E37]">Manage how we contact you</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Communication preferences form would go here */}
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
            
            {/* Account Settings Card */}
            <Card className="border-[#8B4513]/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-[#8B4513]">Account Settings</CardTitle>
                <CardDescription className="text-[#6F4E37]">Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Account settings content would go here */}
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
          </div>
        </div>
      </main>
      <footer className="py-4 px-6 text-center text-sm text-[#6F4E37] border-t border-[#8B4513]/10">
        &copy; {new Date().getFullYear()} Raw Smith Coffee Loyalty Program
      </footer>
    </div>
  );
};

export default Profile;
