import {
  BellIcon,
  CastIcon,
  FullscreenIcon,
  MenuIcon,
  UsersIcon,
} from '../components/icons';
import styles from './TopBar.module.css';

interface TopBarProps {
  onMenuOpen: () => void;
  isMobile: boolean;
}

export default function TopBar({ onMenuOpen, isMobile }: TopBarProps) {
  return (
    <header className={styles.topbar}>
      {isMobile ? (
        <button
          type="button"
          className={styles.hamburger}
          onClick={onMenuOpen}
          aria-label="Меню"
        >
          <MenuIcon width={22} height={22} />
        </button>
      ) : (
        <div className={styles.spacer} />
      )}

      {!isMobile && <div className={styles.time}>Пт, 19 Май. 11:15</div>}

      <div className={styles.actions}>
        <button className={styles.iconBtn} aria-label="Во весь экран">
          <FullscreenIcon width={20} height={20} />
        </button>
        <button className={styles.iconBtn} aria-label="Трансляция">
          <CastIcon width={20} height={20} />
        </button>
        <button className={styles.iconBtn} aria-label="Аккаунты">
          <UsersIcon width={20} height={20} />
        </button>
        <button className={styles.iconBtn} aria-label="Уведомления">
          <BellIcon width={20} height={20} />
          <span className={styles.dot} />
        </button>
        <div className={styles.avatar} aria-label="Профиль">
          <div className={styles.avatarInner}>АН</div>
        </div>
      </div>
    </header>
  );
}
