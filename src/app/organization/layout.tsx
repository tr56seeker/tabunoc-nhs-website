import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration, Faculty & Staff | Tabunoc National High School",
  description:
    "Meet the school administration, faculty members, advisers, program coordinators, and support personnel of Tabunoc National High School.",
};

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
