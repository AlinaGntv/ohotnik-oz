import { useEffect } from 'react'
import './PageHero.css'

// Верхний блок внутренних страниц: тёмный фон с фото, заголовок и подзаголовок.
export default function PageHero({ eyebrow, title, lead, image, children }) {
  useEffect(() => {
    document.title = `${title} — Охотник`
    return () => {
      document.title = 'Охотник — ресторан с историей'
    }
  }, [title])

  return (
    <section className="page-hero dark">
      {image && <img className="page-hero__bg img-cover" src={image} alt="" />}
      <div className="page-hero__overlay" />
      <div className="container page-hero__inner">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="page-hero__title">{title}</h1>
        {lead && <p className="page-hero__lead">{lead}</p>}
        {children && <div className="page-hero__actions">{children}</div>}
      </div>
    </section>
  )
}
