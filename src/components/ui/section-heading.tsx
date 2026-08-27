import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  aside,
}: {
  eyebrow?: string;
  title: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{eyebrow}</p>}
        <h2 className="font-display text-xl font-semibold sm:text-2xl">{title}</h2>
      </div>
      {aside && <div className="text-sm text-muted">{aside}</div>}
    </div>
  );
}
