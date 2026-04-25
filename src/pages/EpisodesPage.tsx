import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { episodes, findFilm, heroFilm } from '../data/catalog';
import type { Episode } from '../data/catalog';
import { useIsMobile } from '../hooks/useMediaQuery';
import styles from './EpisodesPage.module.css';

export default function EpisodesPage() {
  const { id } = useParams();
  const film = findFilm(id ?? '') ?? heroFilm;
  const isMobile = useIsMobile();
  const [activeEpisode, setActiveEpisode] = useState(3);

  const [filters, setFilters] = useState({
    source: 'Filmix',
    season: '1 Сезон',
    translation: 'Полное дублир...',
    quality: 'Максимальное',
    sort: 'Стандартно',
  });

  const backgroundStyle: React.CSSProperties = {
    background: `linear-gradient(90deg, rgba(15,15,15,0.9) 0%, rgba(15,15,15,0.7) 50%, rgba(15,15,15,0.85) 100%), radial-gradient(80% 80% at 70% 30%, ${film.backdropAccent}55 0%, transparent 60%), linear-gradient(160deg, ${film.backdropColor} 0%, #0a0a0a 100%)`,
  };

  if (isMobile) {
    return (
      <div className={styles.mobilePage} style={backgroundStyle}>
        <header className={styles.mobileHeader}>
          <h1 className={styles.mobileTitle}>{film.title}</h1>
          <div className={styles.mobileMeta}>
            {film.year} | {film.seasons ?? 1} Сезон | Серия {activeEpisode}
          </div>
        </header>

        <div className={styles.mobileFilters}>
          <MobileFilterRow label="Источник">
            <ChipButton active>{filters.source}</ChipButton>
          </MobileFilterRow>
          <MobileFilterRow label="Сезон">
            <ChipButton active>1</ChipButton>
            <ChipButton>2</ChipButton>
            <ChipButton>3</ChipButton>
          </MobileFilterRow>
          <MobileFilterRow label="Перевод">
            <ChipButton active>{filters.translation}</ChipButton>
          </MobileFilterRow>
          <MobileFilterRow label="Качество">
            <ChipButton active>Макс.</ChipButton>
            <ChipButton>1080P</ChipButton>
            <ChipButton>720P</ChipButton>
          </MobileFilterRow>
        </div>

        <ul className={styles.mobileEpisodes}>
          {episodes.map((ep) => (
            <li key={ep.id}>
              <button
                type="button"
                onClick={() => setActiveEpisode(ep.id)}
                className={`${styles.mobileEpisode} ${
                  ep.id === activeEpisode ? styles.mobileEpisodeActive : ''
                }`}
              >
                <EpisodePreview episode={ep} size="mobile" />
                <div className={styles.mobileEpisodeBody}>
                  <div className={styles.mobileEpisodeRow}>
                    <span className={styles.mobileEpisodeTitle}>{ep.title}</span>
                    <span className={styles.mobileEpisodeRemaining}>{ep.remainingText}</span>
                  </div>
                  {ep.progress > 0 && (
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${ep.progress * 100}%` }}
                      />
                    </div>
                  )}
                  <div className={styles.mobileEpisodeFoot}>
                    <span className={styles.watchedText}>{ep.watchedText}</span>
                    <span className={styles.qualityText}>{ep.quality}</span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.page} style={backgroundStyle}>
      <div className={styles.layout}>
        <aside className={styles.filters}>
          <FilterGroup
            title="Источники"
            value={filters.source}
            onChange={(v) => setFilters((p) => ({ ...p, source: v }))}
          />
          <FilterGroup
            title="Сезоны"
            value={filters.season}
            onChange={(v) => setFilters((p) => ({ ...p, season: v }))}
            active
          />
          <FilterGroup
            title="Переводы"
            value={filters.translation}
            onChange={(v) => setFilters((p) => ({ ...p, translation: v }))}
          />
          <FilterGroup
            title="Качество"
            value={filters.quality}
            onChange={(v) => setFilters((p) => ({ ...p, quality: v }))}
          />
          <FilterGroup
            title="Сортировка"
            value={filters.sort}
            onChange={(v) => setFilters((p) => ({ ...p, sort: v }))}
          />
          <div className={styles.filmMeta}>
            <div className={styles.filmMetaLine}>
              {film.year} | {film.seasons ?? 1} Сезон | {film.genres.slice(1).join(', ')}
            </div>
            <h3 className={styles.filmName}>{film.title}</h3>
            <div className={styles.progressBarSlim}>
              <div className={styles.progressBarSlimFill} style={{ width: '55%' }} />
            </div>
            <div className={styles.filmSub}>Сезон 1 Серия {activeEpisode}</div>
          </div>
        </aside>

        <ul className={styles.episodes}>
          {episodes.slice(0, 5).map((ep) => (
            <li key={ep.id}>
              <button
                type="button"
                onClick={() => setActiveEpisode(ep.id)}
                className={`${styles.episode} ${
                  ep.id === activeEpisode ? styles.episodeActive : ''
                }`}
              >
                <EpisodePreview episode={ep} size="tv" />
                <div className={styles.episodeBody}>
                  <div className={styles.episodeRow}>
                    <span className={styles.episodeTitle}>{ep.title}</span>
                    <span className={styles.episodeRemaining}>{ep.remainingText}</span>
                  </div>
                  <div className={styles.progressTrack}>
                    {ep.progress > 0 && (
                      <div
                        className={styles.progressFill}
                        style={{ width: `${ep.progress * 100}%` }}
                      />
                    )}
                  </div>
                  <div className={styles.episodeFoot}>
                    <span className={styles.watchedText}>{ep.watchedText}</span>
                    <span className={styles.qualityText}>{ep.quality}</span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  value,
  onChange,
  active,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  active?: boolean;
}) {
  void onChange;
  return (
    <div className={styles.filterGroup}>
      <div className={styles.filterLabel}>{title}</div>
      <button
        type="button"
        className={`${styles.filterButton} ${active ? styles.filterButtonActive : ''}`}
      >
        {value}
      </button>
    </div>
  );
}

function ChipButton({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${active ? styles.chipActive : ''}`}
    >
      {children}
    </button>
  );
}

function MobileFilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.mobileFilterRow}>
      <span className={styles.mobileFilterLabel}>{label}</span>
      <div className={`${styles.mobileFilterChips} tv-scroll`}>{children}</div>
    </div>
  );
}

function EpisodePreview({
  episode,
  size,
}: {
  episode: Episode;
  size: 'tv' | 'mobile';
}) {
  const style: React.CSSProperties = {
    background: `radial-gradient(80% 80% at 40% 40%, ${episode.previewAccent}cc 0%, transparent 70%), linear-gradient(160deg, ${episode.preview} 0%, #0a0a0a 100%)`,
  };
  return (
    <div className={size === 'tv' ? styles.previewTv : styles.previewMobile} style={style}>
      <span className={styles.previewBadge}>{episode.id}</span>
    </div>
  );
}
