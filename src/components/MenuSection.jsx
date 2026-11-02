import { useState } from 'react'
import Reveal from './Reveal.jsx'
import { ArrowLeft, ArrowRight, Cart } from './Icons.jsx'
import { dishes, isPromoActive, menuCategories, promo, promoPrice } from '../data/content.js'
import { useCart } from '../context/CartContext.jsx'
import useSlider from '../hooks/useSlider.js'
import './MenuSection.css'

function DishCard({ dish, promoActive }) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const { add } = useCart()

  const handleAdd = () => {
    add(dish.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <article className="dish">
      <div className="dish__img">
        <img className="img-cover" src={dish.image} alt={dish.name} loading="lazy" />
        <span className="dish__weight">{dish.weight}</span>
        {promoActive && <span className="dish__sale">−{promo.discount}%</span>}
      </div>
      <div className="dish__body">
        <h3 className="dish__name">{dish.name}</h3>
        <div className="dish__footer">
          {promoActive ? (
            <span className="dish__price">
              {promoPrice(dish.price)} ₽<s className="dish__old-price">{dish.price} ₽</s>
            </span>
          ) : (
            <span className="dish__price">{dish.price} ₽</span>
          )}
          <div className="qty">
            <button aria-label="Уменьшить" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              −
            </button>
            <span>{qty}</span>
            <button aria-label="Увеличить" onClick={() => setQty((q) => q + 1)}>
              +
            </button>
          </div>
          <button
            className={`dish__cart ${added ? 'is-added' : ''}`}
            aria-label="Добавить в корзину"
            onClick={handleAdd}
          >
            {added ? <span className="dish__check">✓</span> : <Cart />}
          </button>
        </div>
      </div>
    </article>
  )
}

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
            <a href="#menu" className="btn btn--ghost">
              Перейти в меню <ArrowRight />
            </a>
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
