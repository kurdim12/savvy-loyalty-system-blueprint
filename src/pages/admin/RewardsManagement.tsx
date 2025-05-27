
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, BarChart3, Filter, Trophy, Camera, Settings } from 'lucide-react';
import { toast } from 'sonner';
import RewardsList from '@/components/admin/RewardsList';
import UpdateRewardsSystem from '@/components/admin/UpdateRewardsSystem';
import CommunityHubControl from '@/components/admin/CommunityHubControl';

const RewardsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCommunityHub, setShowCommunityHub] = useState(false);
  
  const handleCreateReward = () => {
    setShowCreateForm(true);
    toast.success('Opening reward creation form');
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rewards Management</h1>
            <p className="text-gray-500">Create and manage loyalty program rewards</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => setShowCommunityHub(!showCommunityHub)}
              className="bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
            >
              <Trophy className="mr-2 h-4 w-4" />
              Community Hub Control
            </Button>
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Redemption Analytics
            </Button>
            <Button onClick={handleCreateReward}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Reward
            </Button>
          </div>
        </div>

        {/* Community Hub Control Section */}
        {showCommunityHub && (
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <Settings className="h-5 w-5" />
                Community Hub Management
              </CardTitle>
              <CardDescription className="text-amber-700">
                Control challenges, photo contests, and community activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CommunityHubControl />
            </CardContent>
          </Card>
        )}

        {/* Update Rewards System */}
        <UpdateRewardsSystem />

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Rewards</CardTitle>
            <CardDescription>Find and manage specific rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rewards..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Button className="flex items-center justify-center gap-2">
                <Filter className="h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rewards List */}
        <RewardsList />
      </div>
    </AdminLayout>
  );
};

export default RewardsManagement;
