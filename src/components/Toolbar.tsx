import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { group } from '../lib/format';
import type { CategoryId, ConditionId, Filters, SellerTypeId, SortId } from '../types';
import { Icon } from './Icon';

interface Props {
  filters: Filters;
  patch: (p: Partial<Filters>) => void;
  reset: () => void;
  count: number;
  view: 'grid' | 'list';
  setView: (v: 'grid' | 'list') => void;
  onPost: () => void;
}

const SORTS: { id: SortId; key: 'sort.new' | 'sort.cheap' | 'sort.expensive' | 'sort.popular' }[] = [
  { id: 'yangi', key: 'sort.new' },
  { id: 'arzon', key: 'sort.cheap' },
  { id: 'qimmat', key: 'sort.expensive' },
  { id: 'ommabop', key: 'sort.popular' },
];

const CONDS: (ConditionId | 'all')[] = ['all', 'yangi', 'ishlatilgan'];
const SELLERS: (SellerTypeId | 'all')[] = ['all', 'shaxsiy', 'ustaxona', 'dokon'];

export function Toolbar({ filters, patch, reset, count, view, setView, onPost }: Props) {
  const { t } = useApp();
  const [more, setMore] = useState(false);

  const chips: { label: string; clear: () => void }[] = [];
  if (filters.q.trim()) chips.push({ label: `“${filters.q.trim()}”`, clear: () => patch({ q: '' }) });
  if (filters.category !== 'all')
    chips.push({
      label: t(`cat.${filters.category}` as 'cat.stul'),
      clear: () => patch({ category: 'all' as CategoryId | 'all' }),
    });
  if (filters.city !== 'all') chips.push({ label: filters.city, clear: () => patch({ city: 'all' }) });
  if (filters.priceMin) chips.push({ label: `${t('filters.from')} ${group(Number(filters.priceMin))}`, clear: () => patch({ priceMin: '' }) });
  if (filters.priceMax) chips.push({ label: `${t('filters.to')} ${group(Number(filters.priceMax))}`, clear: () => patch({ priceMax: '' }) });
  if (filters.condition !== 'all')
    chips.push({
      label: filters.condition === 'yangi' ? t('cond.yangi') : t('cond.ishlatilgan'),
      clear: () => patch({ condition: 'all' }),
    });
  if (filters.sellerType !== 'all')
    chips.push({
      label: t(`seller.${filters.sellerType}` as 'seller.all'),
      clear: () => patch({ sellerType: 'all' }),
    });
  if (filters.withPhoto) chips.push({ label: t('filters.photo'), clear: () => patch({ withPhoto: false }) });

  return (
    <div className="toolbar">
      <div className="toolbar-main">
        <p className="toolbar-count">
          <strong>{group(count)}</strong> {t('filters.found')}
        </p>

        <div className="toolbar-right">
          <div className="seg seg--sort">
            <span className="seg-lead">
              <Icon name="sort" size={15} />
              {t('sort.label')}
            </span>
            {SORTS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`seg-btn${filters.sort === s.id ? ' is-active' : ''}`}
                onClick={() => patch({ sort: s.id })}
              >
                {t(s.key)}
              </button>
            ))}
          </div>

          <div className="seg seg--view" role="group" aria-label="view">
            <button type="button" className={`seg-btn${view === 'grid' ? ' is-active' : ''}`} onClick={() => setView('grid')} title="grid">
              <Icon name="grid" size={15} />
            </button>
            <button type="button" className={`seg-btn${view === 'list' ? ' is-active' : ''}`} onClick={() => setView('list')} title="list">
              <Icon name="rows" size={15} />
            </button>
          </div>

          <button type="button" className="btn btn-ghost" onClick={() => setMore((v) => !v)} aria-expanded={more}>
            <Icon name="sliders" size={16} />
            {more ? t('filters.less') : t('filters.more')}
          </button>
        </div>
      </div>

      {more ? (
        <div className="filters">
          <div className="filter-cell filter-cell--price">
            <label className="label">{t('filters.price')}</label>
            <div className="price-row">
              <input
                inputMode="numeric"
                placeholder={t('filters.from')}
                value={filters.priceMin}
                onChange={(e) => patch({ priceMin: e.target.value.replace(/\D/g, '') })}
              />
              <span aria-hidden="true">—</span>
              <input
                inputMode="numeric"
                placeholder={t('filters.to')}
                value={filters.priceMax}
                onChange={(e) => patch({ priceMax: e.target.value.replace(/\D/g, '') })}
              />
            </div>
          </div>

          <div className="filter-cell">
            <label className="label">{t('filters.condition')}</label>
            <div className="pill-row">
              {CONDS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`pill${filters.condition === c ? ' is-active' : ''}`}
                  onClick={() => patch({ condition: c })}
                >
                  {c === 'all' ? t('cond.all') : c === 'yangi' ? t('cond.yangi') : t('cond.ishlatilgan')}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-cell">
            <label className="label">{t('filters.seller')}</label>
            <div className="pill-row">
              {SELLERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`pill${filters.sellerType === s ? ' is-active' : ''}`}
                  onClick={() => patch({ sellerType: s })}
                >
                  {s === 'all' ? t('seller.all') : t(`seller.${s}` as 'seller.all')}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-cell filter-cell--switch">
            <button
              type="button"
              className={`switch${filters.withPhoto ? ' is-on' : ''}`}
              onClick={() => patch({ withPhoto: !filters.withPhoto })}
              role="switch"
              aria-checked={filters.withPhoto}
            >
              <span className="switch-track">
                <span className="switch-dot" />
              </span>
              <Icon name="camera" size={15} />
              {t('filters.photo')}
            </button>
            <div className="filter-actions">
              <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>
                <Icon name="close" size={14} />
                {t('filters.reset')}
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={onPost}>
                <Icon name="plus" size={14} />
                {t('nav.post')}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {chips.length ? (
        <div className="active-chips">
          <span className="active-chips-label">{t('filters.active')}</span>
          {chips.map((chip) => (
            <button key={chip.label} type="button" className="chip-x" onClick={chip.clear}>
              {chip.label}
              <Icon name="close" size={13} />
            </button>
          ))}
          <button type="button" className="chip-x chip-x--clear" onClick={reset}>
            {t('filters.reset')}
          </button>
        </div>
      ) : null}
    </div>
  );
}
