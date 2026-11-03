import { useState } from 'react'
import { Link } from 'react-router'
import Reveal from './Reveal.jsx'
import DishCard from './DishCard.jsx'
import { ArrowLeft, ArrowRight } from './Icons.jsx'
import { dishes, isPromoActive, menuCategories } from '../data/content.js'
import useSlider from '../hooks/useSlider.js'
import './MenuSection.css'

export default function MenuSection() {
  const [category, setCategory] = useState(menuCategories[0])
  const list = dishes.filter((d) => d.category === category)
  const promoActive = isPromoActive()
  const { ref: trackRef, canPrev, canNext, prev, next } = useSlider([category])

  return (
    <section className="menu section" id="menu">
      <div className="container">
        <div className="section-head">
          <Reveal className="section-head__text">
            <span className="eyebrow">Наше меню</span>
            <h2 className="section-title">Блюда на любой вкус</h2>
            <p className="lead">
              Авторская кухня, сочные блюда на углях, свежие салаты, горячее, закуски и десерты.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <Link to="/menu" className="btn btn--ghost">
              Всё меню <ArrowRight />
            </Link>
          </Reveal>
        </div>

        <Reveal className="menu__top" delay={100}>
          <div className="menu__tabs" role="tablist">
            {menuCategories.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={c === category}
                className={`tab ${c === category ? 'is-active' : ''}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="slider-arrows">
            <button className="round-btn" aria-label="Назад" onClick={prev} disabled={!canPrev}>
              <ArrowLeft />
            </button>
            <button className="round-btn" aria-label="Вперёд" onClick={next} disabled={!canNext}>
              <ArrowRight />
            </button>
          </div>
        </Reveal>

        <div className="track menu__track" ref={trackRef} key={category}>
          {list.length ? (
            list.map((d, i) => (
              <Reveal className="menu__item" key={d.id} delay={i * 90}>
                <DishCard dish={d} promoActive={promoActive} />
              </Reveal>
            ))
          ) : (
            <p className="menu__empty">Скоро здесь появятся блюда этой категории.</p>
          )}
        </div>
      </div>
    </section>
  )
}
