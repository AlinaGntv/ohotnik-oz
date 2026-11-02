import Reveal from './Reveal.jsx'
import CountUp from './CountUp.jsx'
import { ArrowRight } from './Icons.jsx'
import { images, stats } from '../data/content.js'
import useParallax from '../hooks/useParallax.js'
import './About.css'

export default function About() {
  const photoRef = useParallax(0.08)

  return (
    <section className="about section" id="about">
      <div className="container about__inner">
        <div className="about__collage">
          <Reveal variant="mask" className="about__old">
            <img className="img-cover" src={images.aboutOld} alt="Ресторан «Охотник» в 1975 году" loading="lazy" />
            <span className="about__year">1975</span>
          </Reveal>
          <div className="about__new-wrap" ref={photoRef}>
            <Reveal variant="zoom" delay={350} className="about__new">
              <img className="img-cover" src={images.aboutNew} alt="Ресторан «Охотник» сегодня" loading="lazy" />
              <span className="about__new-caption">Охотник сегодня</span>
            </Reveal>
          </div>
        </div>

        <div className="about__content">
          <Reveal>
            <span className="eyebrow">С 1975 года</span>
            <h2 className="section-title">Ресторан с историей</h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="lead about__text">
              Ресторан «Охотник» — это место, где традиции и современный вкус встречаются уже почти 50 лет.
            </p>
            <p className="lead about__text">
              С 1975 года мы создаём атмосферу уюта, гостеприимства и настоящей гастрономической культуры в
              живописном лесопарке «Мельница».
            </p>
          </Reveal>

          <Reveal as="ul" className="about__stats" delay={220}>
            {stats.map((s) => (
              <li key={s.label}>
                <span className="about__stat-value">
                  <CountUp value={s.value} />
                </span>
                <span className="about__stat-label">{s.label}</span>
              </li>
            ))}
          </Reveal>

          <Reveal delay={300}>
            <a href="#about" className="btn btn--gold">
              Подробнее о нас <ArrowRight />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
