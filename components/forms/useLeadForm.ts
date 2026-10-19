'use client';

import { useLocale } from 'next-intl';
import { useState } from 'react';

export type FormStatus = 'idle' | 'sending' | 'success' | 'error';

/** Отправка заявки в /api/lead (→ Telegram) */
export function useLeadForm() {
  const locale = useLocale();
  const [status, setStatus] = useState<FormStatus>('idle');
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  async function submit(payload: Record<string, unknown>) {
    setStatus('sending');
    setServerErrors([]);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, locale }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: string[] };
      if (res.ok && data.ok) {
        setStatus('success');
        return true;
      }
      setServerErrors(data.errors ?? []);
      setStatus('error');
    } catch {
      setStatus('error');
    }
    return false;
  }

  return { status, setStatus, serverErrors, submit };
}
