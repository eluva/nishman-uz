import { RevealText } from '@/components/motion/RevealText';

/** Заголовок секции: тонкая жёлтая линия + метка, затем крупный заголовок с построчным появлением */
export function SectionHead({
  label,
  title,
  id,
  className,
  titleClassName,
  children,
}: {
  label: string;
  title: string | string[];
  id?: string;
  className?: string;
  titleClassName?: string;
  children?: React.ReactNode;
}) {
  const lines = Array.isArray(title) ? title : [title];
  return (
    <div className={className}>
      <p className="eyebrow">{label}</p>
      <RevealText
        lines={lines}
        className={`display mt-5 text-[clamp(2.3rem,7.4vw,6.2rem)] ${titleClassName ?? ''}`}
        id={id}
      />
      {children}
    </div>
  );
}
