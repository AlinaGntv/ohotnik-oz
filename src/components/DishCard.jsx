import { useState } from 'react'
import { Cart } from './Icons.jsx'
import { promo, promoPrice } from '../data/content.js'
import { useCart } from '../context/cart.js'
import './MenuSection.css'

export default function DishCard({ dish, promoActive }) {
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
