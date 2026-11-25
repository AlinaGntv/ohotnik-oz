import PageHero from '../components/PageHero.jsx'
import Stay from '../components/Stay.jsx'
import LeadForm from '../components/LeadForm.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import { contacts, rooms } from '../data/content.js'

export default function HotelPage() {
  return <>
    <PageHero eyebrow="Гостиница" title="Гостиница в лесопарке «Мельница»" lead={`${rooms.count} гостиничных номеров для отдыха с ночёвкой.`} image={rooms.image}>
      <a href="#hotel-booking" className="btn btn--gold">Забронировать номер <ArrowRight /></a>
    </PageHero>
    <Stay mode="hotel" />
    <LeadForm id="hotel-booking" kind="stay" title="Бронь гостиничного номера" lead="Оставьте контакты и дату заезда — администратор уточнит наличие и подтвердит бронь." submitLabel="Забронировать номер" contactPhones={[{ label: contacts.mobile, href: contacts.mobileHref }, { label: contacts.phone, href: contacts.phoneHref }]} fields={[
      { name: 'option', label: 'Что бронируем', type: 'select', required: true, wide: true, options: ['Гостиничный номер'] },
      { name: 'date', label: 'Дата заезда', type: 'date', required: true },
      { name: 'guests', label: 'Гостей', type: 'number', required: true, min: 1, max: 10 },
    ]} />
  </>
}
