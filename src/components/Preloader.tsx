import styles from './Preloader.module.css';

interface PreloaderProps {
  fullscreen?: boolean;
  size?: 'tv' | 'mobile';
}

export default function Preloader({ fullscreen, size = 'tv' }: PreloaderProps) {
  return (
    <div className={fullscreen ? styles.fullscreen : styles.inline}>
      <div className={size === 'tv' ? styles.logoTv : styles.logoMobile}>
        <span className={`${styles.cell} ${styles.primary}`} />
        <span className={styles.cell} />
        <span className={styles.cell} />
        <span className={styles.cell} />
      </div>
    </div>
  );
}
