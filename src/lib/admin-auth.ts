import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "rr_admin";
const TTL_SECONDS = 60 * 60 * 24 * 7;

const signingKey = () => process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";

const digest = (value: string) => createHash("sha256").update(value).digest();

export const isPasswordConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

export const checkAdminPassword = (password: string) => {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqual(digest(password), digest(expected));
};

export const createAdminToken = () => {
  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const sig = createHmac("sha256", signingKey()).update(`admin.${exp}`).digest("hex");
  return { token: `${exp}.${sig}`, maxAge: TTL_SECONDS };
};

export const isAdminToken = (token?: string | null) => {
  if (!token || !signingKey()) return false;
  const dot = token.indexOf(".");
  if (dot < 1) return false;
  const exp = Number(token.slice(0, dot));
  const sig = token.slice(dot + 1);
  if (!exp || !sig || Math.floor(Date.now() / 1000) > exp) return false;
  const expected = createHmac("sha256", signingKey()).update(`admin.${exp}`).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
};

export const isAdminRequest = (request: NextRequest) => isAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);

export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge,
});

export const requireAdmin = async () => {
  const jar = await cookies();
  return isAdminToken(jar.get(ADMIN_COOKIE)?.value);
};
