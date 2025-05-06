
import { useState } from 'react';
import { useCreateCommunityGoal } from '@/hooks/useCommunityGoals';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Coffee, Heart, Plus, Recycle, Users } from 'lucide-react';
import { CreateCommunityGoalInput } from '@/types/communityGoals';

interface NewGoalFormProps {
  onSuccess?: () => void;
}

export default function NewGoalForm({ onSuccess }: NewGoalFormProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateCommunityGoalInput>({
    name: '',
    description: '',
    target_points: 1000,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    icon: 'coffee',
    reward_description: '',
    active: true
  });

  const { mutate: createGoal, isPending } = useCreateCommunityGoal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createGoal(formData, {
      onSuccess: () => {
        setDialogOpen(false);
        resetForm();
        onSuccess?.();
      }
    });
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      target_points: 1000,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      icon: 'coffee',
      reward_description: '',
      active: true
    });
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Create New Community Goal</CardTitle>
          <Button 
            onClick={() => setDialogOpen(true)}
            className="bg-amber-700 hover:bg-amber-800 flex items-center gap-2"
          >
            <Plus size={16} /> New Goal
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Create a new community goal for customers to contribute their points toward. 
            Set a target, reward, and timeframe.
          </p>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Community Goal</DialogTitle>
            <DialogDescription>
              Create a new community goal for users to contribute to.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="target_points" className="text-right">Target Points</Label>
                <Input
                  id="target_points"
                  name="target_points"
                  type="number"
                  min={1}
                  value={formData.target_points}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expires_at" className="text-right">Expiry Date</Label>
                <Input
                  id="expires_at"
                  name="expires_at"
                  type="date"
                  value={formData.expires_at || ''}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">Icon</Label>
                <Select 
                  value={formData.icon} 
                  onValueChange={(value) => handleSelectChange('icon', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coffee">
                      <div className="flex items-center gap-2">
                        <Coffee className="h-4 w-4" /> Coffee
                      </div>
                    </SelectItem>
                    <SelectItem value="heart">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4" /> Heart
                      </div>
                    </SelectItem>
                    <SelectItem value="award">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" /> Award
                      </div>
                    </SelectItem>
                    <SelectItem value="recycle">
                      <div className="flex items-center gap-2">
                        <Recycle className="h-4 w-4" /> Recycle
                      </div>
                    </SelectItem>
                    <SelectItem value="users">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" /> Users
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reward_description" className="text-right">Reward</Label>
                <Input
                  id="reward_description"
                  name="reward_description"
                  value={formData.reward_description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="e.g. Free coffee for all gold members"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="active" className="text-right">Status</Label>
                <Select 
                  value={formData.active ? 'active' : 'inactive'} 
                  onValueChange={(value) => handleSelectChange('active', value === 'active')}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-amber-700 hover:bg-amber-800"
                disabled={isPending}
              >
                {isPending ? 'Creating...' : 'Create Goal'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
