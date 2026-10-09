import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/catalog';
import { compact, group } from '../lib/format';
import type { CategoryId, Filters, Lang } from '../types';
import { Icon } from './Icon';

const POPULAR: Record<Lang, string[]> = {
  uz: ['massiv stul', 'qayin stol', 'quruq les', 'oshxona garrituri', 'yig‘iladigan stul', 'OSB-3'],
  ru: ['стулья массив', 'берёзовый стол', 'сухая доска', 'кухня на заказ', 'складные стулья', 'OSB-3'],
  en: ['solid wood chairs', 'birch table', 'dry timber', 'kitchen set', 'folding chairs', 'OSB-3'],
};

interface Props {
  filters: Filters;
  patch: (p: Partial<Filters>) => void;
  onSearch: () => void;
  onPost: () => void;
  stats: { ads: number; sellers: number; cities: number; views: number };
}

export function Hero({ filters, patch, onSearch, onPost, stats }: Props) {
  const { t, lang } = useApp();
  const [focused, setFocused] = useState(false);

  const submit = (q?: string) => {
    if (q !== undefined) patch({ q });
    onSearch();
  };

  return (
    <section className={`hero${focused ? ' is-focused' : ''}`}>
      <div className="hero-bg" aria-hidden="true" />
      <div className="container hero-inner">
        <span className="hero-badge">
          <Icon name="bolt" size={14} filled />
          {t('hero.badge')}
        </span>
        <h1 className="hero-title">{t('hero.title')}</h1>
        <p className="hero-sub">{t('hero.subtitle')}</p>

        <form
          className="hero-search"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <span className="hero-search-field">
            <Icon name="search" size={20} />
            <input
              value={filters.q}
              onChange={(e) => patch({ q: e.target.value })}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={t('hero.search')}
              aria-label={t('hero.search')}
            />
            {filters.q ? (
              <button type="button" className="clear-x" onClick={() => patch({ q: '' })} aria-label="clear">
                <Icon name="close" size={15} />
              </button>
            ) : null}
          </span>

          <span className="hero-search-cat">
            <select
              value={filters.category}
              onChange={(e) => patch({ category: e.target.value as CategoryId | 'all' })}
              aria-label={t('form.cat')}
            >
              <option value="all">{t('hero.allCats')}</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {t(`cat.${c.id}` as 'cat.stul')}
                </option>
              ))}
            </select>
            <Icon name="chevron" size={16} />
          </span>

          <button type="submit" className="btn btn-primary hero-search-submit">
            <Icon name="search" size={18} />
            <span>{t('hero.searchCta')}</span>
          </button>
        </form>

        <div className="hero-quick">
          <span className="hero-quick-label">{t('hero.popular')}</span>
          {POPULAR[lang].map((word) => (
            <button key={word} type="button" className="quick-chip" onClick={() => submit(word)}>
              {word}
            </button>
          ))}
          <button type="button" className="quick-chip quick-chip--post" onClick={onPost}>
            <Icon name="plus" size={14} />
            {t('hero.post')}
          </button>
        </div>

        <dl className="hero-stats">
          {[
            { label: t('stat.ads'), value: group(stats.ads) },
            { label: t('stat.sellers'), value: group(stats.sellers) },
            { label: t('stat.cities'), value: group(stats.cities) },
            { label: t('stat.views'), value: compact(stats.views) },
          ].map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
