import { ArrowDown, ArrowRight, Clock, Pin, Truck } from './Icons.jsx'
import { contacts, images } from '../data/content.js'
import useParallax from '../hooks/useParallax.js'
import './Hero.css'

export default function Hero() {
  const bgRef = useParallax(-0.25)

  return (
    <section className="hero dark" id="top">
      <div className="hero__bg" ref={bgRef}>
        <img className="img-cover" src={images.hero} alt="" fetchPriority="high" />
      </div>
      <div className="hero__overlay" />

      <div className="container hero__content">
        <span className="eyebrow hero__anim" style={{ '--i': 0 }}>
          Fusion restaurant
        </span>
        <h1 className="hero__title">
          <span className="hero__line">
            <span style={{ '--i': 1 }}>Ресторан</span>
          </span>
          <span className="hero__line">
            <span style={{ '--i': 2 }}>с историей</span>
          </span>
        </h1>
        <p className="hero__text hero__anim" style={{ '--i': 3 }}>
          Кухня на углях, банкеты и отдых
          <br />в лесопарке «Мельница» с 1975 года
        </p>
        <div className="hero__buttons hero__anim" style={{ '--i': 4 }}>
          <a href="#menu" className="btn btn--gold">
            Заказать доставку <ArrowRight />
          </a>
          <a href="#booking" className="btn btn--outline">
            Забронировать стол
          </a>
        </div>
      </div>

      <div className="container hero__bar hero__anim" style={{ '--i': 5 }}>
        <div className="hero__info">
          <Clock />
          <span>{contacts.hoursShort}</span>
        </div>
        <div className="hero__info">
          <Pin />
          <span>{contacts.address}</span>
        </div>
        <div className="hero__info">
          <Truck />
          <span>Доставка по Орехово-Зуеву</span>
        </div>
        <a href="#features" className="hero__scroll">
          Листайте вниз
          <span className="hero__scroll-icon">
            <ArrowDown />
          </span>
        </a>
      </div>
    </section>
  )
}
