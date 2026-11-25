import Reveal from './Reveal.jsx'
import { ArrowRight } from './Icons.jsx'
import { yandexReviewsUrl } from '../data/content.js'
import './Reviews.css'

export default function Reviews() {
  return (
    <section className="reviews section">
      <div className="container">
        <div className="section-head">
          <Reveal className="section-head__text">
            <span className="eyebrow">Отзывы гостей</span>
            <h2 className="section-title">Тёплые слова о «Охотнике»</h2>
            <p className="reviews__intro">
              Впечатления гостей о кухне, залах и праздниках. Оригинальные отзывы загружаются напрямую из Яндекс Карт.
            </p>
          </Reveal>
          <Reveal className="reviews__actions" delay={150}>
            <a href={yandexReviewsUrl} className="btn btn--ghost" target="_blank" rel="noreferrer">
              Все отзывы на Яндексе <ArrowRight />
            </a>
          </Reveal>
        </div>

        <Reveal className="reviews__widget-wrap" delay={100}>
          <iframe
            className="reviews__widget"
            src="https://yandex.ru/maps-reviews-widget/1014180583?comments"
            title="Отзывы о ресторане «Охотник» на Яндекс Картах"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a className="reviews__widget-link" href="https://yandex.ru/maps/org/okhotnik/1014180583/" target="_blank" rel="noreferrer">
            Ресторан «Охотник» на Яндекс Картах
          </a>
        </Reveal>
      </div>
    </section>
  )
}
