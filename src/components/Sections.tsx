import { useApp } from '../context/AppContext';
import { Icon } from './Icon';
import type { IconName } from './Icon';

const CARDS: { icon: IconName; tk: 'why.1t' | 'why.2t' | 'why.3t' | 'why.4t'; dk: 'why.1d' | 'why.2d' | 'why.3d' | 'why.4d'; accent: 'red' | 'blue' }[] = [
  { icon: 'tag', tk: 'why.1t', dk: 'why.1d', accent: 'blue' },
  { icon: 'bolt', tk: 'why.2t', dk: 'why.2d', accent: 'red' },
  { icon: 'globe', tk: 'why.3t', dk: 'why.3d', accent: 'blue' },
  { icon: 'shield', tk: 'why.4t', dk: 'why.4d', accent: 'red' },
];

export function Why() {
  const { t } = useApp();
  return (
    <section className="why">
      <div className="container">
        <h2 className="section-title">{t('why.title')}</h2>
        <div className="why-grid">
          {CARDS.map((c) => (
            <article key={c.tk} className={`why-card why-card--${c.accent}`}>
              <span className="why-ico">
                <Icon name={c.icon} size={20} />
              </span>
              <h3>{t(c.tk)}</h3>
              <p>{t(c.dk)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SellBanner({ onPost }: { onPost: () => void }) {
  const { t } = useApp();
  return (
    <section className="sell">
      <div className="container sell-inner">
        <div>
          <h2 className="sell-title">{t('sell.title')}</h2>
          <p className="sell-sub">{t('sell.sub')}</p>
        </div>
        <div className="sell-actions">
          <button type="button" className="btn btn-solid-light" onClick={onPost}>
            <Icon name="send" size={16} />
            {t('sell.cta')}
          </button>
          <a className="btn btn-outline-light" href="tel:+998712001020">
            <Icon name="phone" size={16} />
            +998 71 200-10-20
          </a>
        </div>
      </div>
    </section>
  );
}
