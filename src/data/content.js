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
  // Карта: центр и поисковый запрос для виджета Яндекс Карт.
  // TODO: заменить на точные координаты ресторана (lon,lat) или ссылку на организацию в Яндекс Картах.
  mapCenter: '38.9618,55.8067',
  mapQuery: 'Орехово-Зуево, ресторан Охотник, лесопарк Мельница',
  parking: 'Бесплатная парковка на 100 мест на территории',
}

// Реквизиты организации для юридических страниц и подвала.
// Значения в квадратных скобках — заполнить перед публикацией (данные из выписки ЕГРЮЛ).
export const company = {
  fullName: 'Общество с ограниченной ответственностью «Радуга+»',
  shortName: 'ООО «Радуга+»',
  inn: '[ИНН]',
  kpp: '[КПП]',
  ogrn: '[ОГРН]',
  legalAddress: '[Юридический адрес]',
  actualAddress: 'Московская обл., г. Орехово-Зуево, лесопарк «Мельница»',
  director: '[ФИО генерального директора]',
  email: '[email для обращений]',
  bank: {
    name: '[Банк]',
    account: '[Расчётный счёт]',
    corrAccount: '[Корр. счёт]',
    bik: '[БИК]',
  },
}

// Дата текущей редакции юридических документов
export const legalUpdated = '3 ноября 2026 г.'

export const legalLinks = [
  { to: '/privacy', label: 'Политика обработки персональных данных' },
  { to: '/consent', label: 'Согласие на обработку персональных данных' },
  { to: '/offer', label: 'Условия заказа и доставки' },
  { to: '/requisites', label: 'Реквизиты' },
]

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

// href вида '#секция' — раздел главной, '/путь' — отдельная страница
export const navLinks = [
  { label: 'Меню', href: '/menu' },
  { label: 'Доставка', href: '#delivery' },
  { label: 'Банкеты', href: '/banquets' },
  { label: 'Проживание', href: '/stay' },
  { label: 'О ресторане', href: '#about' },
  { label: 'Контакты', href: '/contacts' },
]

// Категории меню — вкладки показываются в этом порядке. «Десерты» и «Напитки»
// вернуть сюда, когда появятся их фото и цены.
export const menuCategories = ['Блюда с мангала', 'Горячее', 'Закуски', 'Салаты', 'Супы', 'Гарниры']

// Фото блюд: /public/images/menu. ВНИМАНИЕ: вес и цены — временные, заменить на актуальные из меню ресторана.
const dish = (slug) => `/images/menu/${slug}.webp`

export const dishes = [
  { id: 101, category: 'Блюда с мангала', name: 'Шашлык из свинины', weight: '200 г', price: 450, image: dish('shashlyk-svinina') },
  { id: 102, category: 'Блюда с мангала', name: 'Шашлык из курицы', weight: '200 г', price: 390, image: dish('shashlyk-kurica') },
  { id: 103, category: 'Блюда с мангала', name: 'Люля-кебаб', weight: '200 г', price: 420, image: dish('lyulya-kebab') },

  { id: 201, category: 'Горячее', name: 'Куриное филе в сливочно-грибном соусе с картофелем фри', weight: '350 г', price: 590, image: dish('kurica-slivochnyj-sous') },
  { id: 202, category: 'Горячее', name: 'Шаурма с курицей', weight: '350 г', price: 350, image: dish('shaurma-kurica') },
  { id: 203, category: 'Горячее', name: 'Шаурма с говядиной', weight: '350 г', price: 390, image: dish('shaurma-govyadina') },

  { id: 301, category: 'Закуски', name: 'Пивная тарелка', weight: '800 г', price: 1290, image: dish('pivnaya-tarelka') },
  { id: 302, category: 'Закуски', name: 'Сырные палочки с брусничным соусом', weight: '200 г', price: 390, image: dish('syrnye-palochki') },
  { id: 303, category: 'Закуски', name: 'Брускетта с креветками', weight: '180 г', price: 450, image: dish('brusketta-krevetki') },
  { id: 304, category: 'Закуски', name: 'Гренки из бородинского хлеба', weight: '200 г', price: 250, image: dish('grenki') },

  { id: 401, category: 'Салаты', name: 'Цезарь с курицей', weight: '250 г', price: 490, image: dish('cezar-kurica') },
  { id: 402, category: 'Салаты', name: 'Цезарь с креветками', weight: '250 г', price: 590, image: dish('cezar-krevetki') },
  { id: 403, category: 'Салаты', name: 'Греческий салат', weight: '250 г', price: 420, image: dish('grecheskij-salat') },
  { id: 404, category: 'Салаты', name: 'Тёплый салат с баклажаном и фетой', weight: '250 г', price: 450, image: dish('salat-baklazhan') },

  { id: 501, category: 'Супы', name: 'Том ям', weight: '400 г', price: 590, image: dish('tom-yam') },
  { id: 502, category: 'Супы', name: 'Грибной крем-суп в хлебе', weight: '400 г', price: 450, image: dish('sup-v-hlebe') },

  { id: 601, category: 'Гарниры', name: 'Картофель фри с сырным соусом', weight: '150 г', price: 220, image: dish('kartofel-fri') },
  { id: 602, category: 'Гарниры', name: 'Картофель по-деревенски с сырным соусом', weight: '200 г', price: 240, image: dish('kartofel-po-derevenski') },
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

export const occasions = [
  { title: 'Свадьба', text: 'Выездная регистрация, шатёр на 170 гостей, проживание для гостей и скидка на второй день.' },
  { title: 'Юбилей и день рождения', text: 'От уютного ужина в Каминном зале до большого праздника в Основном зале.' },
  { title: 'Корпоратив', text: 'Залы для команды любого размера, экран для презентаций, караоке и парковка.' },
  { title: 'Выпускной', text: 'Праздник до утра на природе — с банкетом, музыкой и домиками для гостей.' },
  { title: 'Детский праздник', text: 'Безопасное пространство на природе и меню, которое понравится детям.' },
  { title: 'Семейное торжество', text: 'Крестины, годовщины, встречи родных — с домашней атмосферой и кухней на углях.' },
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
