import { Breadcrumbs } from "@/components/ui/primitives";

export function PageHero({
  eyebrow,
  title,
  text,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  crumbs?: { label: string; href?: string }[];
}) {
  return (
    <header className="border-b border-line bg-sand">
      <div className="container-x py-10 sm:py-14">
        {crumbs && (
          <div className="mb-5">
            <Breadcrumbs items={crumbs} />
          </div>
        )}
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="font-serif text-4xl font-medium sm:text-5xl">{title}</h1>
        {text && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">{text}</p>}
      </div>
    </header>
  );
}
