import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/catalog';
import type { CategoryId } from '../types';
import { Icon } from './Icon';

interface Props {
  active: CategoryId | 'all';
  counts: Record<string, number>;
  total: number;
  onPick: (c: CategoryId | 'all') => void;
}

export function CategoryStrip({ active, counts, total, onPick }: Props) {
  const { t } = useApp();
  const items: { id: CategoryId | 'all'; icon: (typeof CATEGORIES)[number]['icon']; accent: 'red' | 'blue' }[] = [
    { id: 'all', icon: 'sliders', accent: 'blue' },
    ...CATEGORIES,
  ];

  return (
    <nav className="cats" aria-label={t('foot.cats')}>
      <div className="container cats-row">
        {items.map((item) => {
          const isActive = active === item.id;
          const count = item.id === 'all' ? total : (counts[item.id] ?? 0);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onPick(item.id)}
              className={`cat-chip cat-chip--${item.accent}${isActive ? ' is-active' : ''}`}
              aria-pressed={isActive}
            >
              <span className="cat-ico">
                <Icon name={item.icon} size={18} />
              </span>
              <span className="cat-text">
                <strong>{t(`cat.${item.id}` as 'cat.all')}</strong>
                {item.id !== 'all' ? <small>{t(`cat.${item.id}.d` as 'cat.stul.d')}</small> : <small>{t('cat.all')}</small>}
              </span>
              <b className="cat-count">{count}</b>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
