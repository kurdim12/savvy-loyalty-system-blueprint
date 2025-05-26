
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Heart, Trophy, Users, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PhotoSubmission {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  author: string;
  authorAvatar?: string;
  votes: number;
  submittedAt: Date;
}

interface PhotoContest {
  id: string;
  title: string;
  description: string;
  theme: string;
  prize: string;
  endsAt: Date;
  submissions: PhotoSubmission[];
  maxSubmissions: number;
}

interface PhotoContestProps {
  contest: PhotoContest;
  onSubmitPhoto: (contestId: string, photo: File, title: string, description: string) => void;
  onVotePhoto: (submissionId: string) => void;
}

export const PhotoContest = ({ contest, onSubmitPhoto, onVotePhoto }: PhotoContestProps) => {
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');

  const timeLeft = Math.ceil((contest.endsAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const topSubmissions = contest.submissions.sort((a, b) => b.votes - a.votes).slice(0, 6);

  const handlePhotoSubmit = () => {
    if (photoFile && photoTitle.trim()) {
      onSubmitPhoto(contest.id, photoFile, photoTitle, photoDescription);
      setIsSubmitDialogOpen(false);
      setPhotoFile(null);
      setPhotoTitle('');
      setPhotoDescription('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Contest Header */}
      <Card className="bg-gradient-to-r from-black to-[#95A5A6] text-white border-0">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Camera className="h-8 w-8" />
            <CardTitle className="text-3xl font-bold">{contest.title}</CardTitle>
          </div>
          <CardDescription className="text-white/80 text-lg">{contest.description}</CardDescription>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
              Theme: {contest.theme}
            </Badge>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              <span className="font-medium">{contest.prize}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{timeLeft} days left</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{contest.submissions.length} submissions</span>
            </div>
          </div>
          
          <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="mt-6 bg-white text-black hover:bg-white/90 transition-colors duration-200"
              >
                <Camera className="h-5 w-5 mr-2" />
                Submit Your Photo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-black">Submit Your Photo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                    className="border-[#95A5A6] focus:border-black"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Photo title"
                    value={photoTitle}
                    onChange={(e) => setPhotoTitle(e.target.value)}
                    className="border-[#95A5A6] focus:border-black"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Describe your photo..."
                    value={photoDescription}
                    onChange={(e) => setPhotoDescription(e.target.value)}
                    className="border-[#95A5A6] focus:border-black"
                  />
                </div>
                <Button 
                  onClick={handlePhotoSubmit}
                  disabled={!photoFile || !photoTitle.trim()}
                  className="w-full bg-black hover:bg-[#95A5A6] text-white"
                >
                  Submit Photo
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>

      {/* Photo Gallery */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-black">Contest Entries</h3>
        {topSubmissions.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topSubmissions.map((submission) => (
              <Card key={submission.id} className="overflow-hidden border-2 border-[#95A5A6]/20 hover:border-black transition-all duration-300 hover:shadow-xl">
                <div className="aspect-square relative">
                  <img 
                    src={submission.imageUrl} 
                    alt={submission.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-black/80 text-white">
                      #{topSubmissions.indexOf(submission) + 1}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={submission.authorAvatar} />
                        <AvatarFallback className="bg-[#95A5A6] text-black text-xs">
                          {submission.author.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-black text-sm">{submission.title}</h4>
                        <p className="text-xs text-[#95A5A6]">by {submission.author}</p>
                      </div>
                    </div>
                  </div>
                  
                  {submission.description && (
                    <p className="text-sm text-[#95A5A6] mb-3 line-clamp-2">{submission.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onVotePhoto(submission.id)}
                      className="border-[#95A5A6] text-black hover:bg-black hover:text-white transition-colors duration-200"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {submission.votes}
                    </Button>
                    <span className="text-xs text-[#95A5A6]">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Camera className="h-12 w-12 text-[#95A5A6] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-black mb-2">No Submissions Yet</h3>
            <p className="text-[#95A5A6]">Be the first to submit a photo!</p>
          </div>
        )}
      </div>
    </div>
  );
};
