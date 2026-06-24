import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

const publicFields =
  "id, title, description, category, image_url, alt_text, facebook_url, event_date, display_order";

export async function GET() {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("homepage_highlights")
      .select(publicFields)
      .eq("status", "published")
      .order("display_order", { ascending: true })
      .order("event_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Unable to load homepage highlights:", error.message);
      return NextResponse.json(
        { error: "Highlights are unavailable right now." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { highlights: data ?? [] },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
    );
  } catch (error) {
    console.error("Homepage highlights API is not configured:", error);
    return NextResponse.json(
      { error: "Highlights are unavailable right now." },
      { status: 503 },
    );
  }
}
