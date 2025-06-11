import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  Megaphone, 
  MessageSquare, 
  Plus, 
  AlertCircle, 
  CheckCircle, 
  Trash2,
  PenSquare,
  Users,
  Shield,
  Trophy,
  Camera
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CommunityControl from '@/components/admin/CommunityControl';
import CommunityHubControl from '@/components/admin/CommunityHubControl';

interface Event {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

const CommunityManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isNewAnnouncementOpen, setIsNewAnnouncementOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Fetch events
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Event[];
    }
  });

  // Create announcement mutation
  const createAnnouncementMutation = useMutation({
    mutationFn: async ({ title, body }: { title: string; body: string }) => {
      if (!user) throw new Error("You must be logged in as admin");
      
      const { error } = await supabase
        .from('events')
        .insert({ 
          title, 
          body, 
          author: user.id 
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setIsNewAnnouncementOpen(false);
      setTitle("");
      setBody("");
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span>Announcement published successfully</span>
        </div>
      );
    },
    onError: (error: any) => {
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{`Error creating announcement: ${error.message}`}</span>
        </div>
      );
    }
  });

  // Delete announcement mutation
  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setEventToDelete(null);
      toast.success("Announcement deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Error deleting announcement: ${error.message}`);
    }
  });

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Please provide both a title and content");
      return;
    }
    
    createAnnouncementMutation.mutate({ title, body });
  };

  const confirmDelete = (id: string) => {
    setEventToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (eventToDelete) {
      deleteAnnouncementMutation.mutate(eventToDelete);
      setIsDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="space-y-6 p-6">
          <div className="flex justify-between items-start">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
                Community Management
              </h2>
              <p className="text-amber-700 mt-1">
                Manage announcements, community discussions, challenges, and member interactions.
              </p>
            </div>
            <Button 
              onClick={() => setIsNewAnnouncementOpen(true)}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg"
            >
              <Megaphone className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </div>

          <Tabs defaultValue="announcements" className="space-y-6">
            <TabsList className="bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="announcements" className="flex items-center gap-2">
                <Megaphone className="h-4 w-4" />
                Announcements
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Community Control
              </TabsTrigger>
              <TabsTrigger value="activities" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Activities & Challenges
              </TabsTrigger>
            </TabsList>

            <TabsContent value="announcements">
              <div className="grid gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-amber-900">Recent Announcements</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {eventsLoading ? (
                      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                        <CardContent className="text-center py-8">
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
                            <span className="ml-3 text-amber-800">Loading announcements...</span>
                          </div>
                        </CardContent>
                      </Card>
                    ) : events && events.length > 0 ? (
                      events.map(event => (
                        <Card key={event.id} className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-amber-900">{event.title}</CardTitle>
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" className="text-amber-700 hover:bg-amber-100">
                                  <PenSquare className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => confirmDelete(event.id)}
                                  className="text-red-700 hover:bg-red-100"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <CardDescription className="text-amber-700">
                              Posted on {formatDate(event.created_at)}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="prose prose-sm">
                              <p className="text-amber-800">{event.body}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                        <CardContent className="text-center py-12">
                          <Megaphone className="h-16 w-16 text-amber-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-amber-900">No Announcements Yet</h3>
                          <p className="text-amber-700 mt-2">
                            Create your first announcement to keep your customers informed.
                          </p>
                          <Button 
                            className="mt-4 bg-amber-600 hover:bg-amber-700" 
                            onClick={() => setIsNewAnnouncementOpen(true)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Announcement
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
                
                <Separator className="bg-amber-200" />
                
                <div>
                  <h3 className="text-lg font-medium mb-4 text-amber-900">Community Statistics</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                      <CardHeader className="py-4">
                        <CardTitle className="text-base text-amber-900">Active Discussions</CardTitle>
                      </CardHeader>
                      <CardContent className="py-0">
                        <div className="text-2xl font-bold text-amber-800">--</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                      <CardHeader className="py-4">
                        <CardTitle className="text-base text-amber-900">Total Messages</CardTitle>
                      </CardHeader>
                      <CardContent className="py-0">
                        <div className="text-2xl font-bold text-amber-800">--</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                      <CardHeader className="py-4">
                        <CardTitle className="text-base text-amber-900">Active Participants</CardTitle>
                      </CardHeader>
                      <CardContent className="py-0">
                        <div className="text-2xl font-bold text-amber-800">--</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="community">
              <CommunityControl />
            </TabsContent>

            <TabsContent value="activities">
              <CommunityHubControl />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* New Announcement Dialog */}
        <Dialog open={isNewAnnouncementOpen} onOpenChange={setIsNewAnnouncementOpen}>
          <DialogContent className="max-w-md bg-white/95 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle className="text-amber-900">New Announcement</DialogTitle>
              <DialogDescription className="text-amber-700">
                Create a new announcement for all users to see.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1 text-amber-900">
                  Announcement Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title of your announcement"
                  className="border-amber-200 focus:border-amber-400"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-1 text-amber-900">
                  Content
                </label>
                <Textarea
                  id="content"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Details of your announcement"
                  className="border-amber-200 focus:border-amber-400"
                  rows={5}
                  required
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsNewAnnouncementOpen(false)}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createAnnouncementMutation.isPending || !title.trim() || !body.trim()}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {createAnnouncementMutation.isPending ? "Publishing..." : "Publish"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="bg-white/95 backdrop-blur-sm">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-amber-900">Delete Announcement</AlertDialogTitle>
              <AlertDialogDescription className="text-amber-700">
                Are you sure you want to delete this announcement? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-amber-300 text-amber-700 hover:bg-amber-50">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default CommunityManagement;
