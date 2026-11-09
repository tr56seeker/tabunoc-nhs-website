import fs from "node:fs";
import path from "node:path";

import type { CalendarEvent } from "@/components/SchoolCalendar";
import type { AdminCalendarEvent, CalendarDatabaseRecord } from "@/lib/calendarEventOptions";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export function readBaselineCalendarEvents() {
  return JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), "public/data/school-calendar-events.json"),
      "utf8",
    ),
  ) as CalendarEvent[];
}

export function calendarRecordToEvent(record: CalendarDatabaseRecord): CalendarEvent {
  return {
    id: record.id,
    title: record.title,
    startDate: record.start_date,
    endDate: record.end_date,
    startTime: record.start_time ?? undefined,
    endTime: record.end_time ?? undefined,
    category: record.category,
    audience: record.audience,
    status: record.event_status as CalendarEvent["status"],
    location: record.location ?? undefined,
    description: record.description,
  };
}

export function baselineEventToAdminRecord(event: CalendarEvent): AdminCalendarEvent {
  return {
    id: event.id,
    title: event.title,
    start_date: event.startDate,
    end_date: event.endDate,
    start_time: event.startTime ?? null,
    end_time: event.endTime ?? null,
    category: event.category,
    audience: event.audience,
    event_status: event.status,
    location: event.location ?? null,
    description: event.description,
    publication_status: "published",
    created_by: null,
    created_at: "",
    updated_at: "",
    source: "baseline",
  };
}

export function mergeAdminCalendarEvents(
  baseline: CalendarEvent[],
  records: CalendarDatabaseRecord[],
) {
  const merged = new Map<string, AdminCalendarEvent>(
    baseline.map((event) => [event.id, baselineEventToAdminRecord(event)]),
  );

  for (const record of records) {
    merged.set(record.id, { ...record, source: "admin" });
  }

  return [...merged.values()].sort((a, b) =>
    a.start_date === b.start_date
      ? a.title.localeCompare(b.title)
      : a.start_date.localeCompare(b.start_date),
  );
}

export async function loadPublishedCalendarEvents() {
  const baseline = readBaselineCalendarEvents();

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("school_calendar_events")
      .select("*")
      .order("start_date", { ascending: true });

    if (error) throw error;

    const merged = new Map(baseline.map((event) => [event.id, event]));
    for (const record of data ?? []) {
      if (record.publication_status === "published") {
        merged.set(record.id, calendarRecordToEvent(record));
      } else {
        merged.delete(record.id);
      }
    }

    return [...merged.values()].sort((a, b) =>
      a.startDate === b.startDate
        ? a.title.localeCompare(b.title)
        : a.startDate.localeCompare(b.startDate),
    );
  } catch (error) {
    console.error("Unable to load managed school calendar events:", error);
    return baseline;
  }
}
