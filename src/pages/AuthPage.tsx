import { Link } from 'react-router-dom';
import {
  BellIcon,
  CastIcon,
  ClockIcon,
  FullscreenIcon,
  HomeIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from '../components/icons';
import styles from './AuthPage.module.css';

const code = ['1', '2', '3', '4', '5', '6', '7', '8'];

const faqs = [
  {
    q: 'Что такое TVinks?',
    a: 'Современный онлайн-кинотеатр, который предлагает обширную коллекцию фильмов и сериалов в высоком качестве',
  },
  {
    q: 'Как создать учётную запись?',
    a: 'Просто перейдите в нашего Telegram-бота — @tvinksbot и следуйте инструкциям. Это займёт всего пару минут',
  },
  {
    q: 'У вас возникли проблемы со входом?',
    a: 'Если вы столкнулись с проблемами при авторизации, свяжитесь с нами через службу поддержки — @tvinks_support',
  },
];

export default function AuthPage() {
  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <button className={styles.menuBtn} aria-label="Меню">
          <MenuIcon width={20} height={20} />
        </button>
        <div className={styles.topbarIcons}>
          <button className={styles.iconBtn}>
            <FullscreenIcon width={20} height={20} />
          </button>
          <button className={styles.iconBtn}>
            <CastIcon width={20} height={20} />
          </button>
          <button className={styles.iconBtn}>
            <UsersIcon width={20} height={20} />
          </button>
          <button className={styles.iconBtn}>
            <BellIcon width={20} height={20} />
            <span className={styles.alertDot} />
          </button>
          <span className={styles.avatar}>АН</span>
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Добро пожаловать!</h1>
        <p className={styles.subtitle}>
          Открой новые возможности любимого приложения и окунись в просмотр кино высокого качества
        </p>

        <section className={styles.codeSection}>
          <div className={styles.codePrompt}>Введите код в боте</div>
          <div className={styles.code}>
            {code.map((digit, idx) => (
              <span key={idx} className={styles.codeDigit}>
                {digit}
              </span>
            ))}
          </div>
        </section>

        <a
          className={styles.cta}
          href="https://t.me/tvinksbot"
          target="_blank"
          rel="noopener noreferrer"
        >
          Перейти в бота
        </a>

        <ul className={styles.faq}>
          {faqs.map((f) => (
            <li key={f.q} className={styles.faqItem}>
              <span className={styles.faqDot} />
              <div className={styles.faqBody}>
                <div className={styles.faqQ}>{f.q}</div>
                <div className={styles.faqA}>{f.a}</div>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <nav className={styles.tabbar}>
        <div className={styles.tabbarGlow} />
        <div className={styles.tabbarInner}>
          <Link to="/" className={`${styles.tab} ${styles.tabActive}`}>
            <HomeIcon width={22} height={22} />
          </Link>
          <Link to="/search" className={styles.tab}>
            <SearchIcon width={22} height={22} />
          </Link>
          <Link to="/history" className={styles.tab}>
            <ClockIcon width={22} height={22} />
          </Link>
          <Link to="/settings" className={styles.tab}>
            <SettingsIcon width={22} height={22} />
          </Link>
        </div>
      </nav>
    </div>
  );
}
