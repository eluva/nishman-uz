'use client';

import { AnimatePresence, m } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState, type FormEvent } from 'react';
import { Field, Honeypot, PhoneInput, TextArea, TextInput } from '@/components/forms/fields';
import { useLeadForm } from '@/components/forms/useLeadForm';
import { Icon } from '@/components/ui/Icon';
import { EASE } from '@/lib/motion';
import { normalizeUzPhone } from '@/lib/validation';

/** «Задайте вопрос» — валидация, honeypot, экран успеха */
export function QuestionForm() {
  const t = useTranslations();
  const { status, setStatus, submit } = useLeadForm();
  const [v, setV] = useState({ name: '', phone: '', message: '', website: '' });
  const [touched, setTouched] = useState(false);
  const errors = {
    name: v.name.trim().length < 2 ? t('forms.required') : null,
    phone: !normalizeUzPhone(v.phone) ? t('forms.phoneInvalid') : null,
    message: v.message.trim().length < 5 ? t('forms.required') : null,
  };
  const show = (k: keyof typeof errors) => (touched ? errors[k] : null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    const first = (Object.keys(errors) as (keyof typeof errors)[]).find((k) => errors[k]);
    if (first) {
      document.getElementById(`qf-${first}`)?.focus();
      return;
    }
    await submit({ kind: 'question', ...v, phone: normalizeUzPhone(v.phone) });
  }

  return (
    <div className="relative rounded-[1.5rem] bg-surface p-5 ring-1 ring-line lg:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <m.div key="ok" role="status" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: EASE }} className="flex min-h-[22rem] flex-col items-start justify-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-ink">
              <Icon name="check" size={26} />
            </span>
            <p className="display text-3xl">{t('contacts.success')}</p>
            <button
              type="button"
              className="btn btn-ghost mt-2"
              onClick={() => {
                setV({ name: '', phone: '', message: '', website: '' });
                setTouched(false);
                setStatus('idle');
              }}
            >
              {t('forms.again')}
            </button>
          </m.div>
        ) : (
          <m.form key="form" noValidate onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative grid gap-5">
            <h3 className="display text-2xl">{t('contacts.formTitle')}</h3>
            <Honeypot value={v.website} onChange={(website) => setV({ ...v, website })} />
            <div className="grid gap-5 md:grid-cols-2">
              <Field id="qf-name" label={t('forms.name')} error={show('name')}>
                <TextInput id="qf-name" autoComplete="given-name" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} invalid={!!show('name')} />
              </Field>
              <Field id="qf-phone" label={t('forms.phone')} error={show('phone')}>
                <PhoneInput id="qf-phone" value={v.phone} onChange={(phone) => setV({ ...v, phone })} invalid={!!show('phone')} />
              </Field>
            </div>
            <Field id="qf-message" label={t('contacts.message')} error={show('message')}>
              <TextArea id="qf-message" value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} invalid={!!show('message')} maxLength={1000} rows={4} />
            </Field>
            {status === 'error' && (
              <p role="alert" className="rounded-xl bg-[#ef7a62]/10 px-4 py-3 text-sm text-[#ef9a86]">
                {t('forms.serverError')}
              </p>
            )}
            <button type="submit" className="btn btn-accent w-full md:w-auto md:justify-self-start" disabled={status === 'sending'}>
              {status === 'sending' ? t('forms.sending') : t('contacts.submit')}
            </button>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}
