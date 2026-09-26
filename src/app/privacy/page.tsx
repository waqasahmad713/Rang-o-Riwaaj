import type { Metadata } from "next";
import { site } from "@/data/site";
import { PolicyPage } from "@/components/pages/PolicyPage";

export const metadata: Metadata = { title: "Privacy Policy", description: "How Rang-o-Riwaaj collects and uses your information." };

export default function Page() {
  return (
    <PolicyPage eyebrow="Legal" title="Privacy Policy">
      <p>We collect the name, email, phone and address you give us at checkout or on contact forms so we can fulfil orders and reply to you.</p>
      <h2>What we store</h2>
      <p>On this demo store, cart, wishlist and orders stay in your browser. When the live shop is connected, order data is stored securely for fulfilment, returns and legal records.</p>
      <h2>Sharing</h2>
      <p>We share delivery details with our courier. We do not sell your data. Payment processors only receive what they need to take payment.</p>
      <h2>Contact</h2>
      <p>
        Questions: {site.contact.email} or WhatsApp {site.contact.phoneDisplay}.
      </p>
    </PolicyPage>
  );
}
