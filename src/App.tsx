import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AdCard } from './components/AdCard';
import { AdDetail } from './components/AdDetail';
import { AdForm } from './components/AdForm';
import { CategoryStrip } from './components/CategoryStrip';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Icon } from './components/Icon';
import { SellBanner, Why } from './components/Sections';
import { Toasts } from './components/Toasts';
import { Toolbar } from './components/Toolbar';
import { useApp } from './context/AppContext';
import type { Ad, CategoryId, Filters, TabId } from './types';

const PAGE = 9;

const emptyFilters: Filters = {
  q: '',
  category: 'all',
  city: 'all',
  priceMin: '',
  priceMax: '',
  condition: 'all',
  sellerType: 'all',
  sort: 'yangi',
  withPhoto: false,
};

export default function App() {
  const { t, lang, ads, favs } = useApp();
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [tab, setTab] = useState<TabId>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [openAd, setOpenAd] = useState<Ad | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const patch = useCallback((p: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...p }));
    setPage(1);
  }, []);

  const reset = useCallback(() => {
    setFilters({ ...emptyFilters, city: filters.city });
    setPage(1);
  }, [filters.city]);

  const scrollToResults = useCallback(() => {
    resultsRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  }, []);

  // Deep link: #ad-<id> opens that listing.
  useEffect(() => {
    const id = location.hash.replace('#ad-', '');
    if (!id) return;
    const found = ads.find((a) => a.id === id);
    if (found) setOpenAd(found);
  }, [ads]);

  const scoped = useMemo(() => {
    if (tab === 'fav') return ads.filter((a) => favs.includes(a.id));
    if (tab === 'mine') return ads.filter((a) => a.mine);
    return ads;
  }, [ads, favs, tab]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const ad of scoped) map[ad.category] = (map[ad.category] ?? 0) + 1;
    return map;
  }, [scoped]);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const min = Number(filters.priceMin) || 0;
    const max = Number(filters.priceMax) || 0;
    const list = scoped.filter((ad) => {
      if (filters.category !== 'all' && ad.category !== filters.category) return false;
      if (filters.city !== 'all' && ad.city !== filters.city) return false;
      if (filters.condition !== 'all' && ad.condition !== filters.condition) return false;
      if (filters.sellerType !== 'all' && ad.sellerType !== filters.sellerType) return false;
      if (filters.withPhoto && !ad.images.length) return false;
      const price = ad.price;
      if (min && price < min) return false;
      if (max && price > max) return false;
      if (q) {
        const hay = `${ad.title[lang]} ${ad.title.uz} ${ad.body[lang]} ${ad.city} ${ad.seller}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const sorted = [...list];
    sorted.sort((a, b) => {
      const boostFirst = filters.sort === 'yangi' || filters.sort === 'ommabop';
      if (boostFirst && a.premium !== b.premium) return a.premium ? -1 : 1;
      switch (filters.sort) {
        case 'arzon':
          return (a.price || Infinity) - (b.price || Infinity);
        case 'qimmat':
          return b.price - a.price;
        case 'ommabop':
          return b.views + b.likes * 6 - (a.views + a.likes * 6);
        default:
          return b.createdAt - a.createdAt;
      }
    });
    return sorted;
  }, [scoped, filters, lang]);

  const visible = filtered.slice(0, page * PAGE);

  const stats = useMemo(
    () => ({
      ads: ads.length,
      sellers: new Set(ads.map((a) => a.seller)).size,
      cities: new Set(ads.map((a) => a.city)).size,
      views: ads.reduce((sum, a) => sum + a.views, 0),
    }),
    [ads],
  );

  const openAdAndLink = useCallback((ad: Ad) => {
    setOpenAd(ad);
    history.replaceState(null, '', `#ad-${ad.id}`);
  }, []);

  const pickCategory = useCallback(
    (c: CategoryId | 'all') => {
      patch({ category: c });
      scrollToResults();
    },
    [patch, scrollToResults],
  );

  const emptyCopy =
    tab === 'fav'
      ? { title: t('list.empty'), sub: t('list.emptySub') }
      : tab === 'mine'
        ? { title: t('list.empty'), sub: t('form.sub') }
        : { title: t('list.empty'), sub: t('list.emptySub') };

  return (
    <div className="page">
      <Header
        tab={tab}
        onTab={(id) => {
          setTab(id);
          setPage(1);
        }}
        onPost={() => setFormOpen(true)}
        city={filters.city}
        onCity={(v) => patch({ city: v })}
        favCount={favs.length}
        mineCount={ads.filter((a) => a.mine).length}
        totalCount={ads.length}
      />

      <main>
        <Hero filters={filters} patch={patch} onSearch={scrollToResults} onPost={() => setFormOpen(true)} stats={stats} />

        <CategoryStrip active={filters.category} counts={counts} total={scoped.length} onPick={pickCategory} />

        <div className="container results" ref={resultsRef}>
          <Toolbar
            filters={filters}
            patch={patch}
            reset={reset}
            count={filtered.length}
            view={view}
            setView={setView}
            onPost={() => setFormOpen(true)}
          />

          {visible.length ? (
            <>
              <div className={`list list--${view}`}>
                {visible.map((ad) => (
                  <AdCard key={ad.id} ad={ad} onOpen={openAdAndLink} />
                ))}
              </div>

              {filtered.length > visible.length ? (
                <div className="list-more">
                  <button type="button" className="btn btn-blue" onClick={() => setPage((p) => p + 1)}>
                    {t('list.more')}
                    <Icon name="chevron" size={16} />
                  </button>
                  <p className="list-progress">
                    {visible.length} / {filtered.length}
                  </p>
                </div>
              ) : (
                <p className="list-end">{t('list.end')}</p>
              )}
            </>
          ) : (
            <div className="empty">
              <span className="empty-ico">
                <Icon name="search" size={26} />
              </span>
              <h3>{emptyCopy.title}</h3>
              <p>{emptyCopy.sub}</p>
              <div className="btn-row">
                <button type="button" className="btn btn-primary" onClick={() => setFormOpen(true)}>
                  <Icon name="plus" size={16} />
                  {t('nav.post')}
                </button>
                {tab === 'all' ? (
                  <button type="button" className="btn btn-ghost" onClick={reset}>
                    <Icon name="close" size={16} />
                    {t('filters.reset')}
                  </button>
                ) : (
                  <button type="button" className="btn btn-ghost" onClick={() => setTab('all')}>
                    <Icon name="tag" size={16} />
                    {t('nav.all')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <Why />
        <SellBanner onPost={() => setFormOpen(true)} />
      </main>

      <Footer
        onPickCategory={(c) => {
          setTab('all');
          pickCategory(c);
        }}
      />

      <AdDetail
        ad={openAd}
        onClose={() => {
          setOpenAd(null);
          history.replaceState(null, '', location.pathname + location.search);
        }}
        onOpen={openAdAndLink}
        onDeleted={() => setOpenAd(null)}
      />

      <AdForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        defaults={{ category: filters.category, city: filters.city }}
        onCreated={(id) => {
          setTab('mine');
          const found = ads.find((a) => a.id === id);
          if (found) setOpenAd(found);
        }}
      />

      <Toasts />
    </div>
  );
}
