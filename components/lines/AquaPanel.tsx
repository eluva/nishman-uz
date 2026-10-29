'use client';

import { AnimatePresence, m } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { useAddToCart } from '@/components/catalog/useAddToCart';
import { HoldDots } from '@/components/ui/HoldDots';
import { Icon } from '@/components/ui/Icon';
import type { Product } from '@/lib/catalog/types';
import { formatVolumes } from '@/lib/format';
import { EASE } from '@/lib/motion';
import { useFilters } from '@/lib/store/ui';

/** (а) Aqua Hair Wax: 7 цветных банок 01–07; выбор меняет подсветку фона, аромат и объёмы */
export function AquaPanel({ products }: { products: Product[] }) {
  const t = useTranslations();
  const [active, setActive] = useState(0);
  const p = products[active];
  const apply = useFilters((s) => s.apply);
  const add = useAddToCart();
  const img = useRef<HTMLImageElement>(null);

  return (
    <article className="relative flex h-full min-h-[34rem] flex-col overflow-hidden rounded-[1.5rem] bg-surface ring-1 ring-line lg:grid lg:grid-cols-[1fr_1.15fr]">
      {/* цветная подсветка: радиальная маска + плавная смена background-color (без filter) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 transition-[background-color] duration-[1200ms] ease-lux"
          style={{ backgroundColor: `color-mix(in oklab, ${p.swatch ?? '#ffc72c'} 32%, transparent)`, maskImage: 'radial-gradient(60% 55% at 68% 55%, #000, transparent)' }}
        />
      </div>

      <div className="relative z-10 flex flex-col p-6 lg:p-12">
        <p className="font-display text-xs font-bold uppercase tracking-[0.24em] text-accent">{p.lineName}</p>
        <p className="mt-4 max-w-sm text-bone/75">{t('lines.aqua.text')}</p>
        <AnimatePresence mode="wait" initial={false}>
          <m.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.7, ease: EASE }} className="mt-8 lg:mt-auto">
            <p className="display text-[clamp(2.75rem,6.5vw,5rem)] !leading-none">
              <span className="text-bone/45">{p.code}</span> {p.name}
            </p>
            <div className="mt-5 space-y-3">
              <p>
                <span className="label !mb-1">{t('lines.aqua.scent')}</span>
                <span className="text-lg">{p.scent}</span>
              </p>
              <p className="flex flex-wrap gap-1.5">
                <span className="pill !bg-raised">{formatVolumes(p.volumes)}</span>
                <HoldDots hold={p.hold} className="!bg-raised" />
              </p>
            </div>
          </m.div>
        </AnimatePresence>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={() => add(p, p.volumes[p.volumes.length - 1].value, null, img.current)} className="btn btn-accent">
            <Icon name="plus" size={18} />
            {t('product.addToCart')}
          </button>
          <button type="button" onClick={() => apply({ line: 'aqua-wax' })} className="btn btn-ghost">
            {t('lines.cta')}
          </button>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-between p-6 pt-0 lg:p-12">
        <div className="relative mx-auto aspect-[3/2] w-full max-w-[34rem] flex-1">
          <AnimatePresence mode="popLayout" initial={false}>
            <m.div
              key={p.id}
              className="absolute inset-0"
              initial={{ opacity: 0, y: 24, rotate: -4 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -16, rotate: 3 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <Image ref={img} src={p.image.src} alt={`${p.code} ${p.name}`} fill sizes="(min-width: 1024px) 34rem, 80vw" quality={85} className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]" />
            </m.div>
          </AnimatePresence>
        </div>
        <div role="radiogroup" aria-label={p.lineName} className="mt-6 grid grid-cols-7 gap-1.5">
          {products.map((x, i) => (
            <button
              key={x.id}
              type="button"
              role="radio"
              aria-checked={i === active}
              aria-label={`${x.code} ${x.name}`}
              onClick={() => setActive(i)}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
              className={`group relative flex aspect-square min-h-11 flex-col items-center justify-center rounded-xl transition-[background-color,box-shadow] duration-500 ${
                i === active ? 'bg-raised ring-1 ring-bone/40' : 'hover:bg-raised/60'
              }`}
            >
              <span className="relative h-2/3 w-4/5">
                <Image src={x.image.src} alt="" fill sizes="64px" quality={60} className="object-contain" />
              </span>
              <span className={`text-[0.62rem] font-bold ${i === active ? 'text-accent' : 'text-muted'}`}>{x.code}</span>
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}
