import Logo from './Logo.jsx'
import Reveal from './Reveal.jsx'
import { Clock, Instagram, Phone, Pin, Telegram, Vk } from './Icons.jsx'
import { contacts, navLinks } from '../data/content.js'
import './Footer.css'

export default function Footer() {
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
            <a href="#" aria-label="ВКонтакте"><Vk /></a>
            <a href="#" aria-label="Instagram"><Instagram /></a>
            <a href="#" aria-label="Telegram"><Telegram /></a>
          </div>
        </Reveal>

        <Reveal as="nav" className="footer__col" delay={100} aria-label="Навигация в подвале">
          <h3 className="footer__heading">Навигация</h3>
          <ul className="footer__links">
            {navLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
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
        <span>© 2026 Охотник. Все права защищены.</span>
        <div className="footer__legal">
          <a href="#">Политика конфиденциальности</a>
          <a href="#">Пользовательское соглашение</a>
        </div>
      </div>
    </footer>
  )
}
