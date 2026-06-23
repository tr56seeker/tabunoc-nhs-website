import { after, NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { resend } from "@/lib/resend";

/*
  Phase 1 database setup (review and answer submissions in Supabase Studio):

  create table if not exists public.faq_community_questions (
    id uuid primary key default gen_random_uuid(),
    faq_topic_id text not null,
    display_name text,
    audience_type text,
    question text not null,
    answer text,
    status text not null default 'pending',
    created_at timestamptz not null default now(),
    approved_at timestamptz
  );

  alter table public.faq_community_questions enable row level security;
*/

const SUCCESS_MESSAGE = "Your question was submitted for review.";
const PRIVACY_MESSAGE =
  "For privacy, please do not include learner names, LRN, grades, addresses, phone numbers, or private concerns. Kindly revise your question or contact the school directly for personal matters.";
const allowedAudienceTypes = new Set([
  "Learner",
  "Parent or Guardian",
  "Teacher",
  "Stakeholder",
  "Other",
]);
const privacyPatterns = [
  /\bLRN\b/i,
  /\b(?:home\s+)?addresses?\b/i,
  /\bphone(?:\s+numbers?)?\b/i,
  /\bfull\s+names?\b/i,
  /\b(?:my|his|her|their|learner(?:'s)?)\s+grades?\b/i,
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /(?:\+?63|0)\s*9(?:[\s-]*\d){9}\b/,
  /\b\d{7,12}\b/,
];

function cleanOptionalText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

type NotificationDetails = {
  faqTopicId: string;
  question: string;
  displayName: string;
  audienceType: string;
  submittedAt: string;
  adminUrl: string;
};

async function sendSubmissionNotification({
  faqTopicId,
  question,
  displayName,
  audienceType,
  submittedAt,
  adminUrl,
}: NotificationDetails) {
  const notifyTo = process.env.FAQ_ADMIN_NOTIFY_TO?.trim();
  const notifyFrom = process.env.FAQ_NOTIFY_FROM?.trim();

  if (!resend || !notifyTo || !notifyFrom) {
    console.warn(
      "FAQ question email notification skipped because email settings are incomplete.",
    );
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: notifyFrom,
      to: notifyTo,
      subject: "New FAQ Question for Review",
      text: `A new FAQ Community Question was submitted for review.

FAQ Topic:
${faqTopicId}

Question:
${question}

Submitted by:
${displayName || "Not provided"}

Audience:
${audienceType || "Not provided"}

Submitted:
${submittedAt}

Review:
${adminUrl}

Reminder:
Please review the question before publishing. Do not approve submissions that include learner names, LRN, grades, addresses, phone numbers, or private concerns.`,
    });

    if (error) {
      console.error(
        "FAQ question email notification failed:",
        error.message || "The email provider returned an error.",
      );
    }
  } catch (error) {
    console.error(
      "FAQ question email notification failed:",
      error instanceof Error ? error.message : "Unknown email delivery error.",
    );
  }
}

export async function GET(request: NextRequest) {
  const faqTopicId = request.nextUrl.searchParams.get("faqTopicId")?.trim();

  if (!faqTopicId) {
    return NextResponse.json(
      { error: "A FAQ topic is required." },
      { status: 400 },
    );
  }

  const { data, error } = await getSupabaseAdmin()
    .from("faq_community_questions")
    .select("id, question, answer, created_at")
    .eq("faq_topic_id", faqTopicId)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Unable to load approved FAQ community questions:", error.message);
    return NextResponse.json(
      { error: "Community questions are temporarily unavailable." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { questions: data ?? [] },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400 },
    );
  }

  const faqTopicId = cleanOptionalText(body.faqTopicId);
  const displayName = cleanOptionalText(body.displayName);
  const audienceType = cleanOptionalText(body.audienceType);
  const question = cleanOptionalText(body.question);
  const website = cleanOptionalText(body.website);

  // Give bots a normal-looking response without creating a public or pending row.
  if (website) {
    return NextResponse.json({ success: true, message: SUCCESS_MESSAGE });
  }

  if (!faqTopicId) {
    return NextResponse.json(
      { error: "A FAQ topic is required." },
      { status: 400 },
    );
  }

  if (!question) {
    return NextResponse.json(
      { error: "Please enter a question." },
      { status: 400 },
    );
  }

  if (question.length < 10) {
    return NextResponse.json(
      { error: "Please enter at least 10 characters for your question." },
      { status: 400 },
    );
  }

  if (question.length > 500) {
    return NextResponse.json(
      { error: "Please keep your question within 500 characters." },
      { status: 400 },
    );
  }

  if (displayName.length > 80) {
    return NextResponse.json(
      { error: "Please keep the name or initials within 80 characters." },
      { status: 400 },
    );
  }

  if (audienceType && !allowedAudienceTypes.has(audienceType)) {
    return NextResponse.json(
      { error: "Please choose a valid audience type." },
      { status: 400 },
    );
  }

  const linkCount = question.match(/https?:\/\/|www\./gi)?.length ?? 0;

  if (linkCount > 2) {
    return NextResponse.json(
      { error: "Please remove extra links and submit your question again." },
      { status: 400 },
    );
  }

  if (privacyPatterns.some((pattern) => pattern.test(question))) {
    return NextResponse.json({ error: PRIVACY_MESSAGE }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin().from("faq_community_questions").insert({
    faq_topic_id: faqTopicId,
    display_name: displayName || null,
    audience_type: audienceType || null,
    question,
    answer: null,
    status: "pending",
  });

  if (error) {
    console.error("Unable to submit FAQ community question:", error.message);
    return NextResponse.json(
      { error: "We could not submit your question right now. Please try again." },
      { status: 500 },
    );
  }

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || request.nextUrl.origin
  ).replace(/\/+$/, "");

  after(() =>
    sendSubmissionNotification({
      faqTopicId,
      question,
      displayName,
      audienceType,
      submittedAt: new Date().toISOString(),
      adminUrl: `${siteUrl}/admin/faq-community`,
    }),
  );

  return NextResponse.json(
    { success: true, message: SUCCESS_MESSAGE },
    { status: 201 },
  );
}
