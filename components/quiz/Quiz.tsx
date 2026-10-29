'use client';

import { AnimatePresence, m } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useCatalogData } from '@/components/catalog/CatalogData';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Icon } from '@/components/ui/Icon';
import type { Effect, Product } from '@/lib/catalog/types';
import { EASE } from '@/lib/motion';

type EffectAnswer = 'matte' | 'natural' | 'shine';
type Length = 'short' | 'medium' | 'long';

const EFFECT_MATCH: Record<EffectAnswer, { exact: Effect[]; near: Effect[] }> = {
  matte: { exact: ['matte'], near: ['semi-matte', 'natural'] },
  natural: { exact: ['natural', 'semi-matte'], near: ['matte', 'natural-shine'] },
  shine: { exact: ['natural-shine'], near: ['semi-matte'] },
};
/** Длина волос — мягкий тай-брейкер по типу линейки */
const LENGTH_LINES: Record<Length, string[]> = {
  short: ['matte', 'powder', 'aqua-wax'],
  medium: ['aqua-wax', 'spider-wax', 'matte', 'pomade'],
  long: ['styling-cream', 'pomade', 'spider-wax', 'seasalt'],
};

export function recommend(products: Product[], effect: EffectAnswer, hold: number, length: Length) {
  const scored = products
    .filter((p) => p.effect && p.hold && p.hold > 0)
    .map((p) => {
      const e = EFFECT_MATCH[effect];
      const effectScore = e.exact.includes(p.effect!) ? 10 : e.near.includes(p.effect!) ? 4 : 0;
      const holdScore = -Math.abs((p.hold! + (p.holdPlus ? 0.5 : 0)) - hold) * 3;
      const lengthScore = LENGTH_LINES[length].includes(p.line) ? 2 : 0;
      return { p, score: effectScore + holdScore + lengthScore };
    })
    .sort((a, b) => b.score - a.score);
  // разные линейки в тройке, если возможно
  const picked: Product[] = [];
  for (const { p } of scored) {
    if (picked.length === 3) break;
    if (!picked.some((x) => x.line === p.line)) picked.push(p);
  }
  for (const { p } of scored) {
    if (picked.length === 3) break;
    if (!picked.includes(p)) picked.push(p);
  }
  return picked;
}

export function Quiz() {
  const t = useTranslations('quiz');
  const { products: all } = useCatalogData();
  const products = useMemo(() => all.filter((p) => p.category === 'styling' && p.effect && p.hold), [all]);
  const tc = useTranslations('common');
  const [step, setStep] = useState(0);
  const [effect, setEffect] = useState<EffectAnswer | null>(null);
  const [hold, setHold] = useState<number | null>(null);
  const [length, setLength] = useState<Length | null>(null);
  const done = step === 3;
  const result = useMemo(
    () => (done && effect && hold && length ? recommend(products, effect, hold, length) : []),
    [done, effect, hold, length, products],
  );

  const steps = [
    {
      q: t('effectQ'),
      value: effect,
      options: (['matte', 'natural', 'shine'] as const).map((k) => ({ key: k, label: t(`effectA.${k}`), mark: null as number | null })),
      set: (k: string) => setEffect(k as EffectAnswer),
    },
    {
      q: t('holdQ'),
      value: hold == null ? null : String(hold),
      options: ([1, 2, 3, 4, 5] as const).map((k) => ({ key: String(k), label: t(`holdA.${k}`), mark: k as number | null })),
      set: (k: string) => setHold(Number(k)),
    },
    {
      q: t('lengthQ'),
      value: length,
      options: (['short', 'medium', 'long'] as const).map((k) => ({ key: k, label: t(`lengthA.${k}`), mark: null as number | null })),
      set: (k: string) => setLength(k as Length),
    },
  ];

  const choose = (k: string) => {
    steps[step].set(k);
    window.setTimeout(() => setStep((s) => Math.min(3, s + 1)), 380);
  };
  const restart = () => {
    setEffect(null);
    setHold(null);
    setLength(null);
    setStep(0);
  };

  return (
    <div className="relative mt-8 min-h-[22rem] overflow-hidden rounded-[1.5rem] bg-surface ring-1 ring-line lg:mt-10 lg:min-h-[20rem]">
      {/* прогресс */}
      <div className="flex items-center gap-4 border-b border-line px-5 py-4 lg:px-10">
        <div className="flex flex-1 gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-line">
              <m.span className="block h-full origin-left bg-accent" initial={false} animate={{ scaleX: step > i ? 1 : step === i ? 0.35 : 0 }} transition={{ duration: 0.9, ease: EASE }} />
            </span>
          ))}
        </div>
        <span className="text-xs uppercase tracking-[0.16em] text-muted" aria-live="polite">
          {done ? t('result') : t('step', { current: step + 1, total: 3 })}
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {!done ? (
          <m.fieldset
            key={step}
            className="grid content-start gap-5 px-5 py-6 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-12 lg:px-10 lg:py-10"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <legend className="sr-only">{steps[step].q}</legend>
            <p aria-hidden="true" className="display text-[clamp(1.875rem,5vw,3.5rem)]">
              {steps[step].q}
            </p>
            <div className="grid gap-2.5">
              {steps[step].options.map((o) => {
                const on = steps[step].value === o.key;
                return (
                  <button
                    key={o.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => choose(o.key)}
                    className={`group flex min-h-14 items-center justify-between gap-4 rounded-2xl px-5 py-3 text-left text-lg transition-[background-color,color,box-shadow] duration-500 ease-lux ${
                      on ? 'bg-accent text-ink' : 'ring-1 ring-inset ring-line hover:bg-raised hover:ring-bone/30'
                    }`}
                  >
                    <span>{o.label}</span>
                    {o.mark ? (
                      <span className="flex gap-1" aria-hidden="true">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span key={i} className={`h-2 w-2 rounded-full ${i <= o.mark! ? (on ? 'bg-ink' : 'bg-accent') : on ? 'bg-ink/25' : 'bg-bone/15'}`} />
                        ))}
                      </span>
                    ) : (
                      <Icon name="arrowRight" size={18} className="shrink-0 opacity-40 transition-[opacity,transform] duration-500 ease-lux group-hover:translate-x-1 group-hover:opacity-100" />
                    )}
                  </button>
                );
              })}
              {step > 0 && (
                <button type="button" onClick={() => setStep((s) => s - 1)} className="mt-2 inline-flex min-h-11 items-center gap-2 self-start text-sm text-muted hover:text-bone">
                  <Icon name="arrowLeft" size={16} />
                  {tc('back')}
                </button>
              )}
            </div>
          </m.fieldset>
        ) : (
          <m.div
            key="result"
            className="px-4 py-6 lg:px-10 lg:py-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <p className="display text-3xl lg:text-4xl">{t('result')}</p>
              <button type="button" onClick={restart} className="btn btn-ghost">
                {t('restart')}
              </button>
            </div>
            <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 no-scrollbar md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
              {result.map((p) => (
                <li key={p.id} className="w-[72%] shrink-0 snap-start md:w-auto">
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
