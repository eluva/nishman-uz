import { useTranslations } from 'next-intl';
import { RevealImage } from '@/components/motion/RevealImage';
import { RevealText } from '@/components/motion/RevealText';
import { FadeIn } from '@/components/motion/FadeIn';
import { photo } from '@/lib/photos';

// доставка — только в секции «Адреса»
const ADVANTAGES = ['original', 'barbers'] as const;

/** О бренде: история Asil Group (без цифр hero), фото, гигантский слоган, статус дистрибьютора, 3 преимущества */
export function About() {
  const t = useTranslations('about');
  const slogan = t('slogan').split('\n');
  return (
    <section id="about" aria-labelledby="about-title" className="section-y relative">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5 lg:pt-10">
            <h2 className="eyebrow" id="about-title">
              {t('label')}
            </h2>
            <FadeIn className="mt-8 space-y-5 text-lg leading-relaxed text-bone/80 lg:mt-12 lg:text-xl">
              <p>{t('p1')}</p>
              <p>{t('p2')}</p>
            </FadeIn>
          </div>
          <RevealImage
            image={photo('about-portrait')}
            alt={t('photoAlt')}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-[4/5] rounded-[1.25rem] lg:col-span-6 lg:col-start-7 lg:aspect-[5/6]"
            imgClassName="object-[50%_35%]"
          />
        </div>

        <figure className="mt-20 lg:mt-36">
          <RevealText
            as="blockquote"
            lines={slogan}
            className="display text-[clamp(2.25rem,7vw,6rem)] text-bone"
            accentIndex={slogan.length - 1}
          />
          <figcaption className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted">NISHMAN</figcaption>
        </figure>

        <FadeIn className="mt-20 border-t border-line pt-10 lg:mt-28">
          <p className="display max-w-3xl text-2xl lg:text-3xl">{t('distributor')}</p>
          <ul className="mt-10 grid gap-8 md:grid-cols-2 md:gap-0">
            {ADVANTAGES.map((k, i) => (
              <li key={k} className={`md:px-8 ${i === 0 ? 'md:pl-0' : 'md:border-l md:border-line'}`}>
                <span className="font-display text-xs font-bold tracking-[0.2em] text-accent">0{i + 1}</span>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em]">{t(`advantages.${k}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t(`advantages.${k}.text`)}</p>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
