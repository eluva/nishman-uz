'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import type { Product } from '@/lib/catalog/types';
import { useFilters } from '@/lib/store/ui';

const GROUPS = [
  { line: 'matte', hero: 'M2', text: 'matteText' },
  { line: 'spider-wax', hero: 'S1', text: 'spiderText' },
] as const;

/** (б) Матовая линейка и Spider Wax: две простые карточки — нажатие открывает линейку в каталоге */
export function MattePanel({ products }: { products: Product[] }) {
  const t = useTranslations();
  const apply = useFilters((s) => s.apply);

  return (
    <article className="flex h-full flex-col rounded-[1.5rem] bg-surface p-6 ring-1 ring-line lg:p-10">
      <h3 className="display text-3xl lg:text-5xl">{t('lines.matte.title')}</h3>
      <p className="mt-3 max-w-lg text-bone/70">{t('lines.matte.text')}</p>
      <ul className="mt-6 grid flex-1 gap-3 md:grid-cols-2 lg:mt-8 lg:gap-4">
        {GROUPS.map((g) => {
          const items = products.filter((p) => p.line === g.line);
          if (!items.length) return null;
          const hero = items.find((p) => p.code === g.hero) ?? items[0];
          const holds = items.map((p) => p.hold ?? 0).filter(Boolean);
          const min = Math.min(...holds);
          const max = Math.max(...holds);
          return (
            <li key={g.line}>
              <button
                type="button"
                onClick={() => apply({ line: g.line })}
                className="group flex h-full w-full items-center gap-4 rounded-2xl bg-raised p-4 text-left ring-1 ring-line transition-shadow duration-500 hover:ring-bone/30 md:flex-col md:items-stretch lg:p-6"
              >
                <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-tile md:h-44 md:w-full lg:h-56">
                  <Image
                    src={hero.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 30vw, 96px"
                    quality={70}
                    className="object-contain p-3 transition-transform duration-700 ease-lux group-hover:scale-[1.04]"
                  />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-xl font-semibold tracking-[-0.02em] lg:text-2xl">{hero.lineName}</span>
                  <span className="mt-1 text-sm text-bone/70 lg:text-base">{t(`lines.matte.${g.text}`)}</span>
                  <span className="mt-3 flex flex-wrap gap-1.5">
                    <span className="pill !bg-ink">{t('catalog.count', { count: items.length })}</span>
                    <span className="pill !bg-ink">{t('product.holdValue', { value: min === max ? String(min) : `${min}–${max}` })}</span>
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent md:mt-auto md:pt-5">
                    {t('lines.cta')}
                    <Icon name="arrowRight" size={16} className="transition-transform duration-500 ease-lux group-hover:translate-x-1" />
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
