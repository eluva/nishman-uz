import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { Icon } from '@/components/ui/Icon';
import type { ImageAsset } from '@/lib/catalog/types';
import { siteConfig } from '@/site.config';

/** Финальный CTA + контакты (единственное место с полным номером, Telegram и Instagram). Фон CTA — статичный, без параллакса. */
export function Contacts({ ctaPhoto }: { ctaPhoto: ImageAsset }) {
  const t = useTranslations();
  const c = siteConfig.contacts;
  const cards = [
    { icon: 'phone' as const, label: t('contacts.phone'), value: c.phoneDisplay, href: c.phoneHref },
    { icon: 'telegram' as const, label: 'Telegram', value: c.telegramHandle, href: c.telegram, external: true },
    { icon: 'instagram' as const, label: 'Instagram', value: c.instagramHandle, href: c.instagram, external: true },
  ];

  return (
    <section id="contacts" aria-labelledby="contacts-title" className="border-t border-line">
      {/* Финальный CTA */}
      <div className="relative isolate overflow-hidden">
        <Image src={ctaPhoto.src} alt={t('contacts.ctaAlt')} fill sizes="100vw" quality={70} className="photo-tone -z-10 object-cover object-[50%_30%] brightness-[0.45]" />
        <div className="container-x flex min-h-[34rem] flex-col justify-end py-20 lg:min-h-[44rem] lg:py-28">
          <RevealText lines={[t('contacts.ctaTitle')]} className="display max-w-[14ch] text-[clamp(2.75rem,8vw,6.5rem)]" />
          <FadeIn className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-md text-lg text-bone/80">{t('contacts.ctaText')}</p>
            <div className="flex flex-wrap items-center gap-3">
              <a href="#catalog" className="btn btn-accent">
                {t('common.toCatalog')}
                <Icon name="arrowRight" size={18} />
              </a>
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="container-x section-y">
        <p className="eyebrow">{t('nav.contacts')}</p>
        <h2 id="contacts-title" className="display mt-5 text-[clamp(2.25rem,6vw,5rem)]">
          {t('contacts.title')}
        </h2>
        <ul className="mt-12 grid gap-3 lg:mt-16 lg:grid-cols-3 lg:gap-4">
          {cards.map((card) => (
            <li key={card.label}>
              <a
                href={card.href}
                {...(card.external ? { target: '_blank', rel: 'noopener' } : {})}
                className="group flex min-h-20 items-center gap-5 rounded-[1.25rem] bg-surface px-5 py-4 ring-1 ring-line transition-[box-shadow,background-color] duration-700 ease-lux hover:ring-accent/60"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-raised text-accent transition-colors duration-700 group-hover:bg-accent group-hover:text-ink">
                  <Icon name={card.icon} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.7rem] uppercase tracking-[0.16em] text-muted">{card.label}</span>
                  <span className="block truncate text-xl font-semibold tracking-[-0.02em] lg:text-2xl">{card.value}</span>
                </span>
                <Icon name="arrowRight" size={18} className="ml-auto shrink-0 text-muted transition-transform duration-700 ease-lux group-hover:translate-x-1 group-hover:text-bone" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
