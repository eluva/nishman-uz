'use client';

import { m, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { useIsDesktop, useReducedMotionPref } from '@/components/providers/device';
import { Icon } from '@/components/ui/Icon';
import { SectionHead } from '@/components/ui/SectionHead';
import type { ImageAsset } from '@/lib/catalog/types';
import { siteConfig } from '@/site.config';

const Lightbox = dynamic(() => import('./Lightbox').then((mod) => mod.Lightbox), { ssr: false });

const HEIGHTS = ['h-[24rem]', 'h-[30rem]', 'h-[22rem]', 'h-[28rem]', 'h-[26rem]'];

/** Лукбук: горизонтальная параллакс-лента (десктоп) / свайп (телефон) + лайтбокс */
export function Lookbook({ photos }: { photos: ImageAsset[] }) {
  const t = useTranslations('lookbook');
  const ref = useRef<HTMLElement>(null);
  const desktop = useIsDesktop();
  const reduced = useReducedMotionPref();
  const [open, setOpen] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], ['4%', reduced ? '4%' : '-38%']);

  return (
    <section ref={ref} id="lookbook" aria-labelledby="lookbook-title" className="section-y cv-auto overflow-hidden [--cv-h:860px] border-t border-line">
      <div className="container-x flex flex-wrap items-end justify-between gap-6">
        <SectionHead label={t('label')} title={t('title')} id="lookbook-title" />
        <a href={siteConfig.contacts.instagram} target="_blank" rel="noopener" className="link-u inline-flex min-h-11 items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em]">
          <Icon name="instagram" size={18} />
          {t('instagram')}
        </a>
      </div>

      <m.ul
        className={`mt-12 flex gap-3 lg:mt-16 lg:w-max lg:items-center lg:gap-5 ${
          desktop ? '' : 'edge-fade snap-x snap-mandatory overflow-x-auto scroll-px-4 px-4 pb-2 no-scrollbar md:px-8'
        }`}
        style={desktop ? { x } : undefined}
      >
        {photos.map((p, i) => (
          <li key={p.src} className={`relative shrink-0 snap-center ${desktop ? HEIGHTS[i % HEIGHTS.length] : 'h-[62vh] max-h-[30rem]'}`} style={{ aspectRatio: `${p.width} / ${p.height}` }}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={t('open', { n: i + 1 })}
              data-cursor="view"
              className="group relative block h-full w-full overflow-hidden rounded-[1rem]"
            >
              <Image
                src={p.src}
                alt={t('alt', { n: i + 1 })}
                fill
                sizes="(min-width: 1024px) 26rem, 70vw"
                quality={70}
                className="photo-tone object-cover transition-transform duration-[1400ms] ease-lux group-hover:scale-[1.04]"
              />
            </button>
          </li>
        ))}
      </m.ul>

      {open !== null && <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </section>
  );
}
