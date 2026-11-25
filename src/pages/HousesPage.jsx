import PageHero from '../components/PageHero.jsx'
import Stay from '../components/Stay.jsx'
import LeadForm from '../components/LeadForm.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import { contacts, houses, housesInfo } from '../data/content.js'

export default function HousesPage() {
  return <>
    <PageHero eyebrow="Домики" title="Домики для отдыха (дневные)" lead={`${housesInfo.count} отапливаемых мангальных домиков для отдыха компанией. Домики сдаются на день; ночёвка не предусмотрена.`} image={houses[0]?.image}>
      <a href="#house-booking" className="btn btn--gold">Забронировать домик <ArrowRight /></a>
    </PageHero>
    <Stay mode="houses" />
    <LeadForm id="house-booking" kind="house" title="Бронь дневного домика" lead="Выберите домик и дату отдыха. Администратор перезвонит и подтвердит бронь. Ночёвка в домиках не предусмотрена." submitLabel="Забронировать домик" contactPhones={[{ label: contacts.mobile, href: contacts.mobileHref }, { label: contacts.phone, href: contacts.phoneHref }]} fields={[
      { name: 'option', label: 'Домик', type: 'select', required: true, wide: true, options: houses.map((house) => `${house.name} (${house.guests}, ${house.price} за день)`) },
      { name: 'date', label: 'Дата отдыха', type: 'date', required: true },
      { name: 'guests', label: 'Гостей', type: 'number', required: true, min: 1, max: 60 },
    ]} />
  </>
}
