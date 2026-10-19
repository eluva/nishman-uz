'use client';

import { AnimatePresence, m } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { effectKey } from '@/components/catalog/useAddToCart';
import { RevealImage } from '@/components/motion/RevealImage';
import { HoldDots } from '@/components/ui/HoldDots';
import type { ImageAsset, Product } from '@/lib/catalog/types';
import { EASE } from '@/lib/motion';
import { useFilters, useUi } from '@/lib/store/ui';

/** (б) Матовая линейка и Spider Wax на шкале фиксации 1–5 */
export function MattePanel({ products, photo }: { products: Product[]; photo: ImageAsset }) {
  const t = useTranslations();
  const apply = useFilters((s) => s.apply);
  const openQuickView = useUi((s) => s.openQuickView);
  const [focus, setFocus] = useState<Product>(products.find((p) => p.code === 'M2') ?? products[0]);
  const columns = [1, 2, 3, 4, 5].map((h) => products.filter((p) => p.hold === h));

  return (
    <article className="relative grid h-full min-h-[34rem] overflow-hidden rounded-[1.5rem] bg-surface ring-1 ring-line lg:grid-cols-[0.8fr_1.4fr]">
      <RevealImage image={photo} alt="" sizes="(min-width: 1024px) 30vw, 88vw" className="hidden h-full lg:block" cursor />
      <div className="flex flex-col p-6 lg:p-10">
        <h3 className="display text-3xl lg:text-5xl">{t('lines.matte.title')}</h3>
        <p className="mt-3 max-w-lg text-bone/70">{t('lines.matte.text')}</p>

        {/* шкала фиксации */}
        <div className="mt-6 grid flex-1 grid-cols-5 gap-1.5 lg:mt-8 lg:gap-2">
          {columns.map((col, i) => (
            <div key={i} className="flex flex-col">
              <div className="flex flex-1 flex-col-reverse justify-start gap-1.5">
                {col.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onPointerEnter={(e) => e.pointerType === 'mouse' && setFocus(p)}
                    onFocus={() => setFocus(p)}
                    onClick={() => (focus.id === p.id ? openQuickView(p.id) : setFocus(p))}
                    aria-label={`${p.code} ${p.name ?? p.type}`}
                    className={`flex min-h-11 items-center justify-center gap-1 rounded-lg px-1 text-[0.68rem] font-bold transition-colors duration-500 lg:justify-start lg:px-2 ${
                      focus.id === p.id ? 'bg-accent text-ink' : 'bg-raised text-bone/80 hover:bg-line'
                    }`}
                  >
                    <span className="relative hidden h-7 w-7 shrink-0 lg:block">
                      <Image src={p.image.src} alt="" fill sizes="28px" quality={50} className="object-contain" />
                    </span>
                    {p.code}
                  </button>
                ))}
              </div>
              <div className="mt-2 border-t border-line pt-2 text-center">
                <span className="font-display text-lg font-extrabold">{i + 1}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[0.66rem] uppercase tracking-[0.18em] text-muted">
          <span>{t('lines.matte.soft')}</span>
          <span>{t('lines.matte.hard')}</span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={focus.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-6 flex items-center gap-4 rounded-2xl bg-raised p-3"
          >
            <span className="relative h-16 w-20 shrink-0 rounded-xl bg-tile">
              <Image src={focus.image.src} alt="" fill sizes="80px" quality={60} className="object-contain p-1.5" />
            </span>
            <span className="min-w-0">
              <span className="block text-xs text-muted">
                {focus.lineName} · {focus.type}
              </span>
              <span className="block truncate font-display font-extrabold uppercase">
                {focus.code} {focus.name}
              </span>
              <span className="mt-1 flex flex-wrap gap-1">
                {focus.effect && <span className="pill !bg-ink">{t(`product.effects.${effectKey(focus.effect)}`)}</span>}
                <HoldDots hold={focus.hold} className="!bg-ink" label={false} />
              </span>
            </span>
          </m.div>
        </AnimatePresence>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          <button type="button" onClick={() => apply({ line: 'matte' })} className="btn btn-ghost">
            {t('lines.cta')}
          </button>
          <button type="button" onClick={() => apply({ line: 'spider-wax' })} className="link-u inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-[0.12em]">
            Spider Wax →
          </button>
        </div>
      </div>
    </article>
  );
}
