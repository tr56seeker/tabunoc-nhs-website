import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const ADMIN_SESSION_COOKIE = "tnhs_admin_session";
const ADMIN_ROLES = new Set(["admin", "super_admin"]);

export type AdminUser = {
  id: string;
  email: string | null;
  role: string;
  fullName: string | null;
};

export async function getAdminUserFromToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const supabase = getSupabaseAdmin();
  const { data: userData, error: userError } = await supabase.auth.getUser(token);

  if (userError || !userData.user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, full_name, email")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileError || !profile?.role || !ADMIN_ROLES.has(profile.role)) {
    return null;
  }

  return {
    id: userData.user.id,
    email: userData.user.email ?? profile.email ?? null,
    role: profile.role,
    fullName: profile.full_name,
  } satisfies AdminUser;
}

export async function getCurrentAdminUser() {
  const cookieStore = await cookies();
  return getAdminUserFromToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function requireAdminUser() {
  const adminUser = await getCurrentAdminUser();

  if (!adminUser) {
    redirect("/admin/login");
  }

  return adminUser;
}

export async function requireAdminApi() {
  const adminUser = await getCurrentAdminUser();

  if (!adminUser) {
    return {
      adminUser: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { adminUser, response: null };
}
