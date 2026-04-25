import { NavLink } from 'react-router-dom';
import {
  BellIcon,
  BookmarkIcon,
  ClockIcon,
  CompassIcon,
  HomeIcon,
  SearchIcon,
  SettingsIcon,
  UploadIcon,
  UsersIcon,
} from '../components/icons';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  onClose: () => void;
}

const items = [
  { to: '/search', icon: SearchIcon, label: 'Поиск' },
  { to: '/', icon: HomeIcon, label: 'Главная', end: true },
  { to: '/history', icon: ClockIcon, label: 'История' },
  { to: '/bookmarks', icon: BookmarkIcon, label: 'Закладки' },
  { to: '/collections', icon: CompassIcon, label: 'Подборки' },
  { to: '/torrents', icon: UploadIcon, label: 'Торренты' },
  { to: '/settings', icon: SettingsIcon, label: 'Настройки' },
];

export default function MobileMenu({ onClose }: MobileMenuProps) {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <aside className={styles.panel}>
        <header className={styles.header}>
          <div className={styles.time}>Пт, 19 Май. 11:15</div>
          <div className={styles.headerIcons}>
            <UsersIcon width={18} height={18} />
            <span className={styles.bellWrap}>
              <BellIcon width={18} height={18} />
              <span className={styles.dot} />
            </span>
            <span className={styles.avatar}>АН</span>
          </div>
        </header>
        <nav className={styles.nav}>
          {items.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `${styles.item} ${isActive ? styles.itemActive : ''}`
              }
            >
              <Icon width={22} height={22} />
              <span>{label}</span>
              <span className={styles.activeDot} />
            </NavLink>
          ))}
        </nav>
      </aside>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Закрыть меню"
        onClick={onClose}
      />
    </div>
  );
}
