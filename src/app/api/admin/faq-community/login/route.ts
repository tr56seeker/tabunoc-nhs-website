import { NextResponse } from "next/server";

import {
  adminPasscodeMatches,
  createFaqAdminSessionToken,
  FAQ_ADMIN_COOKIE_MAX_AGE,
  FAQ_ADMIN_COOKIE_NAME,
} from "@/lib/faqAdminAuth";

export async function POST(request: Request) {
  let body: { passcode?: unknown };

  try {
    body = (await request.json()) as { passcode?: unknown };
  } catch {
    return NextResponse.json(
      { error: "Please enter the moderation passcode." },
      { status: 400 },
    );
  }

  const passcode = typeof body.passcode === "string" ? body.passcode : "";

  try {
    if (!passcode || !adminPasscodeMatches(passcode)) {
      return NextResponse.json(
        { error: "The passcode is incorrect." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(FAQ_ADMIN_COOKIE_NAME, createFaqAdminSessionToken(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: FAQ_ADMIN_COOKIE_MAX_AGE,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("FAQ moderation login is not configured:", error);
    return NextResponse.json(
      { error: "The moderation panel is not configured yet." },
      { status: 503 },
    );
  }
}
