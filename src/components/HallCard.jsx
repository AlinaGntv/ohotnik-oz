import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Users } from './Icons.jsx'
import './Events.css'

export default function HallCard({ hall }) {
  const slides = [
    ...(hall.images ?? [hall.image]).filter(Boolean).map((src) => ({ type: 'image', src })),
    ...(hall.video ? [{ type: 'video', src: hall.video, poster: hall.videoPoster }] : []),
  ]
  const [slideIndex, setSlideIndex] = useState(0)
  const activeSlide = slides[slideIndex]

  return (
    <article className="hall">
      <div className="hall__img">
        {activeSlide.type === 'video' ? (
          <video
            key={activeSlide.src}
            className="hall__video"
            controls
            playsInline
            preload="none"
            poster={activeSlide.poster}
            aria-label={`Видео: ${hall.name}`}
          >
            <source src={activeSlide.src} type="video/mp4" />
          </video>
        ) : (
          <img className="img-cover" src={activeSlide.src} alt={hall.name} loading="lazy" />
        )}
        {slides.length > 1 && (
          <div className="hall__photo-controls" aria-label="Фото и видео зала">
            <button
              type="button"
              aria-label="Предыдущий слайд"
              onClick={() => setSlideIndex((index) => (index - 1 + slides.length) % slides.length)}
            >
              <ArrowLeft />
            </button>
            <span>{slideIndex + 1} / {slides.length}{activeSlide.type === 'video' ? ' · Видео' : ''}</span>
            <button
              type="button"
              aria-label="Следующий слайд"
              onClick={() => setSlideIndex((index) => (index + 1) % slides.length)}
            >
              <ArrowRight />
            </button>
          </div>
        )}
        <span className="hall__capacity">
          <Users />
          {hall.capacity}
        </span>
      </div>
      <div className="hall__body">
        <h3 className="hall__name">{hall.name}</h3>
        <ul className="hall__features">
          {hall.description && <p className="hall__description">{hall.description}</p>}
          {(hall.features || []).map((f) => (
            <li key={f}>
              <Check />
              {f}
            </li>
          ))}
        </ul>
        {(hall.rent || (hall.extras || []).length > 0) && (
          <dl className="hall__prices">
            {hall.rent && (
              <div>
                <dt>Аренда зала</dt>
                <dd>{hall.rent}</dd>
              </div>
            )}
            {(hall.extras || []).map((e) => (
              <div key={e.label}>
                <dt>{e.label}</dt>
                <dd>{e.price}</dd>
              </div>
            ))}
          </dl>
        )}
        {hall.link && <a href={hall.link} target="_blank" rel="noopener noreferrer" className="hall__link">
          Подробнее о зале <ArrowRight />
        </a>}
      </div>
    </article>
  )
}
