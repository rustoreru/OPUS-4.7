import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Player } from "../components/Player";
import { ChevronLeftIcon } from "../components/icons";
import { api } from "../services/api";
import type {
  Episode,
  FilmDetails,
  SourceId,
  StreamBundle,
  Translator,
} from "../services/types";
import styles from "./WatchPage.module.css";

export default function WatchPage() {
  const { source = "hdrezka", id = "" } = useParams<{
    source: SourceId;
    id: string;
  }>();
  const [searchParams] = useSearchParams();
  const rawUrl = searchParams.get("url") ?? undefined;

  const [details, setDetails] = useState<FilmDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const [activeTranslator, setActiveTranslator] = useState<Translator | null>(
    null,
  );
  const [activeSeason, setActiveSeason] = useState<number>(1);
  const [activeEpisode, setActiveEpisode] = useState<number>(1);

  const [bundle, setBundle] = useState<StreamBundle | null>(null);
  const [streamLoading, setStreamLoading] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);

  useEffect(() => {
    setDetailsLoading(true);
    setDetailsError(null);
    const params =
      source === "hdrezka" || source === "zetflix"
        ? { url: rawUrl }
        : { id };
    api
      .details(source as SourceId, params)
      .then((d) => {
        setDetails(d);
        setActiveTranslator(d.translators[0] ?? null);
        if (d.episodes) {
          const firstSeason = Object.keys(d.episodes)[0];
          if (firstSeason) {
            setActiveSeason(Number(firstSeason.replace("s", "")));
            const firstEp = d.episodes[firstSeason][0];
            if (firstEp) setActiveEpisode(firstEp.episode);
          }
        }
      })
      .catch((e: unknown) =>
        setDetailsError(e instanceof Error ? e.message : String(e)),
      )
      .finally(() => setDetailsLoading(false));
  }, [source, id, rawUrl]);

  useEffect(() => {
    if (!details || !activeTranslator) return;
    setStreamLoading(true);
    setStreamError(null);
    const isSeries = details.kind === "series";
    api
      .stream(source as SourceId, {
        id: details.id,
        postId: details.id,
        translatorId: activeTranslator.id,
        translator: activeTranslator.id,
        season: isSeries ? activeSeason : undefined,
        episode: isSeries ? activeEpisode : undefined,
      })
      .then(setBundle)
      .catch((e: unknown) =>
        setStreamError(e instanceof Error ? e.message : String(e)),
      )
      .finally(() => setStreamLoading(false));
  }, [details, activeTranslator, activeSeason, activeEpisode, source]);

  const currentSeasonEpisodes = useMemo<Episode[]>(() => {
    if (!details?.episodes) return [];
    return details.episodes[`s${activeSeason}`] ?? [];
  }, [details, activeSeason]);

  const seasons = useMemo(() => {
    if (!details?.episodes) return [];
    return Object.keys(details.episodes)
      .map((k) => Number(k.replace("s", "")))
      .sort((a, b) => a - b);
  }, [details]);

  if (detailsLoading) {
    return <div className={styles.page}><div className={styles.loading}>Загружаем карточку…</div></div>;
  }
  if (detailsError || !details) {
    return (
      <div className={styles.page}>
        <Link className={styles.backLink} to="/search">
          <ChevronLeftIcon width={16} height={16} /> Назад к поиску
        </Link>
        <div className={styles.error}>
          {detailsError ?? "Не удалось загрузить карточку"}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link className={styles.backLink} to="/search">
        <ChevronLeftIcon width={16} height={16} /> Назад к поиску
      </Link>

      <h1 className={styles.title}>{details.title}</h1>
      {details.originalTitle && (
        <p className={styles.originalTitle}>{details.originalTitle}</p>
      )}

      <div className={styles.meta}>
        {details.year && <span>{details.year}</span>}
        {details.duration && <span>{details.duration}</span>}
        {details.countries?.length ? (
          <span>{details.countries.join(", ")}</span>
        ) : null}
        {details.ageRating && <span>{details.ageRating}</span>}
        {details.rating?.kp && <span>КП {details.rating.kp}</span>}
        {details.rating?.imdb && <span>IMDb {details.rating.imdb}</span>}
      </div>

      <section className={styles.playerSection}>
        <Player
          bundle={bundle}
          loading={streamLoading}
          error={streamError}
        />
      </section>

      <div className={styles.controls}>
        {details.translators.length > 1 && (
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Перевод</span>
            <div className={styles.chipRow}>
              {details.translators.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`${styles.chip} ${
                    activeTranslator?.id === t.id ? styles.active : ""
                  }`}
                  onClick={() => setActiveTranslator(t)}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {seasons.length > 0 && (
          <div className={styles.controlGroup}>
            <span className={styles.controlLabel}>Сезон</span>
            <div className={styles.chipRow}>
              {seasons.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`${styles.chip} ${
                    activeSeason === s ? styles.active : ""
                  }`}
                  onClick={() => setActiveSeason(s)}
                >
                  {s} сезон
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {currentSeasonEpisodes.length > 0 && (
        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>Серии</span>
          <div className={styles.episodeGrid}>
            {currentSeasonEpisodes.map((ep) => (
              <button
                key={`${ep.season}-${ep.episode}`}
                type="button"
                className={`${styles.episodeBtn} ${
                  activeEpisode === ep.episode ? styles.active : ""
                }`}
                onClick={() => setActiveEpisode(ep.episode)}
              >
                {ep.episode}
              </button>
            ))}
          </div>
        </div>
      )}

      {details.description && (
        <p className={styles.description}>{details.description}</p>
      )}
    </div>
  );
}
