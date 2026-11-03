import PageHero from '../components/PageHero.jsx'
import Stay from '../components/Stay.jsx'
import LeadForm from '../components/LeadForm.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import { houses, housesInfo, rooms } from '../data/content.js'

export default function StayPage() {
  return (
    <>
      <PageHero
        eyebrow="Отдых и проживание"
        title="Домики и номера в лесопарке"
        lead={`${housesInfo.count} отапливаемых мангальных домиков на компании до 60 человек и ${rooms.count} гостиничных номеров. Отметить можно абсолютно любой праздник.`}
        image={houses[0].image}
      >
        <a href="#stay-form" className="btn btn--gold">
          Забронировать <ArrowRight />
        </a>
      </PageHero>

      <Stay headless />

      <LeadForm
        id="stay-form"
        kind="stay"
        title="Бронь домика или номера"
        lead="Укажите, что хотите забронировать, дату и количество гостей — администратор перезвонит и подтвердит бронь."
        submitLabel="Забронировать"
        fields={[
          {
            name: 'option',
            label: 'Что бронируем',
            type: 'select',
            required: true,
            wide: true,
            options: houses.map((h) => `${h.name} (${h.guests}, ${h.price})`).concat('Гостиничный номер'),
          },
          { name: 'date', label: 'Дата заезда', type: 'date', required: true },
          { name: 'guests', label: 'Гостей', type: 'number', required: true, min: 1, max: 60 },
        ]}
      />
    </>
  )
}
