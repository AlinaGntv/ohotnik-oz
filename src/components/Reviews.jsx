import Reveal from './Reveal.jsx'
import { ArrowLeft, ArrowRight, Quote, Star } from './Icons.jsx'
import { reviews } from '../data/content.js'
import useSlider from '../hooks/useSlider.js'
import './Reviews.css'

const Stars = ({ className = '' }) => (
  <span className={`stars ${className}`} aria-label="5 из 5">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} />
    ))}
  </span>
)

export default function Reviews() {
  const { ref: trackRef, canPrev, canNext, prev, next } = useSlider()

  return (
    <section className="reviews section">
      <div className="container">
        <div className="section-head">
          <Reveal className="section-head__text">
            <span className="eyebrow">Отзывы</span>
            <h2 className="section-title">Наши гости о нас</h2>
            <div className="reviews__rating">
              <span className="reviews__score">5,0</span>
              <div>
                <Stars className="stars--lg" />
                <span className="reviews__count">на основе 120+ отзывов</span>
              </div>
            </div>
          </Reveal>
          <Reveal className="reviews__actions" delay={150}>
            <a href="#" className="btn btn--ghost">
              Читать все отзывы <ArrowRight />
            </a>
            <div className="slider-arrows">
              <button className="round-btn" aria-label="Назад" onClick={prev} disabled={!canPrev}>
                <ArrowLeft />
              </button>
              <button className="round-btn" aria-label="Вперёд" onClick={next} disabled={!canNext}>
                <ArrowRight />
              </button>
            </div>
          </Reveal>
        </div>

        <div className="track reviews__track" ref={trackRef}>
          {reviews.map((r, i) => (
            <Reveal as="article" className="review" key={r.name} delay={i * 120}>
              <Quote className="review__quote" />
              <p className="review__text">{r.text}</p>
              <div className="review__author">
                <img src={r.avatar} alt="" className="review__avatar" loading="lazy" />
                <div>
                  <span className="review__name">{r.name}</span>
                  <Stars />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
