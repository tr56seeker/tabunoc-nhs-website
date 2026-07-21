import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Senior High School Offerings | Tabunoc National High School",
  description:
    "Explore the Pure Academic Track and Tech-Pro Track offerings available for Senior High School learners of Tabunoc National High School.",
};

export default function ShsOfferingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
