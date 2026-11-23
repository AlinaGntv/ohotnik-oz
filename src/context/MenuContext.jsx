import { useEffect, useMemo, useState } from 'react'
import { dishes as initialDishes, menuCategories as initialCategories } from '../data/content.js'
import { MenuContext } from './menuContext.js'

export function MenuProvider({ children }) {
  const [dishes, setDishes] = useState(initialDishes)
  const [categories, setCategories] = useState(initialCategories)

  useEffect(() => {
    let active = true
    fetch('/api/menu.php', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!active || !Array.isArray(data?.dishes)) return
        setDishes(data.dishes)
        if (Array.isArray(data.categories) && data.categories.length) setCategories(data.categories)
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const value = useMemo(() => ({ dishes, categories, setDishes, setCategories }), [dishes, categories])
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}
