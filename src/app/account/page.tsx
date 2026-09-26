import type { Metadata } from "next";
import { AccountView } from "@/components/account/AccountView";

export const metadata: Metadata = {
  title: "My Account",
  description: "Sign in to view orders, Style Club benefits and saved details.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <AccountView />;
}
