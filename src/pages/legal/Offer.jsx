import { Link } from 'react-router'
import LegalPage from './LegalPage.jsx'
import { company } from '../../data/content.js'

export default function Offer() {
  return (
    <LegalPage eyebrow="Информация для посетителей" title="Заказы доставки временно не принимаются">
      <p className="legal__lead">
        Сейчас через сайт нельзя оформить заказ блюд с доставкой. Публикация меню и цен носит информационный характер
        и не является офертой на дистанционную продажу блюд.
      </p>

      <h2>1. Продавец</h2>
      <p>
        {company.fullName}, ИНН {company.inn}, ОГРН {company.ogrn}, адрес: {company.legalAddress}. Телефон:{' '}
        <a href={company.contactPhoneHref}>{company.contactPhone}</a>, электронная почта: {company.email}. Полные реквизиты — на
        странице <Link to="/requisites">Реквизиты</Link>.
      </p>

      <p>
        Для бронирования столов, банкетов, домиков и номеров ознакомьтесь с{' '}
        <Link to="/booking-terms">Условиями бронирования</Link>. По вопросам работы ресторана звоните{' '}
        <a href={company.contactPhoneHref}>{company.contactPhone}</a>.
      </p>
    </LegalPage>
  )
}
