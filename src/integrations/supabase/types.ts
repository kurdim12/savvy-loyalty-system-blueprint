export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      community_goals: {
        Row: {
          active: boolean
          created_at: string
          current_points: number
          description: string | null
          expires_at: string | null
          icon: string | null
          id: string
          name: string
          reward_description: string | null
          starts_at: string
          target_points: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          current_points?: number
          description?: string | null
          expires_at?: string | null
          icon?: string | null
          id?: string
          name: string
          reward_description?: string | null
          starts_at?: string
          target_points?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          current_points?: number
          description?: string | null
          expires_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          reward_description?: string | null
          starts_at?: string
          target_points?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birthday: string | null
          created_at: string
          current_points: number
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          membership_tier: Database["public"]["Enums"]["membership_tier"]
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          visits: number
        }
        Insert: {
          birthday?: string | null
          created_at?: string
          current_points?: number
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          membership_tier?: Database["public"]["Enums"]["membership_tier"]
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          visits?: number
        }
        Update: {
          birthday?: string | null
          created_at?: string
          current_points?: number
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          membership_tier?: Database["public"]["Enums"]["membership_tier"]
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          visits?: number
        }
        Relationships: []
      }
      redemptions: {
        Row: {
          created_at: string
          fulfilled_at: string | null
          id: string
          points_spent: number
          reward_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          fulfilled_at?: string | null
          id?: string
          points_spent: number
          reward_id: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          fulfilled_at?: string | null
          id?: string
          points_spent?: number
          reward_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          bonus_points: number
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          referee_id: string
          referrer_id: string
        }
        Insert: {
          bonus_points?: number
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          referee_id: string
          referrer_id: string
        }
        Update: {
          bonus_points?: number
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          referee_id?: string
          referrer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          inventory: number | null
          membership_required:
            | Database["public"]["Enums"]["membership_tier"]
            | null
          name: string
          points_required: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          inventory?: number | null
          membership_required?:
            | Database["public"]["Enums"]["membership_tier"]
            | null
          name: string
          points_required: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          inventory?: number | null
          membership_required?:
            | Database["public"]["Enums"]["membership_tier"]
            | null
          name?: string
          points_required?: number
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          id: string
          setting_name: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          setting_name: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          id?: string
          setting_name?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          points: number
          reward_id: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          points: number
          reward_id?: string | null
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          points?: number
          reward_id?: string | null
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_points: {
        Args: { user_id: string; point_amount: number }
        Returns: undefined
      }
      get_community_goal_points: {
        Args: { p_goal_id: string }
        Returns: number
      }
      get_user_points: {
        Args: { user_id: string }
        Returns: number
      }
      get_user_visits: {
        Args: { user_id: string }
        Returns: number
      }
      increment_points: {
        Args: { user_id: string; point_amount: number }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never> | { uid: string }
        Returns: boolean
      }
      update_community_goal_points: {
        Args: { p_goal_id: string; p_amount: number }
        Returns: undefined
      }
    }
    Enums: {
      membership_tier: "bronze" | "silver" | "gold"
      transaction_type: "earn" | "redeem" | "adjustment"
      user_role: "admin" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      membership_tier: ["bronze", "silver", "gold"],
      transaction_type: ["earn", "redeem", "adjustment"],
      user_role: ["admin", "customer"],
    },
  },
} as const
