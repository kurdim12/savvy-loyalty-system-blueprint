
// Helper functions for Supabase database interaction

import { supabase, requireAdmin, requireAuth } from './client';
import type { Database } from './types';

// User Points & Visits
export async function getUserPoints(userId: string): Promise<number> {
  // Only allow authenticated users to access this
  try {
    await requireAuth();
    
    const { data, error } = await supabase.rpc('get_user_points', { user_id: userId });
    
    if (error) {
      console.error('Error getting user points:', error);
      return 0;
    }
    
    return data || 0;
  } catch (error) {
    console.error('Authentication error getting user points:', error);
    return 0;
  }
}

export async function getUserVisits(userId: string): Promise<number> {
  // Only allow authenticated users to access this
  try {
    await requireAuth();
    
    const { data, error } = await supabase.rpc('get_user_visits', { user_id: userId });
    
    if (error) {
      console.error('Error getting user visits:', error);
      return 0;
    }
    
    return data || 0;
  } catch (error) {
    console.error('Authentication error getting user visits:', error);
    return 0;
  }
}

// Get the current rank thresholds from settings
async function getRankThresholds(): Promise<{silver: number, gold: number}> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('setting_value')
      .eq('setting_name', 'rank_thresholds')
      .single();
    
    if (error) {
      // Return defaults if not found or error
      return { silver: 200, gold: 550 };
    }
    
    return data.setting_value as {silver: number, gold: number};
  } catch (error) {
    // Return defaults on any error
    return { silver: 200, gold: 550 };
  }
}

// Create helper functions to match the SQL functions we created
export async function incrementPoints(userId: string, pointAmount: number) {
  // Only allow authenticated users to access this
  try {
    await requireAuth();
    
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
    
    // Get the rank thresholds from settings
    const rankThresholds = await getRankThresholds();
    
    // Calculate new values
    const newPoints = profile.current_points + sanitizedPointAmount;
    const newVisits = sanitizedPointAmount > 0 ? profile.visits + 1 : profile.visits;
    
    // Determine tier based on new points using the correct type and thresholds from settings
    let newTier: Database['public']['Enums']['membership_tier'] = 'bronze';
    if (newPoints >= rankThresholds.gold) {
      newTier = 'gold';
    } else if (newPoints >= rankThresholds.silver) {
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
  } catch (error) {
    console.error('Authentication error incrementing points:', error);
    return { error };
  }
}

export async function decrementPoints(userId: string, pointAmount: number) {
  // Only allow authenticated users to access this
  try {
    await requireAuth();
    
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
    
    // Get the rank thresholds from settings
    const rankThresholds = await getRankThresholds();
    
    // Update profile and possibly adjust membership tier
    let newTier: Database['public']['Enums']['membership_tier'] = 'bronze';
    if (newPoints >= rankThresholds.gold) {
      newTier = 'gold';
    } else if (newPoints >= rankThresholds.silver) {
      newTier = 'silver';
    }
    
    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        current_points: newPoints,
        membership_tier: newTier,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    return { error: updateError };
  } catch (error) {
    console.error('Authentication error decrementing points:', error);
    return { error };
  }
}

// Create helper functions for community goal contributions
export async function contributeToGoal(userId: string, goalId: string, points: number) {
  // Only allow authenticated users to access this
  try {
    await requireAuth();
    
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
  } catch (error) {
    console.error('Authentication error contributing to goal:', error);
    return { error };
  }
}

/**
 * Checks if a user has admin role
 * @param userId The user ID to check
 * @returns Boolean indicating if user is an admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (error || !data) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return data.role === 'admin';
  } catch (err) {
    console.error('Unexpected error checking admin status:', err);
    return false;
  }
}

/**
 * Direct method to verify admin credentials
 * @param email Admin email
 * @param password Admin password
 * @returns Success status and user data if successful
 */
export async function verifyAdminCredentials(email: string, password: string) {
  try {
    // First ensure we're logged out to avoid session conflicts
    await supabase.auth.signOut({ scope: 'global' });
    
    // Try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Authentication error:", error);
      return { success: false, error: error.message };
    }
    
    // Verify this user is actually an admin
    if (data.user) {
      const isAdmin = await isUserAdmin(data.user.id);
      
      if (!isAdmin) {
        // If not admin, sign them out immediately
        await supabase.auth.signOut();
        return { success: false, error: 'Not authorized as admin' };
      }
      
      return { success: true, user: data.user, session: data.session };
    }
    
    return { success: false, error: 'Authentication failed' };
  } catch (err) {
    console.error('Error during admin verification:', err);
    return { success: false, error: 'Authentication system error' };
  }
}

