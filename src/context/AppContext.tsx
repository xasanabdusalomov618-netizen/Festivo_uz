import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { Ad, Lang, Theme, Toast } from '../types';
import { dictionaries, type TKey } from '../i18n/dict';
import { detectLang, KEYS, load, save } from '../lib/storage';
import { SEED_ADS } from '../data/seed';

export type NewAd = Omit<Ad, 'id' | 'createdAt' | 'views' | 'likes' | 'mine'>;

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (k: TKey) => string;

  ads: Ad[];
  addAd: (input: NewAd) => Ad;
  removeAd: (id: string) => void;
  registerView: (id: string) => void;

  favs: string[];
  isFav: (id: string) => boolean;
  toggleFav: (id: string) => void;

  boosts: number;
  addBoost: () => void;

  toasts: Toast[];
  notify: (text: string, tone?: Toast['tone']) => void;
  dismissToast: (id: number) => void;
}

const AppCtx = createContext<Ctx | null>(null);

function preferredTheme(): Theme {
  const saved = load<Theme>(KEYS.theme, 'light');
  return saved === 'dark' ? 'dark' : 'light';
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => detectLang());
  const [theme, setTheme] = useState<Theme>(() => preferredTheme());
  const [ads, setAds] = useState<Ad[]>(() => load<Ad[]>(KEYS.ads, SEED_ADS));
  const [favs, setFavs] = useState<string[]>(() => load<string[]>(KEYS.favs, []));
  const [boosts, setBoosts] = useState<number>(() => load<number>(KEYS.boosted, 0));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(1);
  const viewed = useRef(new Set<string>());

  const t = useCallback((key: TKey) => dictionaries[lang][key] ?? dictionaries.uz[key], [lang]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.lang = lang;
    root.lang = lang === 'uz' ? 'uz-UZ' : lang;
    save(KEYS.theme, theme);
    save(KEYS.lang, lang);
  }, [theme, lang]);

  useEffect(() => {
    save(KEYS.ads, ads);
  }, [ads]);
  useEffect(() => {
    save(KEYS.favs, favs);
  }, [favs]);
  useEffect(() => {
    save(KEYS.boosted, boosts);
  }, [boosts]);

  const notify = useCallback((text: string, tone: Toast['tone'] = 'ok') => {
    const id = toastId.current++;
    setToasts((list) => [...list.slice(-2), { id, text, tone }]);
    window.setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 3400);
  }, []);

  const dismissToast = useCallback((id: number) => setToasts((l) => l.filter((x) => x.id !== id)), []);

  const addAd = useCallback((input: NewAd) => {
    const ad: Ad = { ...input, id: `u-${Date.now().toString(36)}`, createdAt: Date.now(), views: 1, likes: 0, mine: true };
    setAds((list) => [ad, ...list]);
    return ad;
  }, []);

  const removeAd = useCallback((id: string) => {
    setAds((list) => list.filter((a) => a.id !== id));
    setFavs((list) => list.filter((f) => f !== id));
  }, []);

  const registerView = useCallback((id: string) => {
    if (viewed.current.has(id)) return;
    viewed.current.add(id);
    setAds((list) => list.map((a) => (a.id === id ? { ...a, views: a.views + 1 } : a)));
  }, []);

  const toggleFav = useCallback(
    (id: string) => {
      const has = favs.includes(id);
      setFavs(has ? favs.filter((f) => f !== id) : [...favs, id]);
      setAds((list) => list.map((a) => (a.id === id ? { ...a, likes: Math.max(0, a.likes + (has ? -1 : 1)) } : a)));
      notify(has ? t('toast.favDel') : t('toast.favAdd'), has ? 'info' : 'ok');
    },
    [favs, notify, t],
  );

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang: setLangState,
      theme,
      toggleTheme: () => setTheme((v) => (v === 'light' ? 'dark' : 'light')),
      t,
      ads,
      addAd,
      removeAd,
      registerView,
      favs,
      isFav: (id: string) => favs.includes(id),
      toggleFav,
      boosts,
      addBoost: () => setBoosts((v) => v + 1),
      toasts,
      notify,
      dismissToast,
    }),
    [lang, theme, t, ads, addAd, removeAd, registerView, favs, toggleFav, boosts, toasts, notify, dismissToast],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
