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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      lead_details: {
        Row: {
          admission_deadline: string | null
          already_knows_exam_type: string | null
          aso_other_purpose: string | null
          aso_purpose: string | null
          created_at: string
          current_job_role: string | null
          dismissal_deadline: string | null
          employee_role: string | null
          has_return_date: boolean | null
          has_return_document: string | null
          has_role_change_deadline: boolean | null
          id: string
          lead_id: string
          new_role: string | null
          periodic_quantity: number | null
          periodic_type: string | null
          periodic_window: string | null
          raw_data: Json | null
          return_date: string | null
          role_change_deadline: string | null
          specific_question: string | null
          triage_exam_type: string | null
          updated_at: string
        }
        Insert: {
          admission_deadline?: string | null
          already_knows_exam_type?: string | null
          aso_other_purpose?: string | null
          aso_purpose?: string | null
          created_at?: string
          current_job_role?: string | null
          dismissal_deadline?: string | null
          employee_role?: string | null
          has_return_date?: boolean | null
          has_return_document?: string | null
          has_role_change_deadline?: boolean | null
          id?: string
          lead_id: string
          new_role?: string | null
          periodic_quantity?: number | null
          periodic_type?: string | null
          periodic_window?: string | null
          raw_data?: Json | null
          return_date?: string | null
          role_change_deadline?: string | null
          specific_question?: string | null
          triage_exam_type?: string | null
          updated_at?: string
        }
        Update: {
          admission_deadline?: string | null
          already_knows_exam_type?: string | null
          aso_other_purpose?: string | null
          aso_purpose?: string | null
          created_at?: string
          current_job_role?: string | null
          dismissal_deadline?: string | null
          employee_role?: string | null
          has_return_date?: boolean | null
          has_return_document?: string | null
          has_role_change_deadline?: boolean | null
          id?: string
          lead_id?: string
          new_role?: string | null
          periodic_quantity?: number | null
          periodic_type?: string | null
          periodic_window?: string | null
          raw_data?: Json | null
          return_date?: string | null
          role_change_deadline?: string | null
          specific_question?: string | null
          triage_exam_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_details_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: true
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_history: {
        Row: {
          author_id: string | null
          author_type: string | null
          created_at: string
          description: string
          event_origin: string | null
          event_type: string
          id: string
          lead_id: string
          new_value: string | null
          old_value: string | null
        }
        Insert: {
          author_id?: string | null
          author_type?: string | null
          created_at?: string
          description: string
          event_origin?: string | null
          event_type: string
          id?: string
          lead_id: string
          new_value?: string | null
          old_value?: string | null
        }
        Update: {
          author_id?: string | null
          author_type?: string | null
          created_at?: string
          description?: string
          event_origin?: string | null
          event_type?: string
          id?: string
          lead_id?: string
          new_value?: string | null
          old_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_history_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users_internal"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_schedule: {
        Row: {
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          id: string
          lead_id: string
          preferred_date: string | null
          preferred_period: string | null
          schedule_notes: string | null
          schedule_status: string
          updated_at: string
        }
        Insert: {
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          id?: string
          lead_id: string
          preferred_date?: string | null
          preferred_period?: string | null
          schedule_notes?: string | null
          schedule_status?: string
          updated_at?: string
        }
        Update: {
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          id?: string
          lead_id?: string
          preferred_date?: string | null
          preferred_period?: string | null
          schedule_notes?: string | null
          schedule_status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_schedule_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "users_internal"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_schedule_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_user_id: string | null
          channel_origin: string | null
          company: string | null
          conversation_summary: string | null
          created_at: string
          dashboard_summary: string | null
          employee_count: number | null
          employee_name: string | null
          external_session_id: string | null
          external_source: string | null
          finished_at: string | null
          forwarding_reason: string | null
          id: string
          initial_notes: string | null
          needs_human: boolean
          phone: string | null
          preferred_date: string | null
          preferred_period: string | null
          priority: string | null
          request_type: string | null
          requester_name: string | null
          requester_profile: string | null
          sector_id: string | null
          sla_due_at: string | null
          status: string
          updated_at: string
          urgency: string | null
        }
        Insert: {
          assigned_user_id?: string | null
          channel_origin?: string | null
          company?: string | null
          conversation_summary?: string | null
          created_at?: string
          dashboard_summary?: string | null
          employee_count?: number | null
          employee_name?: string | null
          external_session_id?: string | null
          external_source?: string | null
          finished_at?: string | null
          forwarding_reason?: string | null
          id?: string
          initial_notes?: string | null
          needs_human?: boolean
          phone?: string | null
          preferred_date?: string | null
          preferred_period?: string | null
          priority?: string | null
          request_type?: string | null
          requester_name?: string | null
          requester_profile?: string | null
          sector_id?: string | null
          sla_due_at?: string | null
          status?: string
          updated_at?: string
          urgency?: string | null
        }
        Update: {
          assigned_user_id?: string | null
          channel_origin?: string | null
          company?: string | null
          conversation_summary?: string | null
          created_at?: string
          dashboard_summary?: string | null
          employee_count?: number | null
          employee_name?: string | null
          external_session_id?: string | null
          external_source?: string | null
          finished_at?: string | null
          forwarding_reason?: string | null
          id?: string
          initial_notes?: string | null
          needs_human?: boolean
          phone?: string | null
          preferred_date?: string | null
          preferred_period?: string | null
          priority?: string | null
          request_type?: string | null
          requester_name?: string | null
          requester_profile?: string | null
          sector_id?: string | null
          sla_due_at?: string | null
          status?: string
          updated_at?: string
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_user_id_fkey"
            columns: ["assigned_user_id"]
            isOneToOne: false
            referencedRelation: "users_internal"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      sectors: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      users_internal: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          is_active: boolean
          phone: string | null
          role: string | null
          sector_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: string | null
          sector_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: string | null
          sector_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_internal_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
