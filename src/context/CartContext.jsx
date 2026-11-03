import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { dishes, isPromoActive, promoPrice } from '../data/content.js'

const CartContext = createContext(null)
const STORAGE_KEY = 'ohotnik-cart'

const loadItems = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    // оставляем только блюда, которые ещё есть в меню
    return Object.fromEntries(Object.entries(saved).filter(([id, q]) => dishes.some((d) => d.id === +id) && q > 0))
  } catch {
    return {}
  }
}

export function CartProvider({ children }) {
  // { [dishId]: quantity }
  const [items, setItems] = useState(loadItems)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // приватный режим или запрет хранилища — корзина просто не запомнится
    }
  }, [items])

  const value = useMemo(() => {
    const promo = isPromoActive()
    const lines = Object.entries(items)
      .map(([id, qty]) => {
        const dish = dishes.find((d) => d.id === +id)
        if (!dish) return null
        const price = promo ? promoPrice(dish.price) : dish.price
        return { ...dish, qty, price, oldPrice: promo ? dish.price : null, sum: price * qty }
      })
      .filter(Boolean)

    const setQty = (id, qty) =>
      setItems((prev) => {
        const next = { ...prev }
        if (qty > 0) next[id] = Math.min(qty, 99)
        else delete next[id]
        return next
      })

    return {
      items,
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      total: lines.reduce((s, l) => s + l.sum, 0),
      add: (id, qty = 1) => setItems((prev) => ({ ...prev, [id]: Math.min((prev[id] || 0) + qty, 99) })),
      setQty,
      clear: () => setItems({}),
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }
  }, [items, isOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
