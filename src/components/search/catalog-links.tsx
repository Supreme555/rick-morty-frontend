import Link from "next/link";

const CATALOGS = [
  { href: "/characters", title: "Персонажи", count: "826", hint: "Статус, вид, пол, локация" },
  { href: "/episodes", title: "Эпизоды", count: "51", hint: "Все сезоны, по коду S01E01" },
  { href: "/locations", title: "Локации", count: "126", hint: "Планеты, измерения, жители" },
];

export function CatalogLinks() {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {CATALOGS.map((c) => (
        <li key={c.href}>
          <Link
            href={c.href}
            className="group flex h-full flex-col rounded-card border border-line bg-panel p-5 transition-colors hover:border-accent"
          >
            <span className="font-mono text-3xl font-medium text-accent">{c.count}</span>
            <span className="mt-2 font-display text-base font-semibold">{c.title}</span>
            <span className="mt-1 text-sm text-muted">{c.hint}</span>
            <span aria-hidden="true" className="mt-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
