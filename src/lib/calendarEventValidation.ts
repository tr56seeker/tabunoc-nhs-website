import { calendarCategories, calendarEventStatuses } from "@/lib/calendarEventOptions";

const publicationStatuses = new Set(["draft", "published", "archived"]);
const categories = new Set<string>(calendarCategories);
const eventStatuses = new Set<string>(calendarEventStatuses);

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function optionalTime(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return undefined;
  return value;
}

export function validateCalendarEventBody(body: Record<string, unknown>) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const startDate = typeof body.start_date === "string" ? body.start_date : "";
  const endDate = typeof body.end_date === "string" ? body.end_date : "";
  const category = typeof body.category === "string" ? body.category : "";
  const audience = typeof body.audience === "string" ? body.audience.trim() : "";
  const eventStatus = typeof body.event_status === "string" ? body.event_status : "";
  const location = typeof body.location === "string" ? body.location.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const publicationStatus =
    typeof body.publication_status === "string" ? body.publication_status : "draft";
  const startTime = optionalTime(body.start_time);
  const endTime = optionalTime(body.end_time);

  if (!title || !audience || !validDate(startDate) || !validDate(endDate)) {
    return { error: "Title, valid start/end dates, and audience are required." } as const;
  }
  if (endDate < startDate) {
    return { error: "End date cannot be earlier than start date." } as const;
  }
  if (!categories.has(category)) {
    return { error: "Select a valid event category." } as const;
  }
  if (!eventStatuses.has(eventStatus)) {
    return { error: "Select a valid event confirmation status." } as const;
  }
  if (!publicationStatuses.has(publicationStatus)) {
    return { error: "Publication status is invalid." } as const;
  }
  if (startTime === undefined || endTime === undefined) {
    return { error: "Event times must use a valid 24-hour time." } as const;
  }
  if (
    title.length > 240 ||
    audience.length > 200 ||
    location.length > 200 ||
    description.length > 1500
  ) {
    return { error: "One or more event fields exceed their character limit." } as const;
  }

  return {
    value: {
      title,
      start_date: startDate,
      end_date: endDate,
      start_time: startTime,
      end_time: endTime,
      category,
      audience,
      event_status: eventStatus,
      location: location || null,
      description,
      publication_status: publicationStatus,
    },
  } as const;
}
