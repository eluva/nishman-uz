'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

const LABEL: Record<string, string> = { ru: 'RU', uz: 'UZ', en: 'EN' };
const NAME: Record<string, string> = { ru: 'Русский', uz: 'O‘zbekcha', en: 'English' };

/** Переключатель языка: /ru /uz /en */
export function LangSwitch({ className, size = 'sm' }: { className?: string; size?: 'sm' | 'lg' }) {
  const locale = useLocale();
  const t = useTranslations('header');
  return (
    <nav aria-label={t('language')} className={`flex items-center ${className ?? ''}`}>
      {routing.locales.map((l) => (
        <Link
          key={l}
          href="/"
          locale={l}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? 'true' : undefined}
          title={NAME[l]}
          className={`flex min-h-11 min-w-11 items-center justify-center font-semibold tracking-[0.14em] transition-colors duration-500 ${
            size === 'lg' ? 'text-lg' : 'text-[0.72rem]'
          } ${l === locale ? 'text-accent' : 'text-muted hover:text-bone'}`}
        >
          {LABEL[l]}
        </Link>
      ))}
    </nav>
  );
}
