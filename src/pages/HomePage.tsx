import { Link } from 'react-router-dom';
import Poster from '../components/Poster';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PlusIcon } from '../components/icons';
import {
  foreignSeries,
  heroFilm,
  newReleases,
  recommended,
} from '../data/catalog';
import { useIsMobile } from '../hooks/useMediaQuery';
import type { Film } from '../data/catalog';
import styles from './HomePage.module.css';

export default function HomePage() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileHome />;
  }

  return (
    <div className={styles.page}>
      <HeroBanner />
      <Section title="Популярные новинки" films={newReleases.concat(recommended).slice(0, 6)} />
      <Section title="Рекомендуем" films={recommended} />
      <Section title="Зарубежные сериалы" films={foreignSeries} />
    </div>
  );
}

function HeroBanner() {
  return (
    <section
      className={styles.hero}
      style={{
        background: `radial-gradient(120% 90% at 75% 50%, ${heroFilm.backdropAccent}55 0%, transparent 60%), linear-gradient(90deg, rgba(15,15,15,0.96) 35%, rgba(15,15,15,0.2) 75%, rgba(15,15,15,0.6) 100%), linear-gradient(160deg, ${heroFilm.backdropColor} 0%, #0F0F0F 100%)`,
      }}
    >
      <div className={styles.heroContent}>
        <span className={styles.liveBadge}>
          <span className={styles.liveDot} /> Live
        </span>
        <h1 className={styles.heroTitle}>Fantastic Beasts:<br />The Secrets of Dumbledore</h1>
        <p className={styles.heroDesc}>
          Профессор Альбус Дамблдор знает, что могущественный тёмный маг Геллерт Гриндевальд стремится
          захватить власть над волшебным миром.
        </p>
        <div className={styles.heroActions}>
          <Link to="/film/black-bird" className={styles.primaryBtn}>
            <PlayIcon width={18} height={18} />
            <span>Смотреть</span>
          </Link>
          <button className={styles.secondaryBtn} aria-label="Добавить в закладки">
            <PlusIcon width={20} height={20} />
          </button>
        </div>
      </div>
      <div className={styles.heroPager}>
        <button className={styles.pagerBtn} aria-label="Назад">
          <ChevronLeftIcon width={18} height={18} />
        </button>
        <button className={styles.pagerBtn} aria-label="Вперёд">
          <ChevronRightIcon width={18} height={18} />
        </button>
      </div>
    </section>
  );
}

function Section({ title, films }: { title: string; films: Film[] }) {
  return (
    <section className={styles.section}>
      <header className={styles.sectionHeader}>
        <h2>{title}</h2>
        <button className={styles.seeAll}>
          Все
          <ChevronRightIcon width={16} height={16} />
        </button>
      </header>
      <div className={`${styles.rail} tv-scroll`}>
        {films.map((f, idx) => (
          <Link
            key={`${f.id}-${idx}`}
            to={`/film/${f.id}`}
            className={`${styles.card} ${idx === 1 ? styles.cardFocused : ''}`}
          >
            <Poster film={f} />
            <div className={styles.cardMeta}>
              <div className={styles.cardTitle}>{f.title}</div>
              <div className={styles.cardYear}>{f.year}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function MobileHome() {
  return (
    <div className={styles.mobilePage}>
      <MobileRow title="Популярные новинки" films={newReleases} large />
      <MobileRow title="Рекомендуем" films={recommended.slice(0, 6)} />
      <MobileRow title="Зарубежные" films={foreignSeries} />
    </div>
  );
}

function MobileRow({
  title,
  films,
  large,
}: {
  title: string;
  films: Film[];
  large?: boolean;
}) {
  return (
    <section className={styles.mobileSection}>
      <h2 className={styles.mobileSectionTitle}>{title}</h2>
      <div className={`${styles.mobileRail} tv-scroll`}>
        {films.map((f, idx) => (
          <Link
            key={`${f.id}-${idx}`}
            to={`/film/${f.id}`}
            className={`${styles.mobileCard} ${large ? styles.mobileCardLarge : ''}`}
          >
            <Poster film={f} />
            <div className={styles.mobileCardMeta}>
              <div className={styles.mobileCardTitle}>{f.title}</div>
              <div className={styles.mobileCardYear}>{f.year}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
