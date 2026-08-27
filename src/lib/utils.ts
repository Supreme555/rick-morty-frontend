import type { CharacterGender, CharacterStatus } from "./types";

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Query params in Next 16 pages arrive as a Promise of a loose record. */
export type SearchParams = Record<string, string | string[] | undefined>;

export function param(params: SearchParams, key: string): string {
  const value = params[key];
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export function pageParam(params: SearchParams): number {
  const n = Number.parseInt(param(params, "page"), 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

/** "#0042" — record codes used across the UI. */
export function code(id: number, width = 4): string {
  return `#${String(id).padStart(width, "0")}`;
}

export const STATUS_LABEL: Record<CharacterStatus, string> = {
  Alive: "Жив",
  Dead: "Мёртв",
  unknown: "Неизвестно",
};

export const GENDER_LABEL: Record<CharacterGender, string> = {
  Female: "Женский",
  Male: "Мужской",
  Genderless: "Бесполый",
  unknown: "Неизвестно",
};

export function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} ${one}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return `${n} ${few}`;
  return `${n} ${many}`;
}
