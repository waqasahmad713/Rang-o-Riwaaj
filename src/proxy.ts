import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";

const isAdminPage = (path: string) => path === "/admin" || (path.startsWith("/admin/") && path !== "/admin/login");
const isWriteApi = (path: string, method: string) => {
  if (path === "/api/upload" || path.startsWith("/api/upload/")) return method !== "GET";
  if (path === "/api/catalog" || path.startsWith("/api/catalog/")) return method !== "GET";
  return false;
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/")) return NextResponse.next();

  const allowed = isAdminRequest(request);
  if (isAdminPage(pathname) && !allowed) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }
  if (isWriteApi(pathname, request.method) && !allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/catalog", "/api/upload", "/api/admin/:path*"],
};
