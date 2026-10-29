'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { AquaPanel } from './AquaPanel';
import { ColognePanel } from './ColognePanel';
import { MattePanel } from './MattePanel';
import { useCatalogData, usePick } from '@/components/catalog/CatalogData';
import { FadeIn } from '@/components/motion/FadeIn';
import type { ImageAsset } from '@/lib/catalog/types';
import { siteConfig } from '@/site.config';

interface Props {
  photos: { cologne: ImageAsset };
}

/** «Линейки»: телефон и планшет — свайп-карусель со snap, десктоп — панели друг под другом. Без привязки к прокрутке. */
export function Lines(props: Props) {
  const t = useTranslations('lines');
  const { products } = useCatalogData();
  const aqua = usePick(siteConfig.showcase.aqua);
  const colognes = usePick(siteConfig.showcase.colognes);
  const matte = useMemo(() => products.filter((p) => (siteConfig.showcase.matteLines as readonly string[]).includes(p.line)), [products]);
  const panels = [
    <AquaPanel key="aqua" products={aqua} />,
    <MattePanel key="matte" products={matte} />,
    <ColognePanel key="cologne" products={colognes} photo={props.photos.cologne} />,
  ];

  return (
    <section id="lines" aria-labelledby="lines-title" className="section-y border-t border-line">
      <div className="container-x">
        <p className="eyebrow">{t('label')}</p>
        <h2 id="lines-title" className="display mt-5 text-[clamp(2.25rem,6vw,5rem)]">
          {t('title')}
        </h2>
      </div>
      <div className="edge-fade mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-4 no-scrollbar md:scroll-px-8 md:px-8 lg:mx-auto lg:mt-14 lg:max-w-[1440px] lg:flex-col lg:gap-6 lg:overflow-visible lg:pb-0 lg:[mask-image:none] xl:px-14">
        {panels.map((p, i) => (
          <FadeIn key={i} className="w-[88vw] shrink-0 snap-center md:w-[80vw] lg:w-auto">
            {p}
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
