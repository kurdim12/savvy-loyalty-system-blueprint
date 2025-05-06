
// Helper functions for Supabase database interaction

import { supabase } from './client';
import type { Database } from './types';

// User Points & Visits
export async function getUserPoints(userId: string): Promise<number> {
  const { data, error } = await supabase.rpc('get_user_points', { user_id: userId });
  
  if (error) {
    console.error('Error getting user points:', error);
    return 0;
  }
  
  return data || 0;
}

export async function getUserVisits(userId: string): Promise<number> {
  const { data, error } = await supabase.rpc('get_user_visits', { user_id: userId });
  
  if (error) {
    console.error('Error getting user visits:', error);
    return 0;
  }
  
  return data || 0;
}

// Create helper functions to match the SQL functions we created
export async function incrementPoints(userId: string, pointAmount: number) {
  // Get current profile data
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('current_points, visits')
    .eq('id', userId)
    .single();
  
  if (fetchError || !profile) {
    console.error('Error fetching profile:', fetchError);
    return { error: fetchError || new Error('User not found') };
  }
  
  // Calculate new values
  const newPoints = profile.current_points + pointAmount;
  const newVisits = pointAmount > 0 ? profile.visits + 1 : profile.visits;
  
  // Determine tier based on new points using the correct type
  let newTier: Database['public']['Enums']['membership_tier'] = 'bronze';
  if (newPoints >= 550) {
    newTier = 'gold';
  } else if (newPoints >= 200) {
    newTier = 'silver';
  }
  
  // Update profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      current_points: newPoints,
      visits: newVisits,
      membership_tier: newTier,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
    
  return { error: updateError };
}

export async function decrementPoints(userId: string, pointAmount: number) {
  // Get current profile data
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('current_points')
    .eq('id', userId)
    .single();
  
  if (fetchError || !profile) {
    console.error('Error fetching profile:', fetchError);
    return { error: fetchError || new Error('User not found') };
  }
  
  // Calculate new points (never below 0)
  const newPoints = Math.max(0, profile.current_points - pointAmount);
  
  // Update profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      current_points: newPoints,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
    
  return { error: updateError };
}
