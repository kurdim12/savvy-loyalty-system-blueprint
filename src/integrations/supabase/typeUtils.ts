
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

// Type-safe eq parameter helper functions
export const eq = <T extends keyof any, U>(column: T, value: U) => {
  return { column, value } as const;
};

// Helper function to safely cast JSON values
export const castJsonToType = <T>(jsonValue: unknown): T => {
  return jsonValue as T;
};
