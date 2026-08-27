import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const NAV = [
  { href: "/", label: "Поиск" },
  { href: "/characters", label: "Персонажи" },
  { href: "/episodes", label: "Эпизоды" },
  { href: "/locations", label: "Локации" },
] as const;

/**
 * ≥ sm: logo · nav · toggle in one row.
 * < sm: logo + toggle in the first row, nav as a scrollable strip below.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 px-4 py-2.5 sm:h-16 sm:px-6 sm:py-0">
        <Link href="/" className="group flex items-center gap-3 whitespace-nowrap">
          <span
            aria-hidden="true"
            className="size-3 rounded-full bg-accent shadow-[0_0_0_4px_var(--accent-soft)] transition-transform group-hover:scale-110"
          />
          <span className="font-display text-sm font-semibold tracking-wide uppercase">Рик и Морти</span>
          <span className="hidden font-mono text-[11px] text-muted md:inline">/ база данных</span>
        </Link>

        <div className="ml-auto sm:order-last">
          <ThemeToggle />
        </div>

        <nav
          aria-label="Основная навигация"
          className="-mx-4 flex w-[calc(100%+2rem)] items-center gap-1 overflow-x-auto px-3 pt-1.5 [scrollbar-width:none] sm:mx-0 sm:ml-auto sm:w-auto sm:px-0 sm:pt-0"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm whitespace-nowrap text-muted transition-colors hover:bg-panel-2 hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
