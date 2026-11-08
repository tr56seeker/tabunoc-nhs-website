import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "Administration, Faculty & Staff",
  description:
    "Meet the school administration, faculty members, advisers, program coordinators, and support personnel of Tabunoc National High School.",
  path: "/organization",
});

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
