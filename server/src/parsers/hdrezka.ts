/**
 * HDRezka parser.
 *
 * Supports:
 *   - search (HTML scrape of /search/)
 *   - film details (post_id, translators, seasons)
 *   - stream URL resolution (decoding the obfuscated CDN URL)
 *
 * Obfuscation format (observed April 2024+):
 *   "#h#prefix#garbage...#h#real_base64"
 *   After stripping "//_//" sequences and repeatedly unwrapping the
 *   random token/base64 layers, we get the final
 *   "[1080p]https://.../file.mp4 or /master.m3u8,[720p]https://..., ..."
 */
import * as cheerio from "cheerio";
import { http, httpJson } from "../http.js";
import type {
  Episode,
  FilmDetails,
  SearchResult,
  StreamBundle,
  StreamQuality,
  Translator,
} from "../types.js";

const HOSTS = [
  "https://hdrezka.ag",
  "https://rezka.ag",
  "https://hdrezka.cm",
];

async function firstAlive(path: string) {
  for (const host of HOSTS) {
    try {
      const r = await http(host + path);
      if (r.status < 500) return { host, r };
    } catch {
      /* try next */
    }
  }
  throw new Error("HDRezka: all mirrors unreachable");
}

export async function search(query: string): Promise<SearchResult[]> {
  const path = `/search/?do=search&subaction=search&q=${encodeURIComponent(query)}`;
  const { host, r } = await firstAlive(path);
  if (r.status >= 400) return [];
  const $ = cheerio.load(r.text);
  const items: SearchResult[] = [];
  $(".b-content__inline_item").each((_, el) => {
    const $el = $(el);
    const url = $el.find(".b-content__inline_item-link a").attr("href") ?? "";
    const title = $el
      .find(".b-content__inline_item-link a")
      .text()
      .trim();
    const meta = $el.find(".b-content__inline_item-link div").text().trim();
    const yearMatch = meta.match(/\d{4}/);
    const poster = $el.find("img").attr("src") ?? undefined;
    const idMatch = url.match(/\/(\d+)-/);
    const kindGuess: SearchResult["kind"] = url.includes("/series/")
      ? "series"
      : url.includes("/films/")
      ? "movie"
      : "unknown";
    if (!title || !url || !idMatch) return;
    items.push({
      source: "hdrezka",
      id: idMatch[1],
      title,
      year: yearMatch ? parseInt(yearMatch[0], 10) : undefined,
      poster: poster ? (poster.startsWith("http") ? poster : host + poster) : undefined,
      url: url.startsWith("http") ? url : host + url,
      kind: kindGuess,
    });
  });
  return items;
}

