import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import SchoolCalendar from "@/components/SchoolCalendar";

export const metadata: Metadata = {
  title: "School Calendar | Tabunoc National High School",
  description: "Public school activities and important dates for Tabunoc National High School.",
};

export default function SchoolCalendarPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        variant="feature"
        badge="SY 2026-2027"
        title="School Calendar"
        description="View upcoming school activities, academic schedules, enrollment dates, DRRM activities, and other public school events of Tabunoc National High School."
      />
      <SchoolCalendar />
      <Footer />
    </>
  );
}
