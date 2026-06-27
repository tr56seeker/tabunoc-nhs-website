import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const statuses = new Set(["draft", "published", "archived"]);

type RouteContext = { params: Promise<{ id: string }> };

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validFacebookUrl(value: string) {
  if (value.length > 500 || !value.startsWith("https://")) return false;

  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return (
      hostname === "facebook.com" ||
      hostname.endsWith(".facebook.com") ||
      hostname === "fb.watch"
    );
  } catch {
    return false;
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { response } = await requireAdminApi();
  if (response) return response;

  const { id } = await context.params;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const updates: {
    title?: string;
    description?: string | null;
    category?: string | null;
    alt_text?: string | null;
    facebook_url?: string | null;
    status?: string;
    display_order?: number;
    event_date?: string | null;
    updated_at?: string;
  } = {};
  const textFields = [
    ["title", 120],
    ["description", 600],
    ["category", 80],
    ["alt_text", 300],
  ] as const;

  for (const [field, limit] of textFields) {
    if (field in body) {
      if (typeof body[field] !== "string") {
        return NextResponse.json({ error: `${field} must be text.` }, { status: 400 });
      }
      const value = body[field].trim();
      if (value.length > limit || (field === "title" && !value)) {
        return NextResponse.json({ error: `${field} is invalid or too long.` }, { status: 400 });
      }
      if (field === "title") updates.title = value;
      if (field === "description") updates.description = value || null;
      if (field === "category") updates.category = value || null;
      if (field === "alt_text") updates.alt_text = value || null;
    }
  }

  if ("status" in body) {
    if (typeof body.status !== "string" || !statuses.has(body.status)) {
      return NextResponse.json({ error: "Status is invalid." }, { status: 400 });
    }
    updates.status = body.status;
  }
  if ("display_order" in body) {
    if (typeof body.display_order !== "number" || !Number.isInteger(body.display_order)) {
      return NextResponse.json({ error: "Display order must be a whole number." }, { status: 400 });
    }
    updates.display_order = body.display_order;
  }
  if ("event_date" in body) {
    if (
      body.event_date !== null &&
      (typeof body.event_date !== "string" || !validDate(body.event_date))
    ) {
      return NextResponse.json({ error: "Event date is invalid." }, { status: 400 });
    }
    updates.event_date = body.event_date as string | null;
  }
  if ("facebook_url" in body) {
    if (typeof body.facebook_url !== "string") {
      return NextResponse.json({ error: "facebook_url must be text." }, { status: 400 });
    }
    const facebookUrl = body.facebook_url.trim();
    if (facebookUrl && !validFacebookUrl(facebookUrl)) {
      return NextResponse.json(
        { error: "Facebook Post URL must be a valid HTTPS facebook.com or fb.watch link (maximum 500 characters)." },
        { status: 400 },
      );
    }
    updates.facebook_url = facebookUrl || null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No supported changes were provided." }, { status: 400 });
  }
  updates.updated_at = new Date().toISOString();

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("homepage_highlights")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json({ highlight: data });
  } catch (error) {
    console.error("Unable to update homepage highlight:", error);
    return NextResponse.json({ error: "The highlight could not be updated." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { response } = await requireAdminApi();
  if (response) return response;
  const { id } = await context.params;
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("homepage_highlights")
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json({ highlight: data });
  } catch (error) {
    console.error("Unable to archive homepage highlight:", error);
    return NextResponse.json({ error: "The highlight could not be archived." }, { status: 500 });
  }
}
