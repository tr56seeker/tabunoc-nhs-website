import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enrollment Guide | Tabunoc National High School",
  description:
    "Enrollment reminders, requirements, and step-by-step guidance for incoming and returning learners of Tabunoc National High School.",
};

export default function EnrollmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
