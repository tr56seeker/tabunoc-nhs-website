"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Archive, CalendarDays, LoaderCircle, Pencil, Plus, RotateCcw } from "lucide-react";

import {
  calendarCategories,
  calendarEventStatuses,
  type AdminCalendarEvent,
} from "@/lib/calendarEventOptions";

type CalendarForm = {
  title: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  category: string;
  audience: string;
  event_status: string;
  location: string;
  description: string;
  publication_status: string;
};

const emptyForm: CalendarForm = {
  title: "",
  start_date: "",
  end_date: "",
  start_time: "",
  end_time: "",
  category: "Academic",
  audience: "School Community",
  event_status: "Confirmed",
  location: "",
  description: "",
  publication_status: "draft",
};

function publicationClass(status: string) {
  if (status === "published") return "bg-emerald-100 text-emerald-800";
  if (status === "archived") return "bg-slate-200 text-slate-600";
  return "bg-amber-100 text-amber-800";
}

export default function CalendarEventsManager() {
  const [events, setEvents] = useState<AdminCalendarEvent[]>([]);
  const [form, setForm] = useState<CalendarForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [databaseReady, setDatabaseReady] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/calendar-events", { cache: "no-store" });
      const payload = (await response.json()) as {
        events?: AdminCalendarEvent[];
        databaseReady?: boolean;
        warning?: string;
        error?: string;
      };
      if (!response.ok) throw new Error(payload.error || "Unable to load calendar events.");
      setEvents(payload.events ?? []);
      setDatabaseReady(payload.databaseReady !== false);
      setWarning(payload.warning ?? "");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load calendar events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      void loadEvents();
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [loadEvents]);

  const visibleEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return events.filter((event) => {
      if (!showArchived && event.publication_status === "archived") return false;
      if (!query) return true;
      return [event.title, event.category, event.audience, event.start_date, event.event_status]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [events, search, showArchived]);

  function updateForm<Key extends keyof CalendarForm>(key: Key, value: CalendarForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  }

  function beginEdit(event: AdminCalendarEvent) {
    setEditingId(event.id);
    setForm({
      title: event.title,
      start_date: event.start_date,
      end_date: event.end_date,
      start_time: event.start_time?.slice(0, 5) ?? "",
      end_time: event.end_time?.slice(0, 5) ?? "",
      category: event.category,
      audience: event.audience,
      event_status: event.event_status,
      location: event.location ?? "",
      description: event.description,
      publication_status: event.publication_status,
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!databaseReady) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(
        editingId ? `/api/admin/calendar-events/${editingId}` : "/api/admin/calendar-events",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Unable to save calendar event.");
      setMessage(editingId ? "Calendar event updated." : "Calendar event created.");
      resetForm();
      await loadEvents();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save calendar event.");
    } finally {
      setSaving(false);
    }
  }

  async function archiveEvent(event: AdminCalendarEvent) {
    if (!databaseReady || !window.confirm(`Archive “${event.title}”? It will be hidden from the public calendar.`)) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/calendar-events/${event.id}`, { method: "DELETE" });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Unable to archive calendar event.");
      setMessage("Calendar event archived.");
      if (editingId === event.id) resetForm();
      await loadEvents();
    } catch (archiveError) {
      setError(archiveError instanceof Error ? archiveError.message : "Unable to archive calendar event.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-teal focus:ring-4 focus:ring-teal-100";

  return (
    <div className="space-y-6">
      {warning && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">{warning}</div>}
      {(message || error) && <div role="status" className={`rounded-xl border px-4 py-3 text-sm font-semibold ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{error || message}</div>}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3"><span className="rounded-xl bg-brand-mint p-3 text-brand-teal"><CalendarDays className="h-5 w-5" /></span><div><h2 className="text-xl font-semibold text-brand-navy">{editingId ? "Edit calendar event" : "Add calendar event"}</h2><p className="mt-1 text-sm leading-6 text-slate-600">Draft events stay in admin. Published events appear on the public school calendar.</p></div></div>
          {editingId && <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"><RotateCcw className="h-4 w-4" />New event</button>}
        </div>

        <form onSubmit={saveEvent} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold text-slate-700 md:col-span-2">Event title<input required maxLength={240} value={form.title} onChange={(e) => updateForm("title", e.target.value)} className={`${inputClass} mt-2`} /></label>
          <label className="text-sm font-semibold text-slate-700">Start date<input required type="date" value={form.start_date} onChange={(e) => updateForm("start_date", e.target.value)} className={`${inputClass} mt-2`} /></label>
          <label className="text-sm font-semibold text-slate-700">End date<input required type="date" min={form.start_date || undefined} value={form.end_date} onChange={(e) => updateForm("end_date", e.target.value)} className={`${inputClass} mt-2`} /></label>
          <label className="text-sm font-semibold text-slate-700">Start time (optional)<input type="time" value={form.start_time} onChange={(e) => updateForm("start_time", e.target.value)} className={`${inputClass} mt-2`} /></label>
          <label className="text-sm font-semibold text-slate-700">End time (optional)<input type="time" value={form.end_time} onChange={(e) => updateForm("end_time", e.target.value)} className={`${inputClass} mt-2`} /></label>
          <label className="text-sm font-semibold text-slate-700">Category<select value={form.category} onChange={(e) => updateForm("category", e.target.value)} className={`${inputClass} mt-2`}>{calendarCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label className="text-sm font-semibold text-slate-700">Confirmation status<select value={form.event_status} onChange={(e) => updateForm("event_status", e.target.value)} className={`${inputClass} mt-2`}>{calendarEventStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <label className="text-sm font-semibold text-slate-700">Audience<input required maxLength={200} value={form.audience} onChange={(e) => updateForm("audience", e.target.value)} className={`${inputClass} mt-2`} /></label>
          <label className="text-sm font-semibold text-slate-700">Location (optional)<input maxLength={200} value={form.location} onChange={(e) => updateForm("location", e.target.value)} className={`${inputClass} mt-2`} /></label>
          <label className="text-sm font-semibold text-slate-700 md:col-span-2">Description<textarea rows={4} maxLength={1500} value={form.description} onChange={(e) => updateForm("description", e.target.value)} className={`${inputClass} mt-2 resize-y`} /></label>
          <label className="text-sm font-semibold text-slate-700">Publication status<select value={form.publication_status} onChange={(e) => updateForm("publication_status", e.target.value)} className={`${inputClass} mt-2`}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
          <div className="flex items-end"><button disabled={saving || !databaseReady} className="inline-flex items-center gap-2 rounded-xl bg-brand-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-teal disabled:cursor-not-allowed disabled:opacity-60">{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{editingId ? "Save changes" : "Add event"}</button></div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div><h2 className="text-xl font-semibold text-brand-navy">Calendar event library</h2><p className="mt-1 text-sm text-slate-600">Baseline events can be edited or archived; the saved override will control the public calendar.</p></div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center"><input value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search calendar events" placeholder="Search events..." className={`${inputClass} sm:w-72`} /><label className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-slate-600"><input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} className="h-4 w-4" />Show archived</label></div>
        </div>

        {loading ? <p className="mt-6 flex items-center gap-2 text-sm text-slate-600"><LoaderCircle className="h-4 w-4 animate-spin" />Loading calendar events...</p> : visibleEvents.length === 0 ? <p className="mt-6 rounded-xl bg-slate-50 p-6 text-sm text-slate-600">No calendar event matches this view.</p> : <div className="mt-6 space-y-3">{visibleEvents.map((event) => (
          <article key={event.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-brand-navy">{event.title}</h3><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${publicationClass(event.publication_status)}`}>{event.publication_status}</span><span className="rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sky-800">{event.source === "baseline" ? "Official baseline" : "Admin managed"}</span></div><p className="mt-1 text-sm text-slate-600">{event.start_date}{event.end_date !== event.start_date ? ` to ${event.end_date}` : ""} · {event.category} · {event.event_status}</p><p className="mt-1 line-clamp-2 text-sm text-slate-500">{event.description || "No description supplied."}</p></div>
              <div className="flex shrink-0 flex-wrap gap-2"><button type="button" onClick={() => beginEdit(event)} disabled={!databaseReady} className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"><Pencil className="h-4 w-4" />Edit</button>{event.publication_status !== "archived" && <button type="button" onClick={() => archiveEvent(event)} disabled={!databaseReady} className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-50"><Archive className="h-4 w-4" />Archive</button>}</div>
            </div>
          </article>
        ))}</div>}
      </section>
    </div>
  );
}
