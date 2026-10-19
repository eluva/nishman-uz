'use client';

import { AnimatePresence, m, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { Category, ImageAsset } from '@/lib/catalog/types';
import { useFilters } from '@/lib/store/ui';
import { EASE } from '@/lib/motion';
import { useFinePointer } from '@/components/providers/device';

/**
 * Индекс каталога 01–07 — единственное место с названиями категорий.
 * Это и навигация, и фильтр раздела. Десктоп: фото следует за курсором; телефон: миниатюра в строке.
 */
export function CatalogIndex({ categories, photos }: { categories: Category[]; photos: Record<string, ImageAsset> }) {
  const t = useTranslations('catalog');
  const active = useFilters((s) => s.category);
  const apply = useFilters((s) => s.apply);
  const fine = useFinePointer();
  const [hover, setHover] = useState<string | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <div
      className="relative mt-14 lg:mt-20"
      onPointerMove={(e) => {
        if (!fine) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => setHover(null)}
    >
      <ul className="border-t border-line">
        {categories.map((c) => {
          const isActive = active === c.id;
          return (
            <li key={c.id} className="border-b border-line">
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => apply({ category: isActive ? null : c.id })}
                onPointerEnter={() => fine && setHover(c.id)}
                className="group grid min-h-[4.5rem] w-full grid-cols-[auto_1fr_auto] items-center gap-4 py-3 text-left lg:min-h-[8rem] lg:gap-8"
              >
                <span
                  className={`display w-[2.4ch] text-[2.6rem] transition-colors duration-700 lg:text-[6.5rem] ${
                    isActive ? 'text-accent' : 'text-accent/90 lg:text-bone/40 lg:group-hover:text-accent'
                  }`}
                >
                  {c.number}
                </span>
                <span className="flex min-w-0 items-center gap-4 lg:gap-8">
                  <span aria-hidden="true" className="hidden h-px w-16 bg-bone/25 transition-[width,background-color] duration-700 ease-lux group-hover:w-28 group-hover:bg-accent lg:block" />
                  <span className="min-w-0">
                    <span className={`display block text-lg leading-[1.05] transition-colors duration-700 xs:text-xl lg:text-5xl ${isActive ? 'text-accent' : ''}`}>
                      {t(`categories.${c.id}`)}
                    </span>
                    <span className="mt-1 block text-[0.66rem] uppercase tracking-[0.16em] text-muted lg:hidden">{t('count', { count: c.count })}</span>
                  </span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="hidden text-[0.7rem] uppercase tracking-[0.16em] text-muted lg:inline">{t('count', { count: c.count })}</span>
                  {photos[c.id] && (
                    <span className="relative h-12 w-10 overflow-hidden rounded-md lg:hidden">
                      <Image src={photos[c.id].src} alt="" fill sizes="40px" quality={60} className="photo-tone object-cover" />
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {fine && (
        <m.div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-20 hidden transition-transform duration-700 ease-lux lg:block" style={{ x, y }}>
          <AnimatePresence mode="popLayout">
            {hover && photos[hover] && (
              <m.div
                key={hover}
                className="relative -mt-48 ml-10 h-96 w-72 overflow-hidden rounded-xl"
                initial={{ opacity: 0, scale: 0.9, clipPath: 'inset(20% 20% 20% 20%)' }}
                animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                <Image src={photos[hover].src} alt="" fill sizes="288px" quality={70} className="photo-tone object-cover" />
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      )}
    </div>
  );
}
