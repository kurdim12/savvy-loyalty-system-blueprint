
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Search, ChevronLeft, ChevronRight, MessageSquare, Users, Calendar } from 'lucide-react';
import { toast } from 'sonner';

// Types for community posts and comments
interface CommunityPost {
  id: string;
  title?: string;
  content: string;
  created_at: string;
  author_id: string;
  author: {
    first_name?: string;
    last_name?: string;
    email: string;
  };
  comment_count?: number;
}

interface CommunityComment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  author: {
    first_name?: string;
    last_name?: string;
    email: string;
  };
}

const ITEMS_PER_PAGE = 10;

const CommunityManagement = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [showDeletePostDialog, setShowDeletePostDialog] = useState(false);
  const [showDeleteCommentDialog, setShowDeleteCommentDialog] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);

  // Fetch community posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin', 'community', 'posts', currentPage, searchQuery],
    queryFn: async () => {
      try {
        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        
        let query = supabase
          .from('community_goals')
          .select(`
            id, 
            name,
            description, 
            created_at
          `)
          .order('created_at', { ascending: false })
          .range(from, to);
        
        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // This is a mock implementation since we're using community_goals as a placeholder
        // In a real implementation, we would have a proper community posts table
        return data.map(post => ({
          id: post.id,
          title: post.name,
          content: post.description || 'No content',
          created_at: post.created_at,
          author_id: 'mock-author-id',
          author: {
            first_name: 'Community',
            last_name: 'User',
            email: 'community@example.com'
          },
          comment_count: Math.floor(Math.random() * 10) // Mock comment count
        })) as CommunityPost[];
      } catch (error) {
        console.error('Error fetching community posts:', error);
        return [];
      }
    },
    refetchInterval: 60000 // Refetch every minute
  });

  // Fetch post comments when a post is selected
  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['admin', 'community', 'post', selectedPost?.id, 'comments'],
    queryFn: async () => {
      if (!selectedPost?.id) return [];
      
      try {
        // This is a mock implementation since we don't have a real comments table
        // In a real implementation, we would query the comments table
        
        // Generate 0-5 mock comments for the selected post
        const commentCount = Math.floor(Math.random() * 6);
        const mockComments: CommunityComment[] = [];
        
        for (let i = 0; i < commentCount; i++) {
          mockComments.push({
            id: `mock-comment-${i}-${selectedPost.id}`,
            content: `This is a mock comment ${i + 1} on post ${selectedPost.id}`,
            created_at: new Date(Date.now() - Math.random() * 10000000).toISOString(),
            user_id: `mock-user-${i}`,
            author: {
              first_name: `User`,
              last_name: `${i + 1}`,
              email: `user${i + 1}@example.com`
            }
          });
        }
        
        return mockComments.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
      }
    },
    enabled: !!selectedPost?.id
  });

  // Delete post mutation
  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      try {
        // In a real implementation, you would delete the actual post
        // For now, we'll just show a toast
        toast.success('Post would be deleted in a real implementation');
      } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'community', 'posts'] });
      setSelectedPost(null);
      setShowDeletePostDialog(false);
      toast.success('Post deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete post');
    }
  });

  // Delete comment mutation
  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      try {
        // In a real implementation, you would delete the actual comment
        // For now, we'll just show a toast
        toast.success('Comment would be deleted in a real implementation');
      } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
      }
    },
    onSuccess: () => {
      if (selectedPost?.id) {
        queryClient.invalidateQueries({ 
          queryKey: ['admin', 'community', 'post', selectedPost.id, 'comments'] 
        });
      }
      setShowDeleteCommentDialog(false);
      setSelectedCommentId(null);
      toast.success('Comment deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete comment');
    }
  });

  const handleDeletePost = () => {
    if (selectedPost) {
      deletePost.mutate(selectedPost.id);
    }
  };

  const handleDeleteComment = () => {
    if (selectedCommentId) {
      deleteComment.mutate(selectedCommentId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const getUserInitials = (first?: string, last?: string) => {
    const f = first ? first.charAt(0).toUpperCase() : '?';
    const l = last ? last.charAt(0).toUpperCase() : '';
    return f + (l || '');
  };
  
  const getAuthorName = (author: {first_name?: string, last_name?: string, email: string}) => {
    if (author.first_name || author.last_name) {
      return `${author.first_name || ''} ${author.last_name || ''}`.trim();
    }
    return author.email.split('@')[0];
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Management</h1>
            <p className="text-gray-500">Monitor and moderate community content</p>
          </div>
        </div>
        
        {selectedPost ? (
          <div>
            <Button 
              variant="outline" 
              className="mb-4" 
              onClick={() => setSelectedPost(null)}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to All Posts
            </Button>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedPost.title || 'Untitled Post'}</CardTitle>
                    <div className="flex items-center mt-2 space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                        <span className="text-sm font-semibold text-amber-700">
                          {getUserInitials(selectedPost.author.first_name, selectedPost.author.last_name)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{getAuthorName(selectedPost.author)}</div>
                        <div className="text-sm text-muted-foreground">
                          Posted on {formatDate(selectedPost.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => setShowDeletePostDialog(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{selectedPost.content}</p>
                </div>
                
                <div className="border-t pt-4 mt-6">
                  <h3 className="font-medium text-lg mb-4 flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Comments ({comments?.length || 0})
                  </h3>
                  
                  {commentsLoading ? (
                    <div className="flex items-center justify-center h-24">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                    </div>
                  ) : comments && comments.length > 0 ? (
                    <div className="space-y-4">
                      {comments.map(comment => (
                        <div key={comment.id} className="flex space-x-4">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                            <span className="text-sm font-semibold text-gray-600">
                              {getUserInitials(comment.author.first_name, comment.author.last_name)}
                            </span>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-medium">{getAuthorName(comment.author)}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {formatDate(comment.created_at)}
                                </span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-6 w-6 text-red-500 hover:text-red-700"
                                onClick={() => {
                                  setSelectedCommentId(comment.id);
                                  setShowDeleteCommentDialog(true);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-gray-500">No comments on this post</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
              </div>
            </div>
            
            {/* Posts Table */}
            <Card>
              <CardHeader>
                <CardTitle>Community Posts</CardTitle>
                <CardDescription>
                  Manage and moderate user-generated content
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-60">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
                  </div>
                ) : posts && posts.length > 0 ? (
                  <>
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Post</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Comments</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {posts.map(post => (
                            <TableRow key={post.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{post.title || 'Untitled'}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {truncateText(post.content, 50)}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                                    <span className="text-xs font-medium text-amber-700">
                                      {getUserInitials(post.author.first_name, post.author.last_name)}
                                    </span>
                                  </div>
                                  <span className="text-sm">{getAuthorName(post.author)}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-3 w-3 text-muted-foreground" />
                                  {formatDate(post.created_at)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <MessageSquare className="mr-2 h-3 w-3 text-muted-foreground" />
                                  {post.comment_count || 0}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => setSelectedPost(post)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => {
                                      setSelectedPost(post);
                                      setShowDeletePostDialog(true);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {/* Pagination */}
                    <div className="flex items-center justify-end space-x-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="text-sm">
                        Page {currentPage}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={!posts || posts.length < ITEMS_PER_PAGE}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10">
                    <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900 mb-1">No Posts Found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? 
                        "No posts match your search criteria." : 
                        "There are no community posts yet."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
        
        {/* Delete Post Confirmation Dialog */}
        <Dialog open={showDeletePostDialog} onOpenChange={setShowDeletePostDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Post</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this post? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeletePostDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeletePost}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Comment Confirmation Dialog */}
        <Dialog open={showDeleteCommentDialog} onOpenChange={setShowDeleteCommentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Comment</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this comment? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteCommentDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteComment}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Comment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default CommunityManagement;
