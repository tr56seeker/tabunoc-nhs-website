import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/adminAuth";
import { validateCalendarEventBody } from "@/lib/calendarEventValidation";
import {
  mergeAdminCalendarEvents,
  readBaselineCalendarEvents,
} from "@/lib/calendarEvents";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  const { response } = await requireAdminApi();
  if (response) return response;

  const baseline = readBaselineCalendarEvents();
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("school_calendar_events")
      .select("*")
      .order("start_date", { ascending: true });

    if (error) throw error;
    return NextResponse.json({
      events: mergeAdminCalendarEvents(baseline, data ?? []),
      databaseReady: true,
    });
  } catch (error) {
    console.error("Unable to load managed calendar events:", error);
    return NextResponse.json({
      events: mergeAdminCalendarEvents(baseline, []),
      databaseReady: false,
      warning: "Calendar database migration is not active yet. Existing events are read-only until it is applied.",
    });
  }
}

export async function POST(request: Request) {
  const { adminUser, response } = await requireAdminApi(request);
  if (response || !adminUser) return response;

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

  const { data, error } = await getSupabaseAdmin()
    .from("school_calendar_events")
    .insert({
      id: randomUUID(),
      ...validated.value,
      created_by: adminUser.id,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Unable to create calendar event:", error.message);
    return NextResponse.json({ error: "The calendar event could not be saved." }, { status: 500 });
  }

  return NextResponse.json({ event: { ...data, source: "admin" } }, { status: 201 });
}
