'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { SectionHead } from '@/components/ui/SectionHead';
import type { ImageAsset } from '@/lib/catalog/types';
import { scrollBehavior } from '@/lib/motion';
import { siteConfig } from '@/site.config';

const Lightbox = dynamic(() => import('./Lightbox').then((mod) => mod.Lightbox), { ssr: false });

/** Лукбук: лента со свайпом и snap (без привязки к прокрутке страницы), стрелки на планшете и десктопе + лайтбокс */
export function Lookbook({ photos }: { photos: ImageAsset[] }) {
  const t = useTranslations();
  const track = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: scrollBehavior() });
  };

  return (
    <section id="lookbook" aria-labelledby="lookbook-title" className="section-y overflow-hidden border-t border-line">
      <div className="container-x flex flex-wrap items-end justify-between gap-6">
        <SectionHead label={t('lookbook.label')} title={t('lookbook.title')} id="lookbook-title" />
        <div className="flex items-center gap-4">
          <a href={siteConfig.contacts.instagram} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-medium">
            <Icon name="instagram" size={18} />
            <span className="link-u">{t('lookbook.instagram')}</span>
          </a>
          <div className="hidden gap-2 md:flex">
            <button type="button" onClick={() => scroll(-1)} aria-label={t('common.prev')} className="flex h-12 w-12 items-center justify-center rounded-full ring-1 ring-line transition-colors duration-500 hover:bg-raised">
              <Icon name="arrowLeft" />
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label={t('common.next')} className="flex h-12 w-12 items-center justify-center rounded-full ring-1 ring-line transition-colors duration-500 hover:bg-raised">
              <Icon name="arrowRight" />
            </button>
          </div>
        </div>
      </div>

      <ul ref={track} className="edge-fade mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 no-scrollbar md:scroll-px-8 md:px-8 lg:mt-14 lg:gap-4 xl:scroll-px-14 xl:px-14">
        {photos.map((p, i) => (
          <li key={p.src} className="relative h-[min(62vh,30rem)] shrink-0 snap-start lg:h-[28rem]" style={{ aspectRatio: `${p.width} / ${p.height}` }}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={t('lookbook.open', { n: i + 1 })}
              className="group relative block h-full w-full overflow-hidden rounded-[1rem]"
            >
              <Image
                src={p.src}
                alt={t('lookbook.alt', { n: i + 1 })}
                fill
                sizes="(min-width: 1024px) 26rem, 70vw"
                quality={70}
                className="photo-tone object-cover transition-transform duration-700 ease-lux group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      {open !== null && <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </section>
  );
}
