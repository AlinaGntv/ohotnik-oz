import { useEffect, useState } from 'react'
import Logo from './Logo.jsx'
import { ArrowRight, Cart, Phone, Telegram, Whatsapp, Max } from './Icons.jsx'
import { contacts, navLinks } from '../data/content.js'
import { useCart } from '../context/CartContext.jsx'
import './Header.css'

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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  const activeLabel = navLinks.find((l) => l.href === active)?.label

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''} ${menuOpen ? 'header--open' : ''}`}>
      <div className="container header__inner">
        <Logo size={scrolled ? 58 : 88} />

        <nav className="header__nav" aria-label="Основная навигация">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`header__link ${link.label === activeLabel ? 'is-active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <a href={contacts.phoneHref} className="header__phone">
            <Phone />
            <span>{contacts.phone}</span>
          </a>
          <div className="header__messengers">
            <a href="#" className="msg" aria-label="WhatsApp"><Whatsapp /></a>
            <a href="#" className="msg" aria-label="MAX"><Max /></a>
            <a href="#" className="msg" aria-label="Telegram"><Telegram /></a>
          </div>
          <a href="#menu" className="header__cart" aria-label="Корзина">
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
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
