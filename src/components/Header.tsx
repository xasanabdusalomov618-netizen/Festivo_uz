import { useApp } from '../context/AppContext';
import { CITIES } from '../i18n/dict';
import type { TabId } from '../types';
import { Icon } from './Icon';
import { LangSwitcher } from './LangSwitcher';
import { ThemeToggle } from './ThemeToggle';

interface Props {
  tab: TabId;
  onTab: (t: TabId) => void;
  onPost: () => void;
  city: string;
  onCity: (v: string) => void;
  favCount: number;
  mineCount: number;
  totalCount: number;
}

function Brand() {
  const { t } = useApp();
  return (
    <a className="brand" href="#top" aria-label={t('app.name')}>
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 40 40">
          <defs>
            <linearGradient id="festivo-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--blue)" />
              <stop offset="1" stopColor="var(--red)" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="11" fill="url(#festivo-g)" />
          <path d="M11 30V11h14v4.6H16v3.2h7.6V23H16v7z" fill="#fff" />
        </svg>
      </span>
      <span className="brand-text">
        <strong>Festivo</strong>
        <em>.uz</em>
        <small>{t('app.tagline')}</small>
      </span>
    </a>
  );
}

export function Header({ tab, onTab, onPost, city, onCity, favCount, mineCount, totalCount }: Props) {
  const { t } = useApp();

  const tabs: { id: TabId; label: string; icon: 'tag' | 'heart' | 'user'; count: number }[] = [
    { id: 'all', label: t('nav.all'), icon: 'tag', count: totalCount },
    { id: 'fav', label: t('nav.fav'), icon: 'heart', count: favCount },
    { id: 'mine', label: t('nav.mine'), icon: 'user', count: mineCount },
  ];

  return (
    <header className="header" id="top">
      <div className="header-bar container">
        <Brand />

        <nav className="header-nav" aria-label="sections">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-tab${tab === item.id ? ' is-active' : ''}`}
              onClick={() => onTab(item.id)}
            >
              <Icon name={item.icon} size={16} filled={tab === item.id && item.id === 'fav'} />
              <span>{item.label}</span>
              {item.count > 0 ? <b className="nav-count">{item.count}</b> : null}
            </button>
          ))}
        </nav>

        <div className="header-tools">
          <label className="city-select" title={t('top.city')}>
            <Icon name="pin" size={16} />
            <select value={city} onChange={(e) => onCity(e.target.value)} aria-label={t('top.city')}>
              <option value="all">{t('top.allCities')}</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <LangSwitcher />
          <ThemeToggle />

          <button type="button" className="btn btn-primary header-post" onClick={onPost}>
            <Icon name="plus" size={18} />
            <span>{t('nav.post')}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
