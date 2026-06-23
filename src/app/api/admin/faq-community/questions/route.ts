import { NextRequest, NextResponse } from "next/server";

import { isFaqAdminAuthorized } from "@/lib/faqAdminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const allowedStatuses = new Set(["pending", "approved", "rejected", "all"]);

export async function GET(request: NextRequest) {
  try {
    if (!(await isFaqAdminAuthorized())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const status = request.nextUrl.searchParams.get("status") ?? "pending";

    if (!allowedStatuses.has(status)) {
      return NextResponse.json(
        { error: "Choose a valid question status." },
        { status: 400 },
      );
    }

    let query = getSupabaseAdmin()
      .from("faq_community_questions")
      .select(
        "id, faq_topic_id, display_name, audience_type, question, answer, status, created_at, approved_at, reviewed_at, reviewed_by, moderation_note",
      )
      .order("created_at", { ascending: false });

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Unable to load FAQ moderation questions:", error.message);
      return NextResponse.json(
        { error: "Questions could not be loaded right now." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { questions: data ?? [] },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("FAQ moderation API is not configured:", error);
    return NextResponse.json(
      { error: "The moderation panel is not configured yet." },
      { status: 503 },
    );
  }
}
