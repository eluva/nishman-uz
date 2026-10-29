import { useTranslations } from 'next-intl';
import { HeroMedia } from './HeroMedia';
import { Counter } from '@/components/motion/Counter';
import { RevealText } from '@/components/motion/RevealText';
import { Icon } from '@/components/ui/Icon';
import { siteConfig } from '@/site.config';

/** Hero: видео-фон, заголовок, «Creative Men Design», CTA, два счётчика (единственное место цифр бренда) */
export function Hero({ positions }: { positions: number }) {
  const t = useTranslations();

  return (
    <section id="top" className="relative flex h-[100svh] min-h-[600px] flex-col overflow-hidden">
      <HeroMedia />
      <div className="container-x relative z-10 flex flex-1 flex-col justify-end pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-24 lg:pb-16 lg:pr-28">
        <p className="eyebrow fade-in-up text-bone/80" style={{ animationDelay: '0.05s' }}>
          {t('hero.eyebrow')}
        </p>
        <RevealText
          as="h1"
          immediate
          lines={[t('hero.titleA'), t('hero.titleB')]}
          delay={0.1}
          className="display mt-5 text-[clamp(2.75rem,min(9vw,14vh),6.5rem)] !leading-[1.02]"
          accentIndex={1}
        />
        <div className="fade-in-up mt-6 grid gap-8 lg:mt-10 lg:grid-cols-[1fr_auto] lg:items-end" style={{ animationDelay: '0.3s' }}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">{siteConfig.brandFacts.slogan}</p>
            <p className="mt-3 max-w-md text-base text-bone/75 lg:text-lg">{t('hero.lead')}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href="#catalog" className="btn btn-accent">
                {t('common.toCatalog')}
                <Icon name="arrowRight" size={18} />
              </a>
              <a href="#partners" className="inline-flex min-h-11 items-center">
                <span className="link-u text-[0.9375rem] font-medium">{t('nav.partners')}</span>
              </a>
            </div>
          </div>
          <dl className="flex gap-10 lg:gap-14">
            <div>
              <dt className="sr-only">{t('hero.positions')}</dt>
              <dd className="display text-5xl text-bone lg:text-6xl">
                <Counter value={positions} suffix="+" />
              </dd>
              <dd aria-hidden="true" className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-muted">
                {t('hero.positions')}
              </dd>
            </div>
            <div>
              <dt className="sr-only">{t('hero.countries')}</dt>
              <dd className="display text-5xl text-bone lg:text-6xl">
                <Counter value={siteConfig.brandFacts.exportCountries} suffix="+" />
              </dd>
              <dd aria-hidden="true" className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-muted">
                {t('hero.countries')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <a
        href="#about"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.66rem] uppercase tracking-[0.24em] text-bone/60 xl:flex"
      >
        <span>{t('hero.scroll')}</span>
        <span className="relative h-10 w-px overflow-hidden bg-bone/20">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-accent motion-safe:animate-[scrollcue_2.4s_cubic-bezier(0.22,1,0.36,1)_infinite]" />
        </span>
      </a>
    </section>
  );
}
