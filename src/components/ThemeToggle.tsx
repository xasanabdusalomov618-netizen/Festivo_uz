import { useApp } from '../context/AppContext';
import { Icon } from './Icon';

/** Kun / Tun — light & dark mode switch. */
export function ThemeToggle() {
  const { theme, toggleTheme, t } = useApp();
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-pressed={dark}
      title={`${dark ? t('theme.tun') : t('theme.kun')} / ${dark ? t('theme.kun') : t('theme.tun')}`}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <Icon name="sun" size={14} className={`theme-ico theme-ico--sun${!dark ? ' is-active' : ''}`} />
        <Icon name="moon" size={14} className={`theme-ico theme-ico--moon${dark ? ' is-active' : ''}`} />
        <span className={`theme-thumb${dark ? ' is-dark' : ''}`} />
      </span>
      <span className="theme-label">{dark ? t('theme.tun') : t('theme.kun')}</span>
    </button>
  );
}
