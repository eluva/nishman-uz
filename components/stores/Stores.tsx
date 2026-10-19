'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState, useSyncExternalStore } from 'react';
import { LazyMount } from '@/components/global/LazyMount';
import { FadeIn } from '@/components/motion/FadeIn';
import { useFinePointer } from '@/components/providers/device';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Icon } from '@/components/ui/Icon';
import { SectionHead } from '@/components/ui/SectionHead';
import type { ImageAsset } from '@/lib/catalog/types';
import { isOpenNow } from '@/lib/hours';
import { siteConfig } from '@/site.config';

const StoresMap = dynamic(() => import('./StoresMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-surface" />,
});

/** «Открыто сейчас» по Asia/Tashkent; на сервере — неизвестно (null), обновляется раз в минуту */
const openStore = {
  subscribe(cb: () => void) {
    const id = window.setInterval(cb, 60_000);
    return () => window.clearInterval(id);
  },
  get: () => isOpenNow(),
  server: () => null,
};

export function Stores({ photos }: { photos: Record<string, ImageAsset> }) {
  const t = useTranslations();
  const [active, setActive] = useState<string>(siteConfig.stores[0].id);
  const [mapOn, setMapOn] = useState(false);
  const fine = useFinePointer();
  const open = useSyncExternalStore(openStore.subscribe, openStore.get, openStore.server);
  const { hours } = siteConfig;
  const mapStores = siteConfig.stores.map((s) => ({ id: s.id, lat: s.lat, lng: s.lng, name: t(`stores.items.${s.id}.name`) }));

  return (
    <section id="stores" aria-labelledby="stores-title" className="section-y cv-auto border-t border-line [--cv-h:2300px]">
      <div className="container-x">
        <SectionHead label={t('nav.stores')} title={t('stores.title')} id="stores-title" />

        <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-[1fr_1.15fr] lg:gap-6">
          {/* Карта: на телефоне — над списком */}
          <div className="relative isolate z-0 order-first h-[52vh] max-h-[26rem] overflow-hidden rounded-[1.5rem] ring-1 ring-line lg:order-last lg:h-auto lg:max-h-none lg:min-h-[36rem]">
            <LazyMount className="h-full" rootMargin="400px" fallback={<div className="h-full w-full bg-surface" />}>
              <div className="h-full" role="region" aria-label={t('stores.mapLabel')}>
                <StoresMap stores={mapStores} activeId={active} onSelect={setActive} interactive={fine || mapOn} />
              </div>
            </LazyMount>
            {!fine && !mapOn && (
              <button
                type="button"
                onClick={() => setMapOn(true)}
                className="absolute inset-0 z-[500] flex items-end justify-center bg-gradient-to-t from-ink/70 to-transparent pb-5"
              >
                <span className="flex min-h-11 items-center gap-2 rounded-full bg-ink/80 px-4 text-xs uppercase tracking-[0.14em] ring-1 ring-line backdrop-blur">
                  <Icon name="expand" size={16} />
                  {t('stores.mapHint')}
                </span>
              </button>
            )}
          </div>

          <ul className="grid gap-3">
            {siteConfig.stores.map((s) => {
              const on = active === s.id;
              const base = `stores.items.${s.id}` as const;
              return (
                <li key={s.id}>
                  <article
                    className={`grid grid-cols-[5.5rem_1fr] gap-4 rounded-[1.25rem] p-3 transition-[background-color,box-shadow] duration-700 ease-lux md:grid-cols-[8rem_1fr] ${
                      on ? 'bg-surface ring-1 ring-accent/60' : 'bg-surface/50 ring-1 ring-line'
                    }`}
                    onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(s.id)}
                  >
                    <button type="button" onClick={() => setActive(s.id)} aria-pressed={on} aria-label={t(`${base}.name`)} className="relative aspect-square overflow-hidden rounded-xl md:aspect-[4/5]">
                      <Image src={photos[s.id].src} alt="" fill sizes="(min-width: 768px) 128px, 88px" quality={65} className="photo-tone object-cover" />
                    </button>
                    <div className="flex min-w-0 flex-col py-1 pr-1">
                      <p className="flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.16em] text-muted">
                        {t(`stores.kinds.${s.kind}`)}
                        <DemoBadge demo={s.demo} />
                      </p>
                      <h3 className="mt-1 font-display text-lg font-extrabold uppercase">{t(`${base}.name`)}</h3>
                      <p className="mt-1 text-sm text-bone/75">{t(`${base}.address`)}</p>
                      <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                        <Icon name="clock" size={14} />
                        {t('stores.daily', { open: hours.open, close: hours.close })}
                        {open !== null && (
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.66rem] font-semibold ${open ? 'bg-accent/15 text-accent' : 'bg-line text-muted'}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-accent' : 'bg-muted'}`} />
                            {open ? t('stores.openNow') : t('stores.closedNow')}
                          </span>
                        )}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`}
                          target="_blank"
                          rel="noopener"
                          className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-xs font-semibold uppercase tracking-[0.1em] ring-1 ring-line transition-colors duration-500 hover:bg-raised"
                        >
                          <Icon name="route" size={16} />
                          {t('stores.route')}
                        </a>
                        <a href={siteConfig.contacts.phoneHref} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-xs font-semibold uppercase tracking-[0.1em] ring-1 ring-line transition-colors duration-500 hover:bg-raised">
                          <Icon name="phone" size={16} />
                          {t('common.call')}
                        </a>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Доставка — единственное место на сайте */}
        <FadeIn className="mt-16 lg:mt-24">
          <h3 className="display text-2xl lg:text-3xl">{t('stores.delivery.title')}</h3>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-[1.25rem] bg-line ring-1 ring-line md:grid-cols-3">
            {siteConfig.delivery.map((d, i) => (
              <li key={d.id} className="bg-ink p-6 lg:p-8">
                <span className="font-display text-xs font-bold tracking-[0.2em] text-accent">0{i + 1}</span>
                <h4 className="mt-3 flex items-center gap-2 font-display text-lg font-extrabold uppercase">
                  {t(`stores.delivery.items.${d.id}.title`)}
                  <DemoBadge demo={d.demo} />
                </h4>
                <p className="mt-2 text-bone/85">{t(`stores.delivery.items.${d.id}.time`)}</p>
                <p className="mt-1 text-sm text-muted">{t(`stores.delivery.items.${d.id}.text`)}</p>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
