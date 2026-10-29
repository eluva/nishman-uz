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
  return <div className="mt-8 min-h-[22rem] rounded-[1.5rem] bg-surface ring-1 ring-line lg:mt-10 lg:min-h-[20rem]" aria-hidden="true" />;
}

/** Подбор укладки: заголовок рендерится сразу, сам квиз подгружается лениво */
export function QuizSection() {
  const t = useTranslations('quiz');
  return (
    <section id="quiz" aria-labelledby="quiz-title" className="section-y border-t border-line">
      <div className="container-x">
        <SectionHead label={t('label')} title={t('title')} id="quiz-title" />
        <LazyMount fallback={<QuizPlaceholder />}>
          <Quiz />
        </LazyMount>
      </div>
    </section>
  );
}
