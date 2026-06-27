import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Database = {
  public: {
    Tables: {
      faq_community_questions: {
        Row: {
          id: string;
          faq_topic_id: string;
          display_name: string | null;
          audience_type: string | null;
          question: string;
          answer: string | null;
          status: string;
          created_at: string;
          approved_at: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          moderation_note: string | null;
        };
        Insert: {
          id?: string;
          faq_topic_id: string;
          display_name?: string | null;
          audience_type?: string | null;
          question: string;
          answer?: string | null;
          status?: string;
          created_at?: string;
          approved_at?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          moderation_note?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["faq_community_questions"]["Row"]>;
        Relationships: [];
      };
      homepage_highlights: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: string | null;
          image_path: string;
          image_url: string;
          alt_text: string | null;
          facebook_url: string | null;
          status: string;
          display_order: number;
          event_date: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category?: string | null;
          image_path: string;
          image_url: string;
          alt_text?: string | null;
          facebook_url?: string | null;
          status?: string;
          display_order?: number;
          event_date?: string | null;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["homepage_highlights"]["Row"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          role: string | null;
          full_name: string | null;
          email: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      faq_items: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: string | null;
          is_published: boolean;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          category?: string | null;
          is_published?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["faq_items"]["Row"]>;
        Relationships: [];
      };
      community_questions: {
        Row: {
          id: string;
          name: string | null;
          contact: string | null;
          question: string;
          category: string | null;
          status: string;
          admin_answer: string | null;
          is_public: boolean;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name?: string | null;
          contact?: string | null;
          question: string;
          category?: string | null;
          status?: string;
          admin_answer?: string | null;
          is_public?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["community_questions"]["Row"]>;
        Relationships: [];
      };
      map_locations: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          latitude: number | null;
          longitude: number | null;
          x: number | null;
          y: number | null;
          type: string | null;
          is_published: boolean;
          sort_order: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["map_locations"]["Row"]> & {
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["map_locations"]["Row"]>;
        Relationships: [];
      };
      map_routes: {
        Row: {
          id: string;
          name: string;
          route_data: unknown;
          description: string | null;
          is_published: boolean;
          sort_order: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["map_routes"]["Row"]> & {
          name: string;
          route_data?: unknown;
        };
        Update: Partial<Database["public"]["Tables"]["map_routes"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let adminClient: SupabaseClient<Database> | null = null;

export function getSupabaseAdmin() {
  if (adminClient) {
    return adminClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing Supabase admin environment variables.");
  }

  adminClient = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
    },
  });

  return adminClient;
}
