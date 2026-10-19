'use client';

import { useTranslations } from 'next-intl';
import { Icon } from '@/components/ui/Icon';
import { siteConfig } from '@/site.config';

/** Плавающие кнопки-иконки — только десктоп (на телефоне их роль у нижней панели) */
export function FloatingActions() {
  const t = useTranslations('common');
  const btn =
    'flex h-12 w-12 items-center justify-center rounded-full bg-surface/90 text-bone ring-1 ring-line backdrop-blur-md transition-[background-color,color,transform] duration-700 ease-lux hover:-translate-y-0.5 hover:bg-accent hover:text-ink';
  return (
    <div className="fixed bottom-8 right-8 z-[50] hidden flex-col gap-3 lg:flex">
      <a href={siteConfig.contacts.telegram} target="_blank" rel="noopener" aria-label="Telegram" className={btn}>
        <Icon name="telegram" />
      </a>
      <a href={siteConfig.contacts.phoneHref} aria-label={t('call')} className={btn}>
        <Icon name="phone" />
      </a>
    </div>
  );
}
