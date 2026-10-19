'use client';

import { useTranslations } from 'next-intl';
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { formatUzPhoneInput } from '@/lib/validation';

export function Field({ id, label, error, optional, children }: { id: string; label: string; error?: string | null; optional?: boolean; children: ReactNode }) {
  const t = useTranslations('common');
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {optional && <span className="ml-2 normal-case tracking-normal text-muted">({t('optional')})</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-[#ef7a62]">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ id, invalid, ...rest }: InputHTMLAttributes<HTMLInputElement> & { id: string; invalid?: boolean }) {
  return <input id={id} name={id} aria-invalid={invalid || undefined} aria-describedby={invalid ? `${id}-error` : undefined} className="field" {...rest} />;
}

export function TextArea({ id, invalid, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { id: string; invalid?: boolean }) {
  return (
    <textarea
      id={id}
      name={id}
      rows={3}
      aria-invalid={invalid || undefined}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className="field resize-none"
      {...rest}
    />
  );
}

/** Телефон с префиксом +998 и маской «97 737-71-17» */
export function PhoneInput({ id, value, onChange, invalid }: { id: string; value: string; onChange: (v: string) => void; invalid?: boolean }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bone/60">+998</span>
      <input
        id={id}
        name={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder="97 737-71-17"
        value={value}
        onChange={(e) => onChange(formatUzPhoneInput(e.target.value))}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className="field pl-[4.25rem]"
      />
    </div>
  );
}

/** Honeypot: скрыт от людей и скринридеров, заполняется ботами */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const t = useTranslations('forms');
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        {t('honeypot')}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}
