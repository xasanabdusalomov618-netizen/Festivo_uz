export const KEYS = {
  ads: 'festivo.ads.v1',
  favs: 'festivo.favs.v1',
  lang: 'festivo.lang.v1',
  theme: 'festivo.theme',
  boosted: 'festivo.boosted.v1',
} as const;

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function save(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function detectLang(): 'uz' | 'ru' | 'en' {
  const saved = load<string>(KEYS.lang, '');
  if (saved === 'uz' || saved === 'ru' || saved === 'en') return saved;
  const nav = typeof navigator !== 'undefined' ? navigator.language.slice(0, 2).toLowerCase() : 'uz';
  if (nav === 'ru') return 'ru';
  if (nav === 'en') return 'en';
  return 'uz';
}
