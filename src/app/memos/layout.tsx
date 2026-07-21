import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "School Memos and Issuances | Tabunoc National High School",
  description:
    "Search, view, and access public school memoranda, advisories, and issuances of Tabunoc National High School.",
};

export default function MemosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
