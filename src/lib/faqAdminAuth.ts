import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const FAQ_ADMIN_COOKIE_NAME = "tnhs_faq_admin";
export const FAQ_ADMIN_COOKIE_MAX_AGE = 60 * 60 * 8;

function getAdminSecret() {
  const secret = process.env.FAQ_ADMIN_SECRET?.trim();

  if (!secret) {
    throw new Error("Missing FAQ admin environment variable.");
  }

  return secret;
}

function signTimestamp(timestamp: string) {
  return createHmac("sha256", getAdminSecret())
    .update(timestamp)
    .digest("base64url");
}

export function adminPasscodeMatches(passcode: string) {
  const expected = Buffer.from(getAdminSecret());
  const received = Buffer.from(passcode);

  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function createFaqAdminSessionToken() {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  return `${timestamp}.${signTimestamp(timestamp)}`;
}

export function validateFaqAdminSessionToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  const [timestamp, signature, extra] = token.split(".");
  const issuedAt = Number(timestamp);
  const now = Math.floor(Date.now() / 1000);

  if (
    !timestamp ||
    !signature ||
    extra ||
    !Number.isInteger(issuedAt) ||
    issuedAt > now + 60 ||
    now - issuedAt > FAQ_ADMIN_COOKIE_MAX_AGE
  ) {
    return false;
  }

  const expected = Buffer.from(signTimestamp(timestamp));
  const received = Buffer.from(signature);

  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function isFaqAdminAuthorized() {
  const cookieStore = await cookies();
  return validateFaqAdminSessionToken(
    cookieStore.get(FAQ_ADMIN_COOKIE_NAME)?.value,
  );
}
