'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { Category, ImageAsset } from '@/lib/catalog/types';
import { useFilters } from '@/lib/store/ui';

/**
 * Индекс каталога 01–08 — единственное место с названиями категорий.
 * Это и навигация, и фильтр раздела. Миниатюра раздела — прямо в строке (без фото, следующего за курсором).
 */
export function CatalogIndex({ categories, photos }: { categories: Category[]; photos: Record<string, ImageAsset> }) {
  const t = useTranslations('catalog');
  const active = useFilters((s) => s.category);
  const apply = useFilters((s) => s.apply);

  return (
    <div className="relative mt-14 lg:mt-20">
      <ul className="border-t border-line">
        {categories.map((c) => {
          const isActive = active === c.id;
          return (
            <li key={c.id} className="border-b border-line">
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => apply({ category: isActive ? null : c.id })}
                className="group grid min-h-[4.5rem] w-full grid-cols-[auto_1fr_auto] items-center gap-4 py-3 text-left lg:min-h-[7rem] lg:gap-8"
              >
                <span
                  className={`display w-[2.4ch] text-[2.25rem] tabular-nums transition-colors duration-500 lg:text-[4.5rem] ${
                    isActive ? 'text-accent' : 'text-accent/90 lg:text-bone/40 lg:group-hover:text-accent'
                  }`}
                >
                  {c.number}
                </span>
                <span className="flex min-w-0 items-center gap-4 lg:gap-8">
                  <span aria-hidden="true" className="hidden h-px w-24 origin-left scale-x-[0.6] bg-bone/25 transition-[transform,background-color] duration-700 ease-lux group-hover:scale-x-100 group-hover:bg-accent lg:block" />
                  <span className="min-w-0">
                    <span className={`display block text-xl transition-colors duration-500 xs:text-2xl lg:text-5xl ${isActive ? 'text-accent' : ''}`}>
                      {t(`categories.${c.id}`)}
                    </span>
                    <span className="mt-1 block text-[0.66rem] uppercase tracking-[0.16em] text-muted lg:hidden">{t('count', { count: c.count })}</span>
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="hidden text-[0.7rem] uppercase tracking-[0.16em] text-muted lg:inline">{t('count', { count: c.count })}</span>
                  {photos[c.id] && (
                    <span className="relative h-12 w-10 overflow-hidden rounded-md lg:h-20 lg:w-16 lg:rounded-lg">
                      <Image src={photos[c.id].src} alt="" fill sizes="(min-width: 1024px) 64px, 40px" quality={60} className="photo-tone object-cover transition-transform duration-700 ease-lux group-hover:scale-105" />
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

    </div>
  );
}
