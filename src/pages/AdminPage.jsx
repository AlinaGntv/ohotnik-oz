import { useCallback, useEffect, useMemo, useState } from 'react'
import { dishes as originalDishes, halls as originalHalls, menuCategories as originalCategories } from '../data/content.js'
import { useHalls } from '../context/useHalls.js'
import './AdminPage.css'

const PAGE_SIZE = 12
const money = (value) => `${Number(value || 0).toLocaleString('ru-RU')} ₽`
const date = (value) => value ? new Date(value).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' }) : '—'
const statusLabels = { new: 'Новая', in_progress: 'В работе', done: 'Завершена', cancelled: 'Отменена' }

async function request(action, { method = 'GET', data, csrf } = {}) {
  if (import.meta.env.DEV) throw new Error('Управление отключено в локальном режиме: API сайта работает на production. Откройте /admin после публикации, чтобы не менять данные сайта из локального превью.')
  const [actionName, ...queryParts] = action.split('&')
  const params = new URLSearchParams({ action: actionName })
  queryParts.forEach((part) => { const [key, value = ''] = part.split('='); params.set(key, decodeURIComponent(value)) })
  const multipart = typeof FormData !== 'undefined' && data instanceof FormData
  const response = await fetch(`/api/admin.php?${params.toString()}`, {
    method,
    credentials: 'same-origin',
    headers: { ...(data && !multipart ? { 'Content-Type': 'application/json' } : {}), ...(csrf ? { 'X-CSRF-Token': csrf } : {}) },
    body: data ? (multipart ? data : JSON.stringify(data)) : undefined,
  })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || !result.ok) throw new Error(result.error || 'Не удалось выполнить запрос')
  return result
}

function Pagination({ page, pages, onChange }) {
  if (pages < 2) return null
  const start = Math.max(1, Math.min(page - 2, pages - 4))
  const numbers = Array.from({ length: Math.min(5, pages) }, (_, index) => start + index)
  return <nav className="admin__pagination" aria-label="Страницы списка">
    <button disabled={page === 1} onClick={() => onChange(page - 1)}>←</button>
    {numbers.map((number) => <button key={number} className={number === page ? 'is-current' : ''} aria-current={number === page ? 'page' : undefined} onClick={() => onChange(number)}>{number}</button>)}
    <button disabled={page === pages} onClick={() => onChange(page + 1)}>→</button>
    <span>Страница {page} из {pages}</span>
  </nav>
}

function Login({ onLogin, error, busy, localMode }) {
  const [password, setPassword] = useState('')
  return <div className="admin admin--login"><form className="admin__login" onSubmit={(event) => { event.preventDefault(); onLogin(password) }}>
    <span className="admin__eyebrow">Охотник · управление</span><h1>Вход в админку</h1>
    <p>Войдите, чтобы управлять меню и заявками ресторана.</p>
    {!localMode && <label>Пароль администратора<input autoFocus type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>}
    {localMode ? <div className="admin__local-note">В локальном просмотре вход отключён, чтобы случайно не менять данные на рабочем сайте. Чтобы включить админку: опубликуйте проект, задайте пароль на сервере по инструкции в <code>docs/admin-panel.md</code> и откройте страницу <code>/admin</code> на сайте.</div> : error && <div className="admin__error" role="alert">{error}</div>}
    {!localMode && <button className="admin__primary" disabled={busy}>{busy ? 'Входим…' : 'Войти'}</button>}
    <a href="/" className="admin__back">← Вернуться на сайт</a>
  </form></div>
}

