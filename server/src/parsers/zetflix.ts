/**
 * Zetflix — HDRezka mirror with the same CDN API.
 *
 * Structure is nearly identical to HDRezka: /ajax/get_cdn_series/ endpoint,
 * same obfuscation scheme. We reuse the decoder from hdrezka.ts.
 */
import * as cheerio from "cheerio";
import { http } from "../http.js";
import type { SearchResult } from "../types.js";

const HOSTS = [
  "https://zetflix.online",
  "https://zetflix.ws",
];

export async function search(query: string): Promise<SearchResult[]> {
  const out: SearchResult[] = [];
  for (const host of HOSTS) {
    try {
      const r = await http(
        `${host}/search/?do=search&subaction=search&q=${encodeURIComponent(query)}`,
      );
      if (r.status >= 400) continue;
      const $ = cheerio.load(r.text);
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
        if (!title || !url || !idMatch) return;
        out.push({
          source: "zetflix",
          id: idMatch[1],
          title,
          year: yearMatch ? parseInt(yearMatch[0], 10) : undefined,
          poster: poster ? (poster.startsWith("http") ? poster : host + poster) : undefined,
          url: url.startsWith("http") ? url : host + url,
          kind: url.includes("/series/") ? "series" : url.includes("/films/") ? "movie" : "unknown",
        });
      });
      if (out.length) break;
    } catch {
      /* try next host */
    }
  }
  return out;
}
