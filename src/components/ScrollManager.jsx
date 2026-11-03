import { useEffect } from 'react'
import { useLocation } from 'react-router'

// При переходе между страницами — наверх, а по ссылке вида /#menu — к нужной секции
// (секции главной появляются после рендера, поэтому ждём кадр).
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
