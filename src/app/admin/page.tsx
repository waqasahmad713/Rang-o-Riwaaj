import type { Metadata } from "next";
import { AdminDesk } from "@/components/admin/AdminDesk";

export const metadata: Metadata = {
  title: "Studio desk",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AdminDesk />;
}
