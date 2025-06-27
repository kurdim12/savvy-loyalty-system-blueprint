
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Mail, Send, Users, CheckCircle, XCircle } from 'lucide-react';

const BulkEmailSender = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [fromName, setFromName] = useState('Raw Smith Coffee');
  const [isSending, setIsSending] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSendEmails = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in both subject and message');
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
        throw error;
      }

      console.log('Bulk email response:', data);
      setResults(data);

      if (data.success) {
        toast.success(`Emails sent! ${data.successful} successful, ${data.failed} failed`);
      } else {
        toast.error(data.error || 'Failed to send emails');
      }

    } catch (error: any) {
      console.error('Error sending bulk emails:', error);
      toast.error('Failed to send emails: ' + (error.message || 'Unknown error'));
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
            <p className="text-sm text-gray-500">
              Use {'{firstName}'} to personalize the message with each user's first name
            </p>
          </div>

          <Button 
            onClick={handleSendEmails} 
            disabled={isSending || !subject.trim() || !message.trim()}
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
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{results.total}</div>
                <div className="text-sm text-blue-600">Total Users</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{results.successful}</div>
                <div className="text-sm text-green-600">Successful</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{results.failed}</div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
            </div>

            {results.results && results.results.length > 0 && (
              <div className="max-h-64 overflow-y-auto">
                <h4 className="font-semibold mb-2">Detailed Results:</h4>
                <div className="space-y-1">
                  {results.results.map((result: any, index: number) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-2 p-2 rounded text-sm ${
                        result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {result.success ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      <span className="font-mono">{result.email}</span>
                      {!result.success && result.error && (
                        <span className="text-xs">- {result.error}</span>
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
