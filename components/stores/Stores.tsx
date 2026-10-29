'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useSyncExternalStore } from 'react';
import { LazyMount } from '@/components/global/LazyMount';
import { FadeIn } from '@/components/motion/FadeIn';
import { useIsDesktop } from '@/components/providers/device';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Icon } from '@/components/ui/Icon';
import { SectionHead } from '@/components/ui/SectionHead';
import type { ImageAsset } from '@/lib/catalog/types';
import { isOpenNow } from '@/lib/hours';
import { siteConfig } from '@/site.config';

const MAP_LANG: Record<string, string> = { ru: 'ru_RU', uz: 'uz_UZ', en: 'en_US' };

/** Ссылка на виджет Яндекс Карт: метки всех точек; выбранная точка — в центре крупным планом */
function mapSrc(locale: string, active: string | null, desktop: boolean) {
  const { map, stores } = siteConfig;
  const pt = stores.map((s) => `${s.lng},${s.lat}`).join('~');
  const focus = stores.find((s) => s.id === active);
  const ll = focus ? `${focus.lng},${focus.lat}` : `${map.center.lng},${map.center.lat}`;
  const z = focus ? map.storeZoom : desktop ? map.zoom.desktop : map.zoom.mobile;
  return `${map.widget}?ll=${ll}&z=${z}&pt=${pt}&lang=${MAP_LANG[locale] ?? 'ru_RU'}`;
}

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
  const locale = useLocale();
  const desktop = useIsDesktop();
  // null — общий план со всеми точками; нажатие на точку из списка центрирует карту на ней
  const [active, setActive] = useState<string | null>(null);
  const open = useSyncExternalStore(openStore.subscribe, openStore.get, openStore.server);
  const { hours } = siteConfig;

  return (
    <section id="stores" aria-labelledby="stores-title" className="section-y border-t border-line">
      <div className="container-x">
        <SectionHead label={t('nav.stores')} title={t('stores.title')} id="stores-title" />

        <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-[1fr_1.15fr] lg:gap-6">
          {/* Карта: на телефоне — над списком. Обычный блок Яндекс Карт с подписями, без фильтров и оверлеев. Нажатие на фото точки — карта крупно на ней. */}
          <div className="relative order-first h-[24rem] overflow-hidden rounded-[1.5rem] bg-surface ring-1 ring-line md:h-[28rem] lg:order-last lg:h-auto lg:min-h-[36rem]">
            {/* iframe монтируется, только когда секция близко к экрану: скрипты Яндекса не мешают первой загрузке */}
            <LazyMount className="absolute inset-0" rootMargin="800px">
              <iframe
                src={mapSrc(locale, active, desktop)}
                title={t('stores.mapLabel')}
                loading="lazy"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </LazyMount>
          </div>

          <ul className="grid content-start gap-3">
            {siteConfig.stores.map((s) => {
              const on = active === s.id;
              const base = `stores.items.${s.id}` as const;
              return (
                <li key={s.id}>
                  <article
                    className={`grid grid-cols-[5.5rem_1fr] gap-4 rounded-[1.25rem] p-3 transition-[background-color,box-shadow] duration-700 ease-lux md:grid-cols-[8rem_1fr] ${
                      on ? 'bg-surface ring-1 ring-accent/60' : 'bg-surface/50 ring-1 ring-line'
                    }`}
                  >
                    <button type="button" onClick={() => setActive(on ? null : s.id)} aria-pressed={on} aria-label={t(`${base}.name`)} className="relative aspect-square overflow-hidden rounded-xl md:aspect-[4/5]">
                      <Image src={photos[s.id].src} alt="" fill sizes="(min-width: 768px) 128px, 88px" quality={65} className="photo-tone object-cover" />
                    </button>
                    <div className="flex min-w-0 flex-col py-1 pr-1">
                      <p className="flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.16em] text-muted">
                        {t(`stores.kinds.${s.kind}`)}
                        <DemoBadge demo={s.demo} />
                      </p>
                      <h3 className="mt-1 text-lg font-semibold tracking-[-0.015em]">{t(`${base}.name`)}</h3>
                      <p className="mt-1 text-sm text-bone/75">{t(`${base}.address`)}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href={`https://yandex.uz/maps/?rtext=~${s.lat},${s.lng}&rtt=auto`}
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
            {/* часы одни на все точки — одной строкой, а не в каждой карточке */}
            <li className="flex flex-wrap items-center gap-2 px-1 pt-1 text-sm text-muted">
              <Icon name="clock" size={16} />
              {t('stores.daily', { open: hours.open, close: hours.close })}
              {open !== null && (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ${open ? 'bg-accent/15 text-accent' : 'bg-line text-muted'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-accent' : 'bg-muted'}`} />
                  {open ? t('stores.openNow') : t('stores.closedNow')}
                </span>
              )}
            </li>
          </ul>
        </div>

        {/* Доставка — единственное место на сайте */}
        <FadeIn className="mt-16 lg:mt-24">
          <h3 className="display text-2xl lg:text-3xl">{t('stores.delivery.title')}</h3>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-[1.25rem] bg-line ring-1 ring-line md:grid-cols-3">
            {siteConfig.delivery.map((d, i) => (
              <li key={d.id} className="bg-ink p-6 lg:p-8">
                <span className="font-display text-xs font-bold tracking-[0.2em] text-accent">0{i + 1}</span>
                <h4 className="mt-3 flex items-center gap-2 text-lg font-semibold tracking-[-0.015em]">
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
