"use client";

import { useEffect, useMemo, useState } from "react";
import TypewriterText from "@/components/TypewriterText";

type CalendarView = "Day" | "Week" | "Month" | "Year";

type CalendarEvent = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  category: string;
  audience: string;
  status: "Confirmed" | "Tentative" | "For Confirmation";
  location?: string;
  description: string;
};

const categories = ["All", "Academic", "Enrollment", "Examination", "DRRM", "Brigada Eskwela", "School Program", "Holiday", "DepEd Activity"];
const views: CalendarView[] = ["Day", "Week", "Month", "Year"];
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const dotColors: Record<string, string> = {
  Academic: "bg-[#24313E]",
  Enrollment: "bg-[#e9c500]",
  Examination: "bg-rose-500",
  DRRM: "bg-cyan-600",
  "Brigada Eskwela": "bg-emerald-600",
  "School Program": "bg-violet-500",
  Holiday: "bg-slate-500",
  "DepEd Activity": "bg-blue-500",
};

const categoryStyles: Record<string, string> = {
  Academic: "border-slate-300 bg-slate-100 text-[#24313E]",
  Enrollment: "border-yellow-300 bg-yellow-50 text-yellow-800",
  Examination: "border-rose-200 bg-rose-50 text-rose-800",
  DRRM: "border-cyan-200 bg-cyan-50 text-cyan-800",
  "Brigada Eskwela": "border-emerald-200 bg-emerald-50 text-emerald-800",
  "School Program": "border-violet-200 bg-violet-50 text-violet-800",
  Holiday: "border-slate-200 bg-slate-50 text-slate-700",
  "DepEd Activity": "border-blue-200 bg-blue-50 text-blue-800",
};

const statusStyles: Record<CalendarEvent["status"], string> = {
  Confirmed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Tentative: "border-amber-200 bg-amber-50 text-amber-800",
  "For Confirmation": "border-slate-200 bg-slate-100 text-slate-700",
};

function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatMonthYear(date: Date) {
  return new Intl.DateTimeFormat("en-PH", { month: "long", year: "numeric" }).format(date);
}

function formatFullDate(date: Date) {
  return new Intl.DateTimeFormat("en-PH", { month: "long", day: "numeric", year: "numeric" }).format(date);
}

