import { NextResponse } from "next/server";
import { ADMIN_COOKIE, checkAdminPassword, cookieOptions, createAdminToken, isPasswordConfigured } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isPasswordConfigured()) {
    return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 });
  }
  const body = (await request.json().catch(() => ({}))) as { password?: string };
  if (!checkAdminPassword(String(body.password ?? ""))) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  const { token, maxAge } = createAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, cookieOptions(maxAge));
  return res;
}
