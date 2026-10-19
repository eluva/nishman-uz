import { siteConfig } from '@/site.config';

/** Открыто ли сейчас по часовому поясу Ташкента */
export function isOpenNow(now = new Date()) {
  const { open, close, days, timeZone } = siteConfig.hours;
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const dayIdx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const minutes = Number(get('hour')) * 60 + Number(get('minute'));
  const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));
  return (days as readonly number[]).includes(dayIdx) && minutes >= toMin(open) && minutes < toMin(close);
}
