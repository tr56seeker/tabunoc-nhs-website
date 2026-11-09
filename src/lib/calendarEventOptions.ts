export const calendarCategories = [
  "Academic",
  "Enrollment",
  "Examination",
  "DRRM",
  "Brigada Eskwela",
  "School Program",
  "Holiday",
  "DepEd Activity",
] as const;

export const calendarEventStatuses = [
  "Confirmed",
  "Tentative",
  "For Confirmation",
] as const;

export type CalendarPublicationStatus = "draft" | "published" | "archived";

export type CalendarDatabaseRecord = {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  start_time: string | null;
  end_time: string | null;
  category: string;
  audience: string;
  event_status: string;
  location: string | null;
  description: string;
  publication_status: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminCalendarEvent = CalendarDatabaseRecord & {
  source: "baseline" | "admin";
};
