import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  const body = await request.json();
  const payload = {
    title: String(body.title ?? ""),
    description: body.caption || null,
    image_url: body.image_url || "",
    image_path: body.image_url || "",
    category: body.category || null,
    status: body.is_published ? "published" : "draft",
    display_order: Number(body.sort_order ?? 0),
    updated_at: new Date().toISOString(),
  };

  const { error } = await getSupabaseAdmin()
    .from("homepage_highlights")
    .update(payload)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await params;
  const { error } = await getSupabaseAdmin()
    .from("homepage_highlights")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
