
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
import { Search, Plus, BarChart3, Filter, Trophy, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import RewardsList from '@/components/admin/RewardsList';
import UpdateRewardsSystem from '@/components/admin/UpdateRewardsSystem';
import CommunityHubControl from '@/components/admin/CommunityHubControl';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const RewardsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCommunityHub, setShowCommunityHub] = useState(false);
  const [showUpdateSystem, setShowUpdateSystem] = useState(false);
  
  const handleCreateReward = () => {
    setShowCreateForm(true);
    toast.success('Opening reward creation form');
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rewards Management</h1>
            <p className="text-gray-500">Create and manage loyalty program rewards</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Collapsible open={showCommunityHub} onOpenChange={setShowCommunityHub}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline"
                  className="bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Community Hub Control
                  {showCommunityHub ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
            
            <Collapsible open={showUpdateSystem} onOpenChange={setShowUpdateSystem}>
              <CollapsibleTrigger asChild>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Update Rewards System
                  {showUpdateSystem ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
            
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

        {/* Collapsible Sections */}
        <div className="space-y-4">
          {/* Community Hub Control Section */}
          <Collapsible open={showCommunityHub} onOpenChange={setShowCommunityHub}>
            <CollapsibleContent>
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
                <CardContent className="max-h-[600px] overflow-y-auto">
                  <CommunityHubControl />
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Update Rewards System Section */}
          <Collapsible open={showUpdateSystem} onOpenChange={setShowUpdateSystem}>
            <CollapsibleContent>
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Settings className="h-5 w-5" />
                    Rewards System Configuration
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Update rewards database and system settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="max-h-[400px] overflow-y-auto">
                  <UpdateRewardsSystem />
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>

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
        <div className="min-h-[400px]">
          <RewardsList />
        </div>
      </div>
    </AdminLayout>
  );
};

export default RewardsManagement;
