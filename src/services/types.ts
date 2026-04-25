export type SourceId = "hdrezka" | "filmix" | "alloha" | "zetflix";

export interface SearchResult {
  source: SourceId;
  id: string;
  title: string;
  originalTitle?: string;
  year?: number;
  poster?: string;
  url: string;
  kind: "movie" | "series" | "unknown";
}

export interface Translator {
  id: string;
  name: string;
  isOriginal?: boolean;
}

export interface Episode {
  season: number;
  episode: number;
  title?: string;
}

export interface StreamQuality {
  label: string;
  url: string;
}

export interface StreamBundle {
  source: SourceId;
  sourceTitle: string;
  translator?: Translator;
  qualities: StreamQuality[];
  subtitles?: Array<{ lang: string; url: string }>;
  iframe?: string;
}

export interface FilmDetails {
  source: SourceId;
  id: string;
  title: string;
  originalTitle?: string;
  description?: string;
  year?: number;
  poster?: string;
  rating?: { kp?: number; imdb?: number };
  genres?: string[];
  countries?: string[];
  ageRating?: string;
  duration?: string;
  translators: Translator[];
  episodes?: Record<string, Episode[]>;
  url: string;
  kind: "movie" | "series" | "unknown";
}
