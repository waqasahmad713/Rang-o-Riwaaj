import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminDesk } from "@/components/admin/AdminDesk";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Studio desk",
  robots: { index: false, follow: false },
};

export default async function Page() {
  if (!(await requireAdmin())) redirect("/admin/login");
  return <AdminDesk />;
}
