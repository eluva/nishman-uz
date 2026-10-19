import { useTranslations } from 'next-intl';
import { formatNumber } from '@/lib/format';

/** Цена в сумах. from — «от 35 000 сум» */
export function Price({ value, from = false, className }: { value: number; from?: boolean; className?: string }) {
  const t = useTranslations();
  const amount = `${formatNumber(value)} ${t('common.currency')}`;
  return <span className={className}>{from ? t('product.from', { price: amount }) : amount}</span>;
}
