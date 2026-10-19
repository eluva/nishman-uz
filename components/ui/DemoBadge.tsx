import { siteConfig } from '@/site.config';

/** Бейдж «DEMO» у придуманных записей — только при NEXT_PUBLIC_SHOW_DEMO=true (dev) */
export function DemoBadge({ demo, className }: { demo?: boolean; className?: string }) {
  if (!demo || !siteConfig.showDemo) return null;
  return (
    <span
      className={`inline-flex h-5 items-center rounded-sm bg-fuchsia-600 px-1.5 text-[10px] font-bold tracking-widest text-white ${className ?? ''}`}
      title="Демо-данные: заменить перед запуском"
    >
      DEMO
    </span>
  );
}
