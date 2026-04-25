import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import TabBar from './TabBar';
import MobileMenu from './MobileMenu';
import { useIsMobile } from '../hooks/useMediaQuery';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const heroBackgrounds =
    location.pathname.startsWith('/film/') && location.pathname.endsWith('/episodes');

  return (
    <div
      className={styles.app}
      data-mobile={isMobile ? 'true' : 'false'}
      data-immersive={heroBackgrounds ? 'true' : 'false'}
    >
      {!isMobile && <Sidebar />}
      <div className={styles.main}>
        <TopBar onMenuOpen={() => setMenuOpen(true)} isMobile={isMobile} />
        <main className={styles.content}>
          <Outlet />
        </main>
        {isMobile && <TabBar />}
      </div>
      {isMobile && menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}
    </div>
  );
}
