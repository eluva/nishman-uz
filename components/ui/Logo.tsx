import Image from 'next/image';

/** Логотип NISHMAN из PDF-каталога (вектор, белый на прозрачном) */
export function Logo({ full = false, className, alt = 'NISHMAN' }: { full?: boolean; className?: string; alt?: string }) {
  return full ? (
    <Image src="/media/brand/nishman-logo.svg" alt={alt} width={115} height={63} className={className} />
  ) : (
    <Image src="/media/brand/nishman-mark.svg" alt={alt} width={115} height={55} className={className} />
  );
}
