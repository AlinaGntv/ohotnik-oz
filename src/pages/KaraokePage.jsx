import TableVenuePage from './TableVenuePage.jsx'
import { karaokeInfo } from '../data/content.js'

export default function KaraokePage() {
  return <TableVenuePage venue="Караоке" title="Караоке в Каминном зале" lead="Проведите вечер или банкет в Каминном зале с караоке. Забронируйте стол заранее." image="/images/hall-fireplace.webp" schedule={karaokeInfo.schedule} />
}
