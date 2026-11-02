import Reveal from './Reveal.jsx'
import { ArrowRight, Check, Users } from './Icons.jsx'
import { banquetTerms, halls } from '../data/content.js'
import './Events.css'

function HallCard({ hall }) {
  return (
    <article className="hall">
      <div className="hall__img">
        <img className="img-cover" src={hall.image} alt={hall.name} loading="lazy" />
        <span className="hall__capacity">
          <Users />
          {hall.capacity}
        </span>
      </div>
      <div className="hall__body">
        <h3 className="hall__name">{hall.name}</h3>
        <ul className="hall__features">
          {hall.features.map((f) => (
            <li key={f}>
              <Check />
              {f}
            </li>
          ))}
        </ul>
        {(hall.rent || hall.extras.length > 0) && (
          <dl className="hall__prices">
            {hall.rent && (
              <div>
                <dt>Аренда зала</dt>
                <dd>{hall.rent}</dd>
              </div>
            )}
            {hall.extras.map((e) => (
              <div key={e.label}>
                <dt>{e.label}</dt>
                <dd>{e.price}</dd>
              </div>
            ))}
          </dl>
        )}
        <a href={hall.link} target="_blank" rel="noopener noreferrer" className="hall__link">
          Подробнее о зале <ArrowRight />
        </a>
      </div>
    </article>
  )
}

export default function Events() {
  return (
    <section className="events section" id="events">
      <div className="container">
        <div className="section-head">
          <Reveal className="section-head__text">
            <span className="eyebrow">Банкеты и события</span>
            <h2 className="section-title">Идеальное место для ваших событий</h2>
            <p className="lead">
              Свадьбы, юбилеи, корпоративы и другие важные события — три зала и банкетный шатёр на любое
              количество гостей.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <a href="#booking" className="btn btn--gold">
              Забронировать зал <ArrowRight />
            </a>
          </Reveal>
        </div>

        <div className="events__grid">
          {halls.map((h, i) => (
            <Reveal key={h.name} delay={(i % 2) * 140}>
              <HallCard hall={h} />
            </Reveal>
          ))}
        </div>

        <Reveal as="ul" className="events__terms">
          {banquetTerms.map((t) => (
            <li key={t.label}>
              <strong>{t.value}</strong>
              <span>{t.label}</span>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
