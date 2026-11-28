import PageHero from '../components/PageHero.jsx'
import LeadForm from '../components/LeadForm.jsx'
import Reveal from '../components/Reveal.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import { contacts } from '../data/content.js'
import './TableVenuePage.css'

export default function TableVenuePage({ venue, title, lead, image, schedule, tagline, deposit }) {
  return <>
    <PageHero eyebrow={venue} title={title} lead={lead} image={image}>
      <a href={`#${venue === 'Караоке' ? 'karaoke' : 'veranda'}-booking`} className="btn btn--gold">Забронировать стол <ArrowRight /></a>
      <a href={contacts.mobileHref} className="btn btn--outline">Позвонить: {contacts.mobile}</a>
    </PageHero>
    {schedule?.length > 0 && <section className="venue-hours section"><div className="container"><Reveal className="venue-hours__card">
      <div><span className="eyebrow">Часы работы</span><h2 className="section-title">Караоке</h2>{tagline && <p className="lead">{tagline}</p>}</div>
      <ul>{schedule.map((item) => <li key={item}>{item}</li>)}</ul>
      {deposit && <p className="venue-hours__deposit">{deposit}</p>}
    </Reveal></div></section>}
    <LeadForm id={`${venue === 'Караоке' ? 'karaoke' : 'veranda'}-booking`} kind="table" venue={venue} title={`Бронь стола — ${venue.toLowerCase()}`} lead="Укажите дату, время и количество гостей. Администратор свяжется с вами и подтвердит бронь." submitLabel="Забронировать стол" contactPhones={[{ label: contacts.mobile, href: contacts.mobileHref }, { label: contacts.phone, href: contacts.phoneHref }]} fields={[
      { name: 'date', label: 'Дата', type: 'date', required: true },
      { name: 'time', label: 'Время', type: 'time', required: true },
      { name: 'guests', label: 'Гостей', type: 'number', required: true, min: 1, max: 60 },
    ]} />
  </>
}
