import { useTranslations } from 'next-intl';
import { SectionHead } from '@/components/ui/SectionHead';

export const FAQ_KEYS = ['hold', 'types', 'apply', 'wash', 'storage', 'returns'] as const;

/** FAQ: 6 практических вопросов о продукте. Нативный <details> — доступно с клавиатуры и без JS. */
export function Faq() {
  const t = useTranslations('faq');
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y cv-auto border-t border-line [--cv-h:830px]">
      <div className="container-x grid gap-10 lg:grid-cols-12">
        <SectionHead label={t('label')} title={t('title')} id="faq-title" className="lg:col-span-5" titleClassName="!text-[clamp(2.3rem,5.4vw,4.8rem)]" />
        <div className="lg:col-span-7 lg:pt-12">
          {FAQ_KEYS.map((k, i) => (
            <details key={k} className="group border-b border-line first:border-t" name="faq">
              <summary className="flex min-h-16 cursor-pointer list-none items-center gap-5 py-5 [&::-webkit-details-marker]:hidden">
                <span className="font-display text-xs font-bold tracking-[0.2em] text-accent">0{i + 1}</span>
                <span className="flex-1 font-display text-lg font-bold uppercase leading-snug tracking-[-0.01em] lg:text-xl">{t(`items.${k}.q`)}</span>
                <span aria-hidden="true" className="relative h-4 w-4 shrink-0">
                  <span className="absolute left-0 top-1/2 h-px w-4 bg-bone" />
                  <span className="absolute left-1/2 top-0 h-4 w-px bg-bone transition-transform duration-700 ease-lux group-open:rotate-90 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="faq-body max-w-2xl pb-6 pl-10 leading-relaxed text-bone/75">{t(`items.${k}.a`)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
