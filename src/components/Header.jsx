import { useEffect, useState } from 'react'
import Logo from './Logo.jsx'
import { ArrowRight, Cart, Phone, Telegram, Whatsapp, Max } from './Icons.jsx'
import { contacts, navLinks } from '../data/content.js'
import { useCart } from '../context/CartContext.jsx'
import './Header.css'

const Messengers = ({ className = '' }) => (
  <div className={`messengers ${className}`}>
    <a href="#" className="msg" aria-label="WhatsApp"><Whatsapp /></a>
    <a href="#" className="msg" aria-label="MAX"><Max /></a>
    <a href="#" className="msg" aria-label="Telegram"><Telegram /></a>
  </div>
)

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')
  const { count } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // подсветка пункта меню текущей секции
  useEffect(() => {
    const ids = [...new Set(navLinks.map((l) => l.href.slice(1)))]
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // блокируем прокрутку страницы под открытым меню и закрываем его по Esc
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // при повороте/расширении экрана до десктопа мобильное меню не нужно
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1025px)')
    const onChange = (e) => e.matches && setMenuOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const activeLabel = navLinks.find((l) => l.href === active)?.label
  const close = () => setMenuOpen(false)

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''} ${menuOpen ? 'header--open' : ''}`}>
        <div className="container header__inner">
          <Logo size={scrolled || menuOpen ? 58 : 88} />

          <nav className="header__nav" aria-label="Основная навигация">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`header__link ${link.label === activeLabel ? 'is-active' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="header__actions">
            <a href={contacts.phoneHref} className="header__phone" aria-label={`Позвонить: ${contacts.phone}`}>
              <Phone />
              <span>{contacts.phone}</span>
            </a>
            <Messengers className="header__messengers" />
            <a href="#menu" className="header__cart" aria-label="Корзина" onClick={close}>
              <Cart />
              {count > 0 && (
                <span className="header__cart-badge" key={count}>
                  {count}
                </span>
              )}
            </a>
            <a href="#booking" className="btn btn--gold btn--sm header__cta">
              Забронировать стол <ArrowRight />
            </a>
            <button
              className="header__burger"
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Мобильное меню — отдельный слой вне шапки, чтобы он всегда занимал весь экран */}
      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} inert={!menuOpen}>
        <nav className="mobile-menu__nav" aria-label="Мобильная навигация">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className={`mobile-menu__link ${link.label === activeLabel ? 'is-active' : ''}`}
              style={{ '--i': i }}
              onClick={close}
            >
              {link.label}
              <ArrowRight />
            </a>
          ))}
        </nav>

        <div className="mobile-menu__footer" style={{ '--i': navLinks.length }}>
          <a href={contacts.phoneHref} className="mobile-menu__phone">
            <Phone />
            <span>
              <small>Звоните, мы на связи</small>
              {contacts.phone}
            </span>
          </a>
          <Messengers className="mobile-menu__messengers" />
          <a href="#booking" className="btn btn--gold mobile-menu__cta" onClick={close}>
            Забронировать стол <ArrowRight />
          </a>
        </div>
      </div>
    </>
  )
}
