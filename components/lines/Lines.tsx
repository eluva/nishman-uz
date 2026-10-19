'use client';

import { m, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useMemo, useRef, type ReactNode } from 'react';
import { AquaPanel } from './AquaPanel';
import { ColognePanel } from './ColognePanel';
import { MattePanel } from './MattePanel';
import { useIsDesktop, useReducedMotionPref } from '@/components/providers/device';
import { useCatalogData, usePick } from '@/components/catalog/CatalogData';
import type { ImageAsset } from '@/lib/catalog/types';
import { siteConfig } from '@/site.config';

interface Props {
  photos: { matte: ImageAsset; cologne: ImageAsset };
}

/** «Линейки»: десктоп — закреплённая горизонтальная прокрутка, телефон — свайп-карусель со snap */
export function Lines(props: Props) {
  const t = useTranslations('lines');
  const { products } = useCatalogData();
  const aqua = usePick(siteConfig.showcase.aqua);
  const colognes = usePick(siteConfig.showcase.colognes);
  const matte = useMemo(() => products.filter((p) => (siteConfig.showcase.matteLines as readonly string[]).includes(p.line)), [products]);
  const desktop = useIsDesktop();
  const reduced = useReducedMotionPref();
  const panels = [
    <AquaPanel key="aqua" products={aqua} />,
    <MattePanel key="matte" products={matte} photo={props.photos.matte} />,
    <ColognePanel key="cologne" products={colognes} photo={props.photos.cologne} />,
  ];

  const header = (
    <div className="container-x flex items-end justify-between gap-6">
      <div>
        <p className="eyebrow">{t('label')}</p>
        <h2 id="lines-title" className="display mt-4 text-[clamp(2rem,5.6vw,4.5rem)]">
          {t('title')}
        </h2>
      </div>
    </div>
  );

  if (desktop && !reduced) return <Pinned header={header}>{panels}</Pinned>;

  return (
    <section id="lines" aria-labelledby="lines-title" className="section-y cv-auto border-t border-line [--cv-h:1270px]">
      {header}
      <div className="edge-fade mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-4 no-scrollbar md:scroll-px-8 md:px-8">
        {panels.map((p, i) => (
          <div key={i} className="w-[88vw] shrink-0 snap-center md:w-[80vw]">
            {p}
          </div>
        ))}
      </div>
    </section>
  );
}

function Pinned({ header, children }: { header: ReactNode; children: ReactNode[] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0.04, 0.96], ['0%', `-${((children.length - 1) / children.length) * 100}%`]);
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  return (
    <section id="lines" ref={ref} aria-labelledby="lines-title" className="relative border-t border-line" style={{ height: `${children.length * 100 + 40}vh` }}>
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden pt-28">
        {header}
        <div className="relative mt-8 min-h-0 flex-1">
          <m.div className="flex h-full" style={{ x, width: `${children.length * 100}%` }}>
            {children.map((c, i) => (
              <div key={i} className="h-full w-full px-8 pb-10 xl:px-14" style={{ width: `${100 / children.length}%` }}>
                {c}
              </div>
            ))}
          </m.div>
        </div>
        <div className="container-x pb-6">
          <div className="h-px w-full bg-line">
            <m.div className="h-px bg-accent" style={{ width: bar }} />
          </div>
        </div>
      </div>
    </section>
  );
}
