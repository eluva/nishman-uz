'use client';

import { m, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { HeroMedia } from './HeroMedia';
import { Counter } from '@/components/motion/Counter';
import { Magnetic } from '@/components/motion/Magnetic';
import { RevealText } from '@/components/motion/RevealText';
import { Icon } from '@/components/ui/Icon';
import { useIsDesktop, useReducedMotionPref } from '@/components/providers/device';
import { siteConfig } from '@/site.config';

/** Hero: видео-фон, заголовок, «Creative Men Design», CTA, два счётчика (единственное место цифр бренда) */
export function Hero({ positions }: { positions: number }) {
  const t = useTranslations();
  const ref = useRef<HTMLElement>(null);
  const desktop = useIsDesktop();
  const reduced = useReducedMotionPref();
  // Уход контента считается от абсолютной прокрутки окна: в покое (scrollY = 0) — строго без блюра и прозрачности
  const { scrollY } = useScroll();
  const DIST = 620;
  const blurMax = reduced ? 0 : desktop ? 8 : 4;
  const opacity = useTransform(scrollY, [0, DIST], [1, 0], { clamp: true });
  const filter = useTransform(scrollY, (v) => (v < 4 || !blurMax ? 'none' : `blur(${Math.min(1, v / DIST) * blurMax}px)`));
  const y = useTransform(scrollY, [0, DIST], [0, reduced ? 0 : -60], { clamp: true });

  return (
    <section id="top" ref={ref} className="relative flex h-[100dvh] min-h-[600px] flex-col overflow-hidden">
      <HeroMedia />
      <m.div
        className="container-x relative z-10 flex flex-1 flex-col justify-end pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-24 lg:pb-16 lg:pr-28"
        style={{ opacity, filter, y }}
      >
        <p className="eyebrow fade-in-up text-bone/80" style={{ animationDelay: '0.2s' }}>
          {t('hero.eyebrow')}
        </p>
        <RevealText
          as="h1"
          immediate
          delay={0}
          lines={[t('hero.titleA'), t('hero.titleB')]}
          className="display mt-5 text-[clamp(2.9rem,min(9.6vw,15.5vh),9rem)]"
          accentIndex={1}
        />
        <div className="fade-in-up mt-6 grid gap-8 lg:mt-10 lg:grid-cols-[1fr_auto] lg:items-end" style={{ animationDelay: '0.75s' }}>
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.32em] text-accent">{siteConfig.brandFacts.slogan}</p>
            <p className="mt-3 max-w-md text-base text-bone/75 lg:text-lg">{t('hero.lead')}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Magnetic>
                <a href="#catalog" className="btn btn-accent">
                  {t('common.toCatalog')}
                  <Icon name="arrowRight" size={18} />
                </a>
              </Magnetic>
              <a href="#partners" className="link-u inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-[0.14em]">
                {t('nav.partners')}
              </a>
            </div>
          </div>
          <dl className="flex gap-10 lg:gap-14">
            <div>
              <dt className="sr-only">{t('hero.positions')}</dt>
              <dd className="display text-5xl text-bone lg:text-7xl">
                <Counter value={positions} suffix="+" />
              </dd>
              <dd aria-hidden="true" className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-muted">
                {t('hero.positions')}
              </dd>
            </div>
            <div>
              <dt className="sr-only">{t('hero.countries')}</dt>
              <dd className="display text-5xl text-bone lg:text-7xl">
                <Counter value={siteConfig.brandFacts.exportCountries} suffix="+" />
              </dd>
              <dd aria-hidden="true" className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-muted">
                {t('hero.countries')}
              </dd>
            </div>
          </dl>
        </div>
      </m.div>
      <a
        href="#about"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.66rem] uppercase tracking-[0.24em] text-bone/60 xl:flex"
      >
        <span>{t('hero.scroll')}</span>
        <span className="relative h-10 w-px overflow-hidden bg-bone/20">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-accent motion-safe:animate-[scrollcue_2.4s_cubic-bezier(0.22,1,0.36,1)_infinite]" />
        </span>
      </a>
    </section>
  );
}
