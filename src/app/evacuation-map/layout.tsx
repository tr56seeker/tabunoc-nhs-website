import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Evacuation Map | Tabunoc National High School",
  description:
    "Select your current location inside Tabunoc National High School to view the recommended emergency exit route and evacuation area.",
};

export default function EvacuationMapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
