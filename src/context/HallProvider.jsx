import { useEffect, useMemo, useState } from 'react'
import { halls as initialHalls } from '../data/content.js'
import { HallContext } from './HallContext.js'

export function HallProvider({ children }) {
  const [halls, setHalls] = useState(initialHalls)

  useEffect(() => {
    let active = true
    fetch('/api/halls.php', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active && Array.isArray(data?.halls)) setHalls(data.halls)
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const value = useMemo(() => ({ halls, setHalls }), [halls])
  return <HallContext.Provider value={value}>{children}</HallContext.Provider>
}
