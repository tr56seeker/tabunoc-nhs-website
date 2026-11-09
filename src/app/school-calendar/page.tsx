import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import SchoolCalendar from "@/components/SchoolCalendar";
import SchoolYearProgress, { type SchoolYearStatus } from "@/components/SchoolYearProgress";
import { loadPublishedCalendarEvents } from "@/lib/calendarEvents";
import { createPageMetadata } from "@/lib/siteMetadata";

export const revalidate = 60;

export const metadata: Metadata = createPageMetadata({
  title: "School Calendar",
  description:
    "Public school activities and important dates for Tabunoc National High School.",
  path: "/school-calendar",
});

export default async function SchoolCalendarPage() {
  const events = await loadPublishedCalendarEvents();
  const schoolYearStatus = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public/data/school-year-status.json"), "utf8")
  ) as SchoolYearStatus;

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <PageHeader
          variant="feature"
          badge="SY 2026-2027"
          title="School Calendar"
          description="View upcoming school activities, academic schedules, enrollment dates, DRRM activities, and other public school events of Tabunoc National High School."
        />
        <SchoolYearProgress status={schoolYearStatus} events={events} />
        <SchoolCalendar events={events} />
      </main>
      <Footer />
    </>
  );
}
