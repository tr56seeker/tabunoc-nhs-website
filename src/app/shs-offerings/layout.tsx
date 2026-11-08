import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = createPageMetadata({
  title: "Senior High School Offerings",
  description:
    "Explore the Pure Academic Track and Tech-Pro Track offerings available for Senior High School learners of Tabunoc National High School.",
  path: "/shs-offerings",
});

export default function ShsOfferingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
