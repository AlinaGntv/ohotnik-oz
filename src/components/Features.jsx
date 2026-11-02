import Reveal from './Reveal.jsx'
import { Car, ChefHat, Flame, People } from './Icons.jsx'
import './Features.css'

const features = [
  { icon: Flame, title: 'Мангал на живом огне', text: 'Фирменные блюда на натуральных углях' },
  { icon: ChefHat, title: 'Горячий и холодный цех', text: 'Свежие и качественные продукты' },
  { icon: Car, title: 'Доставка горячим', text: 'Быстро и бережно по городу' },
  { icon: People, title: '3 банкетных зала и шатёр', text: 'Для праздников любого масштаба' },
]

export default function Features() {
  return (
    <section className="features dark" id="features">
      <div className="container features__grid">
        {features.map(({ icon: Icon, title, text }, i) => (
          <Reveal className="feature" key={title} delay={i * 120}>
            <span className="feature__icon">
              <Icon />
            </span>
            <h3 className="feature__title">{title}</h3>
            <p className="feature__text">{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
