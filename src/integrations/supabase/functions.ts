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

// Create helper functions for community goal contributions
export async function contributeToGoal(userId: string, goalId: string, points: number) {
  if (!userId || !goalId || typeof points !== 'number' || isNaN(points) || points <= 0) {
    return { error: new Error('Invalid parameters for contribution') };
  }

  // First, check if user has enough points
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('current_points')
    .eq('id', userId)
    .single();
  
  if (profileError || !profile) {
    console.error('Error fetching user profile:', profileError);
    return { error: profileError || new Error('User not found') };
  }
  
  if (profile.current_points < points) {
    return { error: new Error('Not enough points to contribute') };
  }
  
  // Create a transaction for the contribution
  const { error: transactionError } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      transaction_type: 'redeem',
      points: points,
      notes: `Contributed to community goal`,
      community_goal_id: goalId
    });
    
  if (transactionError) {
    console.error('Error creating transaction record:', transactionError);
    return { error: transactionError };
  }
  
  // Update community goal points
  const { error: updateGoalError } = await supabase
    .rpc('update_community_goal_points', { 
      p_goal_id: goalId, 
      p_amount: points 
    });
  
  if (updateGoalError) {
    console.error('Error updating community goal points:', updateGoalError);
    return { error: updateGoalError };
  }
  
  // Deduct points from user
  const { error: deductPointsError } = await decrementPoints(userId, points);
  
  if (deductPointsError) {
    console.error('Error deducting points:', deductPointsError);
    return { error: deductPointsError };
  }
  
  return { success: true };
}
