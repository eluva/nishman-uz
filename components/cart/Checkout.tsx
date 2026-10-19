'use client';

import { AnimatePresence, m } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Field, PhoneInput, TextArea, TextInput } from '@/components/forms/fields';
import { Icon } from '@/components/ui/Icon';
import { Price } from '@/components/ui/Price';
import type { DeliveryMethod, PaymentMethod } from '@/lib/catalog/types';
import { EASE } from '@/lib/motion';
import { selectTotal, useCart } from '@/lib/store/cart';
import { useUi } from '@/lib/store/ui';
import { normalizeUzPhone } from '@/lib/validation';
import { siteConfig } from '@/site.config';

const STEPS = ['contacts', 'delivery', 'payment', 'confirm'] as const;
const METHODS: DeliveryMethod[] = ['courier', 'regions', 'pickup'];
const PAYMENTS: PaymentMethod[] = ['click', 'payme', 'cash'];

type Done = { number: string; total: number; payUrl: string | null; online: boolean };

/** Оформление заказа по шагам. Позиции и цены проверяются на сервере (/api/order → CatalogProvider). */
export function Checkout() {
  const t = useTranslations();
  const locale = useLocale();
  const items = useCart((s) => s.items);
  const total = useCart(selectTotal);
  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const [v, setV] = useState({
    name: '',
    phone: '',
    method: 'courier' as DeliveryMethod,
    city: '',
    address: '',
    storeId: siteConfig.stores[0].id as string,
    payment: 'cash' as PaymentMethod,
    comment: '',
  });

  const errors: Record<string, string | null> = {
    name: v.name.trim().length < 2 ? t('forms.required') : null,
    phone: !normalizeUzPhone(v.phone) ? t('forms.phoneInvalid') : null,
    city: v.method === 'regions' && v.city.trim().length < 2 ? t('forms.required') : null,
    address: v.method !== 'pickup' && v.address.trim().length < 5 ? t('forms.required') : null,
  };
  const stepFields: string[][] = [['name', 'phone'], ['city', 'address'], [], []];
  const show = (k: string) => (touched ? errors[k] : null);

  const next = () => {
    setTouched(true);
    const bad = stepFields[step].find((k) => errors[k]);
    if (bad) {
      document.getElementById(`co-${bad}`)?.focus();
      return;
    }
    setTouched(false);
    setStep((s) => s + 1);
  };

  async function place() {
    setSending(true);
    setError(false);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: v.name, phone: normalizeUzPhone(v.phone) },
          delivery: {
            method: v.method,
            city: v.method === 'regions' ? v.city : 'Tashkent',
            address: v.method === 'pickup' ? undefined : v.address,
            storeId: v.method === 'pickup' ? v.storeId : undefined,
          },
          payment: v.payment,
          comment: v.comment,
          items: items.map((i) => ({ productId: i.productId, volume: i.volume, shade: i.shade, qty: i.qty })),
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error('order');
      setDone({ number: data.number, total: data.total, payUrl: data.payment?.redirectUrl ?? null, online: v.payment !== 'cash' });
      useCart.getState().clear();
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <m.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} className="flex min-h-[60vh] flex-col items-start justify-center gap-5 px-5 py-10 lg:px-7" role="status">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-ink">
          <Icon name="check" size={30} />
        </span>
        <p className="display text-4xl">{t('checkout.doneTitle')}</p>
        <div>
          <p className="label !mb-1">{t('checkout.doneNumber')}</p>
          <p className="display text-3xl text-accent">{done.number}</p>
        </div>
        <p className="text-bone/75">{t('checkout.doneText')}</p>
        {done.online &&
          (done.payUrl ? (
            <a href={done.payUrl} className="btn btn-accent">
              {t('checkout.payNow')}
            </a>
          ) : (
            <p className="rounded-xl bg-raised px-4 py-3 text-sm text-bone/80">{t('checkout.payPending')}</p>
          ))}
        <button type="button" onClick={() => useUi.getState().closeCart()} className="btn btn-ghost">
          {t('checkout.keepShopping')}
        </button>
      </m.div>
    );
  }

  const option = (on: boolean) =>
    `flex min-h-14 w-full cursor-pointer items-center gap-4 rounded-2xl px-4 py-3 text-left transition-[background-color,box-shadow] duration-500 ${
      on ? 'bg-raised ring-1 ring-accent/70' : 'ring-1 ring-inset ring-line hover:ring-bone/40'
    }`;
  const radio = (on: boolean) => (
    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1 ${on ? 'ring-accent' : 'ring-line'}`}>
      {on && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
    </span>
  );

  return (
    <div className="flex min-h-full flex-col">
      {/* шаги */}
      <ol className="flex gap-1.5 px-5 pt-5 lg:px-7" aria-label={t('cart.checkout')}>
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1" aria-current={i === step ? 'step' : undefined}>
            <span className={`block h-[3px] rounded-full transition-colors duration-700 ${i <= step ? 'bg-accent' : 'bg-line'}`} />
            <span className={`mt-2 block truncate text-[0.62rem] uppercase tracking-[0.12em] ${i === step ? 'text-bone' : 'text-muted'}`}>{t(`checkout.steps.${s}`)}</span>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        <m.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6, ease: EASE }} className="flex-1 space-y-5 px-5 py-6 lg:px-7">
          {step === 0 && (
            <>
              <Field id="co-name" label={t('forms.name')} error={show('name')}>
                <TextInput id="co-name" autoComplete="name" value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} invalid={!!show('name')} />
              </Field>
              <Field id="co-phone" label={t('forms.phone')} error={show('phone')}>
                <PhoneInput id="co-phone" value={v.phone} onChange={(phone) => setV({ ...v, phone })} invalid={!!show('phone')} />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <fieldset className="space-y-2">
                <legend className="label">{t('checkout.steps.delivery')}</legend>
                {METHODS.map((mtd) => (
                  <label key={mtd} className={option(v.method === mtd)}>
                    <input type="radio" name="method" className="sr-only" checked={v.method === mtd} onChange={() => setV({ ...v, method: mtd })} />
                    {radio(v.method === mtd)}
                    <span>{t(`checkout.methods.${mtd}`)}</span>
                  </label>
                ))}
                <p className="text-xs text-muted">{t('checkout.termsHint')}</p>
              </fieldset>
              {v.method === 'regions' && (
                <Field id="co-city" label={t('partners.form.city')} error={show('city')}>
                  <TextInput id="co-city" autoComplete="address-level2" value={v.city} onChange={(e) => setV({ ...v, city: e.target.value })} invalid={!!show('city')} />
                </Field>
              )}
              {v.method !== 'pickup' ? (
                <Field id="co-address" label={t('checkout.address')} error={show('address')}>
                  <TextInput id="co-address" autoComplete="street-address" value={v.address} onChange={(e) => setV({ ...v, address: e.target.value })} invalid={!!show('address')} />
                </Field>
              ) : (
                <fieldset className="space-y-2">
                  <legend className="label">{t('checkout.store')}</legend>
                  {siteConfig.stores.map((s) => (
                    <label key={s.id} className={option(v.storeId === s.id)}>
                      <input type="radio" name="store" className="sr-only" checked={v.storeId === s.id} onChange={() => setV({ ...v, storeId: s.id })} />
                      {radio(v.storeId === s.id)}
                      <span>
                        <span className="block font-semibold">{t(`stores.items.${s.id}.name`)}</span>
                        <span className="block text-xs text-muted">{t(`stores.items.${s.id}.address`)}</span>
                      </span>
                    </label>
                  ))}
                </fieldset>
              )}
            </>
          )}

          {step === 2 && (
            <fieldset className="space-y-2">
              <legend className="label">{t('checkout.steps.payment')}</legend>
              {PAYMENTS.map((p) => (
                <label key={p} className={option(v.payment === p)}>
                  <input type="radio" name="payment" className="sr-only" checked={v.payment === p} onChange={() => setV({ ...v, payment: p })} />
                  {radio(v.payment === p)}
                  <span>
                    <span className="block font-semibold">{t(`checkout.payments.${p}`)}</span>
                    <span className="block text-xs text-muted">{t(`checkout.paymentHints.${p === 'cash' ? 'cash' : 'online'}`)}</span>
                  </span>
                </label>
              ))}
            </fieldset>
          )}

          {step === 3 && (
            <>
              <p className="display text-2xl">{t('checkout.review')}</p>
              <ul className="divide-y divide-line rounded-2xl ring-1 ring-line">
                {items.map((i) => (
                  <li key={i.key} className="flex justify-between gap-3 px-4 py-3 text-sm">
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{i.title}</span>
                      <span className="block truncate text-xs text-muted">
                        {[i.subtitle, i.shadeLabel].filter(Boolean).join(' · ')} × {i.qty}
                      </span>
                    </span>
                    <Price value={i.price * i.qty} className="shrink-0" />
                  </li>
                ))}
              </ul>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted">{t('checkout.steps.contacts')}</dt>
                <dd>
                  {v.name}, +998 {v.phone}
                </dd>
                <dt className="text-muted">{t('checkout.steps.delivery')}</dt>
                <dd>
                  {t(`checkout.methods.${v.method}`)}
                  {v.method === 'pickup' ? ` · ${t(`stores.items.${v.storeId}.name`)}` : ` · ${[v.city, v.address].filter(Boolean).join(', ')}`}
                </dd>
                <dt className="text-muted">{t('checkout.steps.payment')}</dt>
                <dd>{t(`checkout.payments.${v.payment}`)}</dd>
              </dl>
              <Field id="co-comment" label={t('checkout.comment')} optional>
                <TextArea id="co-comment" value={v.comment} onChange={(e) => setV({ ...v, comment: e.target.value })} maxLength={500} />
              </Field>
              {error && (
                <p role="alert" className="rounded-xl bg-[#ef7a62]/10 px-4 py-3 text-sm text-[#ef9a86]">
                  {t('forms.serverError')}
                </p>
              )}
            </>
          )}
        </m.div>
      </AnimatePresence>

      <div className="sticky bottom-0 border-t border-line bg-surface px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 lg:px-7">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm uppercase tracking-[0.14em] text-muted">{t('cart.total')}</span>
          <Price value={total} className="display text-xl" />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => (step === 0 ? useUi.setState({ checkout: false }) : setStep((s) => s - 1))}
            aria-label={t('common.back')}
          >
            <Icon name="arrowLeft" size={18} />
          </button>
          {step < 3 ? (
            <button type="button" className="btn btn-accent flex-1" onClick={next}>
              {t('common.continue')}
              <Icon name="arrowRight" size={18} />
            </button>
          ) : (
            <button type="button" className="btn btn-accent flex-1" onClick={place} disabled={sending || items.length === 0}>
              {sending ? t('forms.sending') : t('checkout.place')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
