import Reveal from './Reveal.jsx'
import { Link } from 'react-router'
import HallCard from './HallCard.jsx'
import { ArrowRight } from './Icons.jsx'
import { banquetTerms, halls } from '../data/content.js'
import './Events.css'

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
            <Link to="/banquets" className="btn btn--gold">
              Подробнее о банкетах <ArrowRight />
            </Link>
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
