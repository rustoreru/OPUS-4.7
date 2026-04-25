import { Link, useParams } from 'react-router-dom';
import Poster from '../components/Poster';
import { ExternalIcon, PlayIcon, PlusIcon, StarIcon } from '../components/icons';
import { findFilm, heroFilm, recommended } from '../data/catalog';
import styles from './FilmPage.module.css';

export default function FilmPage() {
  const { id } = useParams();
  const film = findFilm(id ?? '') ?? heroFilm;

  return (
    <div
      className={styles.page}
      style={{
        background: `linear-gradient(90deg, rgba(15,15,15,0.96) 40%, rgba(15,15,15,0.3) 100%), radial-gradient(90% 80% at 80% 30%, ${film.backdropAccent}55 0%, transparent 60%), linear-gradient(160deg, ${film.backdropColor} 0%, #0F0F0F 100%)`,
      }}
    >
      <section className={styles.hero}>
        <div className={styles.heroInfo}>
          <div className={styles.tagRow}>
            <span className={`${styles.tag} ${styles.tagAccent}`}>{film.tag ?? film.genres[0]}</span>
            {film.genres.slice(1, 3).map((g) => (
              <span key={g} className={styles.tag}>
                {g}
              </span>
            ))}
          </div>
          <h1 className={styles.title}>{film.title}</h1>
          <div className={styles.meta}>
            <span>{film.year}</span>
            <span className={styles.sep}>|</span>
            <span>{film.duration}</span>
            <span className={styles.sep}>|</span>
            <span>{film.country}</span>
            <span className={styles.sep}>|</span>
            <span>{film.ageRating}</span>
          </div>
          <p className={styles.description}>{film.description}</p>
          {(film.kpRating || film.imdbRating) && (
            <div className={styles.ratings}>
              {film.kpRating !== undefined && (
                <div className={styles.rating}>
                  <span className={`${styles.ratingBadge} ${styles.kp}`}>КП</span>
                  <span className={styles.ratingValue}>{film.kpRating.toFixed(1)}</span>
                </div>
              )}
              {film.imdbRating !== undefined && (
                <div className={styles.rating}>
                  <span className={`${styles.ratingBadge} ${styles.imdb}`}>IMDb</span>
                  <span className={styles.ratingValue}>{film.imdbRating.toFixed(1)}</span>
                </div>
              )}
            </div>
          )}
          <div className={styles.actions}>
            <Link to={`/film/${film.id}/episodes`} className={styles.primaryBtn}>
              <PlayIcon width={18} height={18} />
              Смотреть
            </Link>
            <button className={styles.secondaryBtn}>
              <PlusIcon width={18} height={18} />
              Закладки
            </button>
            <button className={styles.secondaryBtn}>
              <ExternalIcon width={18} height={18} />
              Трейлер
            </button>
          </div>
        </div>
        <div className={styles.sectionIndicator}>
          <span className={styles.indicatorActive} />
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className={styles.recSection}>
        <h2 className={styles.recTitle}>Рекомендуем</h2>
        <div className={`${styles.rail} tv-scroll`}>
          {recommended.map((f, idx) => {
            const isActive = f.id === 'black-bird-rec' || idx === 2;
            return (
              <Link
                key={`${f.id}-${idx}`}
                to={`/film/${f.id}`}
                className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
              >
                <Poster film={f} />
                {isActive && (
                  <span className={styles.activeStar}>
                    <StarIcon width={18} height={18} />
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
