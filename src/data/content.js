// Временные фото-заглушки. Заменить на реальные фотографии ресторана
// (положить в /public/images и указать путь вида '/images/hero.jpg').
const u = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`

export const images = {
  hero: u('1510798831971-661eb04b3739', 2000),
  grill: u('1544025162-d76694265947', 2000),
  booking: u('1510812431401-41d2bd2722f3', 1600),
  aboutOld: u('1449158743715-0a90ebb6d2d8', 900),
  aboutNew: u('1510798831971-661eb04b3739', 700),
}

export const contacts = {
  phone: '8 (496) 423-06-33',
  phoneHref: 'tel:+74964230633',
  address: 'Орехово-Зуево, Лесопарк «Мельница»',
  hours: 'Ежедневно 10:00 до 22:00',
  hoursShort: 'Ежедневно до 22:00',
}

export const delivery = {
  freeFrom: 1000,
  schedule: [
    { days: 'Пн–Чт', time: '12:00 – 22:00' },
    { days: 'Пт–Сб', time: '11:00 – 00:00' },
  ],
}

// Акция на доставку. startsAt/endsAt — даты в формате 'ГГГГ-ММ-ДД' или null (без ограничения).
// Например, чтобы запустить со 2-й недели: startsAt: '2026-11-09'.
export const promo = {
  discount: 10,
  title: 'Скидка 10% на всё меню',
  startsAt: '2026-11-04',
  endsAt: null,
}

export const isPromoActive = (now = new Date()) => {
  if (!promo.discount) return false
  if (promo.startsAt && now < new Date(`${promo.startsAt}T00:00:00`)) return false
  if (promo.endsAt && now > new Date(`${promo.endsAt}T23:59:59`)) return false
  return true
}

export const promoPrice = (price) => Math.round((price * (100 - promo.discount)) / 100)

export const navLinks = [
  { label: 'Меню', href: '#menu' },
  { label: 'Доставка', href: '#delivery' },
  { label: 'Банкеты', href: '#events' },
  { label: 'Проживание', href: '#stay' },
  { label: 'О ресторане', href: '#about' },
  { label: 'Контакты', href: '#contacts' },
]

export const menuCategories = [
  'Блюда с мангала',
  'Горячее',
  'Холодные закуски',
  'Салаты',
  'Супы',
  'Гарниры',
  'Десерты',
  'Напитки',
]

export const dishes = [
  { id: 1, category: 'Блюда с мангала', name: 'Шашлык из свинины', weight: '200 г', price: 450, image: u('1529692236671-f1f6cf9683ba', 800) },
  { id: 2, category: 'Блюда с мангала', name: 'Люля-кебаб из говядины', weight: '200 г', price: 420, image: u('1603360946369-dc9bb6258143', 800) },
  { id: 3, category: 'Блюда с мангала', name: 'Стейк из лосося', weight: '160 г', price: 790, image: u('1467003909585-2f8a72700288', 800) },
  { id: 4, category: 'Блюда с мангала', name: 'Овощи на мангале', weight: '250 г', price: 750, image: u('1540189549336-e6e99c3679fe', 800) },
  { id: 5, category: 'Блюда с мангала', name: 'Стейк рибай', weight: '300 г', price: 1890, image: u('1600891964092-4316c288032e', 800) },
  { id: 6, category: 'Горячее', name: 'Утиная грудка с соусом', weight: '220 г', price: 890, image: u('1414235077428-338989a2e8c0', 800) },
  { id: 7, category: 'Горячее', name: 'Говядина томлёная', weight: '250 г', price: 820, image: u('1558030006-450675393462', 800) },
  { id: 8, category: 'Салаты', name: 'Салат с ростбифом', weight: '200 г', price: 590, image: u('1512621776951-a57141f2eefd', 800) },
  { id: 9, category: 'Салаты', name: 'Овощной салат', weight: '220 г', price: 390, image: u('1540189549336-e6e99c3679fe', 800) },
  { id: 10, category: 'Десерты', name: 'Чизкейк', weight: '150 г', price: 380, image: u('1551218808-94e220e084d2', 800) },
]

// Ссылки на карточки в VK-маркете ресторана
const vk = (id) => `https://vk.ru/market-219080846_${id}`

