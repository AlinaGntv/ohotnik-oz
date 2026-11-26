import { useState } from 'react'
import { Link } from 'react-router'
import Reveal from './Reveal.jsx'
import { ArrowRight, Check, Clock, Users } from './Icons.jsx'
import { houses, housesInfo, rooms } from '../data/content.js'
import './Stay.css'

function HousePhoto({ house }) {
  const photos = house.photos?.length ? house.photos : [{ src: house.image, alt: house.name }]
  const [activePhoto, setActivePhoto] = useState(0)

  return <div className="house__img">
    <img className="img-cover" src={photos[activePhoto].src} alt={photos[activePhoto].alt} loading="lazy" />
    <span className="house__guests"><Users />{house.guests}</span>
    {photos.length > 1 && <div className="house__gallery" role="group" aria-label={`Фотографии: ${house.name}`}>
      {photos.map((photo, index) => <button
        key={photo.src}
        type="button"
        className={`house__gallery-thumb${activePhoto === index ? ' is-active' : ''}`}
        aria-label={`Показать фото ${index + 1}: ${photo.alt}`}
        aria-pressed={activePhoto === index}
        onClick={() => setActivePhoto(index)}
      >
        <img src={photo.src} alt="" loading="lazy" />
      </button>)}
    </div>}
  </div>
}

function HousesBlock() {
  return <div id="houses" className="stay__part">
    <div className="section-head">
      <div className="section-head__text">
        <span className="eyebrow">Домики</span>
        <h2 className="section-title">Домики для отдыха (дневные)</h2>
        <p className="lead">Домики сдаются для отдыха в течение дня. Ночёвка в домиках не предусмотрена.</p>
      </div>
      <a href="/houses#house-booking" className="btn btn--outline">Подробнее и бронь <ArrowRight /></a>
    </div>
    <div className="stay__houses">
      {houses.map((h, i) => (
        <Reveal key={h.name} delay={i * 100}>
          <article className="house">
            <HousePhoto house={h} />
            <div className="house__body">
              <h3 className="house__name">{h.name}</h3>
              <p className="house__hours"><Clock />{housesInfo.hours}</p>
              <div className="house__price"><strong>{h.price}</strong><span>за день</span></div>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
    <Reveal className="stay__amenities">
      <span className="stay__amenities-title">В каждом домике</span>
      <ul>{housesInfo.amenities.map((item) => <li key={item}><Check />{item}</li>)}</ul>
    </Reveal>
  </div>
}

function HotelBlock() {
  return <div id="hotel" className="stay__part stay__hotel">
    <div className="section-head">
      <div className="section-head__text">
        <span className="eyebrow">Гостиница</span>
        <h2 className="section-title">Номера для ночёвки</h2>
        <p className="lead">Для проживания с ночёвкой бронируйте гостиничный номер.</p>
      </div>
      <a href="/hotel#hotel-booking" className="btn btn--outline">Гостиница и бронь <ArrowRight /></a>
    </div>
    <div className="stay__offers stay__offers--hotel">
      <article className="offer offer--rooms">
        <img className="img-cover offer__bg" src={rooms.image} alt="" loading="lazy" />
        <div className="offer__content">
          <span className="offer__tag">Гостиница</span>
          <h3 className="offer__title">{rooms.count} гостиничных номеров</h3>
          <p className="offer__text">При бронировании банкетного зала — <strong>скидка 20%</strong> на гостиничный номер.</p>
          <Link to="/hotel" className="offer__link">Подробнее и бронь <ArrowRight /></Link>
        </div>
      </article>
      <article className="offer offer--wedding">
        <span className="offer__tag">Свадьбам</span>
        <strong className="offer__big">−50%</strong>
        <h3 className="offer__title">на второй день свадьбы</h3>
        <p className="offer__text">Продолжите праздник в дневном мангальном домике со скидкой 50%.</p>
        <Link to="/houses" className="offer__link">Выбрать домик <ArrowRight /></Link>
      </article>
    </div>
  </div>
}

export default function Stay({ mode = 'all' }) {
  return (
    <section className="stay dark section" id={mode === 'all' ? 'stay' : undefined}>
      <div className="container">
        {mode === 'all' ? <>
          <div className="section-head">
            <Reveal className="section-head__text">
              <span className="eyebrow">Отдых и гостиница</span>
              <h2 className="section-title">Выберите формат отдыха</h2>
              <p className="lead">Для отдыха днём — мангальные домики. Для ночёвки — гостиничные номера.</p>
            </Reveal>
          </div>
          <HousesBlock />
          <HotelBlock />
        </> : mode === 'houses' ? <HousesBlock /> : <HotelBlock />}
      </div>
    </section>
  )
}
