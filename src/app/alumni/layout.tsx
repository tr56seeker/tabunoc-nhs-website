import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "Alumni and Community",
  description:
    "A space for graduates, former learners, and partners to reconnect, celebrate milestones, and support meaningful school-community initiatives.",
  path: "/alumni",
});

export default function AlumniLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
