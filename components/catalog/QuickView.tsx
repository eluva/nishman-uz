'use client';

import { AnimatePresence, m } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { Sheet } from '@/components/global/Sheet';
import { HoldDots } from '@/components/ui/HoldDots';
import { Price } from '@/components/ui/Price';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Icon } from '@/components/ui/Icon';
import type { Product } from '@/lib/catalog/types';
import { formatVolume } from '@/lib/format';
import { EASE } from '@/lib/motion';
import { useUi } from '@/lib/store/ui';
import { siteConfig } from '@/site.config';
import { effectKey, productTitle, useAddToCart } from './useAddToCart';

interface Props {
  open: boolean;
  product: Product;
  related: Product[];
  onClose: () => void;
}

export function QuickView({ open, product, related, onClose }: Props) {
  // ключ сбрасывает выбор объёма/оттенка при смене товара
  return (
    <Sheet open={open} onClose={onClose} title={productTitle(product)} desktop="dialog" footer={<Footer key={product.id} product={product} />}>
      <Body key={product.id} product={product} related={related} />
    </Sheet>
  );
}

/** Выбор объёма/оттенка — общий для тела и липкого футера */
const useSelection = create<{ volume: number; shade: string | null }>()(() => ({ volume: 0, shade: null }));
const setSelection = (next: Partial<{ volume: number; shade: string | null }>) => useSelection.setState(next);

function useResetSelection(product: Product) {
  useEffect(() => {
    useSelection.setState({ volume: product.volumes[0].value, shade: product.shades[0]?.id ?? null });
  }, [product]);
}

