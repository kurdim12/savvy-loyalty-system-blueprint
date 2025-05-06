
import { supabase } from "@/integrations/supabase/client";
import type { CommunityGoalRow, CreateCommunityGoalInput, UpdateCommunityGoalInput, ContributeToGoalInput } from "@/types/communityGoals";

/**
 * Fetch all community goals
 * @returns Promise with community goals array
 */
export async function fetchCommunityGoals(): Promise<CommunityGoalRow[]> {
  const { data, error } = await supabase
    .from('community_goals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching community goals:', error);
    throw error;
  }

  return data as CommunityGoalRow[];
}

/**
 * Fetch active community goals
 * @returns Promise with active community goals array
 */
export async function fetchActiveCommunityGoals(): Promise<CommunityGoalRow[]> {
  const { data, error } = await supabase
    .from('community_goals')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching active community goals:', error);
    throw error;
  }

  return data as CommunityGoalRow[];
}

/**
 * Fetch a single community goal by ID
 * @param id - The ID of the community goal
 * @returns Promise with the community goal or null
 */
export async function fetchCommunityGoalById(id: string): Promise<CommunityGoalRow | null> {
  const { data, error } = await supabase
    .from('community_goals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No data found
    }
    console.error(`Error fetching community goal with id ${id}:`, error);
    throw error;
  }

  return data as CommunityGoalRow;
}

/**
 * Create a new community goal
 * @param goal - The community goal data
 * @returns Promise with the created community goal
 */
export async function createCommunityGoal(goal: CreateCommunityGoalInput): Promise<CommunityGoalRow> {
  const goalData = {
    name: goal.name,
    description: goal.description,
    target_points: goal.target_points,
    expires_at: goal.expires_at ? new Date(goal.expires_at).toISOString() : null,
    icon: goal.icon,
    reward_description: goal.reward_description,
    active: goal.active,
    current_points: 0,
    starts_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('community_goals')
    .insert(goalData)
    .select()
    .single();

  if (error) {
    console.error('Error creating community goal:', error);
    throw error;
  }

  return data as CommunityGoalRow;
}

/**
 * Update an existing community goal
 * @param goal - The community goal data with ID
 * @returns Promise with the updated community goal
 */
export async function updateCommunityGoal(goal: UpdateCommunityGoalInput): Promise<CommunityGoalRow> {
  const goalData = {
    ...(goal.name && { name: goal.name }),
    ...(goal.description && { description: goal.description }),
    ...(goal.target_points && { target_points: goal.target_points }),
    ...(goal.expires_at !== undefined && { expires_at: goal.expires_at ? new Date(goal.expires_at).toISOString() : null }),
    ...(goal.icon && { icon: goal.icon }),
    ...(goal.reward_description && { reward_description: goal.reward_description }),
    ...(goal.active !== undefined && { active: goal.active }),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('community_goals')
    .update(goalData)
    .eq('id', goal.id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating community goal with id ${goal.id}:`, error);
    throw error;
  }

  return data as CommunityGoalRow;
}

/**
 * Delete a community goal by ID
 * @param id - The ID of the community goal to delete
 * @returns Promise with success status
 */
export async function deleteCommunityGoal(id: string): Promise<void> {
  const { error } = await supabase
    .from('community_goals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting community goal with id ${id}:`, error);
    throw error;
  }
}

/**
 * Contribute points to a community goal
 * @param contribution - Object containing userId, goalId, and points
 * @returns Promise with success status
 */
export async function contributeToGoal({ userId, goalId, points }: ContributeToGoalInput): Promise<void> {
  if (!userId || !goalId || typeof points !== 'number' || points <= 0) {
    throw new Error('Invalid parameters for goal contribution');
  }
  
  // First check if the user has enough points
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('current_points')
    .eq('id', userId)
    .single();
    
  if (profileError || !profile) {
    throw profileError || new Error('User not found');
  }
  
  if (profile.current_points < points) {
    throw new Error('Not enough points to contribute');
  }
  
  // Use a transaction pattern to ensure data consistency
  try {
    // Update the user's points first - decrement
    const { error: decrementError } = await supabase.rpc('decrement_points', {
      user_id: userId,
      point_amount: points
    });
    
    if (decrementError) {
      throw decrementError;
    }
    
    // First get current points of the goal
    const { data: goalData, error: goalError } = await supabase
      .from('community_goals')
      .select('current_points')
      .eq('id', goalId)
      .single();
      
    if (goalError) {
      // If there was an error, attempt to restore the user's points
      await supabase.rpc('increment_points', {
        user_id: userId,
        point_amount: points
      });
      throw goalError;
    }
    
    // Then update with new point total
    const currentPoints = goalData.current_points || 0;
    const newPoints = currentPoints + points;
    
    const { error: updateGoalError } = await supabase
      .from('community_goals')
      .update({ current_points: newPoints })
      .eq('id', goalId);
    
    if (updateGoalError) {
      // If there was an error, attempt to restore the user's points
      await supabase.rpc('increment_points', {
        user_id: userId,
        point_amount: points
      });
      throw updateGoalError;
    }

    // Create a transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        points: points,
        transaction_type: 'redeem',
        notes: `Contributed ${points} points to community goal`,
        community_event_id: goalId
      });
    
    if (transactionError) {
      console.error('Error recording transaction:', transactionError);
      // We don't revert the points here as the contribution was successful
    }
  } catch (error) {
    console.error('Error contributing to goal:', error);
    throw new Error('Failed to contribute to goal');
  }
}

/**
 * Get the progress of a community goal
 * @param goalId - The ID of the community goal
 * @returns Promise with current and target points
 */
export async function getCommunityGoalProgress(goalId: string): Promise<{current: number, target: number}> {
  const goal = await fetchCommunityGoalById(goalId);
  
  if (!goal) {
    return { current: 0, target: 0 };
  }
  
  return {
    current: goal.current_points || 0,
    target: goal.target_points || 0
  };
}
