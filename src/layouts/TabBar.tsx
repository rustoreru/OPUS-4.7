import { NavLink } from 'react-router-dom';
import { ClockIcon, HomeIcon, SearchIcon, SettingsIcon } from '../components/icons';
import styles from './TabBar.module.css';

const tabs = [
  { to: '/', icon: HomeIcon, label: 'Главная', end: true },
  { to: '/search', icon: SearchIcon, label: 'Поиск' },
  { to: '/history', icon: ClockIcon, label: 'История' },
  { to: '/settings', icon: SettingsIcon, label: 'Настройки' },
];

export default function TabBar() {
  return (
    <nav className={styles.tabbar}>
      <div className={styles.glow} />
      <div className={styles.inner}>
        {tabs.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${styles.tab} ${isActive ? styles.active : ''}`
            }
          >
            <Icon width={22} height={22} />
            <span className={styles.label}>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