function DishEditor({ dish, categories, csrf, onClose, onSave }) {
  const [form, setForm] = useState(dish || { name: '', category: categories[0] || '', weight: '', price: '', description: '', image: '' })
  const [categoryInput, setCategoryInput] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const set = (key) => (event) => setForm((previous) => ({ ...previous, [key]: event.target.value }))
  const addCategory = () => {
    const value = categoryInput.trim()
    if (value && !categories.includes(value)) {
      onSave({ categories: [...categories, value] }).then(() => { setForm((previous) => ({ ...previous, category: value })); setCategoryInput('') }).catch((err) => setError(err.message))
    }
  }
  const uploadImage = async (file) => {
    if (!file) return
    setError(''); setUploading(true)
    try {
      const data = new FormData(); data.append('image', file)
      const result = await request('upload', { method: 'POST', data, csrf })
      setForm((previous) => ({ ...previous, image: result.image }))
    } catch (err) { setError(err.message) } finally { setUploading(false) }
  }
  return <div className="admin__modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <form className="admin__modal" onSubmit={async (event) => { event.preventDefault(); setError(''); const price = String(form.price).trim(); if (!/^\d+$/.test(price) || Number(price) > 100000) { setError('Укажите целую цену от 0 до 100 000 ₽'); return } try { await onSave({ dish: { ...form, id: form.id == null ? undefined : Number(form.id), price: Number(price), weight: form.weight || null } }) } catch (err) { setError(err.message) } }}>
      <div className="admin__modal-head"><div><span className="admin__eyebrow">Карточка меню</span><h2>{dish ? 'Редактировать блюдо' : 'Новое блюдо'}</h2></div><button type="button" aria-label="Закрыть" onClick={onClose}>×</button></div>
      <div className="admin__form-grid">
        <label>Название<input value={form.name} onChange={set('name')} required maxLength={100} /></label>
        <label>Категория<select value={form.category} onChange={set('category')} required>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
        <label>Цена, ₽<input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} value={form.price} onChange={set('price')} required /></label>
        <label>Вес / объём<input value={form.weight || ''} onChange={set('weight')} maxLength={40} placeholder="Например, 250 г" /></label>
        <label className="admin__field-wide">Путь к изображению<input value={form.image} onChange={set('image')} required placeholder="/images/menu/dish.webp" /></label>
        <label className="admin__field-wide">Загрузить фото (JPG, PNG или WebP, до 8 МБ)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => uploadImage(event.target.files?.[0])} disabled={uploading} />{uploading && <span>Загружаем изображение…</span>}</label>
        {form.image && <div className="admin__image-preview admin__field-wide"><img src={form.image} alt="Предпросмотр блюда" /></div>}
        <label className="admin__field-wide">Описание / состав<textarea rows="4" value={form.description || ''} onChange={set('description')} maxLength={500} /></label>
        {!categories.length && <label>Новая категория<input value={categoryInput} onChange={(event) => setCategoryInput(event.target.value)} /></label>}
      </div>
      <div className="admin__add-category"><input value={categoryInput} onChange={(event) => setCategoryInput(event.target.value)} placeholder="Добавить категорию" /><button type="button" onClick={addCategory} disabled={!categoryInput.trim()}>Добавить категорию</button></div>
      {error && <div className="admin__error" role="alert">{error}</div>}
      <div className="admin__modal-actions"><button type="button" className="admin__secondary" onClick={onClose}>Отмена</button><button className="admin__primary" disabled={uploading}>Сохранить блюдо</button></div>
    </form>
  </div>
}

