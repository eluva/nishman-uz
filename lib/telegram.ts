import 'server-only';

/**
 * Отправка уведомления менеджеру в Telegram.
 * Нужны TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID (.env). Без них сообщение пишется в лог (демо-режим).
 */
export async function sendTelegram(text: string): Promise<{ delivered: boolean }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.info('[telegram:demo]\n' + text);
    return { delivered: false };
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Telegram API ${res.status}`);
  return { delivered: true };
}

export function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
}
