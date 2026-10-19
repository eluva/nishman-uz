import { useTranslations } from 'next-intl';
import { FadeIn } from '@/components/motion/FadeIn';
import { Magnetic } from '@/components/motion/Magnetic';
import { RevealImage } from '@/components/motion/RevealImage';
import { RevealText } from '@/components/motion/RevealText';
import { Icon } from '@/components/ui/Icon';
import type { ImageAsset } from '@/lib/catalog/types';
import { siteConfig } from '@/site.config';
import { QuestionForm } from './QuestionForm';

/** Финальный CTA + контакты (единственное место с полным номером, Telegram и Instagram) + форма вопроса */
export function Contacts({ ctaPhoto }: { ctaPhoto: ImageAsset }) {
  const t = useTranslations();
  const c = siteConfig.contacts;
  const cards = [
    { icon: 'phone' as const, label: t('contacts.phone'), value: c.phoneDisplay, href: c.phoneHref },
    { icon: 'telegram' as const, label: 'Telegram', value: c.telegramHandle, href: c.telegram, external: true },
    { icon: 'instagram' as const, label: 'Instagram', value: c.instagramHandle, href: c.instagram, external: true },
  ];

  return (
    <section id="contacts" aria-labelledby="contacts-title" className="cv-auto border-t border-line [--cv-h:1870px]">
      {/* Финальный CTA */}
      <div className="relative isolate overflow-hidden">
        <RevealImage image={ctaPhoto} alt={t('contacts.ctaAlt')} sizes="100vw" className="absolute inset-0 -z-10" imgClassName="object-[50%_30%] brightness-[0.45]" parallax={10} />
        <div className="container-x flex min-h-[80dvh] flex-col justify-end py-20 lg:min-h-[90dvh] lg:py-28">
          <RevealText lines={[t('contacts.ctaTitle')]} className="display max-w-[12ch] text-[clamp(3rem,11vw,10rem)]" />
          <FadeIn className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-md text-lg text-bone/80">{t('contacts.ctaText')}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <a href="#catalog" className="btn btn-accent">
                  {t('common.toCatalog')}
                  <Icon name="arrowRight" size={18} />
                </a>
              </Magnetic>
              <a href={c.telegram} target="_blank" rel="noopener" aria-label="Telegram" className="btn btn-ghost !px-0 w-12">
                <Icon name="telegram" />
              </a>
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="container-x section-y">
        <p className="eyebrow">{t('nav.contacts')}</p>
        <h2 id="contacts-title" className="display mt-5 text-[clamp(2.3rem,7.4vw,6.2rem)]">
          {t('contacts.title')}
        </h2>
        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          <ul className="grid content-start gap-3">
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
                    <span className="block truncate font-display text-xl font-extrabold lg:text-2xl">{card.value}</span>
                  </span>
                  <Icon name="arrowRight" size={18} className="ml-auto shrink-0 text-muted transition-transform duration-700 ease-lux group-hover:translate-x-1 group-hover:text-bone" />
                </a>
              </li>
            ))}
            <li className="flex min-h-20 items-center gap-5 rounded-[1.25rem] px-5 py-4 ring-1 ring-line">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-raised text-accent">
                <Icon name="clock" />
              </span>
              <span>
                <span className="block text-[0.7rem] uppercase tracking-[0.16em] text-muted">{t('contacts.hours')}</span>
                <span className="block font-display text-xl font-extrabold">{t('stores.daily', { open: siteConfig.hours.open, close: siteConfig.hours.close })}</span>
              </span>
            </li>
          </ul>
          <QuestionForm />
        </div>
      </div>
    </section>
  );
}
