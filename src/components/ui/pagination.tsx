import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Paginated } from "@/lib/types";

interface Props {
  data: Pick<Paginated<unknown>, "page" | "pages" | "hasNext" | "hasPrev">;
  basePath: string;
  /** Current filters — preserved in every page link. */
  params: Record<string, string | undefined>;
}

function pageWindow(page: number, pages: number): Array<number | "…"> {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const set = new Set<number>([1, pages, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((p) => set.add(p));
  if (page >= pages - 2) [pages - 3, pages - 2, pages - 1].forEach((p) => set.add(p));
  const sorted = [...set].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
  const out: Array<number | "…"> = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

export function Pagination({ data, basePath, params }: Props) {
  if (data.pages <= 1) return null;

  const href = (page: number) => {
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) search.set(k, v);
    if (page > 1) search.set("page", String(page));
    const qs = search.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const item = "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 font-mono text-sm transition-colors";
  const arrow = cn(item, "border border-line bg-panel hover:border-accent");
  const disabled = cn(item, "border border-line text-muted opacity-40");

  return (
    <nav aria-label="Пагинация" className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
      {data.hasPrev ? (
        <Link href={href(data.page - 1)} className={arrow} aria-label="Предыдущая страница">
          ←
        </Link>
      ) : (
        <span className={disabled}>←</span>
      )}

      {pageWindow(data.page, data.pages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className={cn(item, "text-muted")}>
            …
          </span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === data.page ? "page" : undefined}
            className={cn(
              item,
              p === data.page ? "bg-accent text-accent-fg" : "hover:bg-panel-2",
            )}
          >
            {p}
          </Link>
        ),
      )}

      {data.hasNext ? (
        <Link href={href(data.page + 1)} className={arrow} aria-label="Следующая страница">
          →
        </Link>
      ) : (
        <span className={disabled}>→</span>
      )}
    </nav>
  );
}
