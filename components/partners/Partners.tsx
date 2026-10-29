'use client';

import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealImage } from '@/components/motion/RevealImage';
import { DemoBadge } from '@/components/ui/DemoBadge';
import { Icon } from '@/components/ui/Icon';
import { SectionHead } from '@/components/ui/SectionHead';
import { useCatalogData } from '@/components/catalog/CatalogData';
import type { ImageAsset } from '@/lib/catalog/types';
import { formatNumber } from '@/lib/format';
import { useFilters } from '@/lib/store/ui';
import { siteConfig } from '@/site.config';
import { PartnerForm } from './PartnerForm';

const BENEFITS = ['price', 'manager', 'materials'] as const;

/** Партнёрам: профобъёмы, аксессуары для барберов, выгоды опта, условия (демо), форма заявки */
export function Partners({ photo }: { photo: ImageAsset }) {
  const t = useTranslations();
  const { products } = useCatalogData();
  const pro = products.filter((p) => p.forSalons.length > 0);
  const apply = useFilters((s) => s.apply);

  return (
    <section id="partners" aria-labelledby="partners-title" className="section-y border-t border-line">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <SectionHead label={t('nav.partners')} title={t('partners.title')} id="partners-title" />
            <p className="mt-6 max-w-xl text-lg text-bone/75">{t('partners.lead')}</p>
            <ul className="mt-10 space-y-4">
              {BENEFITS.map((k) => (
                <li key={k} className="flex items-start gap-4 border-t border-line pt-4">
                  <Icon name="check" size={20} className="mt-0.5 shrink-0 text-accent" />
                  <span className="text-lg">{t(`partners.benefits.${k}`)}</span>
                </li>
              ))}
            </ul>
          </div>
          <RevealImage
            image={photo}
            alt={t('partners.photoAlt')}
            sizes="(min-width: 1024px) 38vw, 100vw"
            className="aspect-[4/3] rounded-[1.25rem] lg:col-span-5 lg:aspect-auto"
            imgClassName="object-[60%_40%]"
          />
        </div>

        <div className="mt-16 grid gap-4 lg:mt-24 lg:grid-cols-2 lg:gap-6">
          <FadeIn className="rounded-[1.5rem] bg-surface p-6 ring-1 ring-line lg:p-10">
            <h3 className="display text-2xl lg:text-3xl">{t('partners.proTitle')}</h3>
            <p className="mt-3 text-bone/70">{t('partners.proText')}</p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {pro.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4 py-3">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold tracking-[-0.015em]">
                      {p.code && <span className="mr-2 text-muted">{p.code}</span>}
                      {p.name}
                    </span>
                    <span className="block truncate text-xs text-muted">{p.type}</span>
                  </span>
                  <span className="flex shrink-0 gap-1">
                    {p.forSalons.map((v) => (
                      <span key={v} className="pill !bg-accent !text-ink">
                        {v >= 1000 ? `${v / 1000} L` : `${v} ml`}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => apply({ forSalons: true })} className="btn btn-ghost mt-6">
              {t('partners.proCta')}
            </button>
          </FadeIn>
          <FadeIn delay={0.1} className="flex flex-col rounded-[1.5rem] bg-surface p-6 ring-1 ring-line lg:p-10">
            <h3 className="display text-2xl lg:text-3xl">{t('partners.toolsTitle')}</h3>
            <p className="mt-3 text-bone/70">{t('partners.toolsText')}</p>
            <div className="mt-auto pt-6">
              <button type="button" onClick={() => apply({ category: 'accessories' })} className="btn btn-ghost">
                {t('partners.toolsCta')}
              </button>
            </div>
          </FadeIn>
        </div>

        {/* Условия (демо) */}
        <FadeIn className="mt-16 lg:mt-24">
          <h3 className="display flex items-center gap-3 text-2xl lg:text-3xl">
            {t('partners.terms.title')}
            <DemoBadge demo />
          </h3>
          <div className="mt-6 overflow-hidden rounded-[1.25rem] ring-1 ring-line">
            <table className="w-full text-left text-sm">
              <thead className="hidden bg-surface text-[0.7rem] uppercase tracking-[0.14em] text-muted md:table-header-group">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">{t('partners.terms.format')}</th>
                  <th scope="col" className="px-6 py-4 font-medium">{t('partners.terms.minOrder')}</th>
                  <th scope="col" className="px-6 py-4 font-medium">{t('partners.terms.deferral')}</th>
                  <th scope="col" className="px-6 py-4 font-medium">{t('partners.terms.bonus')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {siteConfig.partnerTerms.map((row) => (
                  <tr key={row.id} className="grid grid-cols-2 gap-x-4 gap-y-3 p-5 md:table-row md:p-0">
                    <th scope="row" className="col-span-2 text-base font-semibold md:px-6 md:py-5 tracking-[-0.015em]">
                      {t(`partners.terms.rows.${row.id}.format`)}
                    </th>
                    <td className="md:px-6 md:py-5">
                      <span className="label !mb-0.5 md:hidden">{t('partners.terms.minOrder')}</span>
                      {formatNumber(row.minOrder)} {t('common.currency')}
                    </td>
                    <td className="md:px-6 md:py-5">
                      <span className="label !mb-0.5 md:hidden">{t('partners.terms.deferral')}</span>
                      {t(`partners.terms.rows.${row.id}.deferral`)}
                    </td>
                    <td className="col-span-2 text-bone/80 md:px-6 md:py-5">
                      <span className="label !mb-0.5 md:hidden">{t('partners.terms.bonus')}</span>
                      {t(`partners.terms.rows.${row.id}.bonus`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>

        <div className="mt-16 lg:mt-24">
          <PartnerForm />
        </div>
      </div>
    </section>
  );
}
