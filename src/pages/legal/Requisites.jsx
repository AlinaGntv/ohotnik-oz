import LegalPage from './LegalPage.jsx'
import { company, contacts } from '../../data/content.js'

export default function Requisites() {
  const rows = [
    ['Полное наименование', company.fullName],
    ['Сокращённое наименование', company.shortName],
    ['ИНН', company.inn],
    ['КПП', company.kpp],
    ['ОГРН', company.ogrn],
    ['Юридический адрес', company.legalAddress],
    ['Адрес ресторана', company.actualAddress],
    ['Генеральный директор', company.director],
    ['Банк', company.bank.name],
    ['Расчётный счёт', company.bank.account],
    ['Корреспондентский счёт', company.bank.corrAccount],
    ['БИК', company.bank.bik],
    ['Телефон', contacts.phone],
    ['Электронная почта', company.email],
  ]

  return (
    <LegalPage eyebrow="О компании" title="Реквизиты" showDate={false}>
      <table className="legal__table">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </LegalPage>
  )
}
