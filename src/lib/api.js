// Отправка заявок (бронь, заказ) в PHP-обработчик на хостинге, он пересылает их в Make.
// В режиме разработки (npm run dev) заявки по умолчанию не отправляются, а только выводятся
// в консоль. Чтобы слать настоящие заявки с локальной версии, добавьте в .env.local строку
// VITE_SEND_REQUESTS=true — запросы пойдут через прокси Vite на ohotnik-oz.ru.
const API_URL = '/api/notify.php'
const FAKE = import.meta.env.DEV && import.meta.env.VITE_SEND_REQUESTS !== 'true'

export async function sendRequest(type, data) {
  const body = { type, ...data }

  if (FAKE) {
    console.info('[dev] заявка не отправлена, а только выведена в консоль:', body)
    await new Promise((r) => setTimeout(r, 700))
    return { ok: true, id: 'DEV-0001' }
  }

  let res
  try {
    res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.')
  }

  const json = await res.json().catch(() => null)
  if (!res.ok || !json?.ok) {
    throw new Error(json?.error || 'Не удалось отправить заявку. Позвоните нам, пожалуйста.')
  }
  return json
}
