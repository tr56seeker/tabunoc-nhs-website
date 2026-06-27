import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { data, error } = await getSupabaseAdmin()
    .from("faq_items")
    .select("*")
    .order("category", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const body = await request.json();
  const { data, error } = await getSupabaseAdmin()
    .from("faq_items")
    .insert({
      question: String(body.question ?? ""),
      answer: String(body.answer ?? ""),
      category: body.category || null,
      is_published: Boolean(body.is_published),
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}
