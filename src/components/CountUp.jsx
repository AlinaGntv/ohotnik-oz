import { useEffect, useState } from 'react'
import useInView from '../hooks/useInView.js'

const format = (n) => n.toLocaleString('ru-RU').replace(/ /g, ' ')

// Плавно «досчитывает» число вида "100 000+" при появлении на экране.
export default function CountUp({ value, duration = 1800 }) {
  const target = parseInt(value.replace(/\D/g, ''), 10) || 0
  const suffix = value.replace(/[\d\s]/g, '')
  const [ref, inView] = useInView({ threshold: 0.5 })
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!inView) return
    let frame
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 4)
      setCurrent(Math.round(target * eased))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, target, duration])

  return (
    <span ref={ref}>
      {format(current)}
      {suffix}
    </span>
  )
}
