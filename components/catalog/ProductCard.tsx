'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { memo, useRef } from 'react';
import { HoldDots } from '@/components/ui/HoldDots';
import { Price } from '@/components/ui/Price';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Icon } from '@/components/ui/Icon';
import type { Product } from '@/lib/catalog/types';
import { minPrice } from '@/lib/catalog/filter';
import { formatVolumes } from '@/lib/format';
import { useUi } from '@/lib/store/ui';
import { effectKey, productTitle, useAddToCart } from './useAddToCart';

/** Карточка: светлая плитка с призрачным кодом, пилюли объёмов/эффекта, точки фиксации, цена «от» */
function ProductCardBase({ product: p, priority }: { product: Product; priority?: boolean }) {
  const t = useTranslations('product');
  const add = useAddToCart();
  const openQuickView = useUi((s) => s.openQuickView);
  const img = useRef<HTMLImageElement>(null);
  const volumes = formatVolumes(p.volumes);
  const ghost = p.code ?? productTitle(p).charAt(0);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1rem] bg-tile text-tile-ink">
      <div className="relative aspect-[4/5] overflow-hidden">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 bottom-[-0.12em] select-none font-display text-[clamp(5.5rem,22vw,9rem)] font-black leading-none tracking-[-0.06em] text-ghost lg:text-[8.5rem]"
        >
          {ghost.length > 4 ? ghost.slice(-3) : ghost}
        </span>
        <div className="absolute left-3 right-3 top-3 z-10 flex flex-wrap gap-1.5">
          {volumes && <span className="pill">{volumes}</span>}
          {p.effect && <span className="pill hidden xs:inline-flex">{t(`effects.${effectKey(p.effect)}`)}</span>}
        </div>
        <Image
          ref={img}
          src={p.image.src}
          alt={`${p.type} ${p.name ?? ''} ${p.code ?? ''}`.trim()}
          width={p.image.width}
          height={p.image.height}
          sizes="(min-width: 1440px) 300px, (min-width: 1024px) 23vw, (min-width: 768px) 31vw, 46vw"
          priority={priority}
          quality={75}
          className="absolute inset-x-[10%] top-[18%] mx-auto h-[62%] w-[80%] object-contain transition-transform duration-[1200ms] ease-lux group-hover:scale-[1.04]"
        />
        <button
          type="button"
          onClick={() => openQuickView(p.id)}
          className="absolute inset-0 z-[5]"
          aria-label={t('quickView', { name: `${p.code ?? ''} ${productTitle(p)}`.trim() })}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-3 pb-3 pt-1 lg:px-4 lg:pb-4">
        <HoldDots hold={p.hold} plus={p.holdPlus} label={false} className="self-start" />
        <p className="text-[0.68rem] uppercase tracking-[0.12em] text-tile-ink/70">{p.type}</p>
        <h3 className="font-display text-[0.95rem] font-extrabold uppercase leading-tight tracking-[-0.01em] lg:text-base">
          {p.code && <span className="mr-1.5 text-tile-ink/60">{p.code}</span>}
          {productTitle(p)}
        </h3>
        {p.scent && <p className="text-xs text-tile-ink/70">{p.scent}</p>}
        {p.shades.length > 0 && <p className="text-xs text-tile-ink/70">{t('shades', { count: p.shades.length })}</p>}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <span className="flex flex-col">
            <Price value={minPrice(p)} from={p.volumes.length > 1} className="text-sm font-semibold" />
            <DemoBadge demo={p.volumes[0]?.demo} className="mt-1 self-start" />
          </span>
          <button
            type="button"
            onClick={() => (p.shades.length > 1 ? openQuickView(p.id) : add(p, undefined, null, img.current))}
            className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-tile-ink text-bone transition-colors duration-500 hover:bg-accent hover:text-ink lg:w-auto lg:gap-2 lg:px-4"
            aria-label={`${t('addToCart')}: ${productTitle(p)}`}
          >
            <Icon name="plus" size={18} />
            <span className="hidden text-[0.7rem] font-semibold uppercase tracking-[0.1em] lg:inline">{t('addToCart')}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardBase);

export function ProductCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-[1rem] bg-tile/10" aria-hidden="true">
      <div className="aspect-[4/5] bg-tile/10" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 rounded bg-tile/15" />
        <div className="h-4 w-2/3 rounded bg-tile/15" />
        <div className="h-4 w-1/2 rounded bg-tile/10" />
      </div>
    </div>
  );
}
