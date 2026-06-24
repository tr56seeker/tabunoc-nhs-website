import type { Metadata } from "next";

import HomeHighlightsAdminClient from "./HomeHighlightsAdminClient";

export const metadata: Metadata = {
  title: "Homepage Highlights Admin",
  robots: { index: false, follow: false },
};

export default function HomeHighlightsAdminPage() {
  return <HomeHighlightsAdminClient />;
}
