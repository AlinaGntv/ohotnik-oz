import Reveal from './Reveal.jsx'
import { ArrowRight, Play } from './Icons.jsx'
import { images } from '../data/content.js'
import useParallax from '../hooks/useParallax.js'
import './GrillBanner.css'

export default function GrillBanner() {
  const bgRef = useParallax(-0.18)

  return (
    <section className="grill dark">
      <div className="grill__bg" ref={bgRef}>
        <img className="img-cover" src={images.grill} alt="" loading="lazy" />
      </div>
      <div className="grill__overlay" />
      <div className="grill__embers" aria-hidden>
        {Array.from({ length: 14 }, (_, i) => (
          <span key={i} style={{ '--x': `${(i * 37) % 100}%`, '--d': `${6 + (i % 5)}s`, '--delay': `${(i * 0.7) % 6}s` }} />
        ))}
      </div>
      <div className="container grill__inner">
        <div className="grill__content">
          <Reveal>
            <span className="eyebrow">Фирменное направление</span>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="section-title grill__title">
              Мангал
              <br />
              на живом огне
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="grill__text">
              Сочные мясо, рыба и овощи на натуральных углях. Фирменные маринады и неповторимый вкус, который
              помнят наши гости.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <a href="#menu" className="btn btn--gold">
              Заказать с мангала <ArrowRight />
            </a>
          </Reveal>
        </div>
        <Reveal variant="zoom" delay={300}>
          <button className="grill__video" aria-label="Смотреть видео">
            <span className="grill__play">
              <Play />
            </span>
            Смотреть видео
          </button>
        </Reveal>
      </div>
    </section>
  )
}
