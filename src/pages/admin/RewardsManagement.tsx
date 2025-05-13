
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
import { Search, Plus, BarChart3, Filter } from 'lucide-react';
import { toast } from 'sonner';
import RewardsList from '@/components/admin/RewardsList';

const RewardsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  
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
        <RewardsList 
          searchQuery={searchQuery}
          statusFilter={statusFilter === 'all' ? undefined : statusFilter === 'active'} 
        />
      </div>
    </AdminLayout>
  );
};

export default RewardsManagement;
