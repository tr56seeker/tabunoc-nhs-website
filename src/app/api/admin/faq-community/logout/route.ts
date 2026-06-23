import { NextResponse } from "next/server";

import { FAQ_ADMIN_COOKIE_NAME } from "@/lib/faqAdminAuth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(FAQ_ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });

  return response;
}
