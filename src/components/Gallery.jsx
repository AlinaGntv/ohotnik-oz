import Reveal from './Reveal.jsx'
import { ArrowLeft, ArrowRight } from './Icons.jsx'
import { gallery } from '../data/content.js'
import useSlider from '../hooks/useSlider.js'
import './Gallery.css'

export default function Gallery() {
  const { ref: trackRef, canPrev, canNext, prev, next } = useSlider()

  return (
    <section className="gallery section">
      <div className="container">
        <div className="section-head">
          <Reveal className="section-head__text">
            <span className="eyebrow">Галерея</span>
            <h2 className="section-title">Атмосфера «Охотника»</h2>
            <p className="lead">Интерьеры, блюда, мероприятия и природа вокруг нашего ресторана.</p>
          </Reveal>
          <Reveal className="slider-arrows" delay={150}>
            <button className="round-btn" aria-label="Предыдущие фото" onClick={prev} disabled={!canPrev}>
              <ArrowLeft />
            </button>
            <button className="round-btn" aria-label="Следующие фото" onClick={next} disabled={!canNext}>
              <ArrowRight />
            </button>
          </Reveal>
        </div>
      </div>

      <div className="track gallery__track" ref={trackRef}>
        {gallery.map((src, i) => (
          <Reveal variant="mask" className="gallery__item" key={src} delay={Math.min(i, 4) * 100}>
            <img className="img-cover" src={src} alt={`Фото ресторана ${i + 1}`} loading="lazy" />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
