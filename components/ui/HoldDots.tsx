import { useTranslations } from 'next-intl';

/** Точки фиксации ●●●●○ (+ для «5+»). hold = 0 — «Без фиксации». */
export function HoldDots({ hold, plus = false, label = true, className }: { hold: number | null; plus?: boolean; label?: boolean; className?: string }) {
  const t = useTranslations('product');
  if (hold == null) return null;
  if (hold === 0) return <span className={`pill ${className ?? ''}`}>{t('noHold')}</span>;
  return (
    <span className={`pill ${className ?? ''}`} role="img" aria-label={t('holdValue', { value: plus ? '5+' : hold })}>
      {label && <span aria-hidden="true">{t('hold')}</span>}
      <span aria-hidden="true" className="flex items-center gap-[3px]">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`h-[5px] w-[5px] rounded-full ${i <= hold ? 'bg-current' : 'ring-1 ring-current ring-inset opacity-70'}`} />
        ))}
        {plus && <span className="ml-0.5 text-[0.7rem] leading-none">+</span>}
      </span>
    </span>
  );
}
