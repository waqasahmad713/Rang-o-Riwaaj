"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useEscape, useLockBody } from "@/lib/hooks";
import { cn } from "@/lib/format";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  hideTitle?: boolean;
  children: React.ReactNode;
  className?: string;
}

function useFocusOnOpen(open: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const el = ref.current;
    const focusable = el?.querySelector<HTMLElement>("[data-autofocus], input, button, a[href]");
    focusable?.focus({ preventScroll: true });
    return () => prev?.focus?.({ preventScroll: true });
  }, [open]);
  return ref;
}

export function Drawer({ open, onClose, title, hideTitle, children, className, side = "right" }: Props & { side?: "left" | "right" }) {
  useLockBody(open);
  useEscape(onClose, open);
  const ref = useFocusOnOpen(open);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="Close" tabIndex={-1} className="animate-fade-in absolute inset-0 bg-ink/50 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={ref}
        className={cn(
          "absolute top-0 flex h-full w-full max-w-[440px] flex-col bg-ivory shadow-2xl",
          side === "right" ? "animate-slide-in-right right-0" : "animate-slide-in-left left-0",
          className,
        )}
      >
        <div className={cn("flex items-center justify-between border-b border-line px-5 py-4", hideTitle && "sr-only")}>
          <h2 className="font-serif text-2xl font-medium">{title}</h2>
          <button onClick={onClose} aria-label={`Close ${title}`} className="-mr-2 flex h-10 w-10 items-center justify-center hover:text-maroon">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Modal({ open, onClose, title, hideTitle, children, className }: Props) {
  useLockBody(open);
  useEscape(onClose, open);
  const ref = useFocusOnOpen(open);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <button aria-label="Close" tabIndex={-1} className="animate-fade-in absolute inset-0 bg-ink/55 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={ref}
        className={cn(
          "animate-fade-up relative max-h-[92vh] w-full overflow-y-auto bg-ivory shadow-2xl sm:max-w-3xl",
          className,
        )}
      >
        <div className={cn("sticky top-0 z-10 flex items-center justify-between border-b border-line bg-ivory px-5 py-4", hideTitle && "border-none bg-transparent py-0")}>
          <h2 className={cn("font-serif text-2xl font-medium", hideTitle && "sr-only")}>{title}</h2>
          <button
            onClick={onClose}
            aria-label={`Close ${title}`}
            className={cn("flex h-10 w-10 items-center justify-center hover:text-maroon", hideTitle && "absolute top-2 right-2 bg-ivory/90")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
