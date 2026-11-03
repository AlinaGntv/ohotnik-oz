import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import Logo from './Logo.jsx'
import { ArrowRight, Cart, Phone, Telegram, Whatsapp, Max } from './Icons.jsx'
import { contacts, navLinks } from '../data/content.js'
import { useCart } from '../context/cart.js'
import './Header.css'

const Messengers = ({ className = '' }) => (
  <div className={`messengers ${className}`}>
    <a href="#" className="msg" aria-label="WhatsApp"><Whatsapp /></a>
    <a href="#" className="msg" aria-label="MAX"><Max /></a>
    <a href="#" className="msg" aria-label="Telegram"><Telegram /></a>
  </div>
)

// Пункт меню: отдельная страница — через роутер, раздел главной — обычной ссылкой-якорем.
// Вне Header, чтобы ссылки не пересоздавались при каждом рендере (ломались бы анимации меню).
function NavItem({ link, className, isHome, pathname, activeLabel, ...rest }) {
  const isPage = link.href.startsWith('/')
  const isActive = isPage ? pathname === link.href : link.label === activeLabel
  const cls = `${className} ${isActive ? 'is-active' : ''}`
  return isPage ? (
    <Link to={link.href} className={cls} {...rest} />
  ) : (
    <a href={isHome ? link.href : `/${link.href}`} className={cls} {...rest} />
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')
  const { count, open: openCart } = useCart()
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  // ссылки на секции главной: на других страницах ведут на /#секция
  const toSection = (href) => (isHome ? href : `/${href}`)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // подсветка пункта меню текущей секции (только на главной)
  useEffect(() => {
    if (!isHome) return
    const ids = navLinks.filter((l) => l.href.startsWith('#')).map((l) => l.href.slice(1))
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
  }, [isHome])

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

  const activeLabel = isHome ? navLinks.find((l) => l.href === active)?.label : undefined
  const close = () => setMenuOpen(false)
  const navProps = { isHome, pathname, activeLabel }


  return (
    <>
      {/* на внутренних страницах нет тёмного первого экрана — шапка сразу с фоном */}
      <header className={`header ${scrolled || !isHome ? 'header--scrolled' : ''} ${menuOpen ? 'header--open' : ''}`}>
        <div className="container header__inner">
          <Logo size={scrolled || menuOpen || !isHome ? 58 : 88} />

          <nav className="header__nav" aria-label="Основная навигация">
            {navLinks.map((link) => (
              <NavItem key={link.label} link={link} className="header__link" {...navProps}>
                {link.label}
              </NavItem>
            ))}
          </nav>

          <div className="header__actions">
            <a href={contacts.phoneHref} className="header__phone" aria-label={`Позвонить: ${contacts.phone}`}>
              <Phone />
              <span>{contacts.phone}</span>
            </a>
            <Messengers className="header__messengers" />
            <button
              className="header__cart"
              aria-label={count ? `Корзина, блюд: ${count}` : 'Корзина'}
              onClick={() => {
                close()
                openCart()
              }}
            >
              <Cart />
              {count > 0 && (
                <span className="header__cart-badge" key={count}>
                  {count}
                </span>
              )}
            </button>
            <a href={toSection('#booking')} className="btn btn--gold btn--sm header__cta">
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
            <NavItem key={link.label} link={link} className="mobile-menu__link" style={{ '--i': i }} onClick={close} {...navProps}>
              {link.label}
              <ArrowRight />
            </NavItem>
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
          <a href={toSection('#booking')} className="btn btn--gold mobile-menu__cta" onClick={close}>
            Забронировать стол <ArrowRight />
          </a>
        </div>
      </div>
    </>
  )
}
