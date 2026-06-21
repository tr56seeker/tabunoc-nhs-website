import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SchoolCalendar from "@/components/SchoolCalendar";

export const metadata: Metadata = {
  title: "School Calendar | Tabunoc National High School",
  description: "Public school activities and important dates for Tabunoc National High School.",
};

export default function SchoolCalendarPage() {
  return (
    <>
      <Navbar />
      <SchoolCalendar />
      <Footer />
    </>
  );
}
