import type { TKey } from '../i18n/dict';
import type { Lang } from '../types';

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export function timeAgo(ts: number, lang: Lang, t: (k: TKey) => string): string {
  const diff = Math.max(0, Date.now() - ts);
  if (diff < 2 * MIN) return t('justNow');
  if (diff < HOUR) return lang === 'en' ? `${Math.round(diff / MIN)} min ago` : `${Math.round(diff / MIN)} ${t('minAgo')}`;
  if (diff < DAY) return `${Math.round(diff / HOUR)} ${t('hourAgo')}`;
  if (diff < 2 * DAY) return t('today');
  if (diff < 3 * DAY) return t('yesterday');
  return `${Math.round(diff / DAY)} ${t('dayAgo')}`;
}

export function fullDate(ts: number, lang: Lang): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  const date = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return lang === 'en' ? `${date}, ${time}` : `${date} · ${time}`;
}