function HallEditor({ hall, csrf, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    id: hall?.id || '', name: hall?.name || '', capacity: hall?.capacity || '', description: hall?.description || '',
    rent: hall?.rent || '', link: hall?.link || '', features: (hall?.features || []).join('\n'),
    extras: (hall?.extras || []).map((item) => `${item.label} | ${item.price}`).join('\n'),
    images: (hall?.images || [hall?.image].filter(Boolean)).join('\n'), video: hall?.video || '', videoPoster: hall?.videoPoster || '',
    karaokeTagline: hall?.karaoke?.tagline || '', karaokeSchedule: (hall?.karaoke?.schedule || []).join('\n'),
  }))
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const set = (key) => (event) => setForm((previous) => ({ ...previous, [key]: event.target.value }))
  const uploadImages = async (files) => {
    if (!files.length) return
    setError(''); setUploading(true)
    try {
      const paths = []
      for (const file of files) {
        const data = new FormData(); data.append('image', file)
        paths.push((await request('upload&type=hall', { method: 'POST', data, csrf })).image)
      }
      setForm((previous) => ({ ...previous, images: [previous.images, ...paths].filter(Boolean).join('\n') }))
    } catch (err) { setError(err.message) } finally { setUploading(false) }
  }
  const submit = async (event) => {
    event.preventDefault(); setError('')
    const images = form.images.split('\n').map((item) => item.trim()).filter(Boolean)
    if (!form.name.trim() || !form.capacity.trim() || !images.length) { setError('Заполните название, вместимость и добавьте хотя бы одно фото'); return }
    const extras = form.extras.split('\n').map((row) => row.split('|').map((part) => part.trim())).filter(([label]) => label).map(([label, price = '']) => ({ label, price }))
    const karaokeSchedule = form.karaokeSchedule.split('\n').map((item) => item.trim()).filter(Boolean)
    const saved = {
      ...(hall || {}), id: form.id || `hall-${Date.now()}`, name: form.name.trim(), capacity: form.capacity.trim(),
      description: form.description.trim(), rent: form.rent.trim(), link: form.link.trim(), features: form.features.split('\n').map((item) => item.trim()).filter(Boolean),
      extras, images, image: images[0], video: form.video.trim(), videoPoster: form.videoPoster.trim(),
      karaoke: form.karaokeTagline.trim() || karaokeSchedule.length ? { tagline: form.karaokeTagline.trim(), schedule: karaokeSchedule } : null,
    }
    try { await onSave(saved) } catch (err) { setError(err.message) }
  }
  return <div className="admin__modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <form className="admin__modal" onSubmit={submit}>
      <div className="admin__modal-head"><div><span className="admin__eyebrow">Банкетные пространства</span><h2>{hall?.id ? 'Редактировать зал' : 'Новый зал'}</h2></div><button type="button" aria-label="Закрыть" onClick={onClose}>×</button></div>
      <div className="admin__form-grid">
        <label>Название<input value={form.name} onChange={set('name')} required maxLength={100} /></label>
        <label>Вместимость<input value={form.capacity} onChange={set('capacity')} required maxLength={80} placeholder="Например, 40–50 гостей" /></label>
        <label className="admin__field-wide">Описание<textarea rows="3" value={form.description} onChange={set('description')} maxLength={500} /></label>
        <label className="admin__field-wide">Особенности зала, каждая с новой строки<textarea rows="3" value={form.features} onChange={set('features')} /></label>
        <label>Аренда<input value={form.rent} onChange={set('rent')} placeholder="Например, 10 000 ₽" /></label>
        <label>Ссылка «Подробнее»<input value={form.link} onChange={set('link')} placeholder="https://…" /></label>
        <label className="admin__field-wide">Дополнительные услуги: название | цена, каждая с новой строки<textarea rows="3" value={form.extras} onChange={set('extras')} placeholder={'Аренда экрана | 5 000 ₽\nКараоке | 20 000 ₽'} /></label>
        <label className="admin__field-wide">Пути к фото, по одному на строку<textarea rows="3" value={form.images} onChange={set('images')} placeholder="/images/halls/photo.webp" /></label>
        <label className="admin__field-wide">Загрузить фото (JPG, PNG или WebP, до 8 МБ каждое)<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => uploadImages(Array.from(event.target.files || []))} disabled={uploading} />{uploading && <span>Загружаем фото…</span>}</label>
        <label>Путь к видео<input value={form.video} onChange={set('video')} placeholder="/videos/hall.mp4" /></label>
        <label>Постер видео<input value={form.videoPoster} onChange={set('videoPoster')} placeholder="/images/halls/poster.webp" /></label>
        <label>Подпись для караоке<input value={form.karaokeTagline} onChange={set('karaokeTagline')} placeholder="Любой банкет в караоке" /></label>
        <label className="admin__field-wide">Расписание караоке, каждая строка отдельно<textarea rows="4" value={form.karaokeSchedule} onChange={set('karaokeSchedule')} placeholder={'Четверг — не работает\nПятница — 20:00–04:00'} /></label>
      </div>
      {error && <div className="admin__error" role="alert">{error}</div>}
      <div className="admin__modal-actions"><button type="button" className="admin__secondary" onClick={onClose}>Отмена</button><button className="admin__primary" disabled={uploading}>Сохранить зал</button></div>
    </form>
  </div>
}

