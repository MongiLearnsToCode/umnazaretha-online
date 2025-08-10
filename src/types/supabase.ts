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
      approvals: {
        Row: {
          id: string
          content_id: string
          content_type: string
          approver_id: string | null
          approval_level: string | null
          status: string | null
          comments: string | null
          created_at: string
        }
        Insert: {
          id?: string
          content_id: string
          content_type: string
          approver_id?: string | null
          approval_level?: string | null
          status?: string | null
          comments?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          content_id?: string
          content_type?: string
          approver_id?: string | null
          approval_level?: string | null
          status?: string | null
          comments?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approvals_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      audit_logs: {
        Row: {
          id: string
          action: string
          resource_type: string
          resource_id: string | null
          user_id: string | null
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          action: string
          resource_type: string
          resource_id?: string | null
          user_id?: string | null
          details?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          action?: string
          resource_type?: string
          resource_id?: string | null
          user_id?: string | null
          details?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      genres: {
        Row: {
          id: string
          name: string
          description: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
        }
        Relationships: []
      }
      hosts: {
        Row: {
          id: string
          host_name: string
          bio: string | null
          photo_url: string | null
          contact_info: string | null
          approval_status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          host_name: string
          bio?: string | null
          photo_url?: string | null
          contact_info?: string | null
          approval_status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          host_name?: string
          bio?: string | null
          photo_url?: string | null
          contact_info?: string | null
          approval_status?: string | null
          created_at?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          id: string
          title: string
          description: string | null
          duration: number | null
          thumbnail_url: string | null
          video_id: string | null
          language: string | null
          genre: string | null
          target_demographic: string | null
          episode_number: number | null
          season_number: number | null
          series_id: string | null
          production_date: string | null
          approval_status: string | null
          approval_notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          duration?: number | null
          thumbnail_url?: string | null
          video_id?: string | null
          language?: string | null
          genre?: string | null
          target_demographic?: string | null
          episode_number?: number | null
          season_number?: number | null
          series_id?: string | null
          production_date?: string | null
          approval_status?: string | null
          approval_notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          duration?: number | null
          thumbnail_url?: string | null
          video_id?: string | null
          language?: string | null
          genre?: string | null
          target_demographic?: string | null
          episode_number?: number | null
          season_number?: number | null
          series_id?: string | null
          production_date?: string | null
          approval_status?: string | null
          approval_notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_genre_fkey"
            columns: ["genre"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "programs_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          }
        ]
      }
      program_hosts: {
        Row: {
          program_id: string
          host_id: string
        }
        Insert: {
          program_id: string
          host_id: string
        }
        Update: {
          program_id?: string
          host_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_hosts_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "hosts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_hosts_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          }
        ]
      }
      schedules: {
        Row: {
          id: string
          program_id: string
          start_time: string
          end_time: string
          channel: string | null
          created_by: string | null
          programming_block: string | null
          created_at: string
        }
        Insert: {
          id?: string
          program_id: string
          start_time: string
          end_time: string
          channel?: string | null
          created_by?: string | null
          programming_block?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          program_id?: string
          start_time?: string
          end_time?: string
          channel?: string | null
          created_by?: string | null
          programming_block?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          }
        ]
      }
      series: {
        Row: {
          id: string
          series_name: string
          description: string | null
          genre: string | null
          target_demographic: string | null
          total_episodes: number | null
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          series_name: string
          description?: string | null
          genre?: string | null
          target_demographic?: string | null
          total_episodes?: number | null
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          series_name?: string
          description?: string | null
          genre?: string | null
          target_demographic?: string | null
          total_episodes?: number | null
          status?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "series_genre_fkey"
            columns: ["genre"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["name"]
          }
        ]
      }
      settings: {
        Row: {
          id: string
          key: string
          value: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          key: string
          value?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string | null
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      user_viewing_history: {
        Row: {
          id: string
          user_id: string | null
          program_id: string | null
          watch_duration: number | null
          completion_rate: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          program_id?: string | null
          watch_duration?: number | null
          completion_rate?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          program_id?: string | null
          watch_duration?: number | null
          completion_rate?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_viewing_history_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_viewing_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          subscription_status: string | null
          language_preference: string | null
          role: string | null
          viewing_preferences: Json | null
          notification_settings: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          subscription_status?: string | null
          language_preference?: string | null
          role?: string | null
          viewing_preferences?: Json | null
          notification_settings?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          subscription_status?: string | null
          language_preference?: string | null
          role?: string | null
          viewing_preferences?: Json | null
          notification_settings?: Json | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never