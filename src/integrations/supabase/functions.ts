
// Helper functions for Supabase database interaction

import { supabase } from './client';

// User Points & Visits
export async function getUserPoints(userId: string): Promise<number> {
  const { data } = await supabase
    .from('profiles')
    .select('current_points')
    .eq('id', userId)
    .single();
    
  return data?.current_points || 0;
}

export async function getUserVisits(userId: string): Promise<number> {
  const { data } = await supabase
    .from('profiles')
    .select('visits')
    .eq('id', userId)
    .single();
    
  return data?.visits || 0;
}

// Create helper functions to match the SQL functions we created
export async function incrementPoints(userId: string, pointAmount: number) {
  // Get current profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('current_points, visits')
    .eq('id', userId)
    .single();
  
  if (!profile) return { error: 'User not found' };
  
  // Calculate new values
  const newPoints = profile.current_points + pointAmount;
  const newVisits = pointAmount > 0 ? profile.visits + 1 : profile.visits;
  
  // Determine tier based on new points
  let newTier = 'bronze';
  if (newPoints >= 550) {
    newTier = 'gold';
  } else if (newPoints >= 200) {
    newTier = 'silver';
  }
  
  // Update profile
  const { error } = await supabase
    .from('profiles')
    .update({
      current_points: newPoints,
      visits: newVisits,
      membership_tier: newTier,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
    
  return { error };
}

export async function decrementPoints(userId: string, pointAmount: number) {
  // Get current profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('current_points')
    .eq('id', userId)
    .single();
  
  if (!profile) return { error: 'User not found' };
  
  // Calculate new points (never below 0)
  const newPoints = Math.max(0, profile.current_points - pointAmount);
  
  // Update profile
  const { error } = await supabase
    .from('profiles')
    .update({
      current_points: newPoints,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
    
  return { error };
}
