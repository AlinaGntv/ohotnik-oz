import TableVenuePage from './TableVenuePage.jsx'
import { images } from '../data/content.js'

export default function VerandaPage() {
  return <TableVenuePage venue="Лесная веранда" title="Тёплая лесная веранда" lead="Забронируйте стол в тёплой лесной веранде для спокойного отдыха среди природы." image={images.aboutNew} />
}