function formatDateRange(event: CalendarEvent) {
  const start = parseLocalDate(event.startDate);
  const end = parseLocalDate(event.endDate);
  if (isSameDay(start, end)) return formatFullDate(start);
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${new Intl.DateTimeFormat("en-PH", { month: "long" }).format(start)} ${start.getDate()}â€“${end.getDate()}, ${start.getFullYear()}`;
  }
  const short = new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" });
  return `${short.format(start)} â€“ ${short.format(end)}`;
}

function formatEventTime(event: CalendarEvent) {
  if (!event.startTime) return "All day";
  const format = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    return new Intl.DateTimeFormat("en-PH", { hour: "numeric", minute: "2-digit" }).format(new Date(2000, 0, 1, hours, minutes));
  };
  return event.endTime ? `${format(event.startTime)} â€“ ${format(event.endTime)}` : format(event.startTime);
}

function getStartOfWeek(date: Date) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  result.setDate(result.getDate() - result.getDay());
  result.setHours(0, 0, 0, 0);
  return result;
}

function getMonthDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const start = getStartOfWeek(first);
  const end = getStartOfWeek(last);
  end.setDate(end.getDate() + 6);

  const days: Date[] = [];
  const current = new Date(start);

  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return days;
}

function getYearMonths(year: number) {
  return Array.from({ length: 12 }, (_, month) => new Date(year, month, 1));
}

function isSameDay(first: Date, second: Date) {
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
}

function isDateInRange(date: Date, startDate: string, endDate: string) {
  const value = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  return value >= parseLocalDate(startDate).getTime() && value <= parseLocalDate(endDate).getTime();
}

function getEventsForDate(events: CalendarEvent[], date: Date) {
  return events.filter((event) => isDateInRange(date, event.startDate, event.endDate));
}

function getUpcomingEvents(events: CalendarEvent[], fromDate: Date, limit = 8) {
  const from = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()).getTime();
  return events
    .filter((event) => parseLocalDate(event.endDate).getTime() >= from)
    .sort((first, second) => parseLocalDate(first.startDate).getTime() - parseLocalDate(second.startDate).getTime())
    .slice(0, limit);
}

function periodTitle(view: CalendarView, date: Date) {
  if (view === "Day") return formatFullDate(date);
  if (view === "Month") return formatMonthYear(date);
  if (view === "Year") return String(date.getFullYear());
  const start = getStartOfWeek(date);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  if (start.getMonth() === end.getMonth()) return `${new Intl.DateTimeFormat("en-PH", { month: "long" }).format(start)} ${start.getDate()}â€“${end.getDate()}, ${end.getFullYear()}`;
  return `${new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric" }).format(start)} â€“ ${new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" }).format(end)}`;
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true"><path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function CalendarIcon() {
  return <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true"><path d="M7 3v3m10-3v3M4.5 9.5h15M6 5h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
}

function EventDots({ events }: { events: CalendarEvent[] }) {
  const dots = Array.from(new Set(events.map((event) => event.category))).slice(0, 3);
  return <span className="flex min-h-2 items-center justify-center gap-1" aria-label={events.length ? `${events.length} activities` : undefined}>{dots.map((category) => <span key={category} className={`h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${dotColors[category] ?? "bg-slate-400"}`} />)}</span>;
}

function EventRow({ event, selected, onSelect }: { event: CalendarEvent; selected: boolean; onSelect: (event: CalendarEvent) => void }) {
  return (
    <button type="button" onClick={() => onSelect(event)} className={`relative w-full overflow-hidden rounded-xl border bg-white p-4 pl-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24313E] ${selected ? "border-[#e0c400] shadow-[0_0_0_4px_rgba(255,223,32,0.18)]" : "border-slate-200 hover:border-slate-300"}`}>
      <span className={`absolute inset-y-3 left-0 w-1 rounded-r-full ${dotColors[event.category] ?? "bg-slate-400"}`} aria-hidden="true" />
      <span className="block font-semibold leading-5 text-[#24313E]">{event.title}</span>
      <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{formatDateRange(event)} Â· {formatEventTime(event)}</span>
      <span className="mt-2 flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${categoryStyles[event.category] ?? "border-slate-200 bg-slate-50 text-slate-700"}`}>{event.category}</span>
        <span className="text-[11px] font-bold text-slate-500">{event.status} Â· {event.audience}</span>
      </span>
    </button>
  );
}

