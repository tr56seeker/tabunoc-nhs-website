import { NextResponse } from "next/server";

import { memoCategories } from "@/data/memos";
import { requireAdminApi } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type RouteContext = { params: Promise<{ id: string }> };

const statuses = new Set(["draft", "published", "archived"]);
const categories = new Set<string>(memoCategories.filter((category) => category !== "All"));

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export async function PATCH(request: Request, context: RouteContext) {
  const { response } = await requireAdminApi(request);
  if (response) return response;

  const { id } = await context.params;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const updates: Record<string, string> = {};
  const fields = [
    ["memo_number", 100],
    ["title", 240],
    ["issuing_office", 160],
    ["description", 1500],
  ] as const;

  for (const [field, maxLength] of fields) {
    if (field in body) {
      if (typeof body[field] !== "string") {
        return NextResponse.json({ error: `${field} must be text.` }, { status: 400 });
      }
      const value = body[field].trim();
      if ((field !== "description" && !value) || value.length > maxLength) {
        return NextResponse.json({ error: `${field} is required or too long.` }, { status: 400 });
      }
      updates[field] = value;
    }
  }

  if ("date_issued" in body) {
    if (typeof body.date_issued !== "string" || !validDate(body.date_issued)) {
      return NextResponse.json({ error: "Issue date is invalid." }, { status: 400 });
    }
    updates.date_issued = body.date_issued;
  }
  if ("category" in body) {
    if (typeof body.category !== "string" || !categories.has(body.category)) {
      return NextResponse.json({ error: "Memo category is invalid." }, { status: 400 });
    }
    updates.category = body.category;
  }
  if ("status" in body) {
    if (typeof body.status !== "string" || !statuses.has(body.status)) {
      return NextResponse.json({ error: "Memo status is invalid." }, { status: 400 });
    }
    updates.status = body.status;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid changes were provided." }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("school_memos")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Unable to update school memo:", error.message);
    return NextResponse.json({ error: "The memo could not be updated." }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Memo not found." }, { status: 404 });

  return NextResponse.json({ memo: data });
}

export async function DELETE(request: Request, context: RouteContext) {
  const { response } = await requireAdminApi(request);
  if (response) return response;

  const { id } = await context.params;
  const { data, error } = await getSupabaseAdmin()
    .from("school_memos")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Unable to archive school memo:", error.message);
    return NextResponse.json({ error: "The memo could not be archived." }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Memo not found." }, { status: 404 });

  return NextResponse.json({ memo: data });
}
