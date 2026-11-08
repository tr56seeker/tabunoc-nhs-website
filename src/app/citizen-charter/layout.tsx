import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "Citizen's Charter",
  description:
    "A public guide to common school services, documentary requirements, processing offices, and service reminders for learners, parents, alumni, and stakeholders.",
  path: "/citizen-charter",
});

export default function CitizenCharterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
