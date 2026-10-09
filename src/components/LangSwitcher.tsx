import { useApp } from '../context/AppContext';
import { LANGS } from '../i18n/dict';
import { Icon } from './Icon';

export function LangSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useApp();
  return (
    <div className={`lang${compact ? ' lang--compact' : ''}`} role="group" aria-label={t('lang.label')}>
      <Icon name="globe" size={15} className="lang-globe" />
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          className={`lang-btn${lang === l.id ? ' is-active' : ''}`}
          onClick={() => setLang(l.id)}
          title={l.label}
          aria-pressed={lang === l.id}
        >
          {l.code}
        </button>
      ))}
    </div>
  );
}
