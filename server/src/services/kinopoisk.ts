/**
 * Kinopoisk.dev client.
 *
 * Docs: https://kinopoisk.dev/documentation
 * Requires KINOPOISK_DEV_TOKEN env var.
 */
import { httpJson } from "../http.js";

const API = "https://api.kinopoisk.dev/v1.4";

export interface KpMovie {
  id: number;
  name?: string;
  alternativeName?: string;
  enName?: string;
  year?: number;
  description?: string;
  shortDescription?: string;
  rating?: { kp?: number; imdb?: number; filmCritics?: number };
  poster?: { url?: string; previewUrl?: string };
  backdrop?: { url?: string; previewUrl?: string };
  genres?: Array<{ name: string }>;
  countries?: Array<{ name: string }>;
  ageRating?: number;
  movieLength?: number;
  seriesLength?: number;
  type?: "movie" | "tv-series" | "anime" | "cartoon";
  seasonsInfo?: Array<{ number: number; episodesCount: number }>;
  videos?: { trailers?: Array<{ url: string; name?: string }> };
}

export interface KpList<T> {
  docs: T[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

function headers() {
  const t = process.env.KINOPOISK_DEV_TOKEN;
  if (!t) throw new Error("KINOPOISK_DEV_TOKEN is not set");
  return { "x-api-key": t, accept: "application/json" };
}

export async function isEnabled(): Promise<boolean> {
  return !!process.env.KINOPOISK_DEV_TOKEN;
}

export async function popular(limit = 24): Promise<KpMovie[]> {
  const params = new URLSearchParams({
    page: "1",
    limit: String(limit),
    "sortField": "rating.kp",
    "sortType": "-1",
    "rating.kp": "7-10",
    "type": "movie",
  });
  const data = await httpJson<KpList<KpMovie>>(`${API}/movie?${params}`, {
    headers: headers(),
  });
  return data.docs;
}

export async function series(limit = 24): Promise<KpMovie[]> {
  const params = new URLSearchParams({
    page: "1",
    limit: String(limit),
    "sortField": "rating.kp",
    "sortType": "-1",
    "rating.kp": "7-10",
    "type": "tv-series",
  });
  const data = await httpJson<KpList<KpMovie>>(`${API}/movie?${params}`, {
    headers: headers(),
  });
  return data.docs;
}

export async function byId(id: number | string): Promise<KpMovie> {
  return httpJson<KpMovie>(`${API}/movie/${id}`, { headers: headers() });
}

export async function search(query: string, limit = 20): Promise<KpMovie[]> {
  const params = new URLSearchParams({
    query,
    page: "1",
    limit: String(limit),
  });
  const data = await httpJson<KpList<KpMovie>>(
    `${API}/movie/search?${params}`,
    { headers: headers() },
  );
  return data.docs;
}
