import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { categoryMeta } from '../data/catalog';
import { compact, formatPrice, group, initials, prettyPhone } from '../lib/format';
import { fullDate, timeAgo } from '../lib/time';
import type { Ad } from '../types';
import { Icon } from './Icon';
import { Modal } from './Modal';

interface Props {
  ad: Ad | null;
  onClose: () => void;
  onOpen: (ad: Ad) => void;
  onDeleted: () => void;
}

export function AdDetail({ ad, onClose, onOpen, onDeleted }: Props) {
  const { t, lang, ads, isFav, toggleFav, registerView, removeAd, notify } = useApp();
  const [index, setIndex] = useState(0);
  const [phoneShown, setPhoneShown] = useState(false);
  const [askDelete, setAskDelete] = useState(false);

  useEffect(() => {
    if (!ad) return;
    setIndex(0);
    setPhoneShown(false);
    setAskDelete(false);
    registerView(ad.id);
  }, [ad, registerView]);

  const similar = useMemo<Ad[]>(
    () => (ad ? ads.filter((a) => a.category === ad.category && a.id !== ad.id).slice(0, 3) : []),
    [ad, ads],
  );

  if (!ad) return null;
  const meta = categoryMeta(ad.category);
  const fav = isFav(ad.id);
  const sellerAds = ads.filter((a) => a.seller === ad.seller).length;
  const phone = prettyPhone(ad.phone);

  const copy = async (value: string, key: 'toast.phone' | 'toast.link' | 'toast.noShare') => {
    try {
      await navigator.clipboard.writeText(value);
      notify(t(key));
    } catch {
      notify(t('toast.noShare'), 'warn');
    }
  };

  const share = async () => {
    const url = `${location.origin}${location.pathname}#ad-${ad.id}`;
    const payload = { title: `${t('app.name')} — ${ad.title[lang]}`, text: ad.title[lang], url };
    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch {
        /* user cancelled or unsupported — fall through to copy */
      }
    }
    copy(url, 'toast.noShare');
  };

  return (
    <Modal open={!!ad} onClose={onClose} title={ad.title[lang]} subtitle={`${ad.city} · ${timeAgo(ad.createdAt, lang, t)}`} size="lg">
      <div className="detail">
        <div className={`gallery gallery--empty${ad.images.length ? '' : ' is-empty'}`}>
          {ad.images.length ? (
            <>
              <div className={`gallery-main gallery-main--${meta.accent}`}>
                <img src={ad.images[index]} alt={`${ad.title[lang]} — ${index + 1}`} />
                {ad.images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      className="gallery-nav gallery-nav--prev"
                      onClick={() => setIndex((i) => (i - 1 + ad.images.length) % ad.images.length)}
                      aria-label="prev"
                    >
                      <Icon name="chevron" size={18} />
                    </button>
                    <button
                      type="button"
                      className="gallery-nav gallery-nav--next"
                      onClick={() => setIndex((i) => (i + 1) % ad.images.length)}
                      aria-label="next"
                    >
                      <Icon name="chevron" size={18} />
                    </button>
                    <span className="gallery-counter">
                      {index + 1} / {ad.images.length}
                    </span>
                  </>
                ) : null}
                {ad.premium ? (
                  <span className="card-badge card-badge--promo">
                    <Icon name="bolt" size={12} filled />
                    {t('ad.premium')}
                  </span>
                ) : null}
              </div>
              {ad.images.length > 1 ? (
                <div className="gallery-thumbs">
                  {ad.images.map((img, i) => (
                    <button
                      key={img.slice(-24) + i}
                      type="button"
                      className={`gallery-thumb${i === index ? ' is-active' : ''}`}
                      onClick={() => setIndex(i)}
                    >
                      <img src={img} alt="" />
                    </button>
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className={`gallery-main gallery-main--${meta.accent}`}>
              <span className="card-media-empty">
                <Icon name={meta.icon} size={54} />
                <em>{t(`cat.${ad.category}` as 'cat.stul')}</em>
              </span>
            </div>
          )}
        </div>

        <div className="detail-info">
          <p className="detail-price">
            {ad.price > 0 ? (
              <>
                <strong>{formatPrice(ad.price, t('cur'))}</strong>
                {ad.negotiable ? <em>{t('ad.neg')}</em> : null}
              </>
            ) : (
              <em className="card-price-neg">{t('ad.neg')}</em>
            )}
          </p>

          <ul className="detail-meta">
            <li>
              <span>
                <Icon name={meta.icon} size={14} />
                {t('form.cat')}
              </span>
              <b>{t(`cat.${ad.category}` as 'cat.stul')}</b>
            </li>
            <li>
              <span>
                <Icon name="check" size={14} />
                {t('form.condition')}
              </span>
              <b>{ad.condition === 'yangi' ? t('cond.yangi') : t('cond.ishlatilgan')}</b>
            </li>
            <li>
              <span>
                <Icon name="user" size={14} />
                {t('filters.seller')}
              </span>
              <b>{t(`seller.${ad.sellerType}` as 'seller.all')}</b>
            </li>
            <li>
              <span>
                <Icon name="pin" size={14} />
                {t('form.city')}
              </span>
              <b>{ad.city}</b>
            </li>
            <li>
              <span>
                <Icon name="clock" size={14} />
                {t('ad.created')}
              </span>
              <b>{fullDate(ad.createdAt, lang)}</b>
            </li>
            <li>
              <span>
                <Icon name="eye" size={14} />
                {t('ad.views')}
              </span>
              <b>{group(ad.views)}</b>
            </li>
            <li>
              <span>
                <Icon name="tag" size={14} />
                {t('ad.id')}
              </span>
              <b>{ad.id.toUpperCase()}</b>
            </li>
          </ul>

          <section>
            <h4 className="section-mini">{t('ad.details')}</h4>
            <p className="detail-body">{ad.body[lang]}</p>
          </section>

          <section className="seller">
            <span className="avatar">{initials(ad.seller)}</span>
            <div className="seller-text">
              <strong>{ad.seller}</strong>
              <small>
                {t('ad.since')} · {sellerAds} {t('ad.count')} · {t('stat.views')} {compact(ad.views * 3 + 12)}
              </small>
            </div>

            <div className="seller-actions">
              <div className="phone-box">
                <span className="phone-num">{phoneShown ? phone : phone.replace(/\d/g, '•').replace('+•••', '+998 ')}</span>
                <button type="button" className="icon-btn" onClick={() => setPhoneShown((v) => !v)} title={t('ad.phone')}>
                  <Icon name={phoneShown ? 'check' : 'eye'} size={16} />
                </button>
                <button type="button" className="icon-btn" onClick={() => copy(phone, 'toast.phone')} title={t('ad.copy')}>
                  <Icon name="copy" size={16} />
                </button>
              </div>
              <div className="btn-row">
                {phoneShown ? (
                  <a className="btn btn-primary btn-sm" href={`tel:${ad.phone.replace(/\s/g, '')}`}>
                    <Icon name="phone" size={15} />
                    {t('ad.call')}
                  </a>
                ) : (
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => setPhoneShown(true)}>
                    <Icon name="phone" size={15} />
                    {t('ad.phone')}
                  </button>
                )}
                <button type="button" className={`btn btn-blue btn-sm${fav ? ' is-on' : ''}`} onClick={() => toggleFav(ad.id)}>
                  <Icon name="heart" size={15} filled={fav} />
                  {fav ? t('ad.unlike') : t('ad.like')}
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={share}>
                  <Icon name="share" size={15} />
                  {t('ad.share')}
                </button>
                {ad.mine ? (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-danger"
                    onClick={() => setAskDelete((v) => !v)}
                    aria-expanded={askDelete}
                  >
                    <Icon name="trash" size={15} />
                    {t('ad.delete')}
                  </button>
                ) : null}
              </div>

              {askDelete ? (
                <div className="confirm">
                  <p>{t('ad.deleteQ')}</p>
                  <div className="btn-row">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        removeAd(ad.id);
                        notify(t('toast.deleted'), 'info');
                        onDeleted();
                      }}
                    >
                      {t('ad.yes')}
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAskDelete(false)}>
                      {t('ad.no')}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </section>

          <p className="warn">
            <Icon name="shield" size={15} />
            {t('ad.warn')}
          </p>

          {similar.length ? (
            <section>
              <h4 className="section-mini">{t('ad.similar')}</h4>
              <div className="similar">
                {similar.map((s) => (
                  <button key={s.id} type="button" className="similar-item" onClick={() => onOpen(s)}>
                    {s.images[0] ? (
                      <img src={s.images[0]} alt="" loading="lazy" />
                    ) : (
                      <span className={`similar-empty similar-empty--${categoryMeta(s.category).accent}`}>
                        <Icon name={categoryMeta(s.category).icon} size={18} />
                      </span>
                    )}
                    <span className="similar-text">
                      <strong>{s.price > 0 ? formatPrice(s.price, t('cur')) : t('ad.neg')}</strong>
                      <small>{s.title[lang]}</small>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
