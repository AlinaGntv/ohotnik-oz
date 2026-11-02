import { useCallback, useEffect, useRef, useState } from 'react'

// Прокрутка горизонтального трека на ширину одной карточки + состояние кнопок.
export default function useSlider(deps = []) {
  const ref = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.scrollLeft = 0
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const scroll = (dir) => {
    const el = ref.current
    if (!el) return
    const item = el.firstElementChild
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    const step = item ? item.getBoundingClientRect().width + gap : el.clientWidth
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return { ref, canPrev, canNext, prev: () => scroll(-1), next: () => scroll(1) }
}
