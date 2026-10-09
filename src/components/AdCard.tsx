import { useApp } from '../context/AppContext';
import { categoryMeta } from '../data/catalog';
import { compact, formatPrice } from '../lib/format';
import { timeAgo } from '../lib/time';
import { Icon } from './Icon';
import type { Ad } from '../types';

interface Props {
  ad: Ad;
  onOpen: (ad: Ad) => void;
}

export function AdCard({ ad, onOpen }: Props) {
  const { t, lang, isFav, toggleFav } = useApp();
  const meta = categoryMeta(ad.category);
  const cover = ad.images[0];
  const fav = isFav(ad.id);

  return (
    <article
      className={`card${ad.premium ? ' is-premium' : ''}`}
      onClick={() => onOpen(ad)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(ad);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className={`card-media card-media--${meta.accent}`}>
        {cover ? (
          <img src={cover} alt={ad.title[lang]} loading="lazy" />
        ) : (
          <span className="card-media-empty">
            <Icon name={meta.icon} size={38} />
            <em>{t(`cat.${ad.category}` as 'cat.stul')}</em>
          </span>
        )}

        {ad.premium ? (
          <span className="card-badge card-badge--promo">
            <Icon name="bolt" size={12} filled />
            {t('ad.premium')}
          </span>
        ) : null}
        <span className="card-badge card-badge--cat">
          <Icon name={meta.icon} size={13} />
          {t(`cat.${ad.category}` as 'cat.stul')}
        </span>

        <button
          type="button"
          className={`fav-btn${fav ? ' is-on' : ''}`}
          aria-pressed={fav}
          aria-label={fav ? t('ad.unlike') : t('ad.like')}
          onClick={(e) => {
            e.stopPropagation();
            toggleFav(ad.id);
          }}
        >
          <Icon name="heart" size={18} filled={fav} />
        </button>

        {ad.mine ? <span className="card-badge card-badge--mine">{t('ad.myBadge')}</span> : null}
      </div>

      <div className="card-body">
        <p className="card-price">
          {ad.price > 0 ? (
            <>
              <strong>{formatPrice(ad.price, t('cur'))}</strong>
              {ad.negotiable ? <em>{t('ad.neg')}</em> : null}
            </>
          ) : (
            <em className="card-price-neg">{t('ad.neg')}</em>
          )}
        </p>

        <h3 className="card-title">{ad.title[lang]}</h3>

        <ul className="card-tags">
          <li>
            <Icon name={ad.condition === 'yangi' ? 'star' : 'check'} size={12} />
            {t(ad.condition === 'yangi' ? 'cond.yangi' : 'cond.ishlatilgan')}
          </li>
          <li>
            <Icon name={ad.sellerType === 'shaxsiy' ? 'user' : ad.sellerType === 'ustaxona' ? 'tools' : 'sofa'} size={12} />
            {t(`seller.${ad.sellerType}` as 'seller.all')}
          </li>
        </ul>

        <p className="card-foot">
          <span>
            <Icon name="pin" size={13} />
            {ad.city}
          </span>
          <span>
            <Icon name="eye" size={13} />
            {compact(ad.views)}
          </span>
          <span>
            <Icon name="clock" size={13} />
            {timeAgo(ad.createdAt, lang, t)}
          </span>
        </p>
      </div>
    </article>
  );
}
