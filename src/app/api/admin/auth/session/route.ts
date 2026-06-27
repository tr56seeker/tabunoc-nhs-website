import { NextResponse } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  getAdminUserFromToken,
} from "@/lib/adminAuth";

export async function POST(request: Request) {
  try {
    const { accessToken } = (await request.json()) as { accessToken?: string };
    const adminUser = await getAdminUserFromToken(accessToken);

    if (!accessToken || !adminUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = NextResponse.json({ adminUser });
    response.cookies.set(ADMIN_SESSION_COOKIE, accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Unable to create admin session:", error);
    return NextResponse.json(
      { error: "Unable to create admin session." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
