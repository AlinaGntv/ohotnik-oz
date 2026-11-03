import { ArrowRight, Check, Users } from './Icons.jsx'
import './Events.css'

export default function HallCard({ hall }) {
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
