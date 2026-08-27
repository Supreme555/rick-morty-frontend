import Image from "next/image";
import Link from "next/link";
import type { CharacterSummary } from "@/lib/types";
import { code, STATUS_LABEL } from "@/lib/utils";
import { StatusDot } from "./status-dot";

export function CharacterCard({ character: c }: { character: CharacterSummary }) {
  return (
    <Link
      href={`/characters/${c.id}`}
      className="group block overflow-hidden rounded-card border border-line bg-panel transition-[transform,border-color] hover:-translate-y-0.5 hover:border-accent"
    >
      <div className="relative aspect-square overflow-hidden bg-panel-2">
        <Image
          src={c.image}
          alt={c.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute top-2 left-2 rounded bg-bg/85 px-1.5 py-0.5 font-mono text-[11px] text-muted backdrop-blur">
          {code(c.id)}
        </span>
      </div>
      <div className="p-3.5">
        <h3 className="line-clamp-1 font-display text-sm font-semibold leading-snug">{c.name}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
          <StatusDot status={c.status} />
          <span>
            {STATUS_LABEL[c.status]} · {c.species}
          </span>
        </p>
        <p className="mt-2 truncate text-xs text-muted">
          <span className="opacity-70">Локация: </span>
          {c.location.name}
        </p>
      </div>
    </Link>
  );
}
