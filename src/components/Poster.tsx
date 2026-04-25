import type { Film } from '../data/catalog';
import styles from './Poster.module.css';

interface PosterProps {
  film: Film;
  width?: number | string;
  height?: number | string;
  showBadge?: boolean;
  className?: string;
  rounded?: boolean;
}

export default function Poster({
  film,
  width,
  height,
  showBadge = true,
  className,
  rounded = true,
}: PosterProps) {
  const style: React.CSSProperties = {
    width,
    height,
    borderRadius: rounded ? 12 : 0,
    backgroundImage: `radial-gradient(120% 90% at 30% 20%, ${film.posterAccent}55 0%, transparent 55%), radial-gradient(120% 120% at 80% 90%, ${film.posterAccent}33 0%, transparent 60%), linear-gradient(160deg, ${film.posterColor} 0%, #0F0F0F 100%)`,
  };

  const initials = film.title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className={`${styles.poster} ${className ?? ''}`} style={style}>
      <div className={styles.shine} />
      <div className={styles.content}>
        <div className={styles.initials} style={{ color: film.posterAccent }}>
          {initials}
        </div>
      </div>
      {showBadge && film.badge && (
        <span
          className={styles.badge}
          style={{
            background: film.badge.includes('DOLBY') ? '#1565C0' : '#EEBB0D',
            color: film.badge.includes('DOLBY') ? '#FFFFFF' : '#0F0F0F',
          }}
        >
          {film.badge}
        </span>
      )}
    </div>
  );
}
