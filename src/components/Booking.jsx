import { useState } from 'react'
import Reveal from './Reveal.jsx'
import { ArrowRight, Calendar, Clock, Phone } from './Icons.jsx'
import { contacts, images } from '../data/content.js'
import useParallax from '../hooks/useParallax.js'
import { sendRequest } from '../lib/api.js'
import { formatPhone, isPhoneComplete } from '../lib/phone.js'
import ConsentCheckbox from './ConsentCheckbox.jsx'
import './Booking.css'

const initial = { name: '', phone: '', date: '', time: '', guests: 2, comment: '', website: '', consent: false }

// сегодняшняя дата в формате YYYY-MM-DD по местному времени — нижняя граница выбора
const today = () => {
  const d = new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

export default function Booking() {
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [error, setError] = useState('')
  const [requestId, setRequestId] = useState('')
  const bgRef = useParallax(-0.15)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isPhoneComplete(form.phone)) {
      setError('Введите номер телефона полностью')
      return
    }
    setError('')
    setStatus('sending')
    try {
      const res = await sendRequest('booking', form)
      setRequestId(res.id)
      setStatus('sent')
      setForm(initial)
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  return (
    <section className="booking dark section" id="booking">
      <div className="booking__bg" ref={bgRef}>
        <img className="img-cover" src={images.booking} alt="" loading="lazy" />
      </div>
      <div className="booking__overlay" />
      <div className="container booking__inner">
        <Reveal className="booking__intro">
          <span className="eyebrow">Бронирование</span>
          <h2 className="section-title">Забронируйте стол прямо сейчас</h2>
          <p className="lead booking__text">
            Укажите дату, время и количество гостей — мы перезвоним для подтверждения и позаботимся об остальном.
          </p>
          <a href={contacts.phoneHref} className="booking__phone">
            <Phone />
            <span>
              <small>Или позвоните нам</small>
              {contacts.phone}
            </span>
          </a>
        </Reveal>

        <Reveal variant="right" delay={150} className="booking__panel">
          {status === 'sent' ? (
            <div className="booking__success">
              <span className="booking__success-icon">✓</span>
              <h3>Спасибо, заявка принята!</h3>
              <p>
                Номер заявки — {requestId}. Мы перезвоним вам в ближайшее время для подтверждения брони.
              </p>
              <button className="btn btn--outline btn--sm" onClick={() => setStatus('idle')}>
                Новая заявка
              </button>
            </div>
          ) : (
            <form className="booking__form" onSubmit={handleSubmit}>
              <label className="field field--name">
                <span>Ваше имя</span>
                <input required maxLength={80} placeholder="Иванова Анна" value={form.name} onChange={set('name')} />
              </label>
              <label className="field field--phone">
                <span>Телефон</span>
                <input
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: formatPhone(e.target.value) }))}
                />
              </label>
              <label className="field field--date">
                <span>Дата</span>
                <div className="field__control">
                  <Calendar />
                  <input required type="date" min={today()} value={form.date} onChange={set('date')} />
                </div>
              </label>
              <label className="field field--time">
                <span>Время</span>
                <div className="field__control">
                  <Clock />
                  <input required type="time" min="10:00" max="22:00" value={form.time} onChange={set('time')} />
                </div>
              </label>
              <div className="field field--guests">
                <span>Гостей</span>
                <div className="field__control guests">
                  <button
                    type="button"
                    aria-label="Меньше гостей"
                    onClick={() => setForm((f) => ({ ...f, guests: Math.max(1, f.guests - 1) }))}
                  >
                    −
                  </button>
                  <output>{form.guests}</output>
                  <button
                    type="button"
                    aria-label="Больше гостей"
                    onClick={() => setForm((f) => ({ ...f, guests: Math.min(300, f.guests + 1) }))}
                  >
                    +
                  </button>
                </div>
              </div>
              <label className="field field--comment">
                <span>Пожелания (необязательно)</span>
                <input
                  maxLength={500}
                  placeholder="Например: у окна, день рождения, детский стульчик"
                  value={form.comment}
                  onChange={set('comment')}
                />
              </label>

              {/* поле-ловушка для ботов, людям не видно */}
              <input
                className="booking__trap"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form.website}
                onChange={set('website')}
              />

              {error && (
                <p className="booking__error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="btn btn--gold booking__submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Отправляем…' : 'Забронировать стол'} <ArrowRight />
              </button>
              <ConsentCheckbox
                className="booking__note"
                checked={form.consent}
                onChange={(consent) => setForm((f) => ({ ...f, consent }))}
              />
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
