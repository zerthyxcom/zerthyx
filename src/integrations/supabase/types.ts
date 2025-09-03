export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_wallets: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          network: string
          wallet_address: string
          wallet_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          network: string
          wallet_address: string
          wallet_type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          network?: string
          wallet_address?: string
          wallet_type?: string
        }
        Relationships: []
      }
      blockchain_networks: {
        Row: {
          created_at: string | null
          deposit_address: string
          id: string
          is_enabled: boolean | null
          name: string
          network_type: string
        }
        Insert: {
          created_at?: string | null
          deposit_address: string
          id?: string
          is_enabled?: boolean | null
          name: string
          network_type: string
        }
        Update: {
          created_at?: string | null
          deposit_address?: string
          id?: string
          is_enabled?: boolean | null
          name?: string
          network_type?: string
        }
        Relationships: []
      }
      daily_profits: {
        Row: {
          created_at: string
          id: string
          nft_plan_id: string
          profit_amount: number
          profit_date: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nft_plan_id: string
          profit_amount: number
          profit_date?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nft_plan_id?: string
          profit_amount?: number
          profit_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_profits_nft_plan_id_fkey"
            columns: ["nft_plan_id"]
            isOneToOne: false
            referencedRelation: "nft_staking_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_profits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      deposits: {
        Row: {
          admin_notes: string | null
          admin_wallet_id: string | null
          amount: number
          created_at: string
          id: string
          network: string | null
          payment_screenshot_url: string | null
          status: string | null
          transaction_hash: string | null
          updated_at: string
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          admin_notes?: string | null
          admin_wallet_id?: string | null
          amount: number
          created_at?: string
          id?: string
          network?: string | null
          payment_screenshot_url?: string | null
          status?: string | null
          transaction_hash?: string | null
          updated_at?: string
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          admin_notes?: string | null
          admin_wallet_id?: string | null
          amount?: number
          created_at?: string
          id?: string
          network?: string | null
          payment_screenshot_url?: string | null
          status?: string | null
          transaction_hash?: string | null
          updated_at?: string
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deposits_admin_wallet_id_fkey"
            columns: ["admin_wallet_id"]
            isOneToOne: false
            referencedRelation: "admin_wallets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deposits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "deposits_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      mining_token_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      nft_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      nft_packages: {
        Row: {
          created_at: string | null
          daily_profit_rate: number | null
          description: string | null
          duration_days: number | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          daily_profit_rate?: number | null
          description?: string | null
          duration_days?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          daily_profit_rate?: number | null
          description?: string | null
          duration_days?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      nft_staking_plans: {
        Row: {
          amount: number
          created_at: string
          daily_profit_rate: number | null
          end_date: string
          id: string
          individual_end_date: string | null
          individual_start_date: string | null
          is_released: boolean | null
          release_date: string | null
          start_date: string
          status: string | null
          total_profit_earned: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          daily_profit_rate?: number | null
          end_date: string
          id?: string
          individual_end_date?: string | null
          individual_start_date?: string | null
          is_released?: boolean | null
          release_date?: string | null
          start_date?: string
          status?: string | null
          total_profit_earned?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          daily_profit_rate?: number | null
          end_date?: string
          id?: string
          individual_end_date?: string | null
          individual_start_date?: string | null
          is_released?: boolean | null
          release_date?: string | null
          start_date?: string
          status?: string | null
          total_profit_earned?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nft_staking_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          kyc_status: string | null
          phone: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          kyc_status?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          kyc_status?: string | null
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_wallets: {
        Row: {
          created_at: string
          id: string
          main_balance: number | null
          nft_balance: number | null
          total_deposited: number | null
          total_withdrawn: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          main_balance?: number | null
          nft_balance?: number | null
          total_deposited?: number | null
          total_withdrawn?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          main_balance?: number | null
          nft_balance?: number | null
          total_deposited?: number | null
          total_withdrawn?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      withdrawals: {
        Row: {
          amount: number
          created_at: string
          id: string
          network: string
          processed_at: string | null
          processed_by: string | null
          status: string | null
          transaction_hash: string | null
          updated_at: string
          user_id: string
          withdraw_address: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          network: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          transaction_hash?: string | null
          updated_at?: string
          user_id: string
          withdraw_address: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          network?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          transaction_hash?: string | null
          updated_at?: string
          user_id?: string
          withdraw_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "withdrawals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      release_completed_nft_deposits: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
