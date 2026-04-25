import { useState } from 'react';
import styles from './SettingsPage.module.css';

type Category =
  | 'Интерфейс'
  | 'Сервер'
  | 'Общие'
  | 'Плеер'
  | 'Агент'
  | 'Контакты';

const categories: Category[] = [
  'Интерфейс',
  'Сервер',
  'Общие',
  'Плеер',
  'Агент',
  'Контакты',
];

type ToggleState = {
  screensaver: boolean;
  screensaver4k: boolean;
  safeMode: boolean;
};

const initialToggles: ToggleState = {
  screensaver: true,
  screensaver4k: false,
  safeMode: true,
};

export default function SettingsPage() {
  const [active, setActive] = useState<Category>('Общие');
  const [toggles, setToggles] = useState<ToggleState>(initialToggles);
  const [focused, setFocused] = useState<string | null>('sort');

  const toggle = (key: keyof ToggleState) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Настройки</h1>

      <div className={styles.layout}>
        <aside className={styles.categories}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`${styles.category} ${active === cat ? styles.categoryActive : ''}`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </aside>

        <div className={styles.items}>
          <SettingRow
            title="Показывать заставку при бездействии"
            description="Включить или отключить заставку при долгом ожидании"
            control={
              <Toggle checked={toggles.screensaver} onChange={() => toggle('screensaver')} />
            }
            onFocus={() => setFocused('screensaver')}
            active={focused === 'screensaver'}
          />
          <SettingRow
            title="Заставка в 4K"
            description="Это топовая функция для телевизоров"
            control={
              <Toggle
                checked={toggles.screensaver4k}
                onChange={() => toggle('screensaver4k')}
              />
            }
            onFocus={() => setFocused('screensaver4k')}
            active={focused === 'screensaver4k'}
          />
          <SettingRow
            title="Сортировка торрентов"
            description="По какому принципу будут сортироваться торрент файлы"
            control={<span className={styles.valueText}>По размеру (Возрастание)</span>}
            onFocus={() => setFocused('sort')}
            active={focused === 'sort'}
            highlight
          />
          <SettingRow
            title="Безопасный режим"
            description="Ограничение контента после 16+"
            control={<Toggle checked={toggles.safeMode} onChange={() => toggle('safeMode')} />}
            onFocus={() => setFocused('safeMode')}
            active={focused === 'safeMode'}
          />
          <SettingRow
            title="Клавиатура"
            description="Выберите тип используемой клавиатуры"
            control={<span className={styles.valueText}>Встроенная</span>}
            onFocus={() => setFocused('keyboard')}
            active={focused === 'keyboard'}
          />
          <SettingRow
            title="TorrServer"
            description="TorrServer 1.1.x / 1.2.x"
            control={
              <div className={styles.statusBlock}>
                <span className={styles.statusAddress}>127.0.0.1:8090</span>
                <span className={`${styles.statusLine} ${styles.statusOk}`}>
                  <span className={styles.statusDot} /> Успешно
                </span>
              </div>
            }
            onFocus={() => setFocused('torr')}
            active={focused === 'torr'}
          />
          <SettingRow
            title="TorrServer"
            description="TorrServer 1.1.x / 1.2.x"
            control={
              <div className={styles.statusBlock}>
                <span className={styles.statusAddress}>127.0.0.1:8090</span>
                <span className={`${styles.statusLine} ${styles.statusErr}`}>
                  <span className={styles.statusDot} /> Ошибка подключения
                </span>
              </div>
            }
            onFocus={() => setFocused('torr2')}
            active={focused === 'torr2'}
          />
        </div>
      </div>
    </div>
  );
}

interface SettingRowProps {
  title: string;
  description: string;
  control: React.ReactNode;
  onFocus?: () => void;
  active?: boolean;
  highlight?: boolean;
}

function SettingRow({
  title,
  description,
  control,
  onFocus,
  active,
  highlight,
}: SettingRowProps) {
  return (
    <div
      tabIndex={0}
      className={`${styles.row} ${active ? styles.rowActive : ''} ${
        highlight ? styles.rowHighlight : ''
      }`}
      onFocus={onFocus}
      onClick={onFocus}
    >
      <div className={styles.rowBody}>
        <div className={styles.rowTitle}>{title}</div>
        <div className={styles.rowDesc}>{description}</div>
      </div>
      <div className={styles.rowControl}>{control}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
    >
      <span className={styles.toggleThumb} />
    </button>
  );
}
