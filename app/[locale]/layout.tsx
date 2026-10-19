import type { Metadata, Viewport } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { CartMount } from '@/components/cart/CartMount';
import { CustomCursor } from '@/components/global/CustomCursor';
import { FloatingActions } from '@/components/global/FloatingActions';
import { CartHydrator } from '@/components/global/FlyToCart';
import { MobileBar } from '@/components/global/MobileBar';
import { ScrollProgress } from '@/components/global/ScrollProgress';
import { Toast } from '@/components/global/Toast';
import { Header } from '@/components/header/Header';
import { MotionProvider } from '@/components/providers/MotionProvider';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/site.config';
import '../globals.css';

const interTight = Inter_Tight({
  subsets: ['latin', 'cyrillic'],
  weight: ['800', '900'],
  variable: '--font-inter-tight',
  display: 'swap',
  preload: true,
});
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
  preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#0B0B0C',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/** Пространства сообщений, которые используются только на сервере и не отправляются в браузер */
const SERVER_ONLY_MESSAGES = ['catalogData', 'meta', 'faq'];

const OG_LOCALE: Record<string, string> = { ru: 'ru_RU', uz: 'uz_UZ', en: 'en_US' };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `/${l}`]));
  return {
    metadataBase: new URL(siteConfig.url),
    title: t('title'),
    description: t('description'),
    applicationName: siteConfig.name,
    alternates: { canonical: `/${locale}`, languages: { ...languages, 'x-default': '/ru' } },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      title: t('title'),
      description: t('description'),
      url: `/${locale}`,
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [{ url: '/og.jpg', width: 1200, height: 630, alt: t('ogAlt') }],
    },
    twitter: { card: 'summary_large_image', title: t('title'), description: t('description'), images: ['/og.jpg'] },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'common' });
  // Клиенту — только UI-тексты: тексты каталога локализуются на сервере (CatalogProvider), FAQ/«О бренде» — серверные компоненты
  const clientMessages = Object.fromEntries(Object.entries(await getMessages()).filter(([ns]) => !SERVER_ONLY_MESSAGES.includes(ns)));

  return (
    <html lang={locale} className={`${interTight.variable} ${inter.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-ink">
          {t('skip')}
        </a>
        <NextIntlClientProvider messages={clientMessages}>
          <MotionProvider>
            <SmoothScroll />
            <CartHydrator />
            <ScrollProgress />
            <Header />
            {children}
            <MobileBar />
            <FloatingActions />
            <CartMount />
            <Toast />
            <CustomCursor />
          </MotionProvider>
        </NextIntlClientProvider>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
