import { NextResponse } from "next/server";

import { FAQ_ADMIN_COOKIE_NAME } from "@/lib/faqAdminAuth";
import { rejectCrossSiteMutation } from "@/lib/requestSecurity";

export async function POST(request: Request) {
  const rejectedRequest = rejectCrossSiteMutation(request);
  if (rejectedRequest) return rejectedRequest;

  const response = NextResponse.json({ success: true });
  response.cookies.set(FAQ_ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
    priority: "high",
  });

  return response;
}
