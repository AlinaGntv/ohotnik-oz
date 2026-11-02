import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  // { [dishId]: quantity }
  const [items, setItems] = useState({})

  const value = useMemo(() => {
    const add = (id, qty = 1) => setItems((prev) => ({ ...prev, [id]: (prev[id] || 0) + qty }))
    const count = Object.values(items).reduce((sum, q) => sum + q, 0)
    return { items, add, count }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
