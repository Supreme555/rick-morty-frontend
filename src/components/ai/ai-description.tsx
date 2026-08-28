"use client";

import { useState } from "react";
import { ApiError, fetchAiDescription } from "@/lib/api";
import type { AiDescription as AiDescriptionData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "done"; data: AiDescriptionData }
  | { kind: "unavailable" }
  | { kind: "error"; message: string };

export function AiDescription({ characterId, name }: { characterId: number; name: string }) {
  const [state, setState] = useState<State>({ kind: "idle" });

  const load = async () => {
    setState({ kind: "loading" });
    try {
      const data = await fetchAiDescription(characterId);
      setState({ kind: "done", data });
    } catch (e) {
      if (e instanceof ApiError && e.status === 503) setState({ kind: "unavailable" });
      else setState({ kind: "error", message: e instanceof Error ? e.message : "Неизвестная ошибка" });
    }
  };

  return (
    <section
      aria-labelledby="ai-title"
      className="rounded-card border border-line border-l-2 border-l-accent bg-panel-2 p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="ai-title" className="font-display text-sm font-semibold">
          Досье от ИИ
        </h2>
        {(state.kind === "idle" || state.kind === "error") && (
          <Button variant="secondary" onClick={load}>
            {state.kind === "error" ? "Повторить" : `Рассказать о ${name.split(" ")[0]}`}
          </Button>
        )}
      </div>

      {state.kind === "loading" && (
        <div className="mt-4 space-y-2.5" aria-busy="true" aria-label="Генерируем описание">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-11/12" />
          <Skeleton className="h-3.5 w-4/5" />
          <Skeleton className="h-3.5 w-2/3" />
          <p className="pt-1 font-mono text-[11px] text-muted">Обычно занимает 10–25 секунд…</p>
        </div>
      )}

      {state.kind === "done" && (
        <div className="mt-4">
          {state.data.description.split(/\n{2,}/).map((p, i) => (
            <p key={i} className="mt-3 text-sm leading-relaxed first:mt-0">
              {p}
            </p>
          ))}
        </div>
      )}

      {state.kind === "unavailable" && (
        <p className="mt-4 text-sm text-muted">Описания от ИИ отключены на сервере — не задан ключ Gemini.</p>
      )}

      {state.kind === "error" && (
        <p className="mt-4 text-sm text-dead">Не получилось: {state.message}</p>
      )}
    </section>
  );
}
