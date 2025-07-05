
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Send, Users, CheckCircle, XCircle } from 'lucide-react';

interface EmailResult {
  email: string;
  success: boolean;
  error?: string;
  messageId?: string;
}

interface BulkEmailResults {
  success: boolean;
  total: number;
  successful: number;
  failed: number;
  results: EmailResult[];
  error?: string;
}

const BulkEmailSender = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [fromName, setFromName] = useState('Raw Smith Coffee');
  const [isSending, setIsSending] = useState(false);
  const [results, setResults] = useState<BulkEmailResults | null>(null);

  const handleSendEmails = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }

    if (!fromName.trim()) {
      toast.error('Please provide a sender name');
      return;
    }

    setIsSending(true);
    setResults(null);

    try {
      console.log('Sending bulk email request...');
      
      const { data, error } = await supabase.functions.invoke('send-bulk-email', {
        body: {
          subject: subject.trim(),
          message: message.trim(),
          fromName: fromName.trim()
        }
      });

      if (error) {
        console.error('Function invocation error:', error);
        throw new Error(error.message || 'Failed to invoke email function');
      }

      console.log('Bulk email response:', data);
      setResults(data as BulkEmailResults);

      if (data?.success) {
        toast.success(`Emails sent! ${data.successful} successful, ${data.failed} failed`);
        // Clear form after successful send
        setSubject('');
        setMessage('');
      } else {
        toast.error(data?.error || 'Failed to send emails');
      }

    } catch (error: any) {
      console.error('Error sending bulk emails:', error);
      toast.error('Failed to send emails: ' + (error.message || 'Unknown error'));
      setResults({
        success: false,
        total: 0,
        successful: 0,
        failed: 0,
        results: [],
        error: error.message || 'Unknown error'
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Email to All Users
          </CardTitle>
          <CardDescription>
            Send a personalized email to all registered users in your loyalty program
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fromName">From Name</Label>
            <Input
              id="fromName"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              placeholder="Raw Smith Coffee"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Special announcement from Raw Smith Coffee"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hello {firstName}! We have exciting news to share..."
              rows={8}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">
              Use {'{firstName}'} to personalize the message with each user's first name
            </p>
          </div>

          <Button 
            onClick={handleSendEmails} 
            disabled={isSending || !subject.trim() || !message.trim() || !fromName.trim()}
            className="w-full"
          >
            {isSending ? (
              <>
                <Mail className="h-4 w-4 mr-2 animate-spin" />
                Sending Emails...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email to All Users
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Email Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-muted rounded-lg border">
                <div className="text-2xl font-bold text-foreground">{results.total}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">{results.successful}</div>
                <div className="text-sm text-green-600 dark:text-green-500">Successful</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                <div className="text-2xl font-bold text-red-700 dark:text-red-400">{results.failed}</div>
                <div className="text-sm text-red-600 dark:text-red-500">Failed</div>
              </div>
            </div>

            {results.results && results.results.length > 0 && (
              <div className="max-h-64 overflow-y-auto">
                <h4 className="font-semibold mb-2">Detailed Results:</h4>
                <div className="space-y-1">
                  {results.results.map((result: EmailResult, index: number) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-2 p-2 rounded text-sm border ${
                        result.success 
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700' 
                          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700'
                      }`}
                    >
                      {result.success ? (
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 flex-shrink-0" />
                      )}
                      <span className="font-mono text-xs flex-1 truncate" title={result.email}>
                        {result.email}
                      </span>
                      {!result.success && result.error && (
                        <span className="text-xs text-muted-foreground">- {result.error}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkEmailSender;
