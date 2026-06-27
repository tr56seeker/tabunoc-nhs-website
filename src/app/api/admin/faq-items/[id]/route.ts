import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  const body = await request.json();
  const { error } = await getSupabaseAdmin()
    .from("faq_items")
    .update({
      question: String(body.question ?? ""),
      answer: String(body.answer ?? ""),
      category: body.category || null,
      is_published: Boolean(body.is_published),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
