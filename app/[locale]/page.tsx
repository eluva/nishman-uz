import { Suspense } from 'react';
import { preload } from 'react-dom';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { About } from '@/components/about/About';
import { Catalog } from '@/components/catalog/Catalog';
import { CatalogData } from '@/components/catalog/CatalogData';
import { Contacts } from '@/components/contacts/Contacts';
import { Faq } from '@/components/faq/Faq';
import { Footer } from '@/components/footer/Footer';
import { Hero } from '@/components/hero/Hero';
import { Lines } from '@/components/lines/Lines';
import { Lookbook } from '@/components/lookbook/Lookbook';
import { Partners } from '@/components/partners/Partners';
import { QuizSection } from '@/components/quiz/QuizSection';
import { Reviews } from '@/components/reviews/Reviews';
import { Stores } from '@/components/stores/Stores';
import { getLocalizedCatalog } from '@/lib/catalog';
import { compactCatalog } from '@/lib/catalog/compact';
import { photo } from '@/lib/photos';
import { jsonLd } from '@/lib/seo';
import { siteConfig } from '@/site.config';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { products, categories, lines } = await getLocalizedCatalog(locale);
  const t = await getTranslations({ locale });

  // LCP: постер hero (арт-дирекшн телефон/десктоп)
  preload('/media/video/hero-poster-mobile.avif', { as: 'image', type: 'image/avif', media: '(max-width: 767px), (orientation: portrait)', fetchPriority: 'high' });
  preload('/media/video/hero-poster-desktop.avif', { as: 'image', type: 'image/avif', media: '(min-width: 768px) and (orientation: landscape)', fetchPriority: 'high' });

  const sku = products.reduce((n, p) => n + Math.max(1, p.shades.length) * p.volumes.length, 0);
  const positions = Math.floor(sku / 50) * 50; // «150+»

  const categoryPhotos = Object.fromEntries(Object.entries(siteConfig.categoryPhotos).map(([k, v]) => [k, photo(v)]));
  const storePhotos = Object.fromEntries(siteConfig.stores.map((s) => [s.id, photo(s.photo)]));

  const ld = jsonLd({ locale, products, description: t('meta.description') });

  return (
    <>
      {/* Каталог передаётся клиенту один раз; Suspense-границы дробят гидратацию на части (меньше TBT) */}
      <CatalogData data={compactCatalog(products)}>
        <main id="main">
          <Hero positions={positions} />
          <About />
          <Suspense fallback={null}>
            <Catalog categories={categories} lines={lines} categoryPhotos={categoryPhotos} />
          </Suspense>
          <Suspense fallback={null}>
            <QuizSection />
          </Suspense>
          <Suspense fallback={null}>
            <Lines photos={{ cologne: photo('lines-cologne') }} />
          </Suspense>
          <Suspense fallback={null}>
            <Partners photo={photo('partners-salon')} />
          </Suspense>
          <Suspense fallback={null}>
            <Reviews />
          </Suspense>
          <Suspense fallback={null}>
            <Lookbook photos={siteConfig.lookbook.map(photo)} />
          </Suspense>
          <Suspense fallback={null}>
            <Stores photos={storePhotos} />
          </Suspense>
          <Faq />
          <Contacts ctaPhoto={photo('cta-dark')} />
        </main>
      </CatalogData>
      <Footer />
      {ld.map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
      ))}
    </>
  );
}
