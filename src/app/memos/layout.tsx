import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "School Memos and Issuances",
  description:
    "Search, view, and access public school memoranda, advisories, and issuances of Tabunoc National High School.",
  path: "/memos",
});

export default function MemosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
