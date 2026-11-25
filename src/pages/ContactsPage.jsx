import PageHero from '../components/PageHero.jsx'
import Reveal from '../components/Reveal.jsx'
import { ArrowRight, Car, Clock, Max, Phone, Pin, Telegram, Truck, Vk } from '../components/Icons.jsx'
import { Link } from 'react-router'
import { company, contacts, delivery, images, ordersEnabled, yandexMapsUrl } from '../data/content.js'
import './ContactsPage.css'

const routeUrl = yandexMapsUrl
const mapUrl = `https://yandex.ru/map-widget/v1/?ll=${contacts.mapCenter}&z=14&text=${encodeURIComponent(contacts.mapQuery)}`

export default function ContactsPage() {
  return (
    <>
      <PageHero
        eyebrow="Контакты"
        title="Как нас найти"
        lead="Ресторан «Охотник» в лесопарке «Мельница» в Орехово-Зуеве — с собственной парковкой и домиками на территории."
        image={images.aboutNew}
      >
        <a href={contacts.phoneHref} className="btn btn--gold">
          <Phone /> {contacts.phone}
        </a>
        <a href={routeUrl} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
          Построить маршрут <ArrowRight />
        </a>
      </PageHero>

      <section className="contacts-page section">
        <div className="container contacts-page__inner">
          <div className="contacts-page__cards">
            <Reveal className="contact-card">
              <Pin />
              <h2>Адрес</h2>
              <p>{company.actualAddress}</p>
              <a href={routeUrl} target="_blank" rel="noopener noreferrer">
                Открыть в Яндекс Картах <ArrowRight />
              </a>
            </Reveal>
            <Reveal className="contact-card" delay={80}>
              <Phone />
              <h2>Телефон</h2>
              <p>
                <a href={contacts.phoneHref} className="contact-card__big">
                  {contacts.phone}
                </a>
              </p>
              <p className="contact-card__muted">Бронирование столов, банкеты и проживание</p>
            </Reveal>
            <Reveal className="contact-card" delay={160}>
              <Clock />
              <h2>Режим работы</h2>
              <p>Ресторан: {contacts.hours.toLowerCase()}</p>
              <p className="contact-card__muted">
                {ordersEnabled
                  ? `Доставка: ${delivery.schedule.map((s) => `${s.days} ${s.time}`).join(', ')}`
                  : 'Заказы доставки временно не принимаются.'}
              </p>
            </Reveal>
            <Reveal className="contact-card" delay={240}>
              <Car />
              <h2>Как добраться</h2>
              <p>{contacts.parking}.</p>
              <p className="contact-card__muted">
                В приложении такси или навигаторе найдите «Ресторан Охотник» в Орехово-Зуеве.
              </p>
            </Reveal>
            {ordersEnabled ? <Reveal className="contact-card" delay={320}>
              <Truck />
              <h2>Доставка</h2>
              <p>По Орехово-Зуеву, бесплатно от {delivery.freeFrom.toLocaleString('ru-RU')} ₽.</p>
              <Link to="/menu">Заказать из меню <ArrowRight /></Link>
            </Reveal> : <Reveal className="contact-card" delay={320}>
              <Truck />
              <h2>Доставка</h2>
              <p>Заказы доставки временно не принимаются.</p>
              <p className="contact-card__muted">Меню доступно для просмотра на сайте.</p>
            </Reveal>}
            <Reveal className="contact-card" delay={400}>
              <h2>Мы в соцсетях</h2>
              <p className="contact-card__muted">Почта для обращений: {company.email}</p>
              <div className="contact-card__social">
                <a href="#" aria-label="ВКонтакте"><Vk /></a>
                <a href="#" aria-label="Telegram"><Telegram /></a>
                <a href="https://max.ru/join/L6GQ4B7pTrO67eVdiG6dFJrQ9MHsXAkH_7ON6jm5t3M" aria-label="Канал в MAX" title="Канал в MAX" target="_blank" rel="noopener noreferrer"><Max /></a>
              </div>
            </Reveal>
          </div>

          <Reveal variant="fade" className="contacts-page__map">
            <iframe src={mapUrl} title="Ресторан «Охотник» на Яндекс Картах" loading="lazy" allowFullScreen />
          </Reveal>
        </div>
      </section>
    </>
  )
}
