import TableVenuePage from './TableVenuePage.jsx'
import { karaokeInfo } from '../data/content.js'

export default function KaraokePage() {
  return <TableVenuePage venue="Караоке" title="Новый зал караоке в ресторане «Охотник»" lead="Проведите вечер или любой банкет в новом зале караоке. Забронируйте стол заранее." image="/images/hall-fireplace.webp" schedule={karaokeInfo.schedule} tagline={karaokeInfo.tagline} deposit={karaokeInfo.deposit} />
}
