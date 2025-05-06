
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
  if (!userId || typeof pointAmount !== 'number' || isNaN(pointAmount)) {
    return { error: new Error('Invalid user ID or point amount') };
  }

  // Sanitize input - ensure pointAmount is a positive number
  const sanitizedPointAmount = Math.max(0, pointAmount);
  
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
  const newPoints = profile.current_points + sanitizedPointAmount;
  const newVisits = sanitizedPointAmount > 0 ? profile.visits + 1 : profile.visits;
  
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
  if (!userId || typeof pointAmount !== 'number' || isNaN(pointAmount)) {
    return { error: new Error('Invalid user ID or point amount') };
  }

  // Sanitize input - ensure pointAmount is a positive number
  const sanitizedPointAmount = Math.max(0, pointAmount);
  
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
  const newPoints = Math.max(0, profile.current_points - sanitizedPointAmount);
  
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

// New helper function for retrieving community goal progress
export async function getCommunityGoalProgress(goalId: string): Promise<{current: number, target: number}> {
  const { data, error } = await supabase
    .from('community_goals')
    .select('current_points, target_points')
    .eq('id', goalId)
    .single();
    
  if (error) {
    console.error('Error getting community goal progress:', error);
    return { current: 0, target: 0 };
  }
  
  return {
    current: data.current_points || 0,
    target: data.target_points || 0
  };
}

// Helper function to contribute to a community goal
export async function contributeToGoal(userId: string, goalId: string, pointAmount: number) {
  if (!userId || !goalId || typeof pointAmount !== 'number' || pointAmount <= 0) {
    return { error: new Error('Invalid parameters') };
  }
  
  // First check if the user has enough points
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('current_points')
    .eq('id', userId)
    .single();
    
  if (profileError || !profile) {
    return { error: profileError || new Error('User not found') };
  }
  
  if (profile.current_points < pointAmount) {
    return { error: new Error('Not enough points to contribute') };
  }
  
  // Begin transaction (using supabase functions)
  const { error: transactionError } = await supabase
    .rpc('contribute_to_goal', {
      p_user_id: userId,
      p_goal_id: goalId,
      p_point_amount: pointAmount
    });
    
  if (transactionError) {
    return { error: transactionError };
  }
  
  return { error: null };
}
