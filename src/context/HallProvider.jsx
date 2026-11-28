import { useEffect, useMemo, useState } from 'react'
import { halls as initialHalls, karaokeInfo } from '../data/content.js'
import { HallContext } from './HallContext.js'

export function HallProvider({ children }) {
  const [halls, setHalls] = useState(initialHalls)

  useEffect(() => {
    let active = true
    fetch('/api/halls.php', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active && Array.isArray(data?.halls)) {
          const oldSchedule = ['Четверг — не работает', 'Пятница — 20:00–04:00', 'Суббота — 18:00–04:00', 'Воскресенье — 20:00–02:00']
          setHalls(data.halls.map((hall) => {
            const isLegacyKaraoke = hall.id === 'fireplace' && hall.karaoke?.schedule?.some((item) => oldSchedule.includes(item))
            return isLegacyKaraoke ? { ...hall, karaoke: { ...hall.karaoke, ...karaokeInfo } } : hall
          }))
        }
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const value = useMemo(() => ({ halls, setHalls }), [halls])
  return <HallContext.Provider value={value}>{children}</HallContext.Provider>
}
