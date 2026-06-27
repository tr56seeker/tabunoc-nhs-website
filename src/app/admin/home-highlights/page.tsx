import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Homepage Highlights Admin",
  robots: { index: false, follow: false },
};

export default function HomeHighlightsAdminPage() {
  redirect("/admin/highlights");
}
