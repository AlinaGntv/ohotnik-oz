import LegalPage from './LegalPage.jsx'
import { company } from '../../data/content.js'

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
    ['Телефон для обращений', company.contactPhone],
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
