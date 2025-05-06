
import { Database } from "@/integrations/supabase/types";

// Type for a community goal row from the database
export interface CommunityGoalRow {
  id: string;
  name: string;
  description: string | null;
  current_points: number;
  target_points: number;
  starts_at: string;
  expires_at: string | null;
  icon: string | null;
  reward_description: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Type for creating a new community goal
export interface CreateCommunityGoalInput {
  name: string;
  description: string;
  target_points: number;
  expires_at: string | null;
  icon: string;
  reward_description: string;
  active: boolean;
}

// Type for updating an existing community goal
export interface UpdateCommunityGoalInput extends Partial<CreateCommunityGoalInput> {
  id: string;
}

// Type for contributing to a goal
export interface ContributeToGoalInput {
  userId: string;
  goalId: string;
  points: number;
}

// Type for the membership tier
export type MembershipTier = Database["public"]["Enums"]["membership_tier"];
