import { Link } from 'react-router'
import Reveal from './Reveal.jsx'
import { ArrowRight, Check, Clock, Users } from './Icons.jsx'
import { houses, housesInfo, rooms } from '../data/content.js'
import './Stay.css'

// headless — без заголовка секции (на странице /stay заголовок в PageHero)
export default function Stay({ headless = false }) {
  return (
    <section className="stay dark section" id="stay">
      <div className="container">
        {!headless && (
          <div className="section-head">
            <Reveal className="section-head__text">
              <span className="eyebrow">Отдых и проживание</span>
              <h2 className="section-title">Отдых в окружении природы</h2>
              <p className="lead">
                {housesInfo.count} отапливаемых мангальных домиков и {rooms.count} гостиничных номеров в лесопарке.
                Отметить можно абсолютно любой праздник.
              </p>
            </Reveal>
            <Reveal delay={150}>
              <Link to="/stay" className="btn btn--outline">
                Подробнее и бронь <ArrowRight />
              </Link>
            </Reveal>
          </div>
        )}

        <div className="stay__houses">
          {houses.map((h, i) => (
            <Reveal key={h.name} delay={i * 130}>
              <article className="house">
                <div className="house__img">
                  <img className="img-cover" src={h.image} alt={h.name} loading="lazy" />
                  <span className="house__guests">
                    <Users />
                    {h.guests}
                  </span>
                </div>
                <div className="house__body">
                  <h3 className="house__name">{h.name}</h3>
                  <p className="house__hours">
                    <Clock />
                    {housesInfo.hours}
                  </p>
                  <div className="house__price">
                    <strong>{h.price}</strong>
                    <span>за день</span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="stay__amenities">
          <span className="stay__amenities-title">В каждом домике</span>
          <ul>
            {housesInfo.amenities.map((a) => (
              <li key={a}>
                <Check />
                {a}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="stay__offers">
          <Reveal className="offer offer--rooms" variant="left">
            <img className="img-cover offer__bg" src={rooms.image} alt="" loading="lazy" />
            <div className="offer__content">
              <span className="offer__tag">Гостиница</span>
              <h3 className="offer__title">{rooms.count} гостиничных номеров</h3>
              <p className="offer__text">
                При бронировании банкетного зала — <strong>скидка 20%</strong> на проживание.
              </p>
              <a href={rooms.link} target="_blank" rel="noopener noreferrer" className="offer__link">
                Смотреть номера <ArrowRight />
              </a>
            </div>
          </Reveal>

          <Reveal className="offer offer--wedding" variant="right">
            <span className="offer__tag">Свадьбам</span>
            <strong className="offer__big">−50%</strong>
            <h3 className="offer__title">на второй день свадьбы</h3>
            <p className="offer__text">Продолжите праздник в мангальном домике со скидкой 50%.</p>
            <Link to="/stay#stay-form" className="offer__link">
              Забронировать <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
