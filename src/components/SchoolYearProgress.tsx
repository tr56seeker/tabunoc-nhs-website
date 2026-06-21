"use client";

export type SchoolYearStatus = {
  schoolYear: string;
  schoolYearStart: string;
  schoolYearEnd: string;
  totalSchoolDays: number;
  terms: {
    name: string;
    startDate: string;
    endDate: string;
  }[];
  nonClassDays?: {
    date: string;
    label: string;
  }[];
  note?: string;
};

export type ProgressCalendarEvent = {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  category: string;
  audience?: string;
  status?: string;
  description?: string;
};

type SchoolYearProgressProps = {
  status: SchoolYearStatus;
  events: ProgressCalendarEvent[];
};

function parseLocalDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isSameDay(first: Date, second: Date) {
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
}

function isWithinRange(date: Date, start: Date, end: Date) {
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
}

function isWeekend(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6;
}

function isNonClassDay(date: Date, nonClassDays: SchoolYearStatus["nonClassDays"] = []) {
  return nonClassDays.some((item) => isSameDay(date, parseLocalDate(item.date)));
}

function getCurrentTerm(status: SchoolYearStatus, today: Date) {
  const start = parseLocalDate(status.schoolYearStart);
  const end = parseLocalDate(status.schoolYearEnd);

  if (today < start) return { name: "Before School Year Opening", range: formatDateRange(status.schoolYearStart, status.schoolYearEnd) };
  if (today > end) return { name: "School Year Completed", range: formatDateRange(status.schoolYearStart, status.schoolYearEnd) };

  const term = status.terms.find((item) => isWithinRange(today, parseLocalDate(item.startDate), parseLocalDate(item.endDate)));
  return term ? { name: term.name, range: formatDateRange(term.startDate, term.endDate) } : { name: "Term Break", range: "No active academic term" };
}

function countSchoolDays(start: Date, end: Date, nonClassDays: SchoolYearStatus["nonClassDays"] = []) {
  if (start > end) return 0;
  let count = 0;
  const current = new Date(start.getFullYear(), start.getMonth(), start.getDate());

  while (current <= end) {
    if (!isWeekend(current) && !isNonClassDay(current, nonClassDays)) count += 1;
    current.setDate(current.getDate() + 1);
  }

  return count;
}

function getCurrentSchoolWeek(status: SchoolYearStatus, today: Date, completedDays: number) {
  if (today < parseLocalDate(status.schoolYearStart)) return "Not yet started";
  if (today > parseLocalDate(status.schoolYearEnd)) return "Completed";
  return `Week ${Math.max(1, Math.ceil(completedDays / 5))}`;
}

function getNextMajorActivity(events: ProgressCalendarEvent[], today: Date) {
  const todayValue = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return [...events]
    .filter((event) => parseLocalDate(event.startDate).getTime() >= todayValue)
    .sort((first, second) => parseLocalDate(first.startDate).getTime() - parseLocalDate(second.startDate).getTime())[0];
}

function formatDateRange(startValue: string, endValue?: string) {
  const start = parseLocalDate(startValue);
  const end = parseLocalDate(endValue ?? startValue);
  const full = new Intl.DateTimeFormat("en-PH", { month: "long", day: "numeric", year: "numeric" });
  if (isSameDay(start, end)) return full.format(start);
  if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
    return `${new Intl.DateTimeFormat("en-PH", { month: "long" }).format(start)} ${start.getDate()}–${end.getDate()}, ${end.getFullYear()}`;
  }
  const short = new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" });
  return `${short.format(start)} – ${short.format(end)}`;
}

function StatusCard({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <article className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6e6e73]">{label}</p>
      <p className="mt-2 line-clamp-2 text-xl font-semibold leading-tight tracking-tight text-[#1d1d1f] sm:text-2xl">{value}</p>
      <p className="mt-1.5 text-sm leading-snug text-[#6e6e73]">{detail}</p>
    </article>
  );
}

export default function SchoolYearProgress({ status, events }: SchoolYearProgressProps) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yearStart = parseLocalDate(status.schoolYearStart);
  const yearEnd = parseLocalDate(status.schoolYearEnd);
  const completedEnd = today < yearStart ? new Date(yearStart.getTime() - 86400000) : today > yearEnd ? yearEnd : today;
  const completedDays = countSchoolDays(yearStart, completedEnd, status.nonClassDays);
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const remainingStart = today < yearStart ? yearStart : tomorrow;
  const remainingDays = today > yearEnd ? 0 : countSchoolDays(remainingStart, yearEnd, status.nonClassDays);
  const currentTerm = getCurrentTerm(status, today);
  const schoolWeek = getCurrentSchoolWeek(status, today, completedDays);
  const nextActivity = getNextMajorActivity(events, today);
  const percentage = Math.min(100, Math.max(0, Math.round((completedDays / status.totalSchoolDays) * 100)));

  return (
    <section className="bg-[#f5f5f7]">
      <div className="mx-auto w-full max-w-7xl px-4 pb-5 pt-6 sm:px-6 lg:px-8 lg:pb-6 lg:pt-8">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#24313e]">{status.schoolYear}</p>
          <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#1d1d1f] sm:text-3xl">School Year Dashboard</h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#6e6e73]">Quick status of the current school year based on encoded school calendar data.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatusCard label="Current Term" value={currentTerm.name} detail={currentTerm.range} />
          <StatusCard label="School Week" value={schoolWeek} detail="Based on completed school days" />
          <StatusCard label="School Days Remaining" value={remainingDays} detail="Class days left in the school year" />
          <StatusCard label="Next Activity" value={nextActivity?.title ?? "No upcoming public activity listed."} detail={nextActivity ? `${formatDateRange(nextActivity.startDate, nextActivity.endDate)} · ${nextActivity.category}` : "Check official school updates for new entries."} />
        </div>

        <div className="mt-3 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[0_14px_35px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="font-semibold text-[#24313e]">School Year Progress</span>
            <span className="font-medium text-[#6e6e73]">{percentage}% completed</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-label="School year progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}>
            <div className="h-full rounded-full bg-[#24313e]" style={{ width: `${percentage}%` }} />
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[#6e6e73]">{completedDays} of {status.totalSchoolDays} school days completed</p>
        </div>

        {status.note && <p className="mt-3 text-xs leading-relaxed text-[#6e6e73]">{status.note}</p>}
      </div>
    </section>
  );
}
