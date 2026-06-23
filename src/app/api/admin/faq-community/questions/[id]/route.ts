import { NextResponse } from "next/server";

import { isFaqAdminAuthorized } from "@/lib/faqAdminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const allowedStatuses = new Set(["pending", "approved", "rejected"]);
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    if (!(await isFaqAdminAuthorized())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await context.params;

    if (!uuidPattern.test(id)) {
      return NextResponse.json(
        { error: "The question ID is invalid." },
        { status: 400 },
      );
    }

    let body: {
      status?: unknown;
      answer?: unknown;
      moderationNote?: unknown;
    };

    try {
      body = (await request.json()) as {
        status?: unknown;
        answer?: unknown;
        moderationNote?: unknown;
      };
    } catch {
      return NextResponse.json(
        { error: "Please check the moderation update." },
        { status: 400 },
      );
    }

    const hasStatus = Object.prototype.hasOwnProperty.call(body, "status");
    const hasAnswer = Object.prototype.hasOwnProperty.call(body, "answer");
    const hasModerationNote = Object.prototype.hasOwnProperty.call(
      body,
      "moderationNote",
    );

    if (!hasStatus && !hasAnswer && !hasModerationNote) {
      return NextResponse.json(
        { error: "No moderation changes were provided." },
        { status: 400 },
      );
    }

    if (
      hasStatus &&
      (typeof body.status !== "string" || !allowedStatuses.has(body.status))
    ) {
      return NextResponse.json(
        { error: "Choose a valid question status." },
        { status: 400 },
      );
    }

    if (hasAnswer && typeof body.answer !== "string") {
      return NextResponse.json(
        { error: "The official answer must be text." },
        { status: 400 },
      );
    }

    if (hasModerationNote && typeof body.moderationNote !== "string") {
      return NextResponse.json(
        { error: "The moderation note must be text." },
        { status: 400 },
      );
    }

    const answer = typeof body.answer === "string" ? body.answer.trim() : undefined;
    const moderationNote =
      typeof body.moderationNote === "string"
        ? body.moderationNote.trim()
        : undefined;

    if (answer && answer.length > 5000) {
      return NextResponse.json(
        { error: "Please keep the official answer within 5,000 characters." },
        { status: 400 },
      );
    }

    if (moderationNote && moderationNote.length > 2000) {
      return NextResponse.json(
        { error: "Please keep the moderation note within 2,000 characters." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: current, error: currentError } = await supabase
      .from("faq_community_questions")
      .select("status, answer, moderation_note")
      .eq("id", id)
      .single();

    if (currentError || !current) {
      return NextResponse.json(
        { error: "The question could not be found." },
        { status: 404 },
      );
    }

    const nextStatus = hasStatus ? (body.status as string) : current.status;
    const nextAnswer = hasAnswer ? answer ?? "" : current.answer ?? "";

    if (nextStatus === "approved" && !nextAnswer.trim()) {
      return NextResponse.json(
        { error: "Add an official answer before approving this question." },
        { status: 400 },
      );
    }

    const updates: {
      status?: string;
      answer?: string | null;
      approved_at?: string | null;
      reviewed_at?: string | null;
      reviewed_by?: string | null;
      moderation_note?: string | null;
    } = {};

    if (hasAnswer) {
      updates.answer = answer || null;
    }

    if (hasModerationNote) {
      updates.moderation_note = moderationNote || null;
    }

    if (hasStatus) {
      updates.status = body.status as string;
      updates.approved_at =
        body.status === "approved" ? new Date().toISOString() : null;
      updates.reviewed_at =
        body.status === "approved" || body.status === "rejected"
          ? new Date().toISOString()
          : null;
      updates.reviewed_by =
        body.status === "approved" || body.status === "rejected"
          ? "FAQ Admin"
          : null;
    }

    const { data, error } = await supabase
      .from("faq_community_questions")
      .update(updates)
      .eq("id", id)
      .select(
        "id, faq_topic_id, display_name, audience_type, question, answer, status, created_at, approved_at, reviewed_at, reviewed_by, moderation_note",
      )
      .single();

    if (error) {
      console.error("Unable to update FAQ moderation question:", error.message);
      return NextResponse.json(
        { error: "The question could not be updated right now." },
        { status: 500 },
      );
    }

    return NextResponse.json({ question: data });
  } catch (error) {
    console.error("FAQ moderation API is not configured:", error);
    return NextResponse.json(
      { error: "The moderation panel is not configured yet." },
      { status: 503 },
    );
  }
}
