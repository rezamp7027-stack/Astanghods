export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      provinces: {
        Row: { id: string; name: string; slug: string; created_at: string };
        Insert: { id?: string; name: string; slug: string; created_at?: string };
        Update: { id?: string; name?: string; slug?: string; created_at?: string };
        Relationships: [];
      };
      roles: {
        Row: { id: string; slug: Database["public"]["Enums"]["app_role"]; name: string; description: string | null; created_at: string };
        Insert: { id?: string; slug: Database["public"]["Enums"]["app_role"]; name: string; description?: string | null; created_at?: string };
        Update: { id?: string; slug?: Database["public"]["Enums"]["app_role"]; name?: string; description?: string | null; created_at?: string };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string; full_name: string | null; display_name: string | null; phone: string | null;
          birth_date: string | null; province_id: string | null; city: string | null;
          avatar_path: string | null; bio: string | null; onboarding_completed: boolean;
          is_active: boolean; created_at: string; updated_at: string;
        };
        Insert: {
          id: string; full_name?: string | null; display_name?: string | null; phone?: string | null;
          birth_date?: string | null; province_id?: string | null; city?: string | null;
          avatar_path?: string | null; bio?: string | null; onboarding_completed?: boolean;
          is_active?: boolean; created_at?: string; updated_at?: string;
        };
        Update: {
          id?: string; full_name?: string | null; display_name?: string | null; phone?: string | null;
          birth_date?: string | null; province_id?: string | null; city?: string | null;
          avatar_path?: string | null; bio?: string | null; onboarding_completed?: boolean;
          is_active?: boolean; created_at?: string; updated_at?: string;
        };
        Relationships: [{ foreignKeyName: "profiles_province_id_fkey"; columns: ["province_id"]; isOneToOne: false; referencedRelation: "provinces"; referencedColumns: ["id"] }];
      };
      programs: {
        Row: {
          id: string; title: string; slug: string; summary: string | null; description: string | null;
          status: Database["public"]["Enums"]["program_status"]; program_type: string;
          audience_min_age: number | null; audience_max_age: number | null; capacity: number | null;
          registration_open_at: string | null; registration_close_at: string | null;
          start_at: string | null; end_at: string | null; location_name: string | null;
          province_id: string | null; city: string | null; cover_image_path: string | null;
          published_at: string | null; created_by: string | null; created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; title: string; slug: string; summary?: string | null; description?: string | null;
          status?: Database["public"]["Enums"]["program_status"]; program_type?: string;
          audience_min_age?: number | null; audience_max_age?: number | null; capacity?: number | null;
          registration_open_at?: string | null; registration_close_at?: string | null;
          start_at?: string | null; end_at?: string | null; location_name?: string | null;
          province_id?: string | null; city?: string | null; cover_image_path?: string | null;
          published_at?: string | null; created_by?: string | null; created_at?: string; updated_at?: string;
        };
        Update: {
          id?: string; title?: string; slug?: string; summary?: string | null; description?: string | null;
          status?: Database["public"]["Enums"]["program_status"]; program_type?: string;
          audience_min_age?: number | null; audience_max_age?: number | null; capacity?: number | null;
          registration_open_at?: string | null; registration_close_at?: string | null;
          start_at?: string | null; end_at?: string | null; location_name?: string | null;
          province_id?: string | null; city?: string | null; cover_image_path?: string | null;
          published_at?: string | null; created_by?: string | null; created_at?: string; updated_at?: string;
        };
        Relationships: [{ foreignKeyName: "programs_province_id_fkey"; columns: ["province_id"]; isOneToOne: false; referencedRelation: "provinces"; referencedColumns: ["id"] }];
      };
      program_tracks: {
        Row: { id: string; program_id: string; title: string; slug: string; summary: string | null; sort_order: number; created_at: string };
        Insert: { id?: string; program_id: string; title: string; slug: string; summary?: string | null; sort_order?: number; created_at?: string };
        Update: { id?: string; program_id?: string; title?: string; slug?: string; summary?: string | null; sort_order?: number; created_at?: string };
        Relationships: [{ foreignKeyName: "program_tracks_program_id_fkey"; columns: ["program_id"]; isOneToOne: false; referencedRelation: "programs"; referencedColumns: ["id"] }];
      };
      events: {
        Row: {
          id: string; program_id: string | null; title: string; slug: string; summary: string | null; description: string | null;
          starts_at: string; ends_at: string | null; venue_name: string | null; venue_address: string | null;
          province_id: string | null; city: string | null; capacity: number | null; is_public: boolean;
          created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; program_id?: string | null; title: string; slug: string; summary?: string | null; description?: string | null;
          starts_at: string; ends_at?: string | null; venue_name?: string | null; venue_address?: string | null;
          province_id?: string | null; city?: string | null; capacity?: number | null; is_public?: boolean;
          created_at?: string; updated_at?: string;
        };
        Update: {
          id?: string; program_id?: string | null; title?: string; slug?: string; summary?: string | null; description?: string | null;
          starts_at?: string; ends_at?: string | null; venue_name?: string | null; venue_address?: string | null;
          province_id?: string | null; city?: string | null; capacity?: number | null; is_public?: boolean;
          created_at?: string; updated_at?: string;
        };
        Relationships: [];
      };
      registrations: {
        Row: {
          id: string; program_id: string; user_id: string; status: Database["public"]["Enums"]["registration_status"];
          notes: string | null; metadata: Json; registered_at: string; updated_at: string;
        };
        Insert: {
          id?: string; program_id: string; user_id: string; status?: Database["public"]["Enums"]["registration_status"];
          notes?: string | null; metadata?: Json; registered_at?: string; updated_at?: string;
        };
        Update: {
          id?: string; program_id?: string; user_id?: string; status?: Database["public"]["Enums"]["registration_status"];
          notes?: string | null; metadata?: Json; registered_at?: string; updated_at?: string;
        };
        Relationships: [{
          foreignKeyName: "registrations_program_id_fkey";
          columns: ["program_id"];
          isOneToOne: false;
          referencedRelation: "programs";
          referencedColumns: ["id"];
        }];
      };
      waitlist_entries: {
        Row: { id: string; registration_id: string; program_id: string; user_id: string; position: number; joined_at: string; promoted_at: string | null };
        Insert: { id?: string; registration_id: string; program_id: string; user_id: string; position: number; joined_at?: string; promoted_at?: string | null };
        Update: { id?: string; registration_id?: string; program_id?: string; user_id?: string; position?: number; joined_at?: string; promoted_at?: string | null };
        Relationships: [
          { foreignKeyName: "waitlist_entries_registration_id_fkey"; columns: ["registration_id"]; isOneToOne: true; referencedRelation: "registrations"; referencedColumns: ["id"] },
          { foreignKeyName: "waitlist_entries_program_id_fkey"; columns: ["program_id"]; isOneToOne: false; referencedRelation: "programs"; referencedColumns: ["id"] }
        ];
      };
      courses: {
        Row: { id: string; title: string; slug: string; summary: string | null; description: string | null; is_published: boolean; created_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; title: string; slug: string; summary?: string | null; description?: string | null; is_published?: boolean; created_by?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; title?: string; slug?: string; summary?: string | null; description?: string | null; is_published?: boolean; created_by?: string | null; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      notifications: {
        Row: { id: string; user_id: string; title: string; body: string; notification_type: string; data: Json; read_at: string | null; created_at: string };
        Insert: { id?: string; user_id: string; title: string; body: string; notification_type?: string; data?: Json; read_at?: string | null; created_at?: string };
        Update: { id?: string; user_id?: string; title?: string; body?: string; notification_type?: string; data?: Json; read_at?: string | null; created_at?: string };
        Relationships: [];
      };
      notification_preferences: {
        Row: { user_id: string; in_app: boolean; sms: boolean; email: boolean; push: boolean; updated_at: string };
        Insert: { user_id: string; in_app?: boolean; sms?: boolean; email?: boolean; push?: boolean; updated_at?: string };
        Update: { user_id?: string; in_app?: boolean; sms?: boolean; email?: boolean; push?: boolean; updated_at?: string };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {
      register_for_program: {
        Args: { p_program_id: string };
        Returns: { registration_id: string; registration_status: Database["public"]["Enums"]["registration_status"]; waitlist_position: number | null }[];
      };
      has_role: { Args: { required_role: Database["public"]["Enums"]["app_role"] }; Returns: boolean };
      has_any_role: { Args: { required_roles: Database["public"]["Enums"]["app_role"][] }; Returns: boolean };
    };
    Enums: {
      app_role: "super_admin" | "program_manager" | "content_manager" | "mentor_manager" | "regional_manager" | "crm_manager" | "auditor";
      program_status: "draft" | "published" | "registration_closed" | "running" | "completed" | "archived";
      registration_status: "pending" | "confirmed" | "waitlisted" | "cancelled" | "rejected" | "completed";
    };
    CompositeTypes: {};
  };
};
