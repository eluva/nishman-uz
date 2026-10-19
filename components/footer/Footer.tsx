import { useTranslations } from 'next-intl';
import { LangSwitch } from '@/components/header/LangSwitch';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { siteConfig } from '@/site.config';

/** Минимальный футер: логотип, навигация, язык, копирайт, «Наверх» */
export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();
  return (
    <footer className="cv-auto border-t border-line [--cv-h:560px] pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-0">
      <div className="container-x grid gap-10 py-14 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-16">
        <Logo full className="h-14 w-auto" />
        <nav aria-label={t('header.menu')}>
          <ul className="flex flex-wrap gap-x-7 gap-y-1">
            {siteConfig.nav.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className="link-u inline-flex min-h-11 items-center text-xs uppercase tracking-[0.16em] text-bone/75 hover:text-bone">
                  {t(`nav.${id}`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <LangSwitch />
      </div>
      <div className="container-x flex items-center justify-between gap-4 border-t border-line py-6 text-xs text-muted">
        <p>{t('footer.rights', { year })}</p>
        <a href="#top" className="inline-flex min-h-11 items-center gap-2 uppercase tracking-[0.16em] hover:text-bone">
          {t('footer.toTop')}
          <Icon name="arrowUp" size={16} />
        </a>
      </div>
    </footer>
  );
}
