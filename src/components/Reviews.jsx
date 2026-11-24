import Reveal from './Reveal.jsx'
import { ArrowLeft, ArrowRight, Quote, Star } from './Icons.jsx'
import { reviews, yandexReviewsUrl, yandexReviewSummary } from '../data/content.js'
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
              <span className="reviews__score">{yandexReviewSummary.rating}</span>
              <div>
                <Stars className="stars--lg" />
                <span className="reviews__count">{yandexReviewSummary.count} на Яндекс Картах</span>
              </div>
            </div>
          </Reveal>
          <Reveal className="reviews__actions" delay={150}>
            <a href={yandexReviewsUrl} className="btn btn--ghost" target="_blank" rel="noreferrer">
              Читать на Яндекс Картах <ArrowRight />
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
            <Reveal as="article" className="review" key={`${r.name}-${r.date}`} delay={i * 120}>
              <Quote className="review__quote" />
              <p className="review__text">{r.text}</p>
              <div className="review__author">
                <div className="review__byline">
                  <span className="review__name">{r.name}</span>
                  <span className="review__date">{r.date}</span>
                </div>
                <a className="review__source" href={yandexReviewsUrl} target="_blank" rel="noreferrer" aria-label={`Открыть отзыв ${r.name} на Яндекс Картах`}>
                  {r.source}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
