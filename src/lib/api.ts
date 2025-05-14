
import { supabase } from '@/integrations/supabase/client';

export const tierPoints = { bronze: 0, silver: 200, gold: 550 } as const;
export type Tier = keyof typeof tierPoints;

// Events API functions
export async function createEvent(title: string, body: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('events')
    .insert({
      title,
      body,
      author: user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select(`
      id,
      title,
      body,
      created_at,
      author,
      profiles:author (first_name, last_name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map(event => ({
    ...event,
    author_name: event.profiles ? 
      `${event.profiles.first_name || ''} ${event.profiles.last_name || ''}`.trim() : 
      'Admin'
  }));
}

// Threads API functions
export async function createThread(title: string, firstMessage: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  // First create the thread
  const { data: threadData, error: threadError } = await supabase
    .from('threads')
    .insert({ 
      title, 
      user_id: user.id 
    })
    .select()
    .single();
  
  if (threadError) throw threadError;
  
  // Then add the first message
  const { error: messageError } = await supabase
    .from('messages')
    .insert({ 
      body: firstMessage, 
      thread_id: threadData.id,
      user_id: user.id
    });
  
  if (messageError) throw messageError;
  
  return threadData;
}

export async function getThreads() {
  const { data, error } = await supabase
    .from('threads')
    .select(`
      id,
      title,
      created_at,
      user_id,
      profiles:user_id (first_name, last_name)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Get message counts for each thread
  const threadsWithCounts = await Promise.all(data.map(async (thread) => {
    const { count, error: countError } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('thread_id', thread.id);
      
    return {
      ...thread,
      user_name: thread.profiles ? 
        `${thread.profiles.first_name || ''} ${thread.profiles.last_name || ''}`.trim() : 
        'Anonymous',
      message_count: count || 0
    };
  }));
  
  return threadsWithCounts;
}

export async function getThread(threadId: string) {
  const { data, error } = await supabase
    .from('threads')
    .select(`
      id,
      title,
      created_at,
      user_id,
      profiles:user_id (first_name, last_name)
    `)
    .eq('id', threadId)
    .single();
  
  if (error) throw error;
  
  return {
    ...data,
    user_name: data.profiles ? 
      `${data.profiles.first_name || ''} ${data.profiles.last_name || ''}`.trim() : 
      'Anonymous'
  };
}

export async function getMessages(threadId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      id,
      body,
      created_at,
      user_id,
      profiles:user_id (first_name, last_name)
    `)
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  
  return data.map(message => ({
    ...message,
    user_name: message.profiles ? 
      `${message.profiles.first_name || ''} ${message.profiles.last_name || ''}`.trim() : 
      'Anonymous'
  }));
}

export async function sendMessage(threadId: string, message: string) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('messages')
    .insert({ 
      body: message, 
      thread_id: threadId,
      user_id: user.id
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
}

export async function subscribeToMessages(threadId: string, callback: (message: any) => void) {
  return supabase
    .channel(`thread-${threadId}`)
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `thread_id=eq.${threadId}`
      },
      payload => {
        callback(payload.new);
      }
    )
    .subscribe();
}
