import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function normalizeHighlight(row: Record<string, unknown>) {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    caption: (row.caption ?? row.description ?? null) as string | null,
    image_url: (row.image_url ?? null) as string | null,
    category: (row.category ?? null) as string | null,
    is_featured: Boolean(row.is_featured ?? false),
    is_published:
      typeof row.is_published === "boolean"
        ? row.is_published
        : row.status === "published",
    sort_order: Number(row.sort_order ?? row.display_order ?? 0),
  };
}

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { data, error } = await getSupabaseAdmin()
    .from("homepage_highlights")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: (data ?? []).map(normalizeHighlight) });
}

export async function POST(request: Request) {
  const { response } = await requireAdminApi();
  if (response) return response;

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

  const { data, error } = await getSupabaseAdmin()
    .from("homepage_highlights")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ item: normalizeHighlight(data) }, { status: 201 });
}
