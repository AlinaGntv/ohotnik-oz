import { useEffect, useMemo, useState } from 'react'
import PageHero from '../components/PageHero.jsx'
import DishCard from '../components/DishCard.jsx'
import { Cart } from '../components/Icons.jsx'
import { delivery, dishes, isPromoActive, menuCategories, promo } from '../data/content.js'
import { useCart } from '../context/cart.js'
import './MenuPage.css'

const slug = (c) => `cat-${menuCategories.indexOf(c)}`
const money = (n) => `${n.toLocaleString('ru-RU').replace(/ /g, ' ')} ₽`

export default function MenuPage() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(menuCategories[0])
  const { count, total, open } = useCart()
  const promoActive = isPromoActive()

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    return menuCategories
      .map((c) => ({ category: c, items: dishes.filter((d) => d.category === c && d.name.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length)
  }, [query])

  // подсвечиваем категорию, до которой докрутили
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.dataset.category)),
      { rootMargin: '-30% 0px -60% 0px' },
    )
    document.querySelectorAll('.menu-page__group').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [groups])

  const scrollTo = (c) => document.getElementById(slug(c))?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <PageHero
        eyebrow="Меню и доставка"
        title="Меню ресторана"
        lead={`Блюда на углях, горячее, закуски и салаты с доставкой по Орехово-Зуеву. Бесплатная доставка от ${money(delivery.freeFrom)}.`}
        image="/images/menu/pivnaya-tarelka.webp"
      >
        {promoActive && <span className="menu-page__promo">−{promo.discount}% на всё меню при заказе доставки</span>}
      </PageHero>

      <div className="menu-page__bar">
        <div className="container menu-page__bar-inner">
          <nav className="menu-page__cats" aria-label="Категории">
            {menuCategories.map((c) => (
              <button
                key={c}
                className={`tab ${active === c ? 'is-active' : ''}`}
                disabled={!groups.some((g) => g.category === c)}
                onClick={() => scrollTo(c)}
              >
                {c}
              </button>
            ))}
          </nav>
          <input
            className="menu-page__search"
            type="search"
            placeholder="Найти блюдо"
            aria-label="Поиск по меню"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <section className="menu-page section">
        <div className="container">
          {groups.length === 0 && <p className="menu-page__empty">Ничего не нашлось. Попробуйте другое название.</p>}
          {groups.map((g) => (
            <div className="menu-page__group" id={slug(g.category)} data-category={g.category} key={g.category}>
              <h2 className="menu-page__title">{g.category}</h2>
              <div className="menu-page__grid">
                {g.items.map((d) => (
                  <DishCard key={d.id} dish={d} promoActive={promoActive} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {count > 0 && (
        <button className="menu-page__cart" onClick={open}>
          <Cart />
          <span>
            Корзина · {count} — {money(total)}
          </span>
        </button>
      )}
    </>
  )
}