export const halls = [
  {
    name: 'Основной зал',
    capacity: '250–280 гостей',
    features: ['Зона для выездной регистрации', 'Фуршетная зона — на выбор'],
    extras: [{ label: 'Аренда LED-экрана', price: '10 000 ₽' }],
    link: vk(9624417),
    image: u('1519167758481-83f550bb49b3', 900),
  },
  {
    name: 'Банкетный шатёр',
    capacity: '150–170 гостей',
    rent: '50 000 ₽',
    features: ['Зона для выездной регистрации', 'Фуршетная зона — на выбор'],
    extras: [{ label: 'Аренда экрана', price: '5 000 ₽' }],
    link: vk(9182523),
    image: u('1464366400600-7168b8af9bc3', 900),
  },
  {
    name: 'Белый зал',
    capacity: '40–50 гостей',
    rent: '10 000 ₽',
    features: ['Зона для выездной регистрации', 'Фуршетная зона — на выбор'],
    extras: [],
    link: vk(9091396),
    image: u('1519225421980-715cb0215aed', 900),
  },
  {
    name: 'Каминный зал',
    capacity: '25–35 гостей',
    features: ['Уютная камерная атмосфера'],
    extras: [{ label: 'Караоке', price: '20 000 ₽' }],
    link: vk(9624428),
    image: u('1514933651103-005eec06c04b', 900),
  },
]

export const banquetTerms = [
  { value: '10%', label: 'сервисный сбор' },
  { value: '5 000 ₽', label: 'технический сбор' },
  { value: '3 500 ₽', label: 'минимальный заказ с человека' },
  { value: '100 мест', label: 'бесплатная парковка на территории' },
]

// Мангальные отапливаемые домики
export const houses = [
  { name: 'Домики № 1–3', guests: 'до 20 человек', price: '10 000 ₽', image: u('1449158743715-0a90ebb6d2d8', 900) },
  { name: 'Домики № 4–5', guests: 'до 35 человек', price: '12 000 ₽', image: u('1595877244574-e90ce41ce089', 900) },
  { name: 'Домики № 6–8', guests: 'до 60 человек', price: '18 000 ₽', image: u('1510798831971-661eb04b3739', 900) },
]

export const housesInfo = {
  count: 8,
  hours: 'Безлимит с 10:00 до 05:00',
  amenities: ['Туалет', 'Холодильник', 'Микроволновка', 'Чайник', 'Мангальная зона'],
  link: 'https://vk.ru/market-219080846?section=album_5',
}

export const rooms = {
  count: 11,
  link: vk(9620001),
  image: u('1505693416388-ac5ce068fe85', 900),
}

export const stats = [
  { value: '50', label: 'лет работы' },
  { value: '3', label: 'зала и шатёр' },
  { value: '100 000+', label: 'довольных гостей' },
]

export const gallery = [
  u('1517248135467-4c7edcad34c4', 800),
  u('1504674900247-0877df9cc836', 800),
  u('1555396273-367ea4eb4db5', 800),
  u('1511795409834-ef04bbd61622', 800),
  u('1555939594-58d7cb561ad1', 800),
  u('1559339352-11d035aa65de', 800),
  u('1424847651672-bf20a4b0982b', 800),
]

export const reviews = [
  { name: 'Анна К.', text: 'Очень уютное место, вкусная еда и приятная атмосфера. Идеально для семейного ужина!', avatar: u('1438761681033-6461ffad8d80', 120) },
  { name: 'Дмитрий и Елена', text: 'Отмечали свадьбу — всё было на высшем уровне! Гости остались в восторге.', avatar: u('1500648767791-00dcc994a43e', 120) },
  { name: 'Мария С.', text: 'Лучшее кафе в районе! Всегда свежие блюда и внимательный персонал.', avatar: u('1494790108377-be9c29b29330', 120) },
  { name: 'Игорь П.', text: 'Шашлык — лучший в округе. Приезжаем всей компанией уже несколько лет.', avatar: u('1507003211169-0a1dd7228f2d', 120) },
]