export default function SchoolCalendar() {
  const today = useMemo(() => new Date(), []);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<CalendarView>("Month");
  const [selectedDate, setSelectedDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/data/school-calendar-events.json")
      .then((response) => { if (!response.ok) throw new Error("Unable to load calendar events"); return response.json() as Promise<CalendarEvent[]>; })
      .then((data) => { if (active) setEvents([...data].sort((a, b) => parseLocalDate(a.startDate).getTime() - parseLocalDate(b.startDate).getTime())); })
      .catch(() => { if (active) setEvents([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setSelectedEvent(null); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selectedEvent]);

  const filteredEvents = useMemo(() => selectedCategory === "All" ? events : events.filter((event) => event.category === selectedCategory), [events, selectedCategory]);
  const selectedDateEvents = useMemo(() => getEventsForDate(filteredEvents, selectedDate), [filteredEvents, selectedDate]);
  const panelEvents = useMemo(() => selectedDateEvents.length ? selectedDateEvents : getUpcomingEvents(filteredEvents, selectedDate), [filteredEvents, selectedDate, selectedDateEvents]);

  const movePeriod = (direction: number) => {
    setSelectedEvent(null);
    setSelectedDate((current) => {
      if (view === "Day") return new Date(current.getFullYear(), current.getMonth(), current.getDate() + direction);
      if (view === "Week") return new Date(current.getFullYear(), current.getMonth(), current.getDate() + direction * 7);
      if (view === "Month") return new Date(current.getFullYear(), current.getMonth() + direction, 1);
      return new Date(current.getFullYear() + direction, current.getMonth(), 1);
    });
  };

  const selectDate = (date: Date, dateEvents: CalendarEvent[]) => {
    setSelectedDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
    if (dateEvents.length) setSelectedEvent(dateEvents[0]);
  };

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-slate-900">
      <section className="relative overflow-hidden bg-[#24313E] px-5 pb-14 pt-32 text-white sm:px-8 lg:pb-16 lg:pt-36">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[56px] border-white/[0.04]" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 h-1.5 w-full bg-[#ffdf20]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#ffdf20]"><CalendarIcon /> SY 2026-2027</span>
          <TypewriterText as="h1" text="School Calendar" speed={58} className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl" />
          <p className="mt-5 max-w-3xl text-base font-medium leading-7 text-slate-200 sm:text-lg sm:leading-8">View upcoming school activities, academic schedules, enrollment dates, DRRM activities, and other public school events of Tabunoc National High School.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-7 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-6">
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Filter by category</p>
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-1 pb-2" role="group" aria-label="Calendar category filters">
            {categories.map((category) => <button key={category} type="button" aria-pressed={selectedCategory === category} onClick={() => setSelectedCategory(category)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24313E] ${selectedCategory === category ? "border-[#24313E] bg-[#24313E] text-white shadow-sm" : "border-slate-200 bg-white/80 text-slate-600 hover:bg-white"}`}>{category}</button>)}
          </div>
        </div>

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="overflow-hidden rounded-2xl bg-white/85 p-3 shadow-[0_18px_45px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70 backdrop-blur sm:p-6">
            <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5">
              <div className="flex items-center rounded-xl bg-[#ede9e0] p-1" role="group" aria-label="Calendar view">
                {views.map((item) => <button key={item} type="button" aria-pressed={view === item} onClick={() => setView(item)} className={`min-w-0 flex-1 rounded-lg px-2 py-2 text-xs font-semibold transition sm:text-sm ${view === item ? "bg-white text-[#24313E] shadow-sm" : "text-slate-500 hover:text-[#24313E]"}`}>{item}</button>)}
              </div>
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                <div className="flex gap-1">
                  <button type="button" onClick={() => movePeriod(-1)} aria-label={`Previous ${view.toLowerCase()}`} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#24313E] hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24313E]"><ArrowIcon direction="left" /></button>
                  <button type="button" onClick={() => movePeriod(1)} aria-label={`Next ${view.toLowerCase()}`} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#24313E] hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24313E]"><ArrowIcon direction="right" /></button>
                </div>
                <h2 className="px-1 text-center text-base font-semibold leading-tight text-[#24313E] sm:text-2xl">{periodTitle(view, selectedDate)}</h2>
                <button type="button" onClick={() => setSelectedDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()))} className="rounded-xl bg-[#ffdf20] px-3 py-2.5 text-xs font-semibold text-[#24313E] hover:bg-[#f1d200] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24313E] sm:px-4 sm:text-sm">Today</button>
              </div>
            </div>

            {view === "Month" && <MonthView month={selectedDate} today={today} selectedDate={selectedDate} events={filteredEvents} onSelectDate={selectDate} />}
            {view === "Week" && <WeekView date={selectedDate} today={today} selectedDate={selectedDate} events={filteredEvents} onSelectDate={selectDate} onSelectEvent={setSelectedEvent} />}
            {view === "Day" && <DayView date={selectedDate} events={selectedDateEvents} onSelectEvent={setSelectedEvent} />}
            {view === "Year" && <YearView year={selectedDate.getFullYear()} events={filteredEvents} onSelectMonth={(month) => { setSelectedDate(month); setView("Month"); }} />}
          </div>

          <aside aria-labelledby="upcoming-heading" className="rounded-2xl bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70 backdrop-blur sm:p-6 lg:sticky lg:top-28">
            <div className="mb-5 flex items-start justify-between gap-3"><div><h2 id="upcoming-heading" className="text-2xl font-semibold text-[#24313E]">Upcoming Activities</h2><p className="mt-1 text-sm leading-5 text-slate-500">{selectedDateEvents.length ? `Activities on ${formatFullDate(selectedDate)}` : "Public school events and important dates"}</p></div><span className="rounded-full bg-[#ffdf20] px-3 py-1 text-xs font-semibold text-[#24313E]">{panelEvents.length}</span></div>
            <div className="max-h-[680px] space-y-3 overflow-y-auto pr-1">
              {loading ? <p className="rounded-xl bg-slate-50 p-6 text-sm font-semibold text-slate-500">Loading activitiesâ€¦</p> : panelEvents.length ? panelEvents.map((event) => <EventRow key={event.id} event={event} selected={selectedEvent?.id === event.id} onSelect={setSelectedEvent} />) : <p className="rounded-xl border border-dashed border-slate-300 p-7 text-center text-sm font-semibold leading-6 text-slate-500">No public school activities listed for this date.</p>}
            </div>
          </aside>
        </div>

        <div className="mt-9 flex gap-3 rounded-xl border border-slate-200 bg-white/85 p-5 text-sm leading-6 text-slate-600 shadow-sm sm:p-6"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ffdf20] font-semibold text-[#24313E]" aria-hidden="true">i</span><p><strong className="text-[#24313E]">Public information notice.</strong> Calendar entries are provided for public information and may be updated based on DepEd issuances, school memoranda, weather conditions, class suspensions, or other official announcements.</p></div>
      </section>

      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </main>
  );
}

function MonthView({ month, today, selectedDate, events, onSelectDate }: { month: Date; today: Date; selectedDate: Date; events: CalendarEvent[]; onSelectDate: (date: Date, events: CalendarEvent[]) => void }) {
  return <div className="pt-5"><div className="grid grid-cols-7 gap-1.5 sm:gap-2">{weekdays.map((day, index) => <div key={`${day}-${index}`} className="pb-2 text-center text-[22px] font-semibold leading-none text-[#0d0907] sm:text-[26px]">{day.charAt(0)}</div>)}{getMonthDays(month).map((date) => { const dateEvents = getEventsForDate(events, date); const selected = isSameDay(date, selectedDate); const currentMonth = date.getMonth() === month.getMonth(); const currentDay = isSameDay(date, today); const tileTone = currentDay ? "bg-[#f1d200] text-[#0d0907] ring-2 ring-[#f1d200]/40 shadow-md" : currentMonth ? "bg-[#d3cfc6] text-[#0d0907]" : "bg-[#e4e3df] text-[#9c9b97]"; const selectedStyle = selected && !currentDay ? "ring-2 ring-[#24313E]/30 shadow-md" : ""; return <button key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`} type="button" onClick={() => onSelectDate(date, dateEvents)} aria-label={`${formatFullDate(date)}${dateEvents.length ? `, ${dateEvents.length} activities` : ""}`} aria-pressed={selected} className={`relative flex aspect-square min-h-11 flex-col items-center justify-between rounded-lg p-1.5 hover:brightness-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24313E] sm:p-2.5 ${tileTone} ${selectedStyle}`}><span className="pt-0.5 text-[22px] font-semibold leading-none sm:text-[26px]">{date.getDate()}</span><EventDots events={dateEvents} /><span className="sr-only">{selected ? "Selected date" : ""}</span></button>; })}</div></div>;
}

function WeekView({ date, today, selectedDate, events, onSelectDate, onSelectEvent }: { date: Date; today: Date; selectedDate: Date; events: CalendarEvent[]; onSelectDate: (date: Date, events: CalendarEvent[]) => void; onSelectEvent: (event: CalendarEvent) => void }) {
  const start = getStartOfWeek(date);
  const days = Array.from({ length: 7 }, (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index));
  return <div className="grid gap-3 pt-5 sm:grid-cols-2 xl:grid-cols-7">{days.map((day) => { const dayEvents = getEventsForDate(events, day); const selected = isSameDay(day, selectedDate); return <div key={day.toISOString()} className={`rounded-xl border p-3 ${selected ? "border-[#e0c400] bg-yellow-50/50 shadow-[0_0_0_3px_rgba(255,223,32,0.16)]" : "border-slate-200 bg-[#f7f5ef]"}`}><button type="button" onClick={() => onSelectDate(day, [])} className="w-full rounded-xl text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24313E]"><span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">{weekdays[day.getDay()]}</span><span className={`mx-auto mt-1 flex h-10 w-10 items-center justify-center rounded-full text-xl font-semibold ${isSameDay(day, today) ? "bg-[#24313E] text-[#ffdf20]" : "text-[#24313E]"}`}>{day.getDate()}</span><EventDots events={dayEvents} /></button><div className="mt-3 space-y-2">{dayEvents.map((event) => <button key={event.id} type="button" onClick={() => onSelectEvent(event)} className="w-full rounded-lg bg-white px-2 py-2 text-left text-[11px] font-bold leading-4 text-[#24313E] shadow-sm hover:ring-1 hover:ring-slate-300">{event.title}</button>)}</div></div>; })}</div>;
}

function DayView({ date, events, onSelectEvent }: { date: Date; events: CalendarEvent[]; onSelectEvent: (event: CalendarEvent) => void }) {
  return <div className="pt-6"><div className="mb-5 rounded-xl bg-[#24313E] p-5 text-white"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ffdf20]">Daily agenda</p><h3 className="mt-2 text-2xl font-semibold">{formatFullDate(date)}</h3></div>{events.length ? <div className="space-y-3">{events.map((event) => <EventRow key={event.id} event={event} selected={false} onSelect={onSelectEvent} />)}</div> : <div className="rounded-xl border border-dashed border-slate-300 bg-[#f7f5ef] p-10 text-center"><p className="font-semibold text-[#24313E]">No public school activities listed for this date.</p><p className="mt-2 text-sm text-slate-500">Use the calendar controls to check another day.</p></div>}</div>;
}

function YearView({ year, events, onSelectMonth }: { year: number; events: CalendarEvent[]; onSelectMonth: (month: Date) => void }) {
  return <div className="grid gap-3 pt-5 sm:grid-cols-2 xl:grid-cols-3">{getYearMonths(year).map((month) => { const monthEvents = events.filter((event) => { const start = parseLocalDate(event.startDate); const end = parseLocalDate(event.endDate); const monthStart = new Date(year, month.getMonth(), 1); const monthEnd = new Date(year, month.getMonth() + 1, 0); return start <= monthEnd && end >= monthStart; }); const leadingDays = new Date(year, month.getMonth(), 1).getDay(); return <button key={month.getMonth()} type="button" onClick={() => onSelectMonth(month)} className="rounded-xl border border-slate-200 bg-[#f7f5ef] p-4 text-left hover:border-[#d4bc00] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24313E]"><span className="flex items-center justify-between"><span className="text-lg font-semibold text-[#24313E]">{new Intl.DateTimeFormat("en-PH", { month: "long" }).format(month)}</span><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-500">{monthEvents.length} events</span></span><span className="mt-4 grid grid-cols-7 gap-1">{weekdays.map((day, index) => <span key={`${day}-${index}`} className="text-center text-[8px] font-semibold text-slate-400">{day.charAt(0)}</span>)}{Array.from({ length: leadingDays }, (_, index) => <span key={`empty-${index}`} aria-hidden="true" />)}{Array.from({ length: new Date(year, month.getMonth() + 1, 0).getDate() }, (_, index) => { const day = new Date(year, month.getMonth(), index + 1); const hasEvents = getEventsForDate(events, day).length > 0; return <span key={index} className={`aspect-square rounded-sm ${hasEvents ? "bg-[#24313E]" : "bg-slate-200"}`} />; })}</span></button>; })}</div>;
}

function EventModal({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  return <div className="fixed inset-0 z-[1200] flex items-end justify-center bg-[#111A22]/70 p-0 backdrop-blur-sm sm:items-center sm:p-5" onMouseDown={(mouseEvent) => { if (mouseEvent.target === mouseEvent.currentTarget) onClose(); }}><div role="dialog" aria-modal="true" aria-labelledby="event-dialog-title" className="max-h-[90dvh] w-full overflow-y-auto rounded-t-2xl bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:max-w-xl sm:rounded-2xl sm:p-8"><div className="flex items-start justify-between gap-4"><div><span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${categoryStyles[event.category] ?? "border-slate-200 bg-slate-50 text-slate-700"}`}>{event.category}</span><h2 id="event-dialog-title" className="mt-4 text-2xl font-semibold leading-tight text-[#24313E] sm:text-3xl">{event.title}</h2></div><button type="button" onClick={onClose} aria-label="Close event details" autoFocus className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-xl text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24313E]">Ã—</button></div><dl className="mt-6 grid gap-4 rounded-xl bg-[#f7f5ef] p-5 sm:grid-cols-2"><div><dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Date</dt><dd className="mt-1 text-sm font-bold text-[#24313E]">{formatDateRange(event)}</dd></div>{event.startTime && <div><dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Time</dt><dd className="mt-1 text-sm font-bold text-[#24313E]">{formatEventTime(event)}</dd></div>}<div><dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Status</dt><dd className="mt-1"><span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusStyles[event.status]}`}>{event.status}</span></dd></div><div><dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Audience</dt><dd className="mt-1 text-sm font-bold text-[#24313E]">{event.audience}</dd></div>{event.location && <div className="sm:col-span-2"><dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Location</dt><dd className="mt-1 text-sm font-bold text-[#24313E]">{event.location}</dd></div>}</dl><div className="mt-6"><h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">About this activity</h3><p className="mt-2 leading-7 text-slate-600">{event.description}</p></div><button type="button" onClick={onClose} className="mt-7 w-full rounded-xl bg-[#24313E] px-5 py-3 font-semibold text-white hover:bg-[#34495e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24313E] focus-visible:ring-offset-2">Close details</button></div></div>;
}
