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
      challenge_participants: {
        Row: {
          challenge_id: string
          completed: boolean
          completed_at: string | null
          created_at: string
          current_progress: number
          id: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          current_progress?: number
          id?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          current_progress?: number
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          active: boolean
          created_at: string
          description: string
          difficulty_level: string | null
          expires_at: string
          id: string
          reward: string
          starts_at: string
          target: number
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          difficulty_level?: string | null
          expires_at: string
          id?: string
          reward: string
          starts_at?: string
          target: number
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          difficulty_level?: string | null
          expires_at?: string
          id?: string
          reward?: string
          starts_at?: string
          target?: number
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      coffee_education_progress: {
        Row: {
          badge_name: string
          badge_type: string
          description: string | null
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_name: string
          badge_type: string
          description?: string | null
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_name?: string
          badge_type?: string
          description?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coffee_education_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coffee_journey: {
        Row: {
          brewing_method: string | null
          drink_name: string
          id: string
          notes: string | null
          origin: string | null
          rating: number | null
          tried_at: string | null
          user_id: string
        }
        Insert: {
          brewing_method?: string | null
          drink_name: string
          id?: string
          notes?: string | null
          origin?: string | null
          rating?: number | null
          tried_at?: string | null
          user_id: string
        }
        Update: {
          brewing_method?: string | null
          drink_name?: string
          id?: string
          notes?: string | null
          origin?: string | null
          rating?: number | null
          tried_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coffee_journey_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_goal_contributions: {
        Row: {
          created_at: string
          goal_id: string
          id: string
          points_contributed: number
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_id: string
          id?: string
          points_contributed: number
          user_id: string
        }
        Update: {
          created_at?: string
          goal_id?: string
          id?: string
          points_contributed?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_goal_contributions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "community_goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_goal_contributions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      drinks: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string | null
          id: string
          name: string
          points_earned: number
          price: number | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          id?: string
          name: string
          points_earned?: number
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string | null
          id?: string
          name?: string
          points_earned?: number
          price?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          author: string | null
          body: string
          created_at: string | null
          id: string
          title: string
        }
        Insert: {
          author?: string | null
          body: string
          created_at?: string | null
          id?: string
          title: string
        }
        Update: {
          author?: string | null
          body?: string
          created_at?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string | null
          id: string
          thread_id: string | null
          user_id: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          thread_id?: string | null
          user_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          thread_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_contest_submissions: {
        Row: {
          contest_id: string
          created_at: string
          description: string | null
          id: string
          image_url: string
          status: string | null
          title: string
          updated_at: string
          user_id: string
          votes: number
        }
        Insert: {
          contest_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
          votes?: number
        }
        Update: {
          contest_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          votes?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_contest"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "photo_contests"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_contest_votes: {
        Row: {
          created_at: string
          id: string
          submission_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          submission_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          submission_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_contest_votes_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "photo_contest_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_contests: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          ends_at: string
          header_image_url: string | null
          id: string
          max_submissions: number | null
          prize: string | null
          starts_at: string
          theme: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          ends_at: string
          header_image_url?: string | null
          id?: string
          max_submissions?: number | null
          prize?: string | null
          starts_at?: string
          theme?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          ends_at?: string
          header_image_url?: string | null
          id?: string
          max_submissions?: number | null
          prize?: string | null
          starts_at?: string
          theme?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          availability_status: string | null
          avatar_url: string | null
          bio: string | null
          birthday: string | null
          brewing_preference: string | null
          coffee_adventure_level: string | null
          conversation_style: string | null
          created_at: string
          current_drink: string | null
          current_mood: string | null
          current_points: number
          email: string
          favorite_coffee_origin: string | null
          favorite_seating: string | null
          first_name: string | null
          flavor_profile: string | null
          id: string
          languages_spoken: string[] | null
          last_name: string | null
          membership_tier: Database["public"]["Enums"]["membership_tier"]
          phone: string | null
          primary_topics: string[] | null
          referral_code: string | null
          role: Database["public"]["Enums"]["user_role"]
          time_zone: string | null
          updated_at: string
          visit_frequency: string | null
          visits: number
        }
        Insert: {
          availability_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          birthday?: string | null
          brewing_preference?: string | null
          coffee_adventure_level?: string | null
          conversation_style?: string | null
          created_at?: string
          current_drink?: string | null
          current_mood?: string | null
          current_points?: number
          email: string
          favorite_coffee_origin?: string | null
          favorite_seating?: string | null
          first_name?: string | null
          flavor_profile?: string | null
          id: string
          languages_spoken?: string[] | null
          last_name?: string | null
          membership_tier?: Database["public"]["Enums"]["membership_tier"]
          phone?: string | null
          primary_topics?: string[] | null
          referral_code?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          time_zone?: string | null
          updated_at?: string
          visit_frequency?: string | null
          visits?: number
        }
        Update: {
          availability_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          birthday?: string | null
          brewing_preference?: string | null
          coffee_adventure_level?: string | null
          conversation_style?: string | null
          created_at?: string
          current_drink?: string | null
          current_mood?: string | null
          current_points?: number
          email?: string
          favorite_coffee_origin?: string | null
          favorite_seating?: string | null
          first_name?: string | null
          flavor_profile?: string | null
          id?: string
          languages_spoken?: string[] | null
          last_name?: string | null
          membership_tier?: Database["public"]["Enums"]["membership_tier"]
          phone?: string | null
          primary_topics?: string[] | null
          referral_code?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          time_zone?: string | null
          updated_at?: string
          visit_frequency?: string | null
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
          reward_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          fulfilled_at?: string | null
          id?: string
          points_spent: number
          reward_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          fulfilled_at?: string | null
          id?: string
          points_spent?: number
          reward_id?: string | null
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
      referral_campaigns: {
        Row: {
          active: boolean
          bonus_points: number
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          invite_count_required: number
          name: string
          starts_at: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          bonus_points?: number
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          invite_count_required?: number
          name: string
          starts_at?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          bonus_points?: number
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          invite_count_required?: number
          name?: string
          starts_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          bonus_points: number
          campaign_id: string | null
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          referee_id: string
          referrer_id: string
        }
        Insert: {
          bonus_points?: number
          campaign_id?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          referee_id: string
          referrer_id: string
        }
        Update: {
          bonus_points?: number
          campaign_id?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          referee_id?: string
          referrer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "referral_campaigns"
            referencedColumns: ["id"]
          },
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
          category: string | null
          created_at: string
          cupping_score_min: number | null
          description: string | null
          id: string
          image_url: string | null
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
          category?: string | null
          created_at?: string
          cupping_score_min?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
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
          category?: string | null
          created_at?: string
          cupping_score_min?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
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
      song_requests: {
        Row: {
          area_id: string
          artist_name: string
          created_at: string
          id: string
          requested_by: string
          song_name: string
          votes: number
        }
        Insert: {
          area_id: string
          artist_name: string
          created_at?: string
          id?: string
          requested_by: string
          song_name: string
          votes?: number
        }
        Update: {
          area_id?: string
          artist_name?: string
          created_at?: string
          id?: string
          requested_by?: string
          song_name?: string
          votes?: number
        }
        Relationships: []
      }
      song_votes: {
        Row: {
          created_at: string
          id: string
          request_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          request_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "song_votes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "song_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      threads: {
        Row: {
          created_at: string | null
          id: string
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "threads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      user_connections: {
        Row: {
          connected_user_id: string
          connection_type: string | null
          first_met_at: string | null
          id: string
          notes: string | null
          shared_experiences: string[] | null
          user_id: string
        }
        Insert: {
          connected_user_id: string
          connection_type?: string | null
          first_met_at?: string | null
          id?: string
          notes?: string | null
          shared_experiences?: string[] | null
          user_id: string
        }
        Update: {
          connected_user_id?: string
          connection_type?: string | null
          first_met_at?: string | null
          id?: string
          notes?: string | null
          shared_experiences?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_connections_connected_user_id_fkey"
            columns: ["connected_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_connections_user_id_fkey"
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
      admin_create_reward: {
        Args: { name: string; cost: number; category: string; stock: number }
        Returns: undefined
      }
      admin_delete_reward: {
        Args: { rid: string }
        Returns: undefined
      }
      admin_update_reward: {
        Args: {
          rid: string
          name: string
          cost: number
          category: string
          stock: number
        }
        Returns: undefined
      }
      decrement_points: {
        Args: { user_id: string; point_amount: number }
        Returns: undefined
      }
      earn_points: {
        Args: { uid: string; points: number; notes?: string }
        Returns: undefined
      }
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_community_goal_points: {
        Args: { p_goal_id: string }
        Returns: number
      }
      get_referral_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          referrer_id: string
          first_name: string
          last_name: string
          email: string
          total_referrals: number
          completed_referrals: number
          total_bonus_points: number
        }[]
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
      increment_song_votes: {
        Args: { request_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never> | { uid: string }
        Returns: boolean
      }
      recalculate_points: {
        Args: { uid: string }
        Returns: undefined
      }
      redeem_points: {
        Args: { uid: string; reward_id: string; points: number }
        Returns: undefined
      }
      set_user_tier: {
        Args: { uid: string; new_tier: string }
        Returns: undefined
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
