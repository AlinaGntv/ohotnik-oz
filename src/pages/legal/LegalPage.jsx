import { useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { ArrowLeft } from '../../components/Icons.jsx'
import { legalLinks, legalUpdated } from '../../data/content.js'
import './LegalPage.css'

// Общий макет юридических страниц: заголовок, дата редакции, текст и ссылки на другие документы.
export default function LegalPage({ eyebrow = 'Документы', title, children, showDate = true }) {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = `${title} — Охотник`
    return () => {
      document.title = 'Охотник — ресторан с историей'
    }
  }, [title])

  return (
    <article className="legal">
      <div className="container legal__inner">
        <Link to="/" className="legal__back">
          <ArrowLeft /> На главную
        </Link>

        <header className="legal__head">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="legal__title">{title}</h1>
          {showDate && <p className="legal__date">Редакция от {legalUpdated}</p>}
        </header>

        <div className="legal__body">{children}</div>

        <nav className="legal__docs" aria-label="Другие документы">
          <span className="legal__docs-title">Другие документы</span>
          <ul>
            {legalLinks
              .filter((l) => l.to !== pathname)
              .map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </article>
  )
}
