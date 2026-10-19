'use client';

import { AnimatePresence, m } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useDeferredValue, useMemo, useState, useTransition } from 'react';
import { useCatalogData } from './CatalogData';
import { CatalogIndex } from './CatalogIndex';
import { FilterControls, type VolumeOption } from './FilterControls';
import { ProductCard, ProductCardSkeleton } from './ProductCard';
import { Sheet } from '@/components/global/Sheet';
import { Icon } from '@/components/ui/Icon';
import { useIsDesktop } from '@/components/providers/device';
import { countActiveFilters, filterProducts } from '@/lib/catalog/filter';
import type { Category, ImageAsset, Line, Product } from '@/lib/catalog/types';
import { EASE } from '@/lib/motion';
import { useFilters, useUi } from '@/lib/store/ui';
import { siteConfig } from '@/site.config';

const QuickView = dynamic(() => import('./QuickView').then((mod) => mod.QuickView), { ssr: false });

interface Props {
  categories: Category[];
  lines: Line[];
  categoryPhotos: Record<string, ImageAsset>;
}

/** Каталог: индекс разделов → липкие фильтры → сетка с подгрузкой «Показать ещё» */
export function Catalog({ categories, lines, categoryPhotos }: Props) {
  const t = useTranslations();
  const { products } = useCatalogData();
  const desktop = useIsDesktop();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const f = useFilters();
  const quickViewId = useUi((s) => s.quickViewId);
  const openQuickView = useUi((s) => s.openQuickView);

  const query = useMemo(
    () => ({ category: f.category, line: f.line, effect: f.effect, hold: f.hold, volume: f.volume, forSalons: f.forSalons, search: f.search, sort: f.sort }),
    [f.category, f.line, f.effect, f.hold, f.volume, f.forSalons, f.search, f.sort],
  );
  const deferred = useDeferredValue(query);
  const stale = deferred !== query;
  const list = useMemo(() => filterProducts(products, deferred), [products, deferred]);
  const pageSize = desktop ? siteConfig.catalogPageSize.desktop : siteConfig.catalogPageSize.mobile;
  const visible = list.slice(0, f.page * pageSize);
  const active = countActiveFilters(query);

  const volumes: VolumeOption[] = useMemo(() => {
    const map = new Map<number, string>();
    products.forEach((p) => p.volumes.forEach((v) => v.unit !== 'pcs' && map.set(v.value, `${v.value} ${v.unit}`)));
    return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([value, label]) => ({ value, label }));
  }, [products]);

  const quickProduct = quickViewId ? products.find((p) => p.id === quickViewId) ?? null : null;
  // последний открытый товар держим смонтированным, чтобы шторка закрывалась с анимацией
  const [lastQuick, setLastQuick] = useState<Product | null>(null);
  if (quickProduct && quickProduct !== lastQuick) setLastQuick(quickProduct);
  const shownQuick = quickProduct ?? lastQuick;

  return (
    <section id="catalog" aria-labelledby="catalog-title" className="section-y cv-auto relative [--cv-h:2900px]">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow">{t('nav.catalog')}</p>
            <h2 id="catalog-title" className="display mt-5 text-[clamp(2.3rem,7.4vw,6.2rem)]">
              {t('catalog.title')}
            </h2>
          </div>
          <p className="max-w-md text-bone/70 lg:col-span-4 lg:col-start-9 lg:self-end">{t('catalog.lead')}</p>
        </div>

        <CatalogIndex categories={categories} photos={categoryPhotos} />
      </div>

      {/* Липкая панель фильтров */}
      <div id="catalog-grid" className="sticky top-16 z-30 mt-12 border-y border-line bg-ink/95 lg:top-20 lg:bg-ink/80 lg:backdrop-blur-xl lg:mt-16">
        <div className="container-x flex items-center gap-2 py-2.5">
          <label className="relative min-w-0 flex-1 lg:max-w-[16rem]">
            <span className="sr-only">{t('filters.search')}</span>
            <Icon name="search" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={f.search}
              onChange={(e) => f.set({ search: e.target.value })}
              placeholder={t('filters.search')}
              enterKeyHint="search"
              className="field !min-h-11 !rounded-full !py-0 pl-11 text-sm"
            />
          </label>
          <div className="hidden min-w-0 flex-1 lg:block">
            <FilterControls lines={lines} volumes={volumes} layout="bar" />
          </div>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium ring-1 ring-inset ring-line lg:hidden"
          >
            <Icon name="filter" size={18} />
            {t('filters.title')}
            {active > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-ink">{active}</span>
            )}
          </button>
          {(active > 0 || f.category || f.search) && (
            <button type="button" onClick={f.reset} className="hidden min-h-11 shrink-0 px-2 text-xs uppercase tracking-[0.14em] text-muted hover:text-bone lg:block">
              {t('filters.reset')}
            </button>
          )}
        </div>
      </div>

      <div className="container-x mt-6 lg:mt-10">
        <p className="mb-4 text-xs uppercase tracking-[0.16em] text-muted" aria-live="polite">
          {t('catalog.shown', { shown: Math.min(visible.length, list.length), total: list.length })}
        </p>

        {list.length === 0 ? (
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-line px-6 py-16 lg:items-center lg:text-center">
            <p className="display text-3xl">{t('catalog.emptyTitle')}</p>
            <p className="max-w-md text-muted">{t('catalog.emptyText')}</p>
            <button type="button" onClick={f.reset} className="btn btn-ghost mt-2">
              {t('filters.reset')}
            </button>
          </div>
        ) : (
          <ul className={`grid grid-cols-2 gap-2.5 transition-opacity duration-500 xs:gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5 ${stale ? 'opacity-60' : ''}`}>
            <AnimatePresence initial={false}>
              {visible.map((p, i) => (
                <m.li
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: (i % pageSize) * 0.03 }}
                >
                  <ProductCard product={p} priority={false} />
                </m.li>
              ))}
            </AnimatePresence>
            {pending &&
              Array.from({ length: Math.min(4, list.length - visible.length) }).map((_, i) => (
                <li key={`sk-${i}`}>
                  <ProductCardSkeleton />
                </li>
              ))}
          </ul>
        )}

        {visible.length < list.length && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              className="btn btn-ghost min-w-56"
              onClick={() => startTransition(() => f.set({ page: f.page + 1 }))}
              disabled={pending}
            >
              {t('catalog.showMore')}
              <Icon name="arrowDown" size={16} />
            </button>
          </div>
        )}
      </div>

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={t('filters.title')}
        footer={
          <div className="flex gap-3">
            <button type="button" onClick={f.reset} className="btn btn-ghost flex-1">
              {t('filters.reset')}
            </button>
            <button type="button" onClick={() => setSheetOpen(false)} className="btn btn-accent flex-[1.6]">
              {t('filters.apply', { count: list.length })}
            </button>
          </div>
        }
      >
        <FilterControls lines={lines} volumes={volumes} layout="sheet" />
      </Sheet>

      {shownQuick && (
        <QuickView
          open={Boolean(quickProduct)}
          product={shownQuick}
          related={products.filter((p) => p.line === shownQuick.line && p.id !== shownQuick.id)}
          onClose={() => openQuickView(null)}
        />
      )}
    </section>
  );
}
