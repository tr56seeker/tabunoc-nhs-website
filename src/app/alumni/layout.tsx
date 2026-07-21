import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alumni and Community | Tabunoc National High School",
  description:
    "A space for graduates, former learners, and partners to reconnect, celebrate milestones, and support meaningful school-community initiatives.",
};

export default function AlumniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
