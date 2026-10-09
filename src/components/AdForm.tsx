import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, categoryMeta } from '../data/catalog';
import { fileToDataUrl } from '../lib/image';
import { formatPrice, group, prettyPhone } from '../lib/format';
import { load } from '../lib/storage';
import type { CategoryId, ConditionId, Filters, SellerTypeId } from '../types';
import { Icon } from './Icon';
import { Modal } from './Modal';

interface Props {
  open: boolean;
  onClose: () => void;
  defaults: Pick<Filters, 'category' | 'city'>;
  onCreated: (id: string) => void;
}

type Errors = Partial<Record<'title' | 'body' | 'price' | 'phone' | 'name' | 'city', string>>;

const MAX_PHOTOS = 5;
const MAX_BYTES = 5_000_000;

export function AdForm({ open, onClose, defaults, onCreated }: Props) {
  const { t, addAd, notify, addBoost } = useApp();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('stul');
  const [body, setBody] = useState('');
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [condition, setCondition] = useState<ConditionId>('yangi');
  const [sellerType, setSellerType] = useState<SellerTypeId>('ustaxona');
  const [city, setCity] = useState('Toshkent');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [boost, setBoost] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setErrors({});
    setCategory((defaults.category === 'all' ? 'stul' : defaults.category) as CategoryId);
    setCity(defaults.city === 'all' ? 'Toshkent' : defaults.city);
    setName(load<string>('festivo.sellerName', ''));
  }, [open, defaults.category, defaults.city]);

  const validate = (target: number): Errors => {
    const e: Errors = {};
    if (target >= 1) {
      if (title.trim().length < 6) e.title = t('form.err.title');
      if (body.trim().length < 15) e.body = t('form.err.desc');
    }
    if (target >= 2 && !negotiable && Number(price.replace(/\D/g, '')) < 1000) e.price = t('form.err.price');
    if (target >= 3) {
      if (name.trim().length < 2) e.name = t('form.err.name');
      if (phone.replace(/\D/g, '').length < 9) e.phone = t('form.err.phone');
      if (!city) e.city = t('form.err.city');
    }
    return e;
  };

  const next = () => {
    const e = validate(step + 1);
    setErrors(e);
    if (Object.keys(e).length) return;
    setStep((s) => Math.min(2, s + 1));
  };

  const submit = async () => {
    const e = validate(3);
    setErrors(e);
    if (Object.keys(e).length) {
      setStep(e.name || e.phone || e.city ? 2 : e.price ? 1 : 0);
      return;
    }
    const digits = phone.replace(/\D/g, '').slice(-9);
    const text = title.trim();
    const desc = body.trim();
    // The ad is published in every UI language with the same text (the seller writes in one language).
    const ad = addAd({
      title: { uz: text, ru: text, en: text },
      body: { uz: desc, ru: desc, en: desc },
      category,
      price: negotiable ? 0 : Number(price.replace(/\D/g, '')) || 0,
      negotiable,
      condition,
      sellerType,
      city,
      seller: name.trim(),
      phone: `+998${digits}`,
      images,
      premium: boost,
    });
    localStorage.setItem('festivo.sellerName', JSON.stringify(name.trim()));
    if (boost) addBoost();
    notify(t('toast.created'));
    notify(t('toast.saved'), 'info');
    onCreated(ad.id);
    onClose();
    // reset the form for the next time
    setTitle('');
    setBody('');
    setPrice('');
    setPhone('');
    setImages([]);
    setBoost(false);
    setNegotiable(false);
    setStep(0);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    const room = MAX_PHOTOS - images.length;
    if (room <= 0) {
      notify(t('toast.imgMax'), 'warn');
      return;
    }
    const picked = Array.from(files).slice(0, room);
    const urls: string[] = [];
    for (const file of picked) {
      if (!file.type.startsWith('image/')) continue;
      if (file.size > MAX_BYTES) {
        notify(t('toast.imgErr'), 'warn');
        continue;
      }
      try {
        urls.push(await fileToDataUrl(file));
      } catch {
        notify(t('toast.imgErr'), 'warn');
      }
    }
    if (urls.length) setImages((list) => [...list, ...urls].slice(0, MAX_PHOTOS));
  };

  const steps = [t('form.step1'), t('form.step2'), t('form.step3')];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('form.title')}
      subtitle={t('form.sub')}
      size="lg"
      footer={
        <div className="form-foot">
          <div className="stepper" aria-hidden="true">
            {steps.map((label, i) => (
              <span key={label} className={`stepper-item${i === step ? ' is-active' : ''}${i < step ? ' is-done' : ''}`}>
                <b>{i < step ? '✓' : i + 1}</b>
                <em>{label}</em>
              </span>
            ))}
          </div>
          <div className="form-foot-btns">
            {step > 0 ? (
              <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>
                <Icon name="chevron" size={16} className="flip" />
                {t('form.back')}
              </button>
            ) : (
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                {t('form.cancel')}
              </button>
            )}
            {step < 2 ? (
              <button type="button" className="btn btn-primary" onClick={next}>
                {t('form.next')}
                <Icon name="arrow" size={16} />
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={submit}>
                <Icon name="check" size={16} />
                {boost ? t('form.submitBoost') : t('form.submit')}
              </button>
            )}
          </div>
        </div>
      }
    >
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        {step === 0 ? (
          <>
            <div className={`field${errors.title ? ' has-error' : ''}`}>
              <label className="label" htmlFor="f-title">
                {t('form.titleF')}
              </label>
              <input
                id="f-title"
                className="input"
                value={title}
                maxLength={90}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('form.titleP')}
              />
              <span className="counter">{title.length}/90</span>
              {errors.title ? <p className="error-text">{errors.title}</p> : null}
            </div>

            <div className="field">
              <label className="label">{t('form.cat')}</label>
              <div className="cat-grid">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`cat-pick${category === c.id ? ' is-active' : ''} cat-pick--${c.accent}`}
                    onClick={() => setCategory(c.id)}
                  >
                    <Icon name={c.icon} size={18} />
                    <span>{t(`cat.${c.id}` as 'cat.stul')}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={`field${errors.body ? ' has-error' : ''}`}>
              <label className="label" htmlFor="f-body">
                {t('form.desc')}
              </label>
              <textarea
                id="f-body"
                className="input textarea"
                rows={5}
                value={body}
                maxLength={1400}
                onChange={(e) => setBody(e.target.value)}
                placeholder={t('form.descP')}
              />
              <span className="counter">{body.length}/1400</span>
              {errors.body ? <p className="error-text">{errors.body}</p> : null}
            </div>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <div className="form-row">
              <div className={`field${errors.price ? ' has-error' : ''}`}>
                <label className="label" htmlFor="f-price">
                  {t('form.price')}
                </label>
                <input
                  id="f-price"
                  className="input"
                  inputMode="numeric"
                  disabled={negotiable}
                  value={price ? group(Number(price)) : ''}
                  onChange={(e) => setPrice(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  placeholder={t('form.priceP')}
                />
                {negotiable ? <p className="hint">{t('form.priceP')}</p> : null}
                {errors.price ? <p className="error-text">{errors.price}</p> : null}
                <label className="check">
                  <input type="checkbox" checked={negotiable} onChange={(e) => setNegotiable(e.target.checked)} />
                  <span>{t('form.negot')}</span>
                </label>
              </div>

              <div className="field">
                <label className="label">{t('form.condition')}</label>
                <div className="pill-row">
                  {(['yangi', 'ishlatilgan'] as ConditionId[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`pill${condition === c ? ' is-active' : ''}`}
                      onClick={() => setCondition(c)}
                    >
                      {c === 'yangi' ? t('cond.yangi') : t('cond.ishlatilgan')}
                    </button>
                  ))}
                </div>
                <label className="label label-gap">{t('form.sellerType')}</label>
                <div className="pill-row">
                  {(['shaxsiy', 'ustaxona', 'dokon'] as SellerTypeId[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`pill${sellerType === s ? ' is-active' : ''}`}
                      onClick={() => setSellerType(s)}
                    >
                      {t(`seller.${s}` as 'seller.all')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="price-preview">
              <div>
                <span className="price-preview-label">{t('filters.price')}</span>
                <strong>{negotiable ? t('ad.neg') : formatPrice(Number(price), t('cur')) || '—'}</strong>
              </div>
              <div>
                <span className="price-preview-label">{t('form.cat')}</span>
                <strong>{t(`cat.${category}` as 'cat.stul')}</strong>
              </div>
              <div>
                <span className="price-preview-label">{t('form.city')}</span>
                <strong>{city}</strong>
              </div>
            </div>

            <button
              type="button"
              className={`boost${boost ? ' is-on' : ''}`}
              onClick={() => setBoost((v) => !v)}
              role="checkbox"
              aria-checked={boost}
            >
              <span className="boost-ico">
                <Icon name="bolt" size={18} filled />
              </span>
              <span className="boost-text">
                <strong>{t('form.boost')}</strong>
                <small>{t('form.boostPrice')}</small>
              </span>
              <span className={`tick${boost ? ' is-on' : ''}`}>
                {boost ? <Icon name="check" size={14} /> : null}
              </span>
            </button>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div className="form-row">
              <div className={`field${errors.name ? ' has-error' : ''}`}>
                <label className="label" htmlFor="f-name">
                  {t('form.name')}
                </label>
                <input id="f-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Aziz" />
                {errors.name ? <p className="error-text">{errors.name}</p> : null}
              </div>
              <div className={`field${errors.phone ? ' has-error' : ''}`}>
                <label className="label" htmlFor="f-phone">
                  {t('form.phone')}
                </label>
                <input
                  id="f-phone"
                  className="input"
                  inputMode="tel"
                  value={phone ? prettyPhone(phone) : ''}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').replace(/^998/, '').slice(0, 9))}
                  placeholder={t('form.phoneP')}
                />
                {errors.phone ? <p className="error-text">{errors.phone}</p> : null}
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="f-city">
                {t('form.city')}
              </label>
              <div className="select-wrap">
                <select id="f-city" className="input" value={city} onChange={(e) => setCity(e.target.value)}>
                  {['Toshkent', "Yangiyo'l", 'Chirchiq', 'Olmaliq', 'Kangli', 'Bekobod', 'Samarqand', 'Buxoro', 'Qarshi', 'Namangan', 'Andijon', 'Farg‘ona', 'Qo‘qon', 'Navoiy', 'Urganch', 'Nukus', 'G‘ijduvon', 'Termiz', 'Jizzax', 'Nurafshon', 'Ohangaron'].map(
                    (c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ),
                  )}
                </select>
                <Icon name="chevron" size={16} />
              </div>
            </div>

            <div className="field">
              <label className="label">{t('form.photos')}</label>
              <div
                className={`drop${dragging ? ' is-drag' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  void handleFiles(e.dataTransfer.files);
                }}
                onClick={() => fileRef.current?.click()}
              >
                <Icon name="camera" size={26} />
                <div>
                  <strong>{t('form.photosHint')}</strong>
                  <small>{t('form.photosHint2')}</small>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => {
                    void handleFiles(e.target.files);
                    e.target.value = '';
                  }}
                />
              </div>

              <div className="shots">
                {images.map((src, i) => (
                  <div key={src.slice(-20) + i} className="shot">
                    <img src={src} alt="" />
                    {i === 0 ? <span className="shot-cover">{t('form.cover')}</span> : null}
                    <button
                      type="button"
                      className="shot-x"
                      onClick={() => setImages((list) => list.filter((_, idx) => idx !== i))}
                      aria-label="remove"
                    >
                      <Icon name="close" size={13} />
                    </button>
                  </div>
                ))}
                {images.length < MAX_PHOTOS ? (
                  <button type="button" className="shot shot--add" onClick={() => fileRef.current?.click()}>
                    <Icon name="plus" size={20} />
                  </button>
                ) : null}
              </div>

              <div className="url-row">
                <input
                  className="input"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder={t('form.url')}
                />
                <button
                  type="button"
                  className="btn btn-blue btn-sm"
                  onClick={() => {
                    const v = imageUrl.trim();
                    if (!v) return;
                    if (images.length >= MAX_PHOTOS) {
                      notify(t('toast.imgMax'), 'warn');
                      return;
                    }
                    setImages((l) => [...l, v]);
                    setImageUrl('');
                  }}
                >
                  <Icon name="plus" size={14} />
                  {t('form.addUrl')}
                </button>
              </div>
            </div>

            <div className="form-summary">
              <span className={`summary-ico summary-ico--${categoryMeta(category).accent}`}>
                <Icon name={categoryMeta(category).icon} size={16} />
              </span>
              <div>
                <strong>{title || t('form.titleP')}</strong>
                <small>
                  {negotiable ? t('ad.neg') : formatPrice(Number(price), t('cur'))} · {city} ·{' '}
                  {t(`cat.${category}` as 'cat.stul')}
                </small>
              </div>
              {boost ? (
                <span className="summary-boost">
                  <Icon name="bolt" size={14} filled />
                  {t('form.boostPrice')}
                </span>
              ) : null}
            </div>
          </>
        ) : null}
      </form>
    </Modal>
  );
}