function Body({ product: p, related }: { product: Product; related: Product[] }) {
  const t = useTranslations();
  const sel = useSelection();
  useResetSelection(p);
  const openQuickView = useUi((s) => s.openQuickView);
  const images = [p.image, ...p.gallery];
  const [index, setIndex] = useState(0);
  const current = images[index];
  const isPackshot = index === 0 || current.src.includes('/products/');

  return (
    <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      {/* Галерея */}
      <div className="bg-tile p-4 text-tile-ink lg:p-6">
        <div className="relative aspect-square overflow-hidden rounded-xl lg:aspect-[4/5]">
          {p.code && (
            <span aria-hidden="true" className="pointer-events-none absolute -right-2 bottom-0 font-display text-[9rem] font-black leading-none tracking-[-0.06em] text-ghost lg:text-[13rem]">
              {p.code.length > 4 ? p.code.slice(-3) : p.code}
            </span>
          )}
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={current.src}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <Image
                src={current.src}
                alt={`${p.type} ${p.name ?? ''}`.trim()}
                fill
                sizes="(min-width: 1024px) 520px, 100vw"
                quality={85}
                className={isPackshot ? 'object-contain p-[12%]' : 'photo-tone rounded-xl object-cover'}
              />
            </m.div>
          </AnimatePresence>
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar" role="tablist">
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${i + 1} / ${images.length}`}
                onClick={() => setIndex(i)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white/60 transition-shadow duration-500 ${i === index ? 'ring-2 ring-tile-ink' : 'ring-1 ring-tile-ink/10'}`}
              >
                <Image src={img.src} alt="" fill sizes="64px" quality={60} className={img.src.includes('/products/') ? 'object-contain p-1.5' : 'object-cover'} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Описание */}
      <div className="flex flex-col gap-6 p-5 lg:p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            {p.lineName}
            {p.code && <span className="ml-2 text-accent">{t('product.code')} {p.code}</span>}
          </p>
          <p className="mt-3 text-sm text-bone/70">{p.type}</p>
          <h3 className="display mt-1 text-3xl lg:text-4xl">{productTitle(p)}</h3>
          {p.scent && <p className="mt-2 text-bone/70">{p.scent}</p>}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {p.effect && <span className="pill !bg-raised">{t(`product.effects.${effectKey(p.effect)}`)}</span>}
            <HoldDots hold={p.hold} plus={p.holdPlus} className="!bg-raised" />
            {p.notes.map((n) => (
              <span key={n} className="pill !bg-raised">
                {n}
              </span>
            ))}
          </div>
        </div>

        <VolumePicker product={p} selected={sel.volume} label={t('filters.volume')} />

        {p.shades.length > 0 && (
          <fieldset>
            <legend className="label">{t('product.shade')}</legend>
            <div className="flex flex-wrap gap-2">
              {p.shades.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={sel.shade === s.id}
                  onClick={() => {
                    setSelection({ shade: s.id });
                    // у оттенка своё фото — показываем его в галерее
                    const shot = s.image ? images.findIndex((img) => img.src === s.image?.src) : -1;
                    if (shot >= 0) setIndex(shot);
                  }}
                  className={`min-h-11 rounded-full px-4 text-sm transition-colors duration-500 ${
                    sel.shade === s.id ? 'bg-bone text-ink' : 'ring-1 ring-inset ring-line hover:ring-bone/50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {p.size && (
          <p className="text-sm text-bone/70">
            <span className="label !mb-1">{t('product.size')}</span>
            {p.size}
          </p>
        )}

        {p.features.length > 0 && (
          <div>
            <h4 className="label">{t('product.properties')}</h4>
            <ul className="space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex gap-3 text-[0.95rem] leading-snug text-bone/85">
                  <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {related.length > 0 && (
          <div>
            <h4 className="label">{t('product.fromLine')}</h4>
            <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 no-scrollbar">
              {related.slice(0, 10).map((r) => (
                <li key={r.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => openQuickView(r.id)}
                    className="flex w-24 flex-col items-center gap-1.5 rounded-xl bg-tile p-2 text-tile-ink transition-transform duration-700 ease-lux hover:-translate-y-0.5"
                    aria-label={`${r.code ?? ''} ${productTitle(r)}`.trim()}
                  >
                    <span className="relative h-16 w-full">
                      <Image src={r.image.src} alt="" fill sizes="96px" quality={60} className="object-contain" />
                    </span>
                    <span className="w-full truncate text-center text-[0.68rem] font-semibold uppercase">{r.code ?? productTitle(r)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <a href={siteConfig.contacts.telegram} target="_blank" rel="noopener" className="link-u inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold uppercase tracking-[0.12em]">
          <Icon name="telegram" size={18} />
          {t('product.orderTelegram')}
        </a>
      </div>
    </div>
  );
}

function VolumePicker({ product: p, selected, label }: { product: Product; selected: number; label: string }) {
  const t = useTranslations('product');
  if (p.volumes.length < 2 && p.volumes[0].unit === 'pcs') return null;
  return (
    <div>
    <p className="label">{label}</p>
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {p.volumes.map((v) => {
        const on = v.value === selected;
        return (
          <button
            key={v.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => setSelection({ volume: v.value })}
            className={`flex min-h-14 min-w-[5.5rem] flex-col items-start justify-center rounded-2xl px-4 py-2 text-left transition-colors duration-500 ${
              on ? 'bg-bone text-ink' : 'ring-1 ring-inset ring-line hover:ring-bone/50'
            }`}
          >
            <span className="text-sm font-semibold">{formatVolume(v.value, v.unit)}</span>
            <Price value={v.price} className={`text-xs ${on ? 'text-ink/70' : 'text-muted'}`} />
            {p.forSalons.includes(v.value) && <span className={`mt-0.5 text-[0.6rem] uppercase tracking-[0.12em] ${on ? 'text-ink/60' : 'text-accent'}`}>{t('salonSize')}</span>}
          </button>
        );
      })}
    </div>
    </div>
  );
}

function Footer({ product: p }: { product: Product }) {
  const t = useTranslations('product');
  const sel = useSelection();
  const add = useAddToCart();
  const vol = p.volumes.find((v) => v.value === sel.volume) ?? p.volumes[0];
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <m.span key={vol.price} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.5, ease: EASE }}>
            <Price value={vol.price} className="display text-2xl" />
          </m.span>
        </AnimatePresence>
        <DemoBadge demo={vol.demo} className="self-start" />
      </div>
      <button
        type="button"
        className="btn btn-accent flex-1 lg:flex-none lg:px-10"
        onClick={() => {
          const img = document.querySelector<HTMLElement>('[role="dialog"] img');
          add(p, vol.value, sel.shade, img);
        }}
      >
        <Icon name="plus" size={18} />
        {t('addToCart')}
      </button>
    </div>
  );
}
