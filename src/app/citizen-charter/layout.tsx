import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Citizen's Charter | Tabunoc National High School",
  description:
    "A public guide to common school services, documentary requirements, processing offices, and service reminders for learners, parents, alumni, and stakeholders.",
};

export default function CitizenCharterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
