import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/catalog';
import type { CategoryId } from '../types';
import { Icon } from './Icon';
import { LangSwitcher } from './LangSwitcher';
import { ThemeToggle } from './ThemeToggle';

export function Footer({ onPickCategory }: { onPickCategory: (c: CategoryId) => void }) {
  const { t } = useApp();
  return (
    <footer className="footer">
      <div className="container footer-cols">
        <div className="footer-about">
          <span className="footer-brand">
            Festivo<em>.uz</em>
          </span>
          <p>{t('foot.about')}</p>
          <div className="footer-social">
            <a href="#top" aria-label="telegram">
              <Icon name="send" size={18} />
            </a>
            <a href="#top" aria-label="message">
              <Icon name="message" size={18} />
            </a>
            <a href="#top" aria-label="mail">
              <Icon name="mail" size={18} />
            </a>
          </div>
        </div>

        <nav aria-label={t('foot.cats')}>
          <h4>{t('foot.cats')}</h4>
          <ul>
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => onPickCategory(c.id)}>
                  <Icon name={c.icon} size={14} />
                  {t(`cat.${c.id}` as 'cat.stul')}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t('foot.company')}>
          <h4>{t('foot.company')}</h4>
          <ul>
            <li>
              <a href="#top">{t('nav.all')}</a>
            </li>
            <li>
              <a href="#top">{t('foot.help')}</a>
            </li>
            <li>
              <a href="#top">{t('foot.app')}</a>
            </li>
            <li>
              <a href="#top">{t('foot.legal')}</a>
            </li>
            <li>
              <a href="#top">{t('foot.privacy')}</a>
            </li>
          </ul>
        </nav>

        <div className="footer-contacts">
          <h4>{t('foot.contacts')}</h4>
          <a href="tel:+998712001020">
            <Icon name="phone" size={14} /> +998 71 200-10-20
          </a>
          <a href="mailto:info@festivo.uz">
            <Icon name="mail" size={14} /> info@festivo.uz
          </a>
          <span>
            <Icon name="pin" size={14} /> Toshkent, Yangiyo‘l yo‘nalishi, les bazasi
          </span>
          <div className="footer-tools">
            <LangSwitcher compact />
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} Festivo.uz — {t('foot.rights')}
        </p>
        <p className="footer-made">
          <Icon name="star" size={13} filled />
          {t('foot.made')}
        </p>
      </div>
    </footer>
  );
}