export default function AdminPage() {
  const { setHalls: setPublicHalls } = useHalls()
  const [authenticated, setAuthenticated] = useState(false)
  const [csrf, setCsrf] = useState('')
  const [loginError, setLoginError] = useState('')
  const [busy, setBusy] = useState(false)
  const [section, setSection] = useState('dishes')
  const [dishes, setDishes] = useState(originalDishes)
  const [categories, setCategories] = useState(originalCategories)
  const [halls, setHalls] = useState(originalHalls)
  const [records, setRecords] = useState([])
  const [stats, setStats] = useState(null)
  const [recordType, setRecordType] = useState('all')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [hallQuery, setHallQuery] = useState('')
  const [editor, setEditor] = useState(null)
  const [hallEditor, setHallEditor] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    document.title = 'Админ-панель — ресторан «Охотник»'
    let robots = document.head.querySelector('meta[name="robots"]')
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.append(robots) }
    const previous = robots.content
    robots.content = 'noindex,nofollow'
    return () => { robots.content = previous }
  }, [])

  const saveMenu = useCallback(async (nextDishes, nextCategories) => {
    await request('menu', { method: 'PUT', csrf, data: { dishes: nextDishes, categories: nextCategories } })
    setDishes(nextDishes)
    setCategories(nextCategories)
  }, [csrf])

  const loadMenu = useCallback(async () => {
    const result = await request('menu', { csrf })
    if (Array.isArray(result.menu?.dishes)) {
      setDishes(result.menu.dishes)
      setCategories(result.menu.categories || originalCategories)
    } else {
      const seeded = await request('bootstrap', { method: 'POST', csrf, data: { dishes: originalDishes, categories: originalCategories } })
      if (seeded.menu) { setDishes(seeded.menu.dishes); setCategories(seeded.menu.categories) }
    }
  }, [csrf])

  const saveHalls = useCallback(async (nextHalls) => {
    await request('halls', { method: 'PUT', csrf, data: { halls: nextHalls } })
    setHalls(nextHalls)
    setPublicHalls(nextHalls)
  }, [csrf, setPublicHalls])

  const loadHalls = useCallback(async () => {
    const result = await request('halls', { csrf })
    if (Array.isArray(result.halls)) { setHalls(result.halls); setPublicHalls(result.halls) }
    else {
      const seeded = await request('bootstrap-halls', { method: 'POST', csrf, data: { halls: originalHalls } })
      if (Array.isArray(seeded.halls)) { setHalls(seeded.halls); setPublicHalls(seeded.halls) }
    }
  }, [csrf, setPublicHalls])

  const loadStats = useCallback(async () => setStats((await request('stats', { csrf })).stats), [csrf])
  const loadRecords = useCallback(async () => {
    const result = await request(`records&type=${recordType}&page=${page}`, { csrf })
    setRecords(result.items || []); setPages(result.pages || 1); setTotal(result.total || 0)
  }, [csrf, recordType, page])

  useEffect(() => {
    if (import.meta.env.DEV) return
    // oxlint-disable-next-line react(set-state-in-effect)
    request('session').then((result) => { if (result.authenticated) { setAuthenticated(true); setCsrf(result.csrf || '') } }).catch(() => {})
  }, [])
  useEffect(() => {
    if (!authenticated || !csrf) return
    // oxlint-disable-next-line react(set-state-in-effect)
    Promise.all([loadMenu(), loadHalls(), loadStats(), loadRecords()]).catch((err) => setError(err.message))
  }, [authenticated, csrf, section, loadMenu, loadHalls, loadStats, loadRecords])

  const visibleDishes = useMemo(() => dishes.filter((dish) => (category === 'all' || dish.category === category) && `${dish.name} ${dish.description || ''}`.toLowerCase().includes(query.toLowerCase())), [dishes, category, query])
  const dishPages = Math.max(1, Math.ceil(visibleDishes.length / PAGE_SIZE))
  const pageDishes = visibleDishes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const visibleHalls = useMemo(() => halls.filter((hall) => `${hall.name} ${hall.capacity} ${hall.description || ''}`.toLowerCase().includes(hallQuery.toLowerCase())), [halls, hallQuery])
  const hallPages = Math.max(1, Math.ceil(visibleHalls.length / PAGE_SIZE))
  const pageHalls = visibleHalls.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const login = async (password) => {
    setBusy(true); setLoginError('')
    try {
      const result = await request('login', { method: 'POST', data: { password } })
      setCsrf(result.csrf); setAuthenticated(true)
    } catch (err) { setLoginError(err.message) } finally { setBusy(false) }
  }

  const handleDishSave = async ({ dish, categories: nextCategories }) => {
    const updatedCategories = nextCategories || categories
    const savedDish = dish ? { ...dish, id: dish.id ?? Math.max(0, ...dishes.map((item) => Number(item.id) || 0)) + 1 } : null
    const updated = savedDish ? (dishes.some((item) => item.id === savedDish.id) ? dishes.map((item) => item.id === savedDish.id ? savedDish : item) : [...dishes, savedDish]) : dishes
    await saveMenu(updated, updatedCategories)
    if (dish) { setEditor(null); setNotice('Изменения меню сохранены') }
  }

  const deleteDish = async (dish) => {
    if (!window.confirm(`Удалить «${dish.name}» из меню?`)) return
    try { await saveMenu(dishes.filter((item) => item.id !== dish.id), categories); setNotice('Блюдо удалено'); if (pageDishes.length === 1 && page > 1) setPage(page - 1) } catch (err) { setError(err.message) }
  }

  const saveHall = async (hall) => {
    const next = halls.some((item) => item.id === hall.id) ? halls.map((item) => item.id === hall.id ? hall : item) : [...halls, hall]
    await saveHalls(next)
    setHallEditor(null); setNotice('Информация о залах сохранена')
  }
  const deleteHall = async (hall) => {
    if (!window.confirm(`Удалить зал «${hall.name}»? Это действие нельзя отменить.`)) return
    try { await saveHalls(halls.filter((item) => item.id !== hall.id)); setNotice('Зал удалён'); if (pageHalls.length === 1 && page > 1) setPage(page - 1) } catch (err) { setError(err.message) }
  }

  const updateRecord = async (record, status) => {
    try { await request('record', { method: 'PATCH', csrf, data: { id: record.id, status } }); await Promise.all([loadRecords(), loadStats()]) } catch (err) { setError(err.message) }
  }
  const deleteRecord = async (record) => {
    if (!window.confirm(`Удалить запись № ${record.id}? Это действие нельзя отменить.`)) return
    try { await request(`record&id=${encodeURIComponent(record.id)}`, { method: 'DELETE', csrf }); setNotice('Запись удалена'); await Promise.all([loadRecords(), loadStats()]) } catch (err) { setError(err.message) }
  }

  if (!authenticated) return <Login onLogin={login} error={loginError} busy={busy} localMode={import.meta.env.DEV} />

  return <div className="admin">
    <header className="admin__header"><a className="admin__brand" href="/">ОХОТНИК <span>админ-панель</span></a><button className="admin__logout" onClick={async () => { try { await request('logout', { method: 'POST', csrf }) } finally { setAuthenticated(false); setCsrf('') } }}>Выйти</button></header>
    <div className="admin__content">
      <div className="admin__intro"><div><span className="admin__eyebrow">Управление рестораном</span><h1>Панель управления</h1><p>Меню, заказы и обращения гостей в одном месте.</p></div><a href="/" className="admin__site-link">Открыть сайт ↗</a></div>
      {stats && <section className="admin__stats" aria-label="Статистика">
        {[["Заказы", stats.orders], ["Заявки", stats.leads], ["Новые обращения", stats.pending], ["Сегодня", stats.today], ["За неделю", stats.week], ["Сумма заказов", money(stats.revenue)]].map(([label, value]) => <article className="admin__stat" key={label}><span>{label}</span><strong>{value}</strong></article>)}
      </section>}
      <nav className="admin__tabs"><button className={section === 'dishes' ? 'is-active' : ''} onClick={() => { setSection('dishes'); setPage(1) }}>Блюда <span>{dishes.length}</span></button><button className={section === 'halls' ? 'is-active' : ''} onClick={() => { setSection('halls'); setPage(1) }}>Залы <span>{halls.length}</span></button><button className={section === 'records' && recordType === 'orders' ? 'is-active' : ''} onClick={() => { setSection('records'); setRecordType('orders'); setPage(1) }}>Заказы</button><button className={section === 'records' && recordType === 'leads' ? 'is-active' : ''} onClick={() => { setSection('records'); setRecordType('leads'); setPage(1) }}>Заявки</button><button className={section === 'records' && recordType === 'all' ? 'is-active' : ''} onClick={() => { setSection('records'); setRecordType('all'); setPage(1) }}>Все обращения</button></nav>
      {error && <div className="admin__error" role="alert">{error}<button onClick={() => setError('')}>×</button></div>}{notice && <div className="admin__notice">{notice}<button onClick={() => setNotice('')}>×</button></div>}
      {section === 'dishes' ? <section className="admin__section">
        <div className="admin__toolbar"><div><h2>Меню</h2><span>{visibleDishes.length} позиций</span></div><button className="admin__primary" onClick={() => setEditor({})}>＋ Добавить блюдо</button>
          <input className="admin__search" type="search" placeholder="Поиск блюда" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} />
          <select className="admin__filter" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1) }}><option value="all">Все категории</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
        </div>
        <div className="admin__table-wrap"><table className="admin__table"><thead><tr><th>Блюдо</th><th>Категория</th><th>Вес</th><th>Цена</th><th>Действия</th></tr></thead><tbody>{pageDishes.map((dish) => <tr key={dish.id}><td><div className="admin__dish"><img src={dish.image} alt="" /><div><strong>{dish.name}</strong><span>{dish.description || 'Описание не добавлено'}</span></div></div></td><td>{dish.category}</td><td>{dish.weight || '—'}</td><td className="admin__price">{money(dish.price)}</td><td><div className="admin__actions"><button onClick={() => setEditor(dish)}>Изменить</button><button className="is-danger" onClick={() => deleteDish(dish)}>Удалить</button></div></td></tr>)}</tbody></table>{!pageDishes.length && <p className="admin__empty">Блюда не найдены.</p>}</div>
        <Pagination page={page} pages={dishPages} onChange={setPage} />
      </section> : section === 'halls' ? <section className="admin__section">
        <div className="admin__toolbar"><div><h2>Залы</h2><span>{visibleHalls.length} площадок</span></div><button className="admin__primary" onClick={() => setHallEditor({})}>＋ Добавить зал</button><input className="admin__search" type="search" placeholder="Поиск зала" value={hallQuery} onChange={(event) => { setHallQuery(event.target.value); setPage(1) }} /></div>
        <div className="admin__table-wrap"><table className="admin__table"><thead><tr><th>Зал</th><th>Вместимость</th><th>Фото</th><th>Доп. услуги</th><th>Действия</th></tr></thead><tbody>{pageHalls.map((hall) => <tr key={hall.id}><td><div className="admin__dish"><img src={(hall.images || [hall.image])[0]} alt="" /><div><strong>{hall.name}</strong><span>{hall.description || hall.features?.join(' · ') || 'Описание не добавлено'}</span></div></div></td><td>{hall.capacity}</td><td>{(hall.images || [hall.image].filter(Boolean)).length}</td><td>{(hall.extras || []).map((item) => `${item.label}: ${item.price}`).join(' · ') || '—'}</td><td><div className="admin__actions"><button onClick={() => setHallEditor(hall)}>Изменить</button><button className="is-danger" onClick={() => deleteHall(hall)}>Удалить</button></div></td></tr>)}</tbody></table>{!pageHalls.length && <p className="admin__empty">Залы не найдены.</p>}</div>
        <Pagination page={page} pages={hallPages} onChange={setPage} />
      </section> : <section className="admin__section">
        <div className="admin__toolbar"><div><h2>{recordType === 'orders' ? 'Заказы' : recordType === 'leads' ? 'Заявки' : 'Все обращения'}</h2><span>{total} записей</span></div><div className="admin__record-paging">По 20 записей на странице</div></div>
        <div className="admin__records">{records.map((record) => <article className="admin__record" key={record.id}>
          <div className="admin__record-heading"><div><span className="admin__record-id">№ {record.id}</span><span className={`admin__status admin__status--${record.status || 'new'}`}>{statusLabels[record.status || 'new']}</span></div><time>{date(record.created_at)}</time></div>
          <h3>{record.type === 'order' ? `Заказ · ${money(record.total)}` : ({ table: 'Бронь стола', banquet: 'Заявка на банкет', stay: 'Бронь гостиничного номера', house: 'Бронь дневного домика' }[record.kind] || 'Заявка')}</h3>
          <div className="admin__record-info"><span>{record.name || '—'}</span><a href={`tel:${record.phone || ''}`}>{record.phone || '—'}</a>{record.address && <span>{record.address}</span>}</div>
          {record.items?.length > 0 && <ul className="admin__record-items">{record.items.map((item, index) => <li key={`${item.name}-${index}`}>{item.name} × {item.qty} <span>{money(item.sum)}</span></li>)}</ul>}
          {(record.date || record.guests || record.option || record.occasion || record.hall || record.venue) && <p className="admin__record-extra">{record.date && `${record.kind === 'house' ? 'Дата отдыха' : record.kind === 'stay' ? 'Заезд' : 'Дата'}: ${record.date} · `}{record.time && `${record.time} · `}{record.guests && `Гостей: ${record.guests} · `}{record.venue && `${record.venue} · `}{record.occasion && `${record.occasion} · `}{record.hall && `${record.hall} · `}{record.option || ''}</p>}
          {record.comment && <p className="admin__record-comment">«{record.comment}»</p>}
          <div className="admin__record-actions"><label>Статус<select value={record.status || 'new'} onChange={(event) => updateRecord(record, event.target.value)}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><button className="is-danger" onClick={() => deleteRecord(record)}>Удалить запись</button></div>
        </article>)}{records.length === 0 && <div className="admin__empty">Здесь пока нет записей. Новые заказы и заявки будут появляться после отправки формы на сайте.</div>}</div>
        <Pagination page={page} pages={pages} onChange={setPage} />
      </section>}
    </div>
    {editor && <DishEditor dish={editor.id ? editor : null} categories={categories} csrf={csrf} onClose={() => setEditor(null)} onSave={handleDishSave} />}
    {hallEditor && <HallEditor hall={hallEditor.id ? hallEditor : null} csrf={csrf} onClose={() => setHallEditor(null)} onSave={saveHall} />}
  </div>
}
