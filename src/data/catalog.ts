export type Badge = '4K HDR' | '4K DOLBY' | 'HD' | '1080P';

export interface Film {
  id: string;
  title: string;
  year: number;
  country: string;
  ageRating: string;
  duration: string;
  genres: string[];
  description: string;
  kpRating?: number;
  imdbRating?: number;
  posterColor: string;
  posterAccent: string;
  backdropColor: string;
  backdropAccent: string;
  badge?: Badge;
  isSeries?: boolean;
  seasons?: number;
  tag?: string;
}

export interface Episode {
  id: number;
  title: string;
  preview: string;
  previewAccent: string;
  durationText: string;
  remainingText: string;
  watchedText: string;
  quality: '1080P' | '720P' | '4K';
  progress: number;
  status: 'watched' | 'watching' | 'new';
}

export const heroFilm: Film = {
  id: 'black-bird',
  title: 'Чёрная Птица',
  year: 2022,
  country: 'Соединённые Штаты Америки',
  ageRating: '17+',
  duration: '1ч 00мин',
  genres: ['Сериал', 'Драма', 'Криминал'],
  description:
    'Сериал основан на реальных событиях. Джимми Кин осуждён на десять лет тюрьмы, но ему поступает уникальное предложение. Если он получит признание Ларри Холла, подозреваемого в убийстве, Джимми освободят. Но выполнить подобное задание весьма непросто.',
  kpRating: 7.7,
  imdbRating: 8.1,
  posterColor: '#3A2B26',
  posterAccent: '#A44A2A',
  backdropColor: '#1B1410',
  backdropAccent: '#C46A3A',
  badge: '4K HDR',
  isSeries: true,
  seasons: 1,
  tag: 'Сериал',
};

export const newReleases: Film[] = [
  {
    id: 'fast-10',
    title: 'Форсаж 10',
    year: 2023,
    country: 'США',
    ageRating: '16+',
    duration: '2ч 21мин',
    genres: ['Боевик', 'Триллер'],
    description: 'Финальная глава саги о семье Торетто.',
    posterColor: '#1B2740',
    posterAccent: '#FF4747',
    backdropColor: '#0E1728',
    backdropAccent: '#FF5A5A',
    badge: '4K HDR',
  },
  {
    id: 'mario',
    title: 'Братья супер марио в кино',
    year: 2023,
    country: 'США',
    ageRating: '6+',
    duration: '1ч 33мин',
    genres: ['Анимация', 'Приключения'],
    description: 'Приключения братьев-водопроводчиков в волшебном мире.',
    posterColor: '#572C8B',
    posterAccent: '#F0B428',
    backdropColor: '#3C1C66',
    backdropAccent: '#F0B428',
    badge: '4K DOLBY',
  },
  {
    id: 'fast-x',
    title: 'Форсаж X',
    year: 2023,
    country: 'США',
    ageRating: '16+',
    duration: '2ч 21мин',
    genres: ['Боевик'],
    description: 'Продолжение саги.',
    posterColor: '#151B33',
    posterAccent: '#3C7EC4',
    backdropColor: '#0B1020',
    backdropAccent: '#4287E0',
    badge: '4K HDR',
  },
];

