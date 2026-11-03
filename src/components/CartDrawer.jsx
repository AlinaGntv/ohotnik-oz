import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Cart, Phone } from './Icons.jsx'
import { contacts, delivery } from '../data/content.js'
import { useCart } from '../context/CartContext.jsx'
import { sendRequest } from '../lib/api.js'
import { formatPhone, isPhoneComplete } from '../lib/phone.js'
import './CartDrawer.css'

const money = (n) => `${n.toLocaleString('ru-RU').replace(/ /g, ' ')} ₽`
const initialForm = { name: '', phone: '', address: '', comment: '', payment: 'card', website: '' }

export default function CartDrawer() {
  const { lines, count, total, setQty, clear, isOpen, close } = useCart()
  const [step, setStep] = useState('cart') // cart | checkout | done
  const [form, setForm] = useState(initialForm)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [orderId, setOrderId] = useState('')

  // Esc закрывает, страница под корзиной не прокручивается
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, close])

  // после закрытия возвращаемся к списку блюд
  useEffect(() => {
    if (isOpen) return
    const t = setTimeout(() => {
      setStep((s) => (s === 'done' ? 'cart' : s))
      setError('')
    }, 400)
    return () => clearTimeout(t)
  }, [isOpen])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const leftToFree = Math.max(0, delivery.freeFrom - total)

  const submit = async (e) => {
    e.preventDefault()
    if (!isPhoneComplete(form.phone)) {
      setError('Введите номер телефона полностью')
      return
    }
    setError('')
    setSending(true)
    try {
      const res = await sendRequest('order', {
        ...form,
        items: lines.map((l) => ({ name: l.name, qty: l.qty, price: l.price })),
      })
      setOrderId(res.id)
      setStep('done')
      clear()
      setForm(initialForm)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={`cart ${isOpen ? 'is-open' : ''}`} inert={!isOpen}>
      <div className="cart__backdrop" onClick={close} />
      <aside className="cart__panel" role="dialog" aria-modal="true" aria-label="Корзина">
        <header className="cart__head">
          {step === 'checkout' ? (
            <button className="cart__back" onClick={() => setStep('cart')}>
              <ArrowLeft /> Корзина
            </button>
          ) : (
            <h2 className="cart__title">{step === 'done' ? 'Заказ оформлен' : 'Ваш заказ'}</h2>
          )}
          <button className="cart__close" aria-label="Закрыть корзину" onClick={close}>
            <span />
            <span />
          </button>
        </header>

        {step === 'done' && (
          <div className="cart__done">
            <span className="cart__done-icon">✓</span>
            <h3>Спасибо!</h3>
            <p>
              Заказ № {orderId} принят. Оператор перезвонит вам в ближайшее время, чтобы подтвердить заказ и время
              доставки.
            </p>
            <button className="btn btn--gold" onClick={close}>
              Вернуться на сайт
            </button>
          </div>
        )}

        {step !== 'done' && count === 0 && (
          <div className="cart__empty">
            <Cart />
            <p>В корзине пока пусто</p>
            <a href="#menu" className="btn btn--gold" onClick={close}>
              Перейти в меню <ArrowRight />
            </a>
          </div>
        )}

        {step === 'cart' && count > 0 && (
          <>
            <ul className="cart__list">
              {lines.map((l) => (
                <li className="cart__item" key={l.id}>
                  <img className="cart__thumb img-cover" src={l.image} alt="" />
                  <div className="cart__info">
                    <span className="cart__name">{l.name}</span>
                    <span className="cart__meta">
                      {l.weight} · {money(l.price)}
                      {l.oldPrice && <s> {money(l.oldPrice)}</s>}
                    </span>
                    <div className="cart__row">
                      <div className="qty">
                        <button aria-label="Уменьшить" onClick={() => setQty(l.id, l.qty - 1)}>
                          −
                        </button>
                        <span>{l.qty}</span>
                        <button aria-label="Увеличить" onClick={() => setQty(l.id, l.qty + 1)}>
                          +
                        </button>
                      </div>
                      <span className="cart__sum">{money(l.sum)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="cart__foot">
              <p className={`cart__delivery ${leftToFree ? '' : 'is-free'}`}>
                {leftToFree
                  ? `До бесплатной доставки — ${money(leftToFree)}`
                  : 'Доставка бесплатно'}
              </p>
              <div className="cart__total">
                <span>Итого</span>
                <strong>{money(total)}</strong>
              </div>
              <button className="btn btn--gold cart__cta" onClick={() => setStep('checkout')}>
                Оформить заказ <ArrowRight />
              </button>
            </footer>
          </>
        )}

        {step === 'checkout' && count > 0 && (
          <form className="cart__form" onSubmit={submit}>
            <div className="cart__fields">
              <label className="cart__field">
                <span>Имя</span>
                <input required maxLength={80} autoComplete="name" value={form.name} onChange={set('name')} />
              </label>
              <label className="cart__field">
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
              <label className="cart__field">
                <span>Адрес доставки</span>
                <input
                  required
                  maxLength={200}
                  autoComplete="street-address"
                  placeholder="Улица, дом, квартира, подъезд"
                  value={form.address}
                  onChange={set('address')}
                />
              </label>
              <label className="cart__field">
                <span>Комментарий (необязательно)</span>
                <textarea
                  rows={2}
                  maxLength={500}
                  placeholder="Код домофона, время доставки, пожелания"
                  value={form.comment}
                  onChange={set('comment')}
                />
              </label>

              <fieldset className="cart__payment">
                <legend>Оплата</legend>
                {[
                  ['card', 'Картой курьеру'],
                  ['cash', 'Наличными курьеру'],
                ].map(([value, label]) => (
                  <label key={value} className={form.payment === value ? 'is-active' : ''}>
                    <input
                      type="radio"
                      name="payment"
                      value={value}
                      checked={form.payment === value}
                      onChange={set('payment')}
                    />
                    {label}
                  </label>
                ))}
              </fieldset>

              <input
                className="cart__trap"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form.website}
                onChange={set('website')}
              />

              <p className="cart__hours">
                Доставляем:{' '}
                {delivery.schedule.map((s) => `${s.days} ${s.time}`).join(', ')}
              </p>
            </div>

            <footer className="cart__foot">
              {error && (
                <p className="cart__error" role="alert">
                  {error}{' '}
                  <a href={contacts.phoneHref}>
                    <Phone /> {contacts.phone}
                  </a>
                </p>
              )}
              <div className="cart__total">
                <span>К оплате</span>
                <strong>{money(total)}</strong>
              </div>
              <button type="submit" className="btn btn--gold cart__cta" disabled={sending}>
                {sending ? 'Отправляем…' : 'Подтвердить заказ'} <ArrowRight />
              </button>
              <p className="cart__note">
                Нажимая кнопку, вы соглашаетесь с <a href="#">политикой конфиденциальности</a>
              </p>
            </footer>
          </form>
        )}
      </aside>
    </div>
  )
}
