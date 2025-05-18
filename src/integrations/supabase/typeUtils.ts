
import { Database } from './types';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

// Basic table rows
export type ProfilesRow = Database['public']['Tables']['profiles']['Row'];
export type TransactionsRow = Database['public']['Tables']['transactions']['Row'];
export type RewardsRow = Database['public']['Tables']['rewards']['Row'];
export type SettingsRow = Database['public']['Tables']['settings']['Row'];
export type CommunityGoalRow = Database['public']['Tables']['community_goals']['Row'];
export type ReferralsRow = Database['public']['Tables']['referrals']['Row'];

// Typed helpers for casting database results
export function castDbResult<T>(data: any): T {
  return data as T;
}

// Helper for casting parameters to avoid type issues
export function asParam<T>(value: T): T {
  return value;
}

// Helper for creating typed data for database inserts
export function createReferralData(data: Partial<ReferralsRow>): Partial<ReferralsRow> {
  return {
    id: data.id || undefined,
    referrer_id: data.referrer_id || '',
    referee_id: data.referee_id || '',
    status: data.status || 'pending',
    created_at: data.created_at || new Date().toISOString(),
    converted_at: data.converted_at,
    bonus_points: data.bonus_points || 0,
  };
}

// Helper for settings transactions data
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

// Helper for settings data
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
    membership_required: data.membership_required || 'bronze',
    category: data.category || undefined,
    cupping_score_min: data.cupping_score_min || undefined,
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
  };
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
  };
}

// User role helper
export function userRoleAsString(role: string | null | undefined): 'admin' | 'user' | undefined {
  if (role === 'admin') return 'admin';
  if (role === 'user') return 'user';
  return undefined;
}

// Helper to safely check and parse database query results
export function safeDbResult<T>(response: PostgrestSingleResponse<any>): T | null {
  if (response.error) {
    console.error('Database error:', response.error);
    return null;
  }
  return response.data as T;
}
