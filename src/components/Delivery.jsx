import Reveal from './Reveal.jsx'
import { Phone } from './Icons.jsx'
import { contacts, ordersEnabled } from '../data/content.js'
import './Delivery.css'

export default function Delivery() {
  return (
    <section className="delivery section" id="delivery">
      <div className="container delivery__inner">
        <Reveal className="delivery__intro">
          <span className="eyebrow">Заказы еды</span>
          <h2 className="section-title">{ordersEnabled ? 'Доставка' : 'Заказы доставки временно недоступны'}</h2>
          <p className="lead delivery__lead">
            {ordersEnabled
              ? 'Привезём горячим по Орехово-Зуеву: аккуратно упакуем, чтобы вкус был таким же, как в ресторане.'
              : 'Сейчас сайт не принимает заказы еды. Позвоните в ресторан, чтобы уточнить актуальные возможности.'}
          </p>
          <a href={contacts.phoneHref} className="btn btn--gold">
            <Phone /> {contacts.phone}
          </a>
        </Reveal>
        {!ordersEnabled && (
          <Reveal className="delivery__card" delay={100}>
            <span className="delivery__label">Статус</span>
            <strong className="delivery__value">Приём заказов приостановлен</strong>
            <p className="delivery__note">Позвоните в ресторан, чтобы уточнить актуальную информацию.</p>
          </Reveal>
        )}
      </div>
    </section>
  )
}
