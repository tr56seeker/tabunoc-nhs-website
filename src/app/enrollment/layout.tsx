import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "Enrollment Guide",
  description:
    "Enrollment reminders, requirements, and step-by-step guidance for incoming and returning learners of Tabunoc National High School.",
  path: "/enrollment",
});

export default function EnrollmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
