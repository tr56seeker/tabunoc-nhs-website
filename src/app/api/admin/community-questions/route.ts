import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { data, error } = await getSupabaseAdmin()
    .from("community_questions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}
