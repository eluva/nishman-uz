'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { LazyMount } from '@/components/global/LazyMount';
import { SectionHead } from '@/components/ui/SectionHead';

const Quiz = dynamic(() => import('./Quiz').then((mod) => mod.Quiz), {
  ssr: false,
  loading: () => <QuizPlaceholder />,
});

function QuizPlaceholder() {
  return <div className="mt-12 min-h-[calc(100dvh-14rem+49px)] md:min-h-[408px] lg:min-h-[389px] animate-pulse rounded-[1.5rem] bg-surface ring-1 ring-line lg:mt-16" aria-hidden="true" />;
}

/** Подбор укладки: заголовок рендерится сразу, сам квиз подгружается лениво */
export function QuizSection() {
  const t = useTranslations('quiz');
  return (
    <section id="quiz" aria-labelledby="quiz-title" className="section-y cv-auto border-t border-line [--cv-h:1000px]">
      <div className="container-x">
        <SectionHead label={t('label')} title={t('title')} id="quiz-title" />
        <LazyMount fallback={<QuizPlaceholder />}>
          <Quiz />
        </LazyMount>
      </div>
    </section>
  );
}