export async function details(filmUrl: string): Promise<FilmDetails> {
  const r = await http(filmUrl);
  if (r.status >= 400) throw new Error(`HDRezka details: HTTP ${r.status}`);
  const $ = cheerio.load(r.text);

  const postId = $("#post_id").attr("value") ?? filmUrl.match(/\/(\d+)-/)?.[1];
  if (!postId) throw new Error("HDRezka: post_id not found");

  const title = $(".b-post__title h1").text().trim();
  const origTitle = $(".b-post__origtitle").text().trim() || undefined;
  const description =
    $(".b-post__description_text").text().trim() || undefined;
  const poster =
    $(".b-sidecover img").attr("src") ??
    $(".b-sidecover a").attr("href") ??
    undefined;

  const infoRows: Record<string, string> = {};
  $(".b-post__info tbody tr").each((_, el) => {
    const $el = $(el);
    const key = $el.find("h2").text().trim().replace(":", "").toLowerCase();
    if (!key) return;
    infoRows[key] = $el.find("td").last().text().trim();
  });

  const year = infoRows["дата выхода"]?.match(/\d{4}/)?.[0];
  const countries = infoRows["страна"]?.split(",").map((s) => s.trim()) ?? [];
  const genres = infoRows["жанр"]?.split(",").map((s) => s.trim()) ?? [];
  const duration = infoRows["время"] || undefined;
  const ageRating = infoRows["возраст"] || undefined;

  const translators: Translator[] = [];
  $(".b-translator__item").each((_, el) => {
    const $el = $(el);
    const id = $el.attr("data-translator_id");
    const name = $el.text().trim();
    if (id && name) {
      translators.push({
        id,
        name,
        isOriginal: $el.attr("title")?.toLowerCase().includes("оригинал"),
      });
    }
  });

  if (translators.length === 0) {
    const inlineTr = r.text.match(/initCDNMoviesEvents\s*\(\s*(\d+)\s*,\s*(\d+)/);
    if (inlineTr) translators.push({ id: inlineTr[2], name: "По умолчанию" });
  }

  const kind: FilmDetails["kind"] = r.text.includes("initCDNSeriesEvents")
    ? "series"
    : r.text.includes("initCDNMoviesEvents")
    ? "movie"
    : "unknown";

  const ratingKp = $(".b-post__info_rates.kp .bold").text().trim();
  const ratingImdb = $(".b-post__info_rates.imdb .bold").text().trim();

  return {
    source: "hdrezka",
    id: postId,
    title,
    originalTitle: origTitle,
    description,
    year: year ? parseInt(year, 10) : undefined,
    poster,
    rating: {
      kp: ratingKp ? parseFloat(ratingKp) : undefined,
      imdb: ratingImdb ? parseFloat(ratingImdb) : undefined,
    },
    genres,
    countries,
    duration,
    ageRating,
    translators,
    url: filmUrl,
    kind,
  };
}

export async function seasons(
  filmUrl: string,
  translatorId: string,
): Promise<Record<string, Episode[]>> {
  const r = await http(filmUrl);
  if (r.status >= 400) throw new Error(`HDRezka seasons: HTTP ${r.status}`);
  const $ = cheerio.load(r.text);
  const result: Record<string, Episode[]> = {};
  $(
    `#simple-episodes-tabs .b-simple_episodes__list[data-translator_id="${translatorId}"] .b-simple_episode__item`,
  ).each((_, el) => {
    const $el = $(el);
    const s = parseInt($el.attr("data-season_id") ?? "0", 10);
    const e = parseInt($el.attr("data-episode_id") ?? "0", 10);
    if (!s || !e) return;
    const key = `s${s}`;
    (result[key] ??= []).push({ season: s, episode: e });
  });
  return result;
}

// ─── Stream URL decryption ────────────────────────────────────────────

const TRASH_LIST = [
  "@",
  "#",
  "!",
  "^",
  "$",
];

function b64clean(s: string): string {
  for (const part of TRASH_LIST) {
    for (const p2 of TRASH_LIST) {
      for (const p3 of TRASH_LIST) {
        for (const p4 of TRASH_LIST) {
          const token = [part, p2, p3, p4].join("");
          const b64 = Buffer.from(token).toString("base64");
          s = s.split(b64).join("");
        }
      }
    }
  }
  return s;
}

function decodeUrl(raw: string): string {
  if (!raw.startsWith("#h")) return raw;
  let trimmed = raw.substring(2).replace(/\/\/_\/\//g, "");
  trimmed = b64clean(trimmed);
  try {
    return Buffer.from(trimmed, "base64").toString("utf8");
  } catch {
    return raw;
  }
}

function parseQualities(decoded: string): StreamQuality[] {
  const out: StreamQuality[] = [];
  const parts = decoded.split(",");
  for (const part of parts) {
    const m = part.match(/^\[([^\]]+)\](.+?)(?:\s+or\s+(.+))?$/);
    if (!m) continue;
    const label = m[1].trim();
    const url = (m[3] ?? m[2]).trim();
    if (url.startsWith("http")) out.push({ label, url });
  }
  return out;
}

export interface StreamRequest {
  postId: string;
  translatorId: string;
  season?: number;
  episode?: number;
  favs?: string;
}

export async function stream(req: StreamRequest): Promise<StreamBundle> {
  const action =
    req.season && req.episode ? "get_stream" : "get_movie";
  const body = new URLSearchParams({
    id: req.postId,
    translator_id: req.translatorId,
    action,
  });
  if (req.season) body.set("season", String(req.season));
  if (req.episode) body.set("episode", String(req.episode));
  if (req.favs) body.set("favs", req.favs);

  const host = HOSTS[0];
  const resp = await httpJson<{
    success: boolean;
    url?: string;
    message?: string;
    subtitle?: string | false;
    subtitle_lns?: Record<string, string> | false;
  }>(`${host}/ajax/get_cdn_series/?t=${Date.now()}`, {
    method: "POST",
    headers: {
      "x-requested-with": "XMLHttpRequest",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      origin: host,
      referer: host + "/",
    },
    body,
  });

  if (!resp.success || !resp.url) {
    throw new Error(`HDRezka CDN: ${resp.message ?? "unknown error"}`);
  }
  const decoded = decodeUrl(resp.url);
  const qualities = parseQualities(decoded);

  const subtitles: Array<{ lang: string; url: string }> = [];
  if (typeof resp.subtitle === "string" && resp.subtitle) {
    const lns = (resp.subtitle_lns || {}) as Record<string, string>;
    for (const pair of resp.subtitle.split(",")) {
      const m = pair.match(/^\[([^\]]+)\](.+)$/);
      if (!m) continue;
      subtitles.push({ lang: lns[m[1]] ?? m[1], url: m[2].trim() });
    }
  }

  return {
    source: "hdrezka",
    sourceTitle: "HDRezka",
    qualities,
    subtitles: subtitles.length ? subtitles : undefined,
  };
}
