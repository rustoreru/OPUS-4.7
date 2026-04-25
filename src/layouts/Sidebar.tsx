import { NavLink } from 'react-router-dom';
import {
  BookmarkIcon,
  ClockIcon,
  CompassIcon,
  HomeIcon,
  Logo,
  SearchIcon,
  SettingsIcon,
  UploadIcon,
} from '../components/icons';
import styles from './Sidebar.module.css';

const items = [
  { to: '/search', icon: SearchIcon, label: 'Поиск' },
  { to: '/', icon: HomeIcon, label: 'Главная', end: true },
  { to: '/history', icon: ClockIcon, label: 'История' },
  { to: '/bookmarks', icon: BookmarkIcon, label: 'Закладки' },
  { to: '/collections', icon: CompassIcon, label: 'Подборки' },
  { to: '/torrents', icon: UploadIcon, label: 'Торренты' },
  { to: '/settings', icon: SettingsIcon, label: 'Настройки' },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Logo size={44} />
      </div>
      <nav className={styles.nav}>
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.itemActive : ''}`
            }
            title={label}
          >
            <span className={styles.iconWrap}>
              <Icon />
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
