import Link from "next/link";

export function EmptyState({
  title,
  hint,
  resetHref,
}: {
  title: string;
  hint?: string;
  resetHref?: string;
}) {
  return (
    <div className="rounded-card border border-dashed border-line px-6 py-14 text-center">
      <p className="font-display text-lg">{title}</p>
      {hint && <p className="mt-2 text-sm text-muted">{hint}</p>}
      {resetHref && (
        <Link href={resetHref} className="mt-5 inline-block text-sm text-accent underline underline-offset-4">
          Сбросить фильтры
        </Link>
      )}
    </div>
  );
}
