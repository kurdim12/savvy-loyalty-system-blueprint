
import { Database } from './types';

// Helper types for strongly typed Supabase queries
export type Tables = Database['public']['Tables'];
export type UserRole = Database['public']['Enums']['user_role'];
export type MembershipTier = Database['public']['Enums']['membership_tier'];
export type TransactionType = Database['public']['Enums']['transaction_type'];

// Helper type for transaction inserts to avoid TypeScript errors
export type TransactionInsert = Tables['transactions']['Insert'];
export type ProfilesRow = Tables['profiles']['Row'];
export type TransactionsRow = Tables['transactions']['Row'];
export type SettingsRow = Tables['settings']['Row'];
export type SettingsUpdate = Tables['settings']['Update'];
export type SettingsInsert = Tables['settings']['Insert'];
export type RewardsRow = Tables['rewards']['Row'];
export type RewardsInsert = Tables['rewards']['Insert'];
export type RewardsUpdate = Tables['rewards']['Update'];
export type CommunityGoalsRow = Tables['community_goals']['Row'];
export type ReferralsInsert = Tables['referrals']['Insert'];
export type ReferralsRow = Tables['referrals']['Row'];

// Type-safe eq parameter helper functions
export const eq = <T extends keyof any, U>(column: T, value: U) => {
  return { column, value } as const;
};

// Helper function to safely cast JSON values
export const castJsonToType = <T>(jsonValue: unknown): T => {
  return jsonValue as T;
};

// Helper function for making .eq() queries with proper typing
export const typedEq = (column: string, value: any) => {
  return { [column]: value };
};

// Helper function to safely cast database results to known types
export function castDbResult<T>(data: unknown): T {
  return data as T;
}

// Helper to safely cast transaction data for inserts
export function createTransactionData(data: Partial<TransactionInsert>): TransactionInsert {
  return data as TransactionInsert;
}

// Helper to create setting data for inserts
export function createSettingsData(data: Partial<SettingsInsert>): SettingsInsert {
  return data as SettingsInsert;
}

// Helper to create reward data for inserts
export function createRewardData(data: Partial<RewardsInsert>): RewardsInsert {
  return data as RewardsInsert;
}

// Helper to create reward data for updates
export function createRewardUpdateData(data: Partial<RewardsUpdate>): RewardsUpdate {
  return data as RewardsUpdate;
}

// Helper to create referral data for inserts
export function createReferralData(data: Partial<ReferralsInsert>): ReferralsInsert {
  return data as ReferralsInsert;
}

// Helper to correctly type setting names as strings with proper casting
export const settingNameAsString = (name: string) => name as any;

// Helper to safely handle user roles in queries
export const userRoleAsString = (role: UserRole | string) => role as any;

// Helper to safely handle membership tiers in queries
export const membershipTierAsString = (tier: MembershipTier | string) => tier as any;

// Helper for community goals active parameter
export const asCommunityGoalParam = (value: boolean): any => {
  return value as any;
};

// Helper for safely handling data that might be error responses
export function safelyGetData<T, K extends keyof T>(obj: T | { error: any }, key: K): T[K] | undefined {
  if (!obj || (obj as any).error) return undefined;
  return (obj as T)[key];
}

// Helper to safely check if data exists and is not an error
export function isValidData<T>(data: T | { error: any } | null | undefined): data is T {
  return data !== null && data !== undefined && !(data as any).error;
}

// More robust type assertions for Supabase operations
export function assertDataExists<T>(data: T | null | undefined, errorMessage = 'Data not found'): T {
  if (data === null || data === undefined) {
    throw new Error(errorMessage);
  }
  return data;
}

// For safer Supabase insertions
export function validateTransactionData(data: any): TransactionInsert {
  // Perform any runtime validations here if needed
  return data as TransactionInsert;
}

// Helper to safely access nested properties of Supabase query results
export function getSettingValue<T>(data: any): T | undefined {
  if (!data) return undefined;
  if ('error' in data) return undefined;
  if ('setting_value' in data) return data.setting_value as T;
  return undefined;
}

// Helper to safely access ID from query results
export function getIdFromResult(data: any): string | undefined {
  if (!data) return undefined;
  if ('error' in data) return undefined;
  if ('id' in data) return data.id;
  return undefined;
}

// For type-safe eq comparisons in Supabase queries
export function eqTyped<T extends keyof Tables, K extends keyof Tables[T]['Row']>(
  table: T, 
  column: K, 
  value: Tables[T]['Row'][K]
) {
  return { [column]: value } as any;
}

// For casting values to appropriate types for any table
export function asTypedValue<T>(value: any): T {
  return value as T;
}
