import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/site.config';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `${siteConfig.url}/${l}`]));
  return routing.locales.map((l) => ({
    url: `${siteConfig.url}/${l}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: l === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}
