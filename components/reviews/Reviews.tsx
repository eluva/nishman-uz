'use client';

import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Icon } from '@/components/ui/Icon';
import { SectionHead } from '@/components/ui/SectionHead';
import { scrollBehavior } from '@/lib/motion';
import { siteConfig } from '@/site.config';

function Stars({ value, label }: { value: number; label: string }) {
  return (
    <span role="img" aria-label={label} className="flex gap-0.5 text-accent">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" className={i <= value ? '' : 'opacity-25'}>
          <path fill="currentColor" d="M10 1.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.6 7.7l5.8-.8z" />
        </svg>
      ))}
    </span>
  );
}

/** Отзывы: компактные карточки (звёзды, текст, имя, город). Телефон — свайп со snap, десктоп — сетка 3 × 2. */
export function Reviews() {
  const t = useTranslations();
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector('li');
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 12), behavior: scrollBehavior() });
  };

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="section-y overflow-hidden border-t border-line">
      <div className="container-x flex items-end justify-between gap-6">
        <SectionHead label={t('reviews.label')} title={t('reviews.title')} id="reviews-title" />
        <div className="hidden gap-2 md:flex lg:hidden">
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
        className="edge-fade mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 no-scrollbar md:scroll-px-8 md:px-8 lg:mx-auto lg:mt-14 lg:grid lg:max-w-[1440px] lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:pb-0 lg:[mask-image:none] xl:px-14"
        aria-label={t('reviews.title')}
      >
        {siteConfig.reviews.map((r) => {
          const base = `reviews.items.${r.id}` as const;
          return (
            <li key={r.id} className="w-[80vw] max-w-[22rem] shrink-0 snap-start lg:w-auto lg:max-w-none">
              <figure className="flex h-full flex-col gap-4 rounded-[1.25rem] bg-surface p-5 ring-1 ring-line lg:p-6">
                <Stars value={r.rating} label={t('reviews.rating', { value: r.rating })} />
                <blockquote className="text-[0.98rem] leading-relaxed text-bone/85">{t(`${base}.text`)}</blockquote>
                <figcaption className="mt-auto flex items-center justify-between gap-3 text-sm">
                  <span>
                    <span className="font-semibold tracking-[-0.015em]">{t(`${base}.name`)}</span>
                    <span className="text-muted"> · {t(`${base}.city`)}</span>
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
