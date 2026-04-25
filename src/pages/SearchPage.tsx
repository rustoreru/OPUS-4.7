import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { SearchResult, SourceId } from "../services/types";
import styles from "./SearchPage.module.css";

const SOURCES: Array<{ id: SourceId | "all"; label: string }> = [
  { id: "all", label: "Все источники" },
  { id: "hdrezka", label: "HDRezka" },
  { id: "filmix", label: "Filmix" },
  { id: "zetflix", label: "Zetflix" },
  { id: "alloha", label: "Alloha" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [activeSource, setActiveSource] = useState<SourceId | "all">("all");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!submitted) return;
    setLoading(true);
    setError(null);
    api
      .search(submitted)
      .then(setResults)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : String(e)),
      )
      .finally(() => setLoading(false));
  }, [submitted]);

  const filtered = useMemo(() => {
    if (activeSource === "all") return results;
    return results.filter((r) => r.source === activeSource);
  }, [results, activeSource]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Поиск</h1>
      </header>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(query.trim());
        }}
      >
        <input
          className={styles.input}
          placeholder="Название фильма или сериала…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <button
          type="submit"
          className={styles.submit}
          disabled={!query.trim() || loading}
        >
          Найти
        </button>
      </form>

      <div className={styles.sourceTabs}>
        {SOURCES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`${styles.sourceTab} ${
              activeSource === s.id ? styles.active : ""
            }`}
            onClick={() => setActiveSource(s.id)}
          >
            {s.label}
            {s.id !== "all" &&
              ` · ${results.filter((r) => r.source === s.id).length}`}
          </button>
        ))}
      </div>

      {loading && <div className={styles.loading}>Ищем по источникам…</div>}
      {error && <div className={styles.error}>{error}</div>}
      {!loading && submitted && filtered.length === 0 && !error && (
        <div className={styles.empty}>
          Ничего не найдено. Проверь доступ к источникам (HDRezka/Filmix могут
          блокировать IP — нужен VPN, а для Alloha — токен).
        </div>
      )}

      {filtered.length > 0 && (
        <div className={styles.grid}>
          {filtered.map((r) => (
            <Link
              to={`/watch/${r.source}/${encodeURIComponent(r.id)}?url=${encodeURIComponent(r.url)}`}
              key={`${r.source}-${r.id}`}
              className={styles.card}
            >
              <div
                className={styles.poster}
                style={
                  r.poster
                    ? { backgroundImage: `url(${r.poster})` }
                    : undefined
                }
              >
                <span className={styles.sourceBadge}>{r.source}</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardTitle}>{r.title}</div>
                <div className={styles.cardMeta}>
                  {r.year ? `${r.year} · ` : ""}
                  {r.kind === "series"
                    ? "Сериал"
                    : r.kind === "movie"
                    ? "Фильм"
                    : ""}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
