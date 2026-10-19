import type { Product } from '@/lib/catalog/types';
import { siteConfig } from '@/site.config';

/** JSON-LD: Organization, LocalBusiness (точки), Product (по одному на линейку — без раздувания HTML) */
export function jsonLd({ locale, products, description }: { locale: string; products: Product[]; description: string }) {
  const url = siteConfig.url;
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}/#org`,
    name: siteConfig.name,
    url,
    logo: `${url}/media/brand/nishman-logo.svg`,
    description,
    telephone: siteConfig.contacts.phoneHref.replace('tel:', ''),
    sameAs: [siteConfig.contacts.instagram, siteConfig.contacts.telegram],
    areaServed: 'UZ',
    brand: { '@type': 'Brand', name: siteConfig.brand, slogan: siteConfig.brandFacts.slogan },
  };

  const [open, close] = [siteConfig.hours.open, siteConfig.hours.close];
  const stores = siteConfig.stores.map((s) => ({
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${url}/#store-${s.id}`,
    name: `${siteConfig.name} — ${s.id}`,
    parentOrganization: { '@id': `${url}/#org` },
    telephone: siteConfig.contacts.phoneHref.replace('tel:', ''),
    address: { '@type': 'PostalAddress', addressLocality: 'Tashkent', addressCountry: 'UZ' },
    geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lng },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: open,
        closes: close,
      },
    ],
  }));

  const seen = new Set<string>();
  const representative = products.filter((p) => (seen.has(p.line) ? false : (seen.add(p.line), true)));
  const items = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'NISHMAN',
    inLanguage: locale,
    itemListElement: representative.map((p, i) => {
      const prices = p.volumes.map((v) => v.price);
      return {
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: [p.type, p.name, p.code].filter(Boolean).join(' '),
          sku: p.id,
          brand: { '@type': 'Brand', name: siteConfig.brand },
          image: `${url}${p.image.src}`,
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'UZS',
            lowPrice: Math.min(...prices),
            highPrice: Math.max(...prices),
            offerCount: p.volumes.length,
            availability: 'https://schema.org/InStock',
          },
        },
      };
    }),
  };

  return [org, ...stores, items];
}
