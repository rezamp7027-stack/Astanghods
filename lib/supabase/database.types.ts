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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          checked_at: string | null
          created_at: string
          id: string
          marked_by: string | null
          notes: string | null
          session_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          checked_at?: string | null
          created_at?: string
          id?: string
          marked_by?: string | null
          notes?: string | null
          session_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          checked_at?: string | null
          created_at?: string
          id?: string
          marked_by?: string | null
          notes?: string | null
          session_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "event_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: number
          metadata: Json
          request_id: string | null
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: number
          metadata?: Json
          request_id?: string | null
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: number
          metadata?: Json
          request_id?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_number: string
          course_id: string | null
          created_at: string
          id: string
          issued_at: string
          metadata: Json
          program_id: string | null
          revoked_at: string | null
          title: string
          user_id: string
          verification_code: string
        }
        Insert: {
          certificate_number: string
          course_id?: string | null
          created_at?: string
          id?: string
          issued_at?: string
          metadata?: Json
          program_id?: string | null
          revoked_at?: string | null
          title: string
          user_id: string
          verification_code?: string
        }
        Update: {
          certificate_number?: string
          course_id?: string | null
          created_at?: string
          id?: string
          issued_at?: string
          metadata?: Json
          program_id?: string | null
          revoked_at?: string | null
          title?: string
          user_id?: string
          verification_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_records: {
        Row: {
          consent_type: string
          granted: boolean
          granted_at: string
          id: string
          metadata: Json
          revoked_at: string | null
          user_id: string
          version: string
        }
        Insert: {
          consent_type: string
          granted: boolean
          granted_at?: string
          id?: string
          metadata?: Json
          revoked_at?: string | null
          user_id: string
          version: string
        }
        Update: {
          consent_type?: string
          granted?: boolean
          granted_at?: string
          id?: string
          metadata?: Json
          revoked_at?: string | null
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      content: {
        Row: {
          author_id: string | null
          body: Json
          content_type: string
          created_at: string
          id: string
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body?: Json
          content_type?: string
          created_at?: string
          id?: string
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: Json
          content_type?: string
          created_at?: string
          id?: string
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      course_modules: {
        Row: {
          course_id: string
          created_at: string
          id: string
          sort_order: number
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          sort_order?: number
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          sort_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_published: boolean
          slug: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_published?: boolean
          slug: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_published?: boolean
          slug?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      engagement_events: {
        Row: {
          entity_id: string | null
          entity_type: string | null
          event_type: string
          id: string
          metadata: Json
          occurred_at: string
          source: string | null
          user_id: string | null
        }
        Insert: {
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          id?: string
          metadata?: Json
          occurred_at?: string
          source?: string | null
          user_id?: string | null
        }
        Update: {
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          id?: string
          metadata?: Json
          occurred_at?: string
          source?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          status: Database["public"]["Enums"]["enrollment_status"]
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      event_sessions: {
        Row: {
          capacity: number | null
          created_at: string
          ends_at: string | null
          event_id: string
          id: string
          location_name: string | null
          sort_order: number
          starts_at: string
          title: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          ends_at?: string | null
          event_id: string
          id?: string
          location_name?: string | null
          sort_order?: number
          starts_at: string
          title: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          ends_at?: string | null
          event_id?: string
          id?: string
          location_name?: string | null
          sort_order?: number
          starts_at?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          capacity: number | null
          city: string | null
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          is_public: boolean
          program_id: string | null
          province_id: string | null
          slug: string
          starts_at: string
          summary: string | null
          title: string
          updated_at: string
          venue_address: string | null
          venue_name: string | null
        }
        Insert: {
          capacity?: number | null
          city?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          is_public?: boolean
          program_id?: string | null
          province_id?: string | null
          slug: string
          starts_at: string
          summary?: string | null
          title: string
          updated_at?: string
          venue_address?: string | null
          venue_name?: string | null
        }
        Update: {
          capacity?: number | null
          city?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          is_public?: boolean
          program_id?: string | null
          province_id?: string | null
          slug?: string
          starts_at?: string
          summary?: string | null
          title?: string
          updated_at?: string
          venue_address?: string | null
          venue_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      gamification_events: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          points: number
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          points: number
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          points?: number
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      gamification_points: {
        Row: {
          level: number
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          level?: number
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          level?: number
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journey_enrollments: {
        Row: {
          completed_at: string | null
          current_step: number
          enrolled_at: string
          id: string
          journey_id: string
          next_run_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          current_step?: number
          enrolled_at?: string
          id?: string
          journey_id: string
          next_run_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          current_step?: number
          enrolled_at?: string
          id?: string
          journey_id?: string
          next_run_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_enrollments_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_steps: {
        Row: {
          action_type: string
          config: Json
          delay_minutes: number
          id: string
          journey_id: string
          step_order: number
        }
        Insert: {
          action_type: string
          config?: Json
          delay_minutes?: number
          id?: string
          journey_id: string
          step_order: number
        }
        Update: {
          action_type?: string
          config?: Json
          delay_minutes?: number
          id?: string
          journey_id?: string
          step_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "journey_steps_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journeys"
            referencedColumns: ["id"]
          },
        ]
      }
      journeys: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          trigger_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          trigger_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          trigger_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          lesson_id: string
          progress_percent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          lesson_id: string
          progress_percent?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          lesson_id?: string
          progress_percent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: Json
          created_at: string
          duration_minutes: number | null
          id: string
          is_published: boolean
          lesson_type: string
          module_id: string
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          lesson_type?: string
          module_id: string
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          duration_minutes?: number | null
          id?: string
          is_published?: boolean
          lesson_type?: string
          module_id?: string
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_assignments: {
        Row: {
          assigned_by: string | null
          created_at: string
          ended_at: string | null
          id: string
          mentor_user_id: string
          notes: string | null
          program_id: string | null
          started_at: string
          youth_user_id: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string
          ended_at?: string | null
          id?: string
          mentor_user_id: string
          notes?: string | null
          program_id?: string | null
          started_at?: string
          youth_user_id: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string
          ended_at?: string | null
          id?: string
          mentor_user_id?: string
          notes?: string | null
          program_id?: string | null
          started_at?: string
          youth_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_assignments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_profiles: {
        Row: {
          bio: string | null
          created_at: string
          expertise: string[]
          is_available: boolean
          max_active_assignments: number
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          expertise?: string[]
          is_available?: boolean
          max_active_assignments?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          expertise?: string[]
          is_available?: boolean
          max_active_assignments?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_deliveries: {
        Row: {
          attempts: number
          channel: string
          created_at: string
          id: string
          last_error: string | null
          notification_id: string
          provider: string | null
          provider_message_id: string | null
          scheduled_at: string | null
          sent_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          channel: string
          created_at?: string
          id?: string
          last_error?: string | null
          notification_id: string
          provider?: string | null
          provider_message_id?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          channel?: string
          created_at?: string
          id?: string
          last_error?: string | null
          notification_id?: string
          provider?: string | null
          provider_message_id?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_deliveries_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          email: boolean
          in_app: boolean
          push: boolean
          sms: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          email?: boolean
          in_app?: boolean
          push?: boolean
          sms?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          email?: boolean
          in_app?: boolean
          push?: boolean
          sms?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          data: Json
          id: string
          notification_type: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json
          id?: string
          notification_type?: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json
          id?: string
          notification_type?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      organization_directory: {
        Row: {
          city: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          organization_id: string
          organization_type: string
          province_id: string | null
          slug: string
          updated_at: string
          website: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          organization_id: string
          organization_type: string
          province_id?: string | null
          slug: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          organization_type?: string
          province_id?: string | null
          slug?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_directory_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_directory_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          is_active: boolean
          joined_at: string
          organization_id: string
          role_name: string
          user_id: string
        }
        Insert: {
          is_active?: boolean
          joined_at?: string
          organization_id: string
          role_name?: string
          user_id: string
        }
        Update: {
          is_active?: boolean
          joined_at?: string
          organization_id?: string
          role_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          city: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          is_active: boolean
          name: string
          organization_type: string
          phone: string | null
          province_id: string | null
          slug: string
          updated_at: string
          website: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          organization_type: string
          phone?: string | null
          province_id?: string | null
          slug: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          organization_type?: string
          phone?: string | null
          province_id?: string | null
          slug?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_links: {
        Row: {
          consented_at: string | null
          created_at: string
          id: string
          is_active: boolean
          parent_user_id: string
          relationship: string | null
          youth_user_id: string
        }
        Insert: {
          consented_at?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          parent_user_id: string
          relationship?: string | null
          youth_user_id: string
        }
        Update: {
          consented_at?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          parent_user_id?: string
          relationship?: string | null
          youth_user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_path: string | null
          bio: string | null
          birth_date: string | null
          city: string | null
          created_at: string
          display_name: string | null
          full_name: string | null
          id: string
          is_active: boolean
          onboarding_completed: boolean
          phone: string | null
          province_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_path?: string | null
          bio?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
          onboarding_completed?: boolean
          phone?: string | null
          province_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_path?: string | null
          bio?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string
          display_name?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          onboarding_completed?: boolean
          phone?: string | null
          province_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      program_tracks: {
        Row: {
          created_at: string
          id: string
          program_id: string
          slug: string
          sort_order: number
          summary: string | null
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          program_id: string
          slug: string
          sort_order?: number
          summary?: string | null
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          program_id?: string
          slug?: string
          sort_order?: number
          summary?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_tracks_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          audience_max_age: number | null
          audience_min_age: number | null
          capacity: number | null
          city: string | null
          cover_image_path: string | null
          created_at: string
          created_by: string | null
          description: string | null
          end_at: string | null
          id: string
          location_name: string | null
          program_type: string
          province_id: string | null
          published_at: string | null
          registration_close_at: string | null
          registration_open_at: string | null
          slug: string
          start_at: string | null
          status: Database["public"]["Enums"]["program_status"]
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          audience_max_age?: number | null
          audience_min_age?: number | null
          capacity?: number | null
          city?: string | null
          cover_image_path?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_at?: string | null
          id?: string
          location_name?: string | null
          program_type?: string
          province_id?: string | null
          published_at?: string | null
          registration_close_at?: string | null
          registration_open_at?: string | null
          slug: string
          start_at?: string | null
          status?: Database["public"]["Enums"]["program_status"]
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          audience_max_age?: number | null
          audience_min_age?: number | null
          capacity?: number | null
          city?: string | null
          cover_image_path?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_at?: string | null
          id?: string
          location_name?: string | null
          program_type?: string
          province_id?: string | null
          published_at?: string | null
          registration_close_at?: string | null
          registration_open_at?: string | null
          slug?: string
          start_at?: string | null
          status?: Database["public"]["Enums"]["program_status"]
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      provinces: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          expires_at: string | null
          id: string
          reason: string | null
          score: number
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          expires_at?: string | null
          id?: string
          reason?: string | null
          score?: number
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          expires_at?: string | null
          id?: string
          reason?: string | null
          score?: number
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          id: string
          metadata: Json
          notes: string | null
          program_id: string
          registered_at: string
          status: Database["public"]["Enums"]["registration_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          metadata?: Json
          notes?: string | null
          program_id: string
          registered_at?: string
          status?: Database["public"]["Enums"]["registration_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          metadata?: Json
          notes?: string | null
          program_id?: string
          registered_at?: string
          status?: Database["public"]["Enums"]["registration_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registrations_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist_entries: {
        Row: {
          id: string
          joined_at: string
          position: number
          program_id: string
          promoted_at: string | null
          registration_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          position: number
          program_id: string
          promoted_at?: string | null
          registration_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          position?: number
          program_id?: string
          promoted_at?: string | null
          registration_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_entries_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_entries_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: true
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_promote_waitlist: {
        Args: { p_program_id: string }
        Returns: {
          registration_id: string
          user_id: string
          waitlist_position: number
        }[]
      }
      award_points: {
        Args: {
          p_entity_id?: string
          p_entity_type?: string
          p_points: number
          p_reason: string
        }
        Returns: {
          level: number
          total_points: number
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "gamification_points"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      consent_parent_link: {
        Args: { p_link_id: string }
        Returns: {
          consented_at: string | null
          created_at: string
          id: string
          is_active: boolean
          parent_user_id: string
          relationship: string | null
          youth_user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "parent_links"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      enroll_in_course: {
        Args: { p_course_id: string }
        Returns: {
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          status: Database["public"]["Enums"]["enrollment_status"]
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "enrollments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_any_role: {
        Args: { required_roles: Database["public"]["Enums"]["app_role"][] }
        Returns: boolean
      }
      has_role: {
        Args: { required_role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      register_for_program: {
        Args: { p_program_id: string }
        Returns: {
          registration_id: string
          registration_status: Database["public"]["Enums"]["registration_status"]
          waitlist_position: number
        }[]
      }
      update_lesson_progress: {
        Args: { p_lesson_id: string; p_progress_percent: number }
        Returns: {
          completed_at: string | null
          lesson_id: string
          progress_percent: number
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "lesson_progress"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      verify_certificate: {
        Args: { p_code: string }
        Returns: {
          certificate_number: string
          issued_at: string
          title: string
          valid: boolean
        }[]
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "program_manager"
        | "content_manager"
        | "mentor_manager"
        | "regional_manager"
        | "crm_manager"
        | "auditor"
      content_status: "draft" | "published" | "archived"
      enrollment_status: "active" | "completed" | "cancelled"
      program_status:
        | "draft"
        | "published"
        | "registration_closed"
        | "running"
        | "completed"
        | "archived"
      registration_status:
        | "pending"
        | "confirmed"
        | "waitlisted"
        | "cancelled"
        | "rejected"
        | "completed"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: [
        "super_admin",
        "program_manager",
        "content_manager",
        "mentor_manager",
        "regional_manager",
        "crm_manager",
        "auditor",
      ],
      content_status: ["draft", "published", "archived"],
      enrollment_status: ["active", "completed", "cancelled"],
      program_status: [
        "draft",
        "published",
        "registration_closed",
        "running",
        "completed",
        "archived",
      ],
      registration_status: [
        "pending",
        "confirmed",
        "waitlisted",
        "cancelled",
        "rejected",
        "completed",
      ],
    },
  },
} as const
