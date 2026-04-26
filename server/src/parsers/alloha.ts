/**
 * Alloha API — legal content aggregator.
 *
 * Requires `ALLOHA_TOKEN` env var. Endpoint:
 *   https://api.alloha.tv/?token=...&kp={kinopoiskId}&imdb={ttId}
 *
 * Returns iframe URL (embedded player) which the frontend renders in an <iframe>.
 * Optional: parse qualities from the inner player if needed.
 */
import { httpJson } from "../http.js";
import type { SearchResult, StreamBundle } from "../types.js";

const API = "https://api.alloha.tv";

interface AllohaResp {
  status: "success" | "error";
  data?: {
    id_kp?: number;
    id_imdb?: string;
    name?: string;
    original_name?: string;
    year?: number;
    poster?: string;
    iframe?: string;
    category?: number;
    seasons?: unknown;
  };
  error_info?: string;
}

function token() {
  const t = process.env.ALLOHA_TOKEN;
  if (!t) throw new Error("ALLOHA_TOKEN env var is not set");
  return t;
}

export async function searchByKp(kinopoiskId: number | string): Promise<SearchResult[]> {
  const r = await httpJson<AllohaResp>(
    `${API}/?token=${token()}&kp=${kinopoiskId}`,
  ).catch(() => null);
  if (!r || r.status !== "success" || !r.data) return [];
  return [
    {
      source: "alloha",
      id: String(r.data.id_kp ?? kinopoiskId),
      title: r.data.name ?? "Untitled",
      originalTitle: r.data.original_name,
      year: r.data.year,
      poster: r.data.poster,
      url: r.data.iframe ?? "",
      kind: r.data.category === 2 ? "series" : "movie",
    },
  ];
}

export async function streamByKp(kinopoiskId: number | string): Promise<StreamBundle> {
  const r = await httpJson<AllohaResp>(
    `${API}/?token=${token()}&kp=${kinopoiskId}`,
  );
  if (r.status !== "success" || !r.data?.iframe) {
    throw new Error(`Alloha: ${r.error_info ?? "no iframe"}`);
  }
  return {
    source: "alloha",
    sourceTitle: "Alloha",
    qualities: [],
    iframe: r.data.iframe,
  };
}
