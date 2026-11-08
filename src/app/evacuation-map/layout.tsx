import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "Interactive Evacuation Map",
  description:
    "Select your current location inside Tabunoc National High School to view the recommended emergency exit route and evacuation area.",
  path: "/evacuation-map",
});

export default function EvacuationMapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
