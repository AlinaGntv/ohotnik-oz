import { useState } from 'react'
import Reveal from './Reveal.jsx'
import { ArrowRight, Calendar, Clock, Phone } from './Icons.jsx'
import { contacts, images } from '../data/content.js'
import useParallax from '../hooks/useParallax.js'
import './Booking.css'

const initial = { name: '', phone: '', date: '', time: '', guests: 2 }

export default function Booking() {
  const [form, setForm] = useState(initial)
  const [sent, setSent] = useState(false)
  const bgRef = useParallax(-0.15)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: отправка заявки на бэкенд
    setSent(true)
    setForm(initial)
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
          {sent ? (
            <div className="booking__success">
              <span className="booking__success-icon">✓</span>
              <h3>Спасибо, заявка принята!</h3>
              <p>Мы перезвоним вам в ближайшее время для подтверждения брони.</p>
              <button className="btn btn--outline btn--sm" onClick={() => setSent(false)}>
                Новая заявка
              </button>
            </div>
          ) : (
            <form className="booking__form" onSubmit={handleSubmit}>
              <label className="field field--name">
                <span>Ваше имя</span>
                <input required placeholder="Иванова Анна" value={form.name} onChange={set('name')} />
              </label>
              <label className="field field--phone">
                <span>Телефон</span>
                <input
                  required
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  value={form.phone}
                  onChange={set('phone')}
                />
              </label>
              <label className="field field--date">
                <span>Дата</span>
                <div className="field__control">
                  <Calendar />
                  <input required type="date" value={form.date} onChange={set('date')} />
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
                    onClick={() => setForm((f) => ({ ...f, guests: Math.min(200, f.guests + 1) }))}
                  >
                    +
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn--gold booking__submit">
                Забронировать стол <ArrowRight />
              </button>
              <p className="booking__note">
                Нажимая кнопку, вы соглашаетесь с <a href="#">политикой конфиденциальности</a>
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
