import TableVenuePage from './TableVenuePage.jsx'
import { karaokeInfo } from '../data/content.js'

export default function KaraokePage() {
  return <TableVenuePage venue="Караоке" title="В ресторане «Охотник» открылся новый зал — Караоке" lead="Отдельный зал для караоке и банкетов. Забронируйте стол заранее." schedule={karaokeInfo.schedule} tagline={karaokeInfo.tagline} deposit={karaokeInfo.deposit} />
}
