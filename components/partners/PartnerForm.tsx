'use client';

import { AnimatePresence, m } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState, type FormEvent } from 'react';
import { Field, Honeypot, PhoneInput, TextArea, TextInput } from '@/components/forms/fields';
import { useLeadForm } from '@/components/forms/useLeadForm';
import { Icon } from '@/components/ui/Icon';
import { EASE } from '@/lib/motion';
import { normalizeUzPhone } from '@/lib/validation';

const TYPES = ['barbershop', 'salon', 'shop', 'other'] as const;

export function PartnerForm() {
  const t = useTranslations();
  const { status, setStatus, submit } = useLeadForm();
  const [v, setV] = useState({ business: '', type: '', city: '', phone: '', comment: '', website: '' });
  const [touched, setTouched] = useState(false);

  const errors = {
    business: v.business.trim().length < 2 ? t('forms.required') : null,
    type: !v.type ? t('forms.required') : null,
    city: v.city.trim().length < 2 ? t('forms.required') : null,
    phone: !normalizeUzPhone(v.phone) ? t('forms.phoneInvalid') : null,
  };
  const show = (k: keyof typeof errors) => (touched ? errors[k] : null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (Object.values(errors).some(Boolean)) {
      const first = (Object.keys(errors) as (keyof typeof errors)[]).find((k) => errors[k]);
      document.getElementById(`pf-${first}`)?.focus();
      return;
    }
    await submit({ kind: 'partner', ...v, phone: normalizeUzPhone(v.phone) });
  }

  return (
    <div className="relative rounded-[1.5rem] bg-surface p-5 ring-1 ring-line lg:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'success' ? (
          <m.div key="ok" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: EASE }} className="flex min-h-[26rem] flex-col items-start justify-center gap-4" role="status">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-ink">
              <Icon name="check" size={26} />
            </span>
            <p className="display text-4xl">{t('partners.form.successTitle')}</p>
            <p className="max-w-sm text-bone/70">{t('partners.form.successText')}</p>
            <button
              type="button"
              className="btn btn-ghost mt-4"
              onClick={() => {
                setV({ business: '', type: '', city: '', phone: '', comment: '', website: '' });
                setTouched(false);
                setStatus('idle');
              }}
            >
              {t('forms.again')}
            </button>
          </m.div>
        ) : (
          <m.form key="form" noValidate onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative grid gap-5">
            <h3 className="display text-2xl lg:text-3xl">{t('partners.form.title')}</h3>
            <Honeypot value={v.website} onChange={(website) => setV({ ...v, website })} />
            <Field id="pf-business" label={t('partners.form.business')} error={show('business')}>
              <TextInput id="pf-business" autoComplete="organization" value={v.business} onChange={(e) => setV({ ...v, business: e.target.value })} invalid={!!show('business')} />
            </Field>
            <fieldset>
              <legend className="label">{t('partners.form.type')}</legend>
              <div className="grid grid-cols-2 gap-2" id="pf-type" tabIndex={-1}>
                {TYPES.map((k) => (
                  <label
                    key={k}
                    className={`flex min-h-12 cursor-pointer items-center justify-center rounded-xl px-3 text-center text-sm transition-colors duration-500 ${
                      v.type === k ? 'bg-bone text-ink' : 'ring-1 ring-inset ring-line hover:ring-bone/40'
                    }`}
                  >
                    <input type="radio" name="type" value={k} checked={v.type === k} onChange={() => setV({ ...v, type: k })} className="sr-only" />
                    {t(`partners.form.types.${k}`)}
                  </label>
                ))}
              </div>
              {show('type') && <p role="alert" className="mt-1.5 text-xs text-[#ef7a62]">{show('type')}</p>}
            </fieldset>
            <div className="grid gap-5 md:grid-cols-2">
              <Field id="pf-city" label={t('partners.form.city')} error={show('city')}>
                <TextInput id="pf-city" autoComplete="address-level2" value={v.city} onChange={(e) => setV({ ...v, city: e.target.value })} invalid={!!show('city')} />
              </Field>
              <Field id="pf-phone" label={t('forms.phone')} error={show('phone')}>
                <PhoneInput id="pf-phone" value={v.phone} onChange={(phone) => setV({ ...v, phone })} invalid={!!show('phone')} />
              </Field>
            </div>
            <Field id="pf-comment" label={t('partners.form.comment')} optional>
              <TextArea id="pf-comment" value={v.comment} onChange={(e) => setV({ ...v, comment: e.target.value })} maxLength={1000} />
            </Field>
            {status === 'error' && (
              <p role="alert" className="rounded-xl bg-[#ef7a62]/10 px-4 py-3 text-sm text-[#ef9a86]">
                {t('forms.serverError')}
              </p>
            )}
            <button type="submit" className="btn btn-accent w-full md:w-auto md:justify-self-start" disabled={status === 'sending'}>
              {status === 'sending' ? t('forms.sending') : t('partners.form.submit')}
              <Icon name="arrowRight" size={18} />
            </button>
          </m.form>
        )}
      </AnimatePresence>
    </div>
  );
}
