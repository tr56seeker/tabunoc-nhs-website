import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import SchoolCalendar, { type CalendarEvent } from "@/components/SchoolCalendar";
import SchoolYearProgress, { type SchoolYearStatus } from "@/components/SchoolYearProgress";

export const metadata: Metadata = {
  title: "School Calendar | Tabunoc National High School",
  description: "Public school activities and important dates for Tabunoc National High School.",
};

export default function SchoolCalendarPage() {
  const events = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public/data/school-calendar-events.json"), "utf8")
  ) as CalendarEvent[];
  const schoolYearStatus = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public/data/school-year-status.json"), "utf8")
  ) as SchoolYearStatus;

  return (
    <>
      <Navbar />
      <PageHeader
        variant="feature"
        badge="SY 2026-2027"
        title="School Calendar"
        description="View upcoming school activities, academic schedules, enrollment dates, DRRM activities, and other public school events of Tabunoc National High School."
      />
      <SchoolYearProgress status={schoolYearStatus} events={events} />
      <SchoolCalendar events={events} />
      <Footer />
    </>
  );
}
