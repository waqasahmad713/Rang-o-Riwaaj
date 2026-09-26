import type { Metadata } from "next";
import { site } from "@/data/site";
import { PolicyPage } from "@/components/pages/PolicyPage";

export const metadata: Metadata = { title: "Careers", description: "Join the Rang-o-Riwaaj studio." };

export default function Page() {
  return (
    <PolicyPage eyebrow="Studio" title="Careers" text="We're a small team. When a role opens, we post it here and on Instagram.">
      <h2>How we hire</h2>
      <p>We look for people who care about fabric, fit and customer care — not just fashion résumés.</p>
      <p>
        Send a short note and portfolio to {site.contact.email} with the subject “Careers”.
      </p>
    </PolicyPage>
  );
}
