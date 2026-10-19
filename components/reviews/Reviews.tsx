'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Icon } from '@/components/ui/Icon';
import { SectionHead } from '@/components/ui/SectionHead';
import type { ImageAsset } from '@/lib/catalog/types';
import { siteConfig } from '@/site.config';

/** Отзывы: карусель со snap; первым — отзыв из PDF-каталога с портретом и атрибуцией */
export function Reviews({ portrait }: { portrait: ImageAsset }) {
  const t = useTranslations();
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector('li:nth-child(2)') as HTMLElement | null;
    el.scrollBy({ left: dir * (card?.offsetWidth ?? 360) + dir * 16, behavior: 'smooth' });
  };

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="section-y cv-auto overflow-hidden [--cv-h:1460px] border-t border-line">
      <div className="container-x flex items-end justify-between gap-6">
        <SectionHead label={t('reviews.label')} title={t('reviews.title')} id="reviews-title" />
        <div className="hidden gap-2 md:flex">
          <button type="button" onClick={() => scroll(-1)} aria-label={t('common.prev')} className="flex h-12 w-12 items-center justify-center rounded-full ring-1 ring-line transition-colors duration-500 hover:bg-raised">
            <Icon name="arrowLeft" />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label={t('common.next')} className="flex h-12 w-12 items-center justify-center rounded-full ring-1 ring-line transition-colors duration-500 hover:bg-raised">
            <Icon name="arrowRight" />
          </button>
        </div>
      </div>

      <ul
        ref={track}
        className="edge-fade mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 no-scrollbar md:scroll-px-8 md:px-8 lg:mt-16 xl:scroll-px-14 xl:px-14"
        aria-label={t('reviews.title')}
        data-lenis-prevent-wheel
      >
        {siteConfig.reviews.map((r, i) => {
          const base = `reviews.items.${r.id}` as const;
          if (i === 0) {
            return (
              <li key={r.id} className="w-[88vw] shrink-0 snap-start md:w-[min(920px,78vw)]">
                <figure className="grid h-full overflow-hidden rounded-[1.5rem] bg-surface ring-1 ring-line md:grid-cols-[0.8fr_1.2fr]">
                  <div className="relative aspect-[4/5] md:aspect-auto" data-cursor="view">
                    <Image src={portrait.src} alt={t(`${base}.name`)} fill sizes="(min-width: 768px) 360px, 88vw" quality={75} className="photo-tone object-cover object-[72%_20%]" />
                  </div>
                  <div className="flex flex-col p-6 lg:p-10">
                    <span aria-hidden="true" className="display text-6xl leading-none text-accent">“</span>
                    <blockquote className="mt-2 text-[0.98rem] leading-relaxed text-bone/85 lg:text-lg">{t(`${base}.text`)}</blockquote>
                    <figcaption className="mt-auto border-t border-line pt-5">
                      <span className="block font-display font-extrabold uppercase">{t(`${base}.name`)}</span>
                      <span className="mt-1 block text-sm text-muted">{t(`${base}.role`)}</span>
                      <span className="mt-3 inline-block text-[0.66rem] uppercase tracking-[0.18em] text-accent/80">{t('reviews.fromCatalog')}</span>
                    </figcaption>
                  </div>
                </figure>
              </li>
            );
          }
          return (
            <li key={r.id} className="w-[78vw] shrink-0 snap-start xs:w-[72vw] md:w-[360px]">
              <figure className="flex h-full flex-col rounded-[1.5rem] bg-surface p-6 ring-1 ring-line lg:p-8">
                <span aria-hidden="true" className="display text-5xl leading-none text-bone/20">“</span>
                <blockquote className="mt-2 text-[0.98rem] leading-relaxed text-bone/85">{t(`${base}.text`)}</blockquote>
                <figcaption className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-5">
                  <span>
                    <span className="block font-display font-extrabold uppercase">{t(`${base}.name`)}</span>
                    <span className="mt-1 block text-sm text-muted">{t(`${base}.role`)}</span>
                  </span>
                  <DemoBadge demo={r.demo} />
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
