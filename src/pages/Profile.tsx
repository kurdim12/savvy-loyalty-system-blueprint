
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Profile = () => {
  const { profile } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    birthday: profile?.birthday || '',
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      if (!profile?.id) {
        throw new Error('User profile not found');
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          birthday: formData.birthday,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);
      
      if (error) throw error;
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-amber-900 mb-6">My Profile</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      name="firstName"
                      value={formData.firstName} 
                      onChange={handleChange} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      name="lastName"
                      value={formData.lastName} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email"
                    value={formData.email} 
                    disabled 
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    value={formData.phone || ''} 
                    onChange={handleChange} 
                    placeholder="(123) 456-7890"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="birthday">Birthday</Label>
                  <Input 
                    id="birthday" 
                    name="birthday"
                    type="date" 
                    value={formData.birthday || ''} 
                    onChange={handleChange} 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="ml-auto bg-amber-700 hover:bg-amber-800"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Membership Information</CardTitle>
              <CardDescription>Your loyalty program details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-amber-700">Membership Tier</p>
                  <p className="text-lg font-semibold capitalize">{profile?.membership_tier || 'Bronze'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-amber-700">Points Balance</p>
                  <p className="text-lg font-semibold">{profile?.current_points || 0} points</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-amber-700">Visits</p>
                  <p className="text-lg font-semibold">{profile?.visits || 0} visits</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-amber-700">Member Since</p>
                  <p className="text-lg font-semibold">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <p className="text-sm font-medium text-amber-700">Tier Benefits</p>
                <ul className="mt-2 space-y-2">
                  {profile?.membership_tier === 'bronze' && (
                    <>
                      <li className="text-sm flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>Free coffee on your birthday</span>
                      </li>
                      <li className="text-sm flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>10% off on all food items</span>
                      </li>
                      <li className="text-sm flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>Access to Bronze-tier rewards</span>
                      </li>
                    </>
                  )}
                  
                  {profile?.membership_tier === 'silver' && (
                    <>
                      <li className="text-sm flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>Free coffee on your birthday</span>
                      </li>
                      <li className="text-sm flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>15% off on all food items</span>
                      </li>
                      <li className="text-sm flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>Access to Silver-tier rewards</span>
                      </li>
                      <li className="text-sm flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>Priority service during peak hours</span>
                      </li>
                    </>
                  )}
                  
                  {profile?.membership_tier === 'gold' && (
                    <>
                      <li className="text-sm flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>Free coffee on your birthday plus a pastry</span>
                      </li>
                      <li className="text-sm flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>20% off on all food items</span>
                      </li>
                      <li className="text-sm flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>Access to all reward tiers</span>
                      </li>
                      <li className="text-sm flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>Exclusive invites to tasting events</span>
                      </li>
                      <li className="text-sm flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>Free size upgrades on all drinks</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
