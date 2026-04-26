import type {
  FilmDetails,
  SearchResult,
  SourceId,
  StreamBundle,
} from "./types";

export interface KpMovie {
  id: number;
  name?: string;
  alternativeName?: string;
  enName?: string;
  year?: number;
  description?: string;
  shortDescription?: string;
  rating?: { kp?: number; imdb?: number };
  poster?: { url?: string; previewUrl?: string };
  backdrop?: { url?: string; previewUrl?: string };
  genres?: Array<{ name: string }>;
  countries?: Array<{ name: string }>;
  ageRating?: number;
  movieLength?: number;
  type?: "movie" | "tv-series" | "anime" | "cartoon";
  videos?: { trailers?: Array<{ url: string; name?: string }> };
}

export interface HealthResponse {
  ok: boolean;
  sources: SourceId[];
  kinopoisk: boolean;
  alloha: boolean;
}

async function get<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`/api${path}`, init);
  if (!r.ok) {
    const body = await r.text();
    throw new Error(`${path} → HTTP ${r.status}: ${body.slice(0, 200)}`);
  }
  return r.json() as Promise<T>;
}

export const api = {
  health: () => get<HealthResponse>("/health"),

  kpPopular: () => get<KpMovie[]>("/kp/popular"),
  kpSeries: () => get<KpMovie[]>("/kp/series"),
  kpById: (id: number | string) => get<KpMovie>(`/kp/movie/${id}`),
  kpSearch: (query: string) =>
    get<KpMovie[]>(`/kp/search?q=${encodeURIComponent(query)}`),

  search: (query: string, sources?: SourceId[]) =>
    get<SearchResult[]>(
      `/search?q=${encodeURIComponent(query)}${
        sources?.length ? `&sources=${sources.join(",")}` : ""
      }`,
    ),

  details: (source: SourceId, params: { id?: string; url?: string }) => {
    const q = new URLSearchParams();
    if (params.id) q.set("id", params.id);
    if (params.url) q.set("url", params.url);
    return get<FilmDetails>(`/source/${source}/details?${q}`);
  },

  stream: (
    source: SourceId,
    params: {
      id?: string;
      url?: string;
      postId?: string;
      translatorId?: string;
      translator?: string;
      kp?: string | number;
      season?: number;
      episode?: number;
    },
  ) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) q.set(k, String(v));
    }
    return get<StreamBundle>(`/source/${source}/stream?${q}`);
  },
};
