'use client';

import { useTranslations } from 'next-intl';
import type { Effect, Line, SortKey } from '@/lib/catalog/types';
import { useFilters } from '@/lib/store/ui';
import { effectKey } from './useAddToCart';

const EFFECTS: Effect[] = ['matte', 'semi-matte', 'natural', 'natural-shine'];
const SORTS: { key: SortKey; label: string }[] = [
  { key: 'default', label: 'default' },
  { key: 'price-asc', label: 'priceAsc' },
  { key: 'price-desc', label: 'priceDesc' },
  { key: 'hold-desc', label: 'holdDesc' },
  { key: 'name', label: 'name' },
];

export interface VolumeOption {
  value: number;
  label: string;
}

const chip = (on: boolean) =>
  `inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-[0.75rem] font-medium transition-[background-color,color,box-shadow] duration-500 ease-lux ${
    on ? 'bg-bone text-ink' : 'text-bone/80 ring-1 ring-inset ring-line hover:ring-bone/50'
  }`;

function Group({ sheet, label, children }: { sheet: boolean; label: string; children: React.ReactNode }) {
  if (!sheet) return <>{children}</>;
  return (
    <fieldset className="border-b border-line px-5 py-5">
      <legend className="label float-left mb-3 w-full">{label}</legend>
      <div className="clear-both flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

/** Набор фильтров: линейка, эффект, фиксация 1–5, объём, «Для салонов», сортировка */
export function FilterControls({ lines, volumes, layout }: { lines: Line[]; volumes: VolumeOption[]; layout: 'bar' | 'sheet' }) {
  const t = useTranslations();
  const f = useFilters();
  const visibleLines = f.category ? lines.filter((l) => l.category === f.category) : lines;
  const sheet = layout === 'sheet';

  const select = 'field !min-h-11 !rounded-full !py-0 pr-9 text-sm appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat';
  const arrow = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%239b988f' stroke-width='1.5'/%3E%3C/svg%3E\")",
  };

  return (
    <div className={sheet ? '' : 'flex flex-wrap items-center gap-2'}>
      <Group sheet={sheet} label={t('filters.line')}>
        <label className={sheet ? 'w-full' : ''}>
          <span className="sr-only">{t('filters.line')}</span>
          <select
            value={f.line ?? ''}
            onChange={(e) => f.set({ line: e.target.value || null })}
            className={`${select} ${sheet ? 'w-full' : 'max-w-[13rem]'}`}
            style={arrow}
          >
            <option value="">{t('filters.allLines')}</option>
            {visibleLines.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
      </Group>

      <Group sheet={sheet} label={t('filters.effect')}>
        <div role="group" aria-label={t('filters.effect')} className="flex flex-wrap gap-2">
          {EFFECTS.map((e) => (
            <button key={e} type="button" aria-pressed={f.effect === e} onClick={() => f.set({ effect: f.effect === e ? null : e })} className={chip(f.effect === e)}>
              {t(`product.effects.${effectKey(e)}`)}
            </button>
          ))}
        </div>
      </Group>

      <Group sheet={sheet} label={t('product.hold')}>
        <div role="group" aria-label={t('product.hold')} className="flex items-center gap-1 rounded-full px-2 ring-1 ring-inset ring-line">
          {!sheet && <span className="pl-2 pr-1 text-[0.72rem] text-muted">{t('product.hold')}</span>}
          {[1, 2, 3, 4, 5].map((h) => (
            <button
              key={h}
              type="button"
              aria-pressed={f.hold === h}
              aria-label={t('product.holdValue', { value: h })}
              onClick={() => f.set({ hold: f.hold === h ? null : h })}
              className="group flex h-11 w-11 items-center justify-center"
            >
              <span className="flex flex-col items-center gap-1">
                <span className={`h-2.5 w-2.5 rounded-full transition-colors duration-500 ${f.hold != null && h <= f.hold ? 'bg-accent' : 'bg-bone/20 group-hover:bg-bone/50'}`} />
                <span className="text-[0.6rem] text-muted">{h}</span>
              </span>
            </button>
          ))}
        </div>
      </Group>

      <Group sheet={sheet} label={t('filters.volume')}>
        <label className={sheet ? 'w-full' : ''}>
          <span className="sr-only">{t('filters.volume')}</span>
          <select
            value={f.volume ?? ''}
            onChange={(e) => f.set({ volume: e.target.value ? Number(e.target.value) : null })}
            className={`${select} ${sheet ? 'w-full' : ''}`}
            style={arrow}
          >
            <option value="">
              {t('filters.volume')}: {t('filters.any')}
            </option>
            {volumes.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </label>
      </Group>

      <Group sheet={sheet} label={t('product.salonSize')}>
        <button type="button" aria-pressed={f.forSalons} onClick={() => f.set({ forSalons: !f.forSalons })} className={chip(f.forSalons)}>
          <span className={`h-2 w-2 rounded-full ${f.forSalons ? 'bg-accent' : 'bg-bone/30'}`} />
          {t('filters.forSalons')}
        </button>
      </Group>

      <Group sheet={sheet} label={t('filters.sort')}>
        <label className={sheet ? 'w-full' : 'lg:ml-auto'}>
          <span className="sr-only">{t('filters.sort')}</span>
          <select value={f.sort} onChange={(e) => f.set({ sort: e.target.value as SortKey })} className={`${select} ${sheet ? 'w-full' : ''}`} style={arrow}>
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {t(`filters.sortOptions.${s.label}`)}
              </option>
            ))}
          </select>
        </label>
      </Group>
    </div>
  );
}
