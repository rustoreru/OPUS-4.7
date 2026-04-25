/**
 * Filmix parser.
 *
 * Uses the undocumented REST API at https://filmix.my / filmix.app:
 *   GET /api/v2/suggestions?search_word=...   → search
 *   GET /api/v2/post/{id}                     → film details incl. player_links
 *
 * Stream URLs in `player_links.movie` are in the clear (MP4/HLS).
 * For series the structure is player_links.playlist[season][episode].
 */
import { httpJson } from "../http.js";
import type {
  Episode,
  FilmDetails,
  SearchResult,
  StreamBundle,
  Translator,
} from "../types.js";

const API = "https://filmix.my/api/v2";

interface FxSuggest {
  id: number;
  title: string;
  original_name?: string;
  year?: string;
  poster_url?: string;
  link?: string;
  section?: string;
}

interface FxPlayerMovieTrack {
  link: string;
  qualities?: Record<string, string>;
  translation?: string;
}

interface FxPost {
  id: number;
  title: string;
  original_name?: string;
  year?: number | string;
  poster_url?: string;
  short_story?: string;
  genres?: Array<{ name: string }>;
  countries?: Array<{ name: string }>;
  imdb_rating?: string | number;
  kinopoisk_rating?: string | number;
  duration?: string | number;
  ratings?: { imdb?: string | number; kinopoisk?: string | number };
  age?: string;
  player_links?: {
    movie?: FxPlayerMovieTrack[];
    playlist?: Record<
      string,
      Record<
        string,
        Record<string, { title: string; link: string; qualities?: Record<string, string> }>
      >
    >;
    trailer?: string;
  };
  section?: string;
}

export async function search(query: string): Promise<SearchResult[]> {
  const data = await httpJson<FxSuggest[]>(
    `${API}/suggestions/ru?search_word=${encodeURIComponent(query)}`,
  ).catch(() => [] as FxSuggest[]);
  return data.slice(0, 20).map((it) => ({
    source: "filmix" as const,
    id: String(it.id),
    title: it.title,
    originalTitle: it.original_name,
    year: it.year ? parseInt(String(it.year), 10) : undefined,
    poster: it.poster_url,
    url: it.link ?? `https://filmix.my/play/${it.id}`,
    kind: it.section === "serials" ? "series" : it.section === "films" ? "movie" : "unknown",
  }));
}

export async function details(id: string): Promise<FilmDetails> {
  const post = await httpJson<FxPost>(`${API}/post/${id}`);
  const translators: Translator[] = [];
  const episodes: Record<string, Episode[]> = {};
  const kind: FilmDetails["kind"] = post.player_links?.playlist
    ? "series"
    : post.player_links?.movie
    ? "movie"
    : "unknown";

  if (post.player_links?.movie) {
    for (const m of post.player_links.movie) {
      translators.push({
        id: m.translation ?? "default",
        name: m.translation ?? "По умолчанию",
      });
    }
  }

  if (post.player_links?.playlist) {
    const trKeys = Object.keys(post.player_links.playlist);
    for (const tr of trKeys) translators.push({ id: tr, name: tr });

    // Episode lists are identical across translators — collect once from the
    // first translator to avoid duplicate UI buttons.
    const baseTr = trKeys[0];
    if (baseTr) {
      const seasonsObj = post.player_links.playlist[baseTr];
      for (const sKey of Object.keys(seasonsObj)) {
        const s = parseInt(sKey, 10);
        episodes[`s${s}`] = Object.keys(seasonsObj[sKey])
          .map((eKey) => ({
            season: s,
            episode: parseInt(eKey, 10),
            title: seasonsObj[sKey][eKey].title,
          }))
          .sort((a, b) => a.episode - b.episode);
      }
    }
  }

  return {
    source: "filmix",
    id: String(post.id),
    title: post.title,
    originalTitle: post.original_name,
    description: post.short_story,
    year: post.year ? parseInt(String(post.year), 10) : undefined,
    poster: post.poster_url,
    rating: {
      kp: post.ratings?.kinopoisk
        ? parseFloat(String(post.ratings.kinopoisk))
        : post.kinopoisk_rating
        ? parseFloat(String(post.kinopoisk_rating))
        : undefined,
      imdb: post.ratings?.imdb
        ? parseFloat(String(post.ratings.imdb))
        : post.imdb_rating
        ? parseFloat(String(post.imdb_rating))
        : undefined,
    },
    genres: post.genres?.map((g) => g.name),
    countries: post.countries?.map((c) => c.name),
    ageRating: post.age,
    duration: post.duration ? String(post.duration) + " мин" : undefined,
    translators,
    episodes: kind === "series" ? episodes : undefined,
    url: `https://filmix.my/play/${post.id}`,
    kind,
  };
}

export async function stream(
  id: string,
  opts: { translator?: string; season?: number; episode?: number } = {},
): Promise<StreamBundle> {
  const post = await httpJson<FxPost>(`${API}/post/${id}`);
  const qualities: StreamBundle["qualities"] = [];

  const pick = (q?: Record<string, string>, fallback?: string) => {
    if (q) {
      for (const label of Object.keys(q)) {
        if (q[label]) qualities.push({ label, url: q[label] });
      }
    } else if (fallback) {
      qualities.push({ label: "auto", url: fallback });
    }
  };

  if (opts.season && opts.episode && post.player_links?.playlist) {
    const tr = opts.translator ?? Object.keys(post.player_links.playlist)[0];
    const ep = post.player_links.playlist[tr]?.[String(opts.season)]?.[
      String(opts.episode)
    ];
    if (!ep) throw new Error("Filmix: episode not found");
    pick(ep.qualities, ep.link);
  } else if (post.player_links?.movie?.length) {
    const track =
      post.player_links.movie.find((m) => m.translation === opts.translator) ??
      post.player_links.movie[0];
    pick(track.qualities, track.link);
  } else {
    throw new Error("Filmix: no player_links");
  }

  return {
    source: "filmix",
    sourceTitle: "Filmix",
    translator: opts.translator ? { id: opts.translator, name: opts.translator } : undefined,
    qualities,
  };
}
