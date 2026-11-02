import Reveal from './Reveal.jsx'
import { ArrowRight, Clock, Percent, Truck, Wallet } from './Icons.jsx'
import { delivery, isPromoActive, promo } from '../data/content.js'
import './Delivery.css'

const formatPrice = (n) => n.toLocaleString('ru-RU').replace(/ /g, ' ')

export default function Delivery() {
  const promoActive = isPromoActive()

  return (
    <section className="delivery section" id="delivery">
      <div className="container delivery__inner">
        <Reveal className="delivery__intro">
          <span className="eyebrow">Доставка</span>
          <h2 className="section-title">Блюда с мангала — к вашему столу</h2>
          <p className="lead delivery__lead">
            Привезём горячим по Орехово-Зуеву: аккуратно упакуем, чтобы вкус был таким же, как в ресторане.
          </p>
          <a href="#menu" className="btn btn--gold">
            Заказать доставку <ArrowRight />
          </a>
        </Reveal>

        <div className="delivery__cards">
          <Reveal className="delivery__card" delay={100}>
            <span className="delivery__icon">
              <Wallet />
            </span>
            <span className="delivery__label">Бесплатно</span>
            <strong className="delivery__value">от {formatPrice(delivery.freeFrom)} ₽</strong>
            <p className="delivery__note">Бесплатная доставка при заказе от {formatPrice(delivery.freeFrom)} ₽</p>
          </Reveal>

          <Reveal className="delivery__card" delay={200}>
            <span className="delivery__icon">
              <Clock />
            </span>
            <span className="delivery__label">Время работы</span>
            <ul className="delivery__schedule">
              {delivery.schedule.map((s) => (
                <li key={s.days}>
                  <span>{s.days}</span>
                  <strong>{s.time}</strong>
                </li>
              ))}
            </ul>
          </Reveal>

          {promoActive ? (
            <Reveal className="delivery__card delivery__card--promo" delay={300}>
              <span className="delivery__icon">
                <Percent />
              </span>
              <span className="delivery__label">Акция</span>
              <strong className="delivery__value delivery__value--big">−{promo.discount}%</strong>
              <p className="delivery__note">{promo.title} при заказе доставки</p>
            </Reveal>
          ) : (
            <Reveal className="delivery__card" delay={300}>
              <span className="delivery__icon">
                <Truck />
              </span>
              <span className="delivery__label">Зона доставки</span>
              <strong className="delivery__value">Орехово-Зуево</strong>
              <p className="delivery__note">Доставляем горячим и бережно</p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
