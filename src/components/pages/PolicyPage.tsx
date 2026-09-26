import type { ReactNode } from "react";
import { PageHero } from "./PageHero";

export function PolicyPage({
  eyebrow,
  title,
  text,
  children,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} text={text} crumbs={[{ label: "Home", href: "/" }, { label: title }]} />
      <div className="container-x prose-rr max-w-3xl py-12 lg:py-16">{children}</div>
    </>
  );
}
