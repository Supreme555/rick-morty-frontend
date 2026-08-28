"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

const DEBOUNCE_MS = 300;

export function SearchBar({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPushed = useRef(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync only on external navigation (back/forward), never while the user types.
  useEffect(() => {
    if (initialQuery !== lastPushed.current) {
      lastPushed.current = initialQuery;
      setValue(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const navigate = (raw: string) => {
    const q = raw.trim();
    if (q === lastPushed.current) return;
    lastPushed.current = q;
    startTransition(() => {
      router.replace(q ? `/?q=${encodeURIComponent(q)}` : "/", { scroll: false });
    });
  };

  const schedule = (next: string) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => navigate(next), DEBOUNCE_MS);
  };

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    setValue("");
    navigate("");
    inputRef.current?.focus();
  };

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (timer.current) clearTimeout(timer.current);
        navigate(value);
      }}
      className="relative"
    >
      <label htmlFor="q" className="sr-only">
        Поиск по персонажам, эпизодам и локациям
      </label>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        ref={inputRef}
        id="q"
        name="q"
        type="search"
        autoComplete="off"
        maxLength={100}
        enterKeyHint="search"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          schedule(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape" && value) clear();
        }}
        placeholder="Rick, Pilot, Citadel of Ricks…"
        className="h-14 w-full rounded-full border border-line bg-panel pr-28 pl-13 text-base text-fg shadow-[0_1px_0_var(--line)] transition-colors placeholder:text-muted hover:border-muted focus:border-accent focus:outline-none sm:h-16 sm:text-lg [&::-webkit-search-cancel-button]:hidden"
      />
      <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
        {pending && (
          <span
            role="status"
            aria-label="Ищем"
            className="mr-1 size-4 animate-spin rounded-full border-2 border-line border-t-accent"
          />
        )}
        {value && (
          <button
            type="button"
            onClick={clear}
            className="h-9 rounded-full px-3 text-xs text-muted hover:bg-panel-2 hover:text-fg"
          >
            Очистить
          </button>
        )}
        <button
          type="submit"
          className="h-10 rounded-full bg-accent px-4 text-sm font-medium text-accent-fg hover:brightness-110"
        >
          Найти
        </button>
      </div>
    </form>
  );
}
