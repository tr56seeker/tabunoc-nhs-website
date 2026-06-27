import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  const body = await request.json();
  const supabase = getSupabaseAdmin();
  const adminAnswer = String(body.admin_answer ?? "");

  const { data, error } = await supabase
    .from("community_questions")
    .update({
      admin_answer: adminAnswer,
      status: body.status || "answered",
      is_public: Boolean(body.is_public),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (body.publishAsFaq && data) {
    await supabase.from("faq_items").insert({
      question: data.question,
      answer: adminAnswer,
      category: data.category || "Community Questions",
      is_published: true,
      updated_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({ item: data });
}
