import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import FilmPage from './pages/FilmPage';
import EpisodesPage from './pages/EpisodesPage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';
import Preloader from './components/Preloader';

export default function App() {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  if (booting) {
    return <Preloader fullscreen />;
  }

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/film/:id" element={<FilmPage />} />
        <Route path="/film/:id/episodes" element={<EpisodesPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
