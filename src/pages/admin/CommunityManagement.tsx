
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
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Megaphone, 
  MessageSquare, 
  Plus, 
  AlertCircle, 
  CheckCircle, 
  Trash2,
  PenSquare
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
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Community Management</h2>
            <p className="text-muted-foreground">
              Manage announcements and community discussions.
            </p>
          </div>
          <Button onClick={() => setIsNewAnnouncementOpen(true)}>
            <Megaphone className="mr-2 h-4 w-4" />
            New Announcement
          </Button>
        </div>

        <Separator />
        
        <div className="grid gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Recent Announcements</h3>
            </div>
            
            <div className="space-y-4">
              {eventsLoading ? (
                <Card>
                  <CardContent className="text-center py-8">
                    Loading announcements...
                  </CardContent>
                </Card>
              ) : events && events.length > 0 ? (
                events.map(event => (
                  <Card key={event.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{event.title}</CardTitle>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <PenSquare className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => confirmDelete(event.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        Posted on {formatDate(event.created_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm">
                        <p>{event.body}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No Announcements Yet</h3>
                    <p className="text-muted-foreground mt-1">
                      Create your first announcement to keep your customers informed.
                    </p>
                    <Button 
                      className="mt-4" 
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
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Community Statistics</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-base">Active Discussions</CardTitle>
                </CardHeader>
                <CardContent className="py-0">
                  <div className="text-2xl font-bold">--</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-base">Total Messages</CardTitle>
                </CardHeader>
                <CardContent className="py-0">
                  <div className="text-2xl font-bold">--</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-base">Active Participants</CardTitle>
                </CardHeader>
                <CardContent className="py-0">
                  <div className="text-2xl font-bold">--</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* New Announcement Dialog */}
      <Dialog open={isNewAnnouncementOpen} onOpenChange={setIsNewAnnouncementOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Announcement</DialogTitle>
            <DialogDescription>
              Create a new announcement for all users to see.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Announcement Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title of your announcement"
                required
              />
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                Content
              </label>
              <Textarea
                id="content"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Details of your announcement"
                rows={5}
                required
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsNewAnnouncementOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createAnnouncementMutation.isPending || !title.trim() || !body.trim()}
              >
                {createAnnouncementMutation.isPending ? "Publishing..." : "Publish"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this announcement? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default CommunityManagement;
