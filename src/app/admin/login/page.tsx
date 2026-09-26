import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/pages/PageHero";
import { AdminLogin } from "@/components/admin/AdminLogin";

export const metadata: Metadata = {
  title: "Studio sign in",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Private"
        title="Studio sign in"
        text="This desk is for Rang-o-Riwaaj staff only. Enter the admin password to upload products or change prices."
        crumbs={[{ label: "Home", href: "/" }]}
      />
      <div className="container-x py-10 lg:py-14">
        <Suspense fallback={<div className="mx-auto h-56 max-w-md border border-line bg-white" />}>
          <AdminLogin />
        </Suspense>
      </div>
    </>
  );
}
