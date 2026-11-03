import { Link } from 'react-router'
import PageHero from '../components/PageHero.jsx'
import HallCard from '../components/HallCard.jsx'
import LeadForm from '../components/LeadForm.jsx'
import Reveal from '../components/Reveal.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import { banquetTerms, halls, occasions, rooms } from '../data/content.js'
import '../components/Events.css'
import './BanquetsPage.css'

const steps = [
  ['Заявка', 'Оставьте заявку на сайте или позвоните нам — укажите дату, количество гостей и повод.'],
  ['Звонок администратора', 'Уточним детали, проверим свободные даты и подберём подходящий зал.'],
  ['Встреча и меню', 'Приглашаем посмотреть зал, вместе составляем меню и оформление под ваш бюджет.'],
  ['Договор', 'Фиксируем дату, меню и условия — и готовимся к вашему празднику.'],
]

export default function BanquetsPage() {
  return (
    <>
      <PageHero
        eyebrow="Банкеты и события"
        title="Банкеты в лесопарке «Мельница»"
        lead="Три зала и банкетный шатёр — от камерного ужина на 25 гостей до свадьбы на 280 человек. Кухня на углях, выездная регистрация и парковка на 100 мест."
        image={halls[0].image}
      >
        <a href="#banquet-form" className="btn btn--gold">
          Оставить заявку <ArrowRight />
        </a>
      </PageHero>

      <section className="events section">
        <div className="container">
          <Reveal className="section-head">
            <div className="section-head__text">
              <span className="eyebrow">Залы</span>
              <h2 className="section-title">Выберите пространство</h2>
            </div>
          </Reveal>
          <div className="events__grid">
            {halls.map((h, i) => (
              <Reveal key={h.name} delay={(i % 2) * 140}>
                <HallCard hall={h} />
              </Reveal>
            ))}
          </div>
          <Reveal as="ul" className="events__terms">
            {banquetTerms.map((t) => (
              <li key={t.label}>
                <strong>{t.value}</strong>
                <span>{t.label}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="banquets-occasions section dark">
        <div className="container">
          <Reveal className="section-head">
            <div className="section-head__text">
              <span className="eyebrow">Поводы</span>
              <h2 className="section-title">Что у нас празднуют</h2>
            </div>
          </Reveal>
          <ul className="banquets-occasions__grid">
            {occasions.map((o, i) => (
              <Reveal as="li" key={o.title} delay={(i % 3) * 100} className="banquets-occasions__item">
                <h3>{o.title}</h3>
                <p>{o.text}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal className="banquets-occasions__extra">
            <p>
              Гостям банкета — <strong>скидка 20%</strong> на {rooms.count} гостиничных номеров, а на второй день
              свадьбы — <strong>−50%</strong> на мангальные домики.
            </p>
            <Link to="/stay" className="btn btn--outline btn--sm">
              Проживание <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="banquets-steps section">
        <div className="container">
          <Reveal className="section-head">
            <div className="section-head__text">
              <span className="eyebrow">Как это работает</span>
              <h2 className="section-title">Бронирование банкета</h2>
            </div>
          </Reveal>
          <ol className="banquets-steps__list">
            {steps.map(([title, text], i) => (
              <Reveal as="li" key={title} delay={i * 110}>
                <span className="banquets-steps__num">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <LeadForm
        id="banquet-form"
        kind="banquet"
        title="Заявка на банкет"
        lead="Администратор перезвонит, расскажет о свободных датах и поможет выбрать зал и меню."
        submitLabel="Отправить заявку"
        fields={[
          { name: 'date', label: 'Дата', type: 'date', required: true },
          { name: 'guests', label: 'Гостей', type: 'number', required: true, min: 1, max: 300 },
          { name: 'occasion', label: 'Повод', type: 'select', required: true, options: occasions.map((o) => o.title).concat('Другое') },
          { name: 'hall', label: 'Зал', type: 'select', placeholder: 'Помогите выбрать', options: halls.map((h) => h.name) },
        ]}
      />
    </>
  )
}
