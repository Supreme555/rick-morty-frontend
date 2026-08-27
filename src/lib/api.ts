import type {
  AiDescription,
  CharacterDetail,
  CharacterSummary,
  EpisodeDetail,
  EpisodeSummary,
  LocationDetail,
  LocationSummary,
  Paginated,
  SearchResult,
} from "./types";

export type QueryParams = Record<string, string | number | undefined>;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const FALLBACK_URL = "http://localhost:4009";

/** Server components: prefer the in-cluster URL, fall back to the public one. */
function serverBase(): string {
  return (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? FALLBACK_URL).replace(/\/$/, "");
}

/** Client components only see NEXT_PUBLIC_* (inlined at build time). */
export function clientBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? FALLBACK_URL).replace(/\/$/, "");
}

export function buildQuery(params: QueryParams): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "" && value !== null) search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function readError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) return body.message.join(", ");
    if (typeof body.message === "string") return body.message;
  } catch {
    /* non-JSON body */
  }
  return `Request failed with status ${res.status}`;
}

export async function request<T>(path: string, base = serverBase()): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${base}${path}`, { next: { revalidate: 300 } });
  } catch {
    throw new ApiError(0, "Сервер недоступен");
  }
  if (!res.ok) throw new ApiError(res.status, await readError(res));
  return (await res.json()) as T;
}

export const api = {
  characters: {
    list: (params: QueryParams) =>
      request<Paginated<CharacterSummary>>(`/characters${buildQuery(params)}`),
    get: (id: string | number) => request<CharacterDetail>(`/characters/${id}`),
  },
  episodes: {
    list: (params: QueryParams) =>
      request<Paginated<EpisodeSummary>>(`/episodes${buildQuery(params)}`),
    get: (id: string | number) => request<EpisodeDetail>(`/episodes/${id}`),
  },
  locations: {
    list: (params: QueryParams) =>
      request<Paginated<LocationSummary>>(`/locations${buildQuery(params)}`),
    get: (id: string | number) => request<LocationDetail>(`/locations/${id}`),
  },
  search: (q: string) => request<SearchResult>(`/search${buildQuery({ q })}`),
};

/** Called from the browser (AI block). No Next cache — the backend caches in its DB. */
export async function fetchAiDescription(characterId: number): Promise<AiDescription> {
  let res: Response;
  try {
    res = await fetch(`${clientBase()}/ai/characters/${characterId}/description`);
  } catch {
    throw new ApiError(0, "Сервер недоступен");
  }
  if (!res.ok) throw new ApiError(res.status, await readError(res));
  return (await res.json()) as AiDescription;
}
