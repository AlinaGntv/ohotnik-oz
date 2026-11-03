import { useState } from 'react'
import { ArrowRight } from './Icons.jsx'
import ConsentCheckbox from './ConsentCheckbox.jsx'
import { sendRequest } from '../lib/api.js'
import { formatPhone, isPhoneComplete } from '../lib/phone.js'
import './LeadForm.css'

const today = () => {
  const d = new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

// Форма заявки для внутренних страниц (банкет, проживание).
// fields: [{ name, label, type: 'text' | 'date' | 'number' | 'select', options?, required?, placeholder?, wide? }]
// Заявка уходит как бронь (type: 'booking') с полем kind — в Make она попадает в ветку «Бронь».
export default function LeadForm({ id, kind, title, lead, fields, submitLabel }) {
  const initial = () => ({
    name: '',
    phone: '',
    comment: '',
    website: '',
    consent: false,
    ...Object.fromEntries(fields.map((f) => [f.name, f.type === 'number' ? f.min ?? 1 : ''])),
  })
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [requestId, setRequestId] = useState('')

  const set = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!isPhoneComplete(form.phone)) {
      setError('Введите номер телефона полностью')
      return
    }
    setError('')
    setStatus('sending')
    try {
      const data = { ...form, kind }
      fields.filter((f) => f.type === 'number').forEach((f) => (data[f.name] = Number(form[f.name])))
      const res = await sendRequest('booking', data)
      setRequestId(res.id)
      setStatus('sent')
      setForm(initial())
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  return (
    <section className="lead-form section" id={id}>
      <div className="container lead-form__inner">
        <div className="lead-form__intro">
          <span className="eyebrow">Заявка</span>
          <h2 className="section-title">{title}</h2>
          {lead && <p className="lead">{lead}</p>}
        </div>

        <div className="lead-form__panel">
          {status === 'sent' ? (
            <div className="lead-form__done">
              <span className="lead-form__done-icon">✓</span>
              <h3>Заявка принята</h3>
              <p>Номер заявки — {requestId}. Администратор перезвонит вам в ближайшее время.</p>
              <button className="btn btn--ghost btn--sm" onClick={() => setStatus('idle')}>
                Новая заявка
              </button>
            </div>
          ) : (
            <form className="lead-form__form" onSubmit={submit}>
              <label className="lead-field">
                <span>Ваше имя</span>
                <input required maxLength={80} autoComplete="name" value={form.name} onChange={set('name')} />
              </label>
              <label className="lead-field">
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

              {fields.map((f) => (
                <label key={f.name} className={`lead-field ${f.wide ? 'lead-field--wide' : ''}`}>
                  <span>{f.label}</span>
                  {f.type === 'select' ? (
                    <select required={f.required} value={form[f.name]} onChange={set(f.name)}>
                      <option value="">{f.placeholder ?? 'Выберите'}</option>
                      {f.options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type}
                      required={f.required}
                      min={f.type === 'date' ? today() : f.min}
                      max={f.max}
                      placeholder={f.placeholder}
                      value={form[f.name]}
                      onChange={set(f.name)}
                    />
                  )}
                </label>
              ))}

              <label className="lead-field lead-field--wide">
                <span>Комментарий (необязательно)</span>
                <textarea rows={3} maxLength={500} value={form.comment} onChange={set('comment')} />
              </label>

              <input
                className="lead-form__trap"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form.website}
                onChange={set('website')}
              />

              {error && (
                <p className="lead-form__error" role="alert">
                  {error}
                </p>
              )}

              <ConsentCheckbox
                className="lead-form__consent"
                checked={form.consent}
                onChange={(consent) => setForm((f) => ({ ...f, consent }))}
              />

              <button type="submit" className="btn btn--gold lead-form__submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Отправляем…' : submitLabel} <ArrowRight />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
