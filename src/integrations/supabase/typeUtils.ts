
import { Database } from './types';
import { PostgrestSingleResponse, PostgrestError } from '@supabase/supabase-js';
import { Json } from './types';

// Basic table rows
export type ProfilesRow = Database['public']['Tables']['profiles']['Row'];
export type TransactionsRow = Database['public']['Tables']['transactions']['Row'];
export type RewardsRow = Database['public']['Tables']['rewards']['Row'];
export type SettingsRow = Database['public']['Tables']['settings']['Row'];
export type CommunityGoalRow = Database['public']['Tables']['community_goals']['Row'];
export type ReferralsRow = Database['public']['Tables']['referrals']['Row'];

// Define enums from the database
export type UserRole = Database['public']['Enums']['user_role'];
export type MembershipTier = Database['public']['Enums']['membership_tier'];
export type TransactionType = 'earn' | 'redeem';

// Type for transaction inserts
export type TransactionInsert = Omit<TransactionsRow, 'id' | 'created_at'>;

// Typed helpers for casting database results
export function castDbResult<T>(data: any): T {
  return data as T;
}

// Helper for casting parameters to avoid type issues
export function asParam<T>(value: T): T {
  return value;
}

// Type-safe equality check for database queries
export function eqTyped<T>(value: T): T {
  return value;
}

// Helper for safely checking JSON values
export function castJsonToType<T>(json: Json | null | undefined): T | null {
  if (!json) return null;
  return json as unknown as T;
}

// Helper to validate if data exists and is not an error
export function isValidData(data: any): boolean {
  return data !== null && 
         data !== undefined && 
         !data.error && 
         typeof data === 'object';
}

// Helper to safely extract ID from query result
export function getIdFromResult(data: any): string | null {
  if (!data || !data.id) return null;
  return data.id as string;
}

// Helper to safely get setting value with proper typing
export function getSettingValue<T>(data: any): T | null {
  if (!data || !data.setting_value) return null;
  return data.setting_value as T;
}

// Helper for handling enum values in database queries
export function settingNameAsString(name: string): string {
  return name;
}

// Helper for user roles
export function userRoleAsString(role: string | null | undefined): 'admin' | 'customer' | undefined {
  if (role === 'admin') return 'admin';
  if (role === 'customer') return 'customer';
  return undefined;
}

// Helper for membership tiers
export function membershipTierAsString(tier: MembershipTier | 'all' | null | undefined): MembershipTier | undefined {
  if (tier === 'bronze' || tier === 'silver' || tier === 'gold') return tier;
  return undefined;
}

// Helper for safely checking and parsing database query results
export function safeDbResult<T>(response: PostgrestSingleResponse<any>): T | null {
  if (response.error) {
    console.error('Database error:', response.error);
    return null;
  }
  return response.data as T;
}

// Helper for creating typed data for referrals
export function createReferralData(data: Partial<ReferralsRow>): Partial<ReferralsRow> {
  return {
    id: data.id || undefined,
    referrer_id: data.referrer_id || '',
    referee_id: data.referee_id || '',
    bonus_points: data.bonus_points || 0,
    created_at: data.created_at || new Date().toISOString(),
    completed: data.completed || false,
    completed_at: data.completed_at
  };
}

// Helper for creating typed data for transactions
export function createTransactionData(data: Partial<TransactionsRow>): Partial<TransactionsRow> {
  return {
    id: data.id || undefined,
    user_id: data.user_id || '',
    transaction_type: data.transaction_type || 'earn',
    points: data.points || 0,
    notes: data.notes || undefined,
    reward_id: data.reward_id || undefined,
    created_at: data.created_at || new Date().toISOString(),
  };
}

// Helper for validating transaction data
export function validateTransactionData(data: Partial<TransactionsRow>): Partial<TransactionsRow> {
  if (!data.user_id) {
    throw new Error('User ID is required');
  }
  if (!data.points || data.points <= 0) {
    throw new Error('Points must be greater than 0');
  }
  if (!data.transaction_type) {
    throw new Error('Transaction type is required');
  }
  
  return createTransactionData(data);
}

// Helper for creating settings data
export function createSettingsData(data: Partial<SettingsRow>): Partial<SettingsRow> {
  return {
    id: data.id || undefined,
    setting_name: data.setting_name || '',
    setting_value: data.setting_value || {},
    updated_at: data.updated_at || new Date().toISOString(),
  };
}

// Helper for rewards data
export function createRewardData(data: Partial<RewardsRow>): Partial<RewardsRow> {
  return {
    id: data.id || undefined,
    name: data.name || '',
    description: data.description || undefined,
    points_required: data.points_required || 0,
    active: data.active !== undefined ? data.active : true,
    inventory: data.inventory !== undefined ? data.inventory : null,
    membership_required: data.membership_required || undefined,
    category: data.category || undefined,
    cupping_score_min: data.cupping_score_min || undefined,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
  };
}

// Helper for updating reward data
export function createRewardUpdateData(data: Partial<RewardsRow>): Partial<RewardsRow> {
  const updateData: Partial<RewardsRow> = {};
  
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.points_required !== undefined) updateData.points_required = data.points_required;
  if (data.active !== undefined) updateData.active = data.active;
  if (data.inventory !== undefined) updateData.inventory = data.inventory;
  if (data.membership_required !== undefined) updateData.membership_required = data.membership_required;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.cupping_score_min !== undefined) updateData.cupping_score_min = data.cupping_score_min;
  if (data.updated_at !== undefined) updateData.updated_at = data.updated_at;
  
  return updateData;
}

// Helper for converting values to typed parameters for database queries
export function asTypedValue<T>(value: T): T {
  return value;
}

// Helper for community goals data
export function createCommunityGoalData(data: Partial<CommunityGoalRow>): Partial<CommunityGoalRow> {
  return {
    id: data.id || undefined,
    name: data.name || '',
    description: data.description || '',
    target_points: data.target_points || 0,
    current_points: data.current_points || 0,
    reward_description: data.reward_description || '',
    icon: data.icon || undefined,
    active: data.active !== undefined ? asParam(data.active) : true,
    expires_at: data.expires_at || undefined,
    created_at: data.created_at || new Date().toISOString(),
    starts_at: data.starts_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
  };
}