/**
 * Get discount rate based on membership tier
 */
export function getDiscountRate(tier: Database['public']['Enums']['membership_tier']): number {
  switch(tier) {
    case 'gold': return 25;
    case 'silver': return 15;
    case 'bronze': return 10;
    default: return 0;
  }
}

/**
 * Get all available drinks - user function
 */
export async function getDrinks() {
  try {
    await requireAuth();
    
    const { data, error } = await supabase
      .from('drinks')
      .select('*')
      .eq('active', true)
      .order('points_earned', { ascending: false });
    
    if (error) {
      console.error('Error fetching drinks:', error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error('Authentication error fetching drinks:', error);
    return { error };
  }
}

/**
 * Get all drinks - admin function
 */
export async function getAllDrinks() {
  try {
    await requireAdmin();
    
    const { data, error } = await supabase
      .from('drinks')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching all drinks:', error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error('Authentication error fetching all drinks:', error);
    return { error };
  }
}

/**
 * Update a drink - admin function
 */
export async function updateDrink(id: string, drinkData: any) {
  try {
    await requireAdmin();
    
    const { data, error } = await supabase
      .from('drinks')
      .update({
        name: drinkData.name,
        category: drinkData.category,
        points_earned: drinkData.points_earned,
        price: drinkData.price,
        active: drinkData.active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating drink:', error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error('Authentication error updating drink:', error);
    return { error };
  }
}

/**
 * Create a new drink - admin function
 */
export async function createDrink(drinkData: any) {
  try {
    await requireAdmin();
    
    const { data, error } = await supabase
      .from('drinks')
      .insert({
        name: drinkData.name,
        category: drinkData.category,
        points_earned: drinkData.points_earned,
        price: drinkData.price,
        active: drinkData.active || true
      });
    
    if (error) {
      console.error('Error creating drink:', error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error('Authentication error creating drink:', error);
    return { error };
  }
}

/**
 * Delete a drink - admin function
 */
export async function deleteDrink(id: string) {
  try {
    await requireAdmin();
    
    const { data, error } = await supabase
      .from('drinks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting drink:', error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error('Authentication error deleting drink:', error);
    return { error };
  }
}

/**
 * Helper function to calculate if a redemption would cause a rank downgrade
 */
export async function wouldCauseRankDowngrade(currentPoints: number, pointsToRedeem: number): Promise<{
  wouldDowngrade: boolean;
  currentTier: Database['public']['Enums']['membership_tier'];
  newTier: Database['public']['Enums']['membership_tier'];
}> {
  // Get the rank thresholds from settings
  const rankThresholds = await getRankThresholds();
  
  // Determine current tier
  let currentTier: Database['public']['Enums']['membership_tier'] = 'bronze';
  if (currentPoints >= rankThresholds.gold) {
    currentTier = 'gold';
  } else if (currentPoints >= rankThresholds.silver) {
    currentTier = 'silver';
  }
  
  // Calculate new tier after redemption
  const newPoints = Math.max(0, currentPoints - pointsToRedeem);
  let newTier: Database['public']['Enums']['membership_tier'] = 'bronze';
  if (newPoints >= rankThresholds.gold) {
    newTier = 'gold';
  } else if (newPoints >= rankThresholds.silver) {
    newTier = 'silver';
  }
  
  return {
    wouldDowngrade: currentTier !== newTier,
    currentTier,
    newTier
  };
}

// Admin-only API functions
/**
 * Get all users - admin only
 */
export async function getAllUsers() {
  try {
    await requireAdmin();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all users:', error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error('Authentication error fetching all users:', error);
    return { error };
  }
}

/**
 * Delete a user - admin only
 */
export async function deleteUser(userId: string) {
  try {
    await requireAdmin();
    
    // This will delete the auth.user as well due to cascade
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    
    if (error) {
      console.error('Error deleting user:', error);
      return { error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Authentication error deleting user:', error);
    return { error: error instanceof Error ? error : new Error('Unknown error') };
  }
}
