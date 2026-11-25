import { Link, useLocation } from 'react-router'
import Logo from './Logo.jsx'
import Reveal from './Reveal.jsx'
import { Clock, Max, Phone, Pin } from './Icons.jsx'
import { company, contacts, legalLinks, navLinks, yandexMapsUrl } from '../data/content.js'
import './Footer.css'

export default function Footer() {
  const isHome = useLocation().pathname === '/'

  return (
    <footer className="footer dark" id="contacts">
      <div className="container footer__inner">
        <Reveal className="footer__brand">
          <Logo size={128} />
          <p>
            Кухня на углях, банкеты и отдых
            <br />в лесопарке «Мельница»
          </p>
          <div className="footer__social">
            <a href="https://max.ru/join/L6GQ4B7pTrO67eVdiG6dFJrQ9MHsXAkH_7ON6jm5t3M" aria-label="Канал в MAX" title="Канал в MAX" target="_blank" rel="noopener noreferrer"><Max /></a>
            <a href={yandexMapsUrl} aria-label="Яндекс Карты" title="Яндекс Карты" target="_blank" rel="noopener noreferrer"><Pin /></a>
          </div>
        </Reveal>

        <Reveal as="nav" className="footer__col" delay={100} aria-label="Навигация в подвале">
          <h3 className="footer__heading">Навигация</h3>
          <ul className="footer__links">
            {navLinks.map((l) => (
              <li key={l.label}>
                {l.href.startsWith('/') ? (
                  <Link to={l.href}>{l.label}</Link>
                ) : (
                  <a href={isHome ? l.href : `/${l.href}`}>{l.label}</a>
                )}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="footer__col" delay={200}>
          <h3 className="footer__heading">Контакты</h3>
          <ul className="footer__contacts">
            <li>
              <Pin />
              <span>{contacts.address}</span>
            </li>
            <li>
              <Phone />
              <a href={contacts.phoneHref}>{contacts.phone}</a>
            </li>
            <li>
              <Phone />
              <a href={contacts.mobileHref}>{contacts.mobile}</a>
            </li>
            <li>
              <Clock />
              <span>{contacts.hours}</span>
            </li>
          </ul>
        </Reveal>

        <Reveal className="footer__map" delay={300} aria-label="Карта проезда">
          <div className="footer__map-pin">
            <Pin />
            <span>Охотник</span>
          </div>
        </Reveal>
      </div>

      <div className="container footer__bottom">
        <div className="footer__company">
          <span>© 2026 Охотник. Все права защищены.</span>
          <span>
            {company.shortName} · ИНН {company.inn} · ОГРН {company.ogrn}
          </span>
          <a className="footer__credit" href="https://chadmetrix.ru/" target="_blank" rel="noopener noreferrer">
            Разработано в AVE
          </a>
        </div>
        <nav className="footer__legal" aria-label="Документы">
          {legalLinks.map((l) => (
            <Link key={l.to} to={l.to}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
