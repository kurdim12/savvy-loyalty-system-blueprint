
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { createCommunityGoal } from '@/services/communityGoals';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  targetPoints: z.number().min(100, 'Target points must be at least 100'),
  expiresAt: z.date().optional(),
  icon: z.string().min(1, 'Icon is required'),
  rewardDescription: z.string().min(5, 'Reward description must be at least 5 characters'),
  active: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

const ICON_OPTIONS = [
  { value: 'coffee', label: 'Coffee Cup' },
  { value: 'gift', label: 'Gift Box' },
  { value: 'star', label: 'Star' },
  { value: 'award', label: 'Award' },
  { value: 'heart', label: 'Heart' },
];

export default function NewGoalForm() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      targetPoints: 1000,
      icon: 'coffee',
      rewardDescription: '',
      active: true,
    },
  });

  const createGoalMutation = useMutation({
    mutationFn: createCommunityGoal,
    onSuccess: () => {
      toast.success('Community goal created successfully!');
      form.reset();
      navigate('/admin/community-goals');
    },
    onError: (error: any) => {
      toast.error(`Error creating community goal: ${error.message}`);
      setSubmitting(false);
    },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    
    // Convert the form data to match the CreateCommunityGoalInput type
    createGoalMutation.mutate({
      name: data.name,
      description: data.description,
      target_points: data.targetPoints,
      expires_at: data.expiresAt ? data.expiresAt.toISOString() : null,
      icon: data.icon,
      reward_description: data.rewardDescription,
      active: data.active,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Community Goal</CardTitle>
        <CardDescription>
          Define a new community goal for your members to contribute to.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Free Coffee Day" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="targetPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Points</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={100}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Help us reach our goal for a community-wide free coffee day!"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                        {...field}
                      >
                        {ICON_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expiresAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiry Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full flex justify-between items-center text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>No expiry date</span>
                            )}
                            <CalendarIcon className="h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="rewardDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reward Description</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Free coffee for all loyalty members!"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Enable this goal for immediate display on the dashboard
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
        
            <CardFooter className="flex justify-between px-0">
              <Button
                type="button" 
                variant="outline"
                onClick={() => navigate('/admin/community-goals')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-amber-700 hover:bg-amber-800"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Goal'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