export const recommended: Film[] = [
  {
    id: 'mysteres',
    title: 'Les Mystères de l’Amour',
    year: 2011,
    country: 'Франция',
    ageRating: '12+',
    duration: 'Сериал',
    genres: ['Мелодрама'],
    description: 'Французская мелодрама.',
    posterColor: '#2E3240',
    posterAccent: '#E7DEC6',
    backdropColor: '#111419',
    backdropAccent: '#AFB8C9',
  },
  {
    id: 'evil-dead-rise',
    title: 'Восстание зловещих мертвецов',
    year: 2023,
    country: 'США',
    ageRating: '18+',
    duration: '1ч 37мин',
    genres: ['Ужасы'],
    description: 'Хоррор-продолжение культовой франшизы.',
    posterColor: '#241012',
    posterAccent: '#A11D22',
    backdropColor: '#140708',
    backdropAccent: '#7A1015',
    badge: '4K HDR',
  },
  {
    id: 'black-bird-rec',
    title: 'Чёрная Птица',
    year: 2022,
    country: 'США',
    ageRating: '17+',
    duration: '1ч 00мин',
    genres: ['Драма'],
    description: 'Основано на реальных событиях.',
    posterColor: '#E6E1DC',
    posterAccent: '#B33B2C',
    backdropColor: '#C8C1BA',
    backdropAccent: '#7F2419',
    badge: '4K HDR',
    isSeries: true,
  },
  {
    id: 'quantumania',
    title: 'Человек-муравей и Оса: Квантомания',
    year: 2023,
    country: 'США',
    ageRating: '12+',
    duration: '2ч 05мин',
    genres: ['Фантастика'],
    description: 'Марвел: путешествие в квантовый мир.',
    posterColor: '#1E2A3C',
    posterAccent: '#E63946',
    backdropColor: '#0B1320',
    backdropAccent: '#C21F2F',
    badge: '4K DOLBY',
  },
  {
    id: 'vatican-exorcist',
    title: 'Экзорцист Ватикана',
    year: 2023,
    country: 'США',
    ageRating: '16+',
    duration: '1ч 43мин',
    genres: ['Ужасы'],
    description: 'Основано на дневниках главного экзорциста Ватикана.',
    posterColor: '#1A0F0A',
    posterAccent: '#C38840',
    backdropColor: '#0F0806',
    backdropAccent: '#9A6830',
    badge: '4K HDR',
  },
  {
    id: 'translator',
    title: 'Переводчик',
    year: 2023,
    country: 'США',
    ageRating: '18+',
    duration: '2ч 03мин',
    genres: ['Боевик'],
    description: 'Военная драма Гая Ричи.',
    posterColor: '#38291E',
    posterAccent: '#D6A772',
    backdropColor: '#1F1610',
    backdropAccent: '#B2834E',
  },
  {
    id: 'mulan',
    title: 'Мулан',
    year: 2020,
    country: 'США',
    ageRating: '12+',
    duration: '1ч 55мин',
    genres: ['Приключения'],
    description: 'Ремейк классики Disney.',
    posterColor: '#502212',
    posterAccent: '#E8A33F',
    backdropColor: '#2B1208',
    backdropAccent: '#C4852A',
  },
];

export const foreignSeries: Film[] = recommended.slice(0, 4);

export const episodes: Episode[] = [
  {
    id: 1,
    title: '1 Серия',
    preview: '#2A1F18',
    previewAccent: '#94573A',
    durationText: '00:57:49',
    remainingText: '3мин осталось',
    watchedText: 'Просмотрено 00:54:49 из 00:57:49',
    quality: '1080P',
    progress: 0.95,
    status: 'watching',
  },
  {
    id: 2,
    title: '2 Серия',
    preview: '#1C2028',
    previewAccent: '#5A7FA8',
    durationText: '00:57:49',
    remainingText: '5мин осталось',
    watchedText: 'Просмотрено 00:52:49 из 00:57:49',
    quality: '1080P',
    progress: 0.91,
    status: 'watching',
  },
  {
    id: 3,
    title: '3 Серия',
    preview: '#2C211A',
    previewAccent: '#A86F3F',
    durationText: '00:57:49',
    remainingText: '23мин осталось',
    watchedText: 'Просмотрено 00:34:49 из 00:57:49',
    quality: '1080P',
    progress: 0.6,
    status: 'watching',
  },
  {
    id: 4,
    title: '4 Серия',
    preview: '#2C2520',
    previewAccent: '#8C7A66',
    durationText: '00:57:49',
    remainingText: '57мин 49сек',
    watchedText: 'Не просмотрено',
    quality: '1080P',
    progress: 0,
    status: 'new',
  },
  {
    id: 5,
    title: '5 Серия',
    preview: '#1E1A18',
    previewAccent: '#6A5A4E',
    durationText: '00:57:49',
    remainingText: '57мин 49сек',
    watchedText: 'Не просмотрено',
    quality: '1080P',
    progress: 0,
    status: 'new',
  },
  {
    id: 6,
    title: '6 Серия',
    preview: '#22201E',
    previewAccent: '#544E46',
    durationText: '00:57:49',
    remainingText: '57мин 49сек',
    watchedText: 'Не просмотрено',
    quality: '1080P',
    progress: 0,
    status: 'new',
  },
];

export function findFilm(id: string): Film | undefined {
  if (id === heroFilm.id) return heroFilm;
  return [...newReleases, ...recommended, ...foreignSeries].find((f) => f.id === id);
}
