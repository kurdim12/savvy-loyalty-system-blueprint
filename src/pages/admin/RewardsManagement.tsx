
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
      <div className="space-y-8 max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rewards Management</h1>
            <p className="text-gray-500 mt-2">Create and manage loyalty program rewards</p>
          </div>
          
          {/* Action Buttons - FIXED: Better responsive layout */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <Collapsible open={showCommunityHub} onOpenChange={setShowCommunityHub}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline"
                  className="bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors w-full sm:w-auto"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Community Hub Control
                  {showCommunityHub ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
            
            <Collapsible open={showUpdateSystem} onOpenChange={setShowUpdateSystem}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="transition-colors w-full sm:w-auto">
                  <Settings className="mr-2 h-4 w-4" />
                  Update Rewards System
                  {showUpdateSystem ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
            
            <Button variant="outline" className="transition-colors w-full sm:w-auto">
              <BarChart3 className="mr-2 h-4 w-4" />
              Redemption Analytics
            </Button>
            
            <Button onClick={handleCreateReward} className="bg-primary hover:bg-primary/90 transition-colors w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create New Reward
            </Button>
          </div>
        </div>

        {/* Collapsible Sections - FIXED: Better spacing and mobile handling */}
        <div className="space-y-6">
          {/* Community Hub Control Section */}
          <Collapsible open={showCommunityHub} onOpenChange={setShowCommunityHub}>
            <CollapsibleContent className="space-y-2">
              <Card className="bg-amber-50 border-amber-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <Settings className="h-5 w-5" />
                    Community Hub Management
                  </CardTitle>
                  <CardDescription className="text-amber-700">
                    Control challenges, photo contests, and community activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="max-h-[500px] overflow-y-auto pr-2">
                    <CommunityHubControl />
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Update Rewards System Section */}
          <Collapsible open={showUpdateSystem} onOpenChange={setShowUpdateSystem}>
            <CollapsibleContent className="space-y-2">
              <Card className="bg-blue-50 border-blue-200 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Settings className="h-5 w-5" />
                    Rewards System Configuration
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Update rewards database and system settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="max-h-[400px] overflow-y-auto pr-2">
                    <UpdateRewardsSystem />
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Filters - FIXED: Better mobile responsiveness */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle>Filter Rewards</CardTitle>
            <CardDescription>Find and manage specific rewards</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative sm:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search rewards..."
                  className="pl-10"
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
              
              <Button className="flex items-center justify-center gap-2 transition-colors">
                <Filter className="h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rewards List */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="min-h-[400px]">
              <RewardsList />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default RewardsManagement;
