import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ru', 'uz', 'en'],
  defaultLocale: 'ru',
  localePrefix: 'always',
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
