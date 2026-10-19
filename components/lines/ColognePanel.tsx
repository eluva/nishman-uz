'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useAddToCart } from '@/components/catalog/useAddToCart';
import { RevealImage } from '@/components/motion/RevealImage';
import { Icon } from '@/components/ui/Icon';
import type { ImageAsset, Product } from '@/lib/catalog/types';
import { useFilters } from '@/lib/store/ui';

/** (в) Стена ароматов: 12 одеколонов; hover/нажатие показывает название и быстрое «В корзину» */
export function ColognePanel({ products, photo }: { products: Product[]; photo: ImageAsset }) {
  const t = useTranslations();
  const apply = useFilters((s) => s.apply);
  const add = useAddToCart();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <article className="relative grid h-full min-h-[34rem] overflow-hidden rounded-[1.5rem] bg-surface ring-1 ring-line lg:grid-cols-[1.5fr_0.75fr]">
      <div className="flex flex-col p-6 lg:p-10">
        <h3 className="display text-3xl lg:text-5xl">{t('lines.cologne.title')}</h3>
        <p className="mt-3 max-w-lg text-bone/70">{t('lines.cologne.text')}</p>
        <ul className="mt-6 grid flex-1 grid-cols-3 gap-1.5 xs:grid-cols-4 lg:mt-8 lg:grid-cols-6 lg:gap-2">
          {products.map((p) => {
            const shown = open === p.id;
            return (
              <li key={p.id} className="relative">
                <div
                  className="group relative flex h-full min-h-[7.5rem] flex-col items-center justify-end overflow-hidden rounded-xl bg-raised pb-2 lg:min-h-[9.5rem]"
                  onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(p.id)}
                  onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(null)}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1/2 opacity-0 transition-opacity duration-700 group-hover:opacity-40"
                    style={{ background: `radial-gradient(60% 80% at 50% 100%, ${p.swatch}, transparent)` }}
                  />
                  <button
                    type="button"
                    aria-expanded={shown}
                    aria-label={`${p.code} ${p.name}`}
                    onClick={() => setOpen(shown ? null : p.id)}
                    className="relative h-[78%] w-full"
                  >
                    <Image
                      src={p.image.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 8vw, 20vw"
                      quality={70}
                      className="object-contain transition-transform duration-[1000ms] ease-lux group-hover:-translate-y-1 group-hover:scale-[1.04]"
                    />
                  </button>
                  <span className="relative text-[0.66rem] font-bold text-muted">{p.code}</span>

                  <div
                    className={`absolute inset-x-1 bottom-1 flex flex-col gap-1 rounded-lg bg-bone p-2 text-ink transition-[opacity,transform] duration-500 ease-lux ${
                      shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
                    }`}
                  >
                    <span className="truncate text-center font-display text-[0.7rem] font-extrabold uppercase">{p.name}</span>
                    <button
                      type="button"
                      tabIndex={shown ? 0 : -1}
                      onClick={(e) => add(p, undefined, null, e.currentTarget.closest('li')?.querySelector('img'))}
                      className="flex min-h-11 items-center justify-center gap-1 rounded-md bg-ink text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-bone"
                    >
                      <Icon name="plus" size={14} />
                      <span className="hidden xs:inline">{t('product.addToCart')}</span>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-6">
          <button type="button" onClick={() => apply({ line: 'cologne' })} className="btn btn-ghost">
            {t('lines.cta')}
          </button>
        </div>
      </div>
      <RevealImage image={photo} alt="" sizes="(min-width: 1024px) 25vw, 88vw" className="hidden h-full lg:block" cursor />
    </article>
  );
}
