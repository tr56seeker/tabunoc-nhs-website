import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/adminAuth";
import { validateCalendarEventBody } from "@/lib/calendarEventValidation";
import { baselineEventToAdminRecord, readBaselineCalendarEvents } from "@/lib/calendarEvents";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { adminUser, response } = await requireAdminApi(request);
  if (response || !adminUser) return response;

  const { id } = await context.params;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validated = validateCalendarEventBody(body);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const now = new Date().toISOString();
  const { data, error } = await getSupabaseAdmin()
    .from("school_calendar_events")
    .upsert(
      {
        id,
        ...validated.value,
        created_by: adminUser.id,
        updated_at: now,
      },
      { onConflict: "id" },
    )
    .select("*")
    .single();

  if (error) {
    console.error("Unable to update calendar event:", error.message);
    return NextResponse.json({ error: "The calendar event could not be updated." }, { status: 500 });
  }

  return NextResponse.json({ event: { ...data, source: "admin" } });
}

export async function DELETE(request: Request, context: RouteContext) {
  const { adminUser, response } = await requireAdminApi(request);
  if (response || !adminUser) return response;

  const { id } = await context.params;
  const supabase = getSupabaseAdmin();
  const { data: existing, error: lookupError } = await supabase
    .from("school_calendar_events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json({ error: "The calendar event could not be loaded." }, { status: 500 });
  }

  const baseline = readBaselineCalendarEvents().find((event) => event.id === id);
  const record = existing ?? (baseline ? baselineEventToAdminRecord(baseline) : null);
  if (!record) return NextResponse.json({ error: "Calendar event not found." }, { status: 404 });

  const { data, error } = await supabase
    .from("school_calendar_events")
    .upsert(
      {
        id,
        title: record.title,
        start_date: record.start_date,
        end_date: record.end_date,
        start_time: record.start_time,
        end_time: record.end_time,
        category: record.category,
        audience: record.audience,
        event_status: record.event_status,
        location: record.location,
        description: record.description,
        publication_status: "archived",
        created_by: existing?.created_by ?? adminUser.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    )
    .select("*")
    .single();

  if (error) {
    console.error("Unable to archive calendar event:", error.message);
    return NextResponse.json({ error: "The calendar event could not be archived." }, { status: 500 });
  }

  return NextResponse.json({ event: { ...data, source: "admin" } });
}
