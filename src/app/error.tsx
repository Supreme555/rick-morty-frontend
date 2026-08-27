"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-card border border-dashed border-line px-6 py-14 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Ошибка загрузки</p>
      <h1 className="mt-2 font-display text-xl">Не удалось получить данные</h1>
      <p className="mt-2 text-sm text-muted">{error.message || "Сервер не ответил."}</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Button onClick={reset}>Повторить</Button>
        <Link href="/" className="text-sm text-muted underline underline-offset-4 hover:text-fg">
          На главную
        </Link>
      </div>
    </div>
  );
}
