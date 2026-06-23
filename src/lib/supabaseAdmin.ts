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
