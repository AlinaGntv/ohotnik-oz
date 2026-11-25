// Временные фото-заглушки. Заменить на реальные фотографии ресторана
// (положить в /public/images и указать путь вида '/images/hero.jpg').
const u = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`

export const images = {
  hero: '/images/hero-ohotnik.webp',
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
export const company = {
  fullName: 'Общество с ограниченной ответственностью «Радуга+»',
  shortName: 'ООО «Радуга+»',
  inn: '5034026479',
  kpp: '503401001',
  ogrn: '1065034028146',
  legalAddress: '142600, Московская область, г. Орехово-Зуево, ул. Лесопарк Мельница, д. 1',
  actualAddress: 'Московская область, г. Орехово-Зуево, ул. Лесопарк Мельница, д. 1',
  director: 'Пурясев Роман Анатольевич',
  email: 'Ohotnikhool21@mail.ru',
  contactPhone: '+7 926 559-38-23',
  contactPhoneHref: 'tel:+79265593823',
}

// Дата текущей редакции юридических документов
export const legalUpdated = '17 ноября 2026 г.'

export const legalLinks = [
  { to: '/privacy', label: 'Политика обработки персональных данных' },
  { to: '/consent', label: 'Согласие на обработку персональных данных' },
  { to: '/offer', label: 'Условия заказа и доставки' },
  { to: '/booking-terms', label: 'Условия бронирования' },
  { to: '/requisites', label: 'Реквизиты' },
]

export const delivery = {
  freeFrom: 1000,
  schedule: [
    { days: 'Пн–Чт', time: '12:00 – 22:00' },
    { days: 'Пт–Вс', time: '10:00 – 02:00 следующего дня' },
  ],
}

export const ordersEnabled = true

// Акция на доставку. startsAt/endsAt — даты в формате 'ГГГГ-ММ-ДД' или null (без ограничения).
export const promo = {
  discount: 0,
  title: '',
  startsAt: null,
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
export const menuCategories = ['Блюда с мангала', 'Горячее', 'Пицца', 'Паста', 'Закуски', 'Горячие закуски', 'Брускетты', 'Детское меню', 'Салаты', 'Супы', 'Гарниры', 'Десерты']

// Фото блюд: /public/images/menu. ВНИМАНИЕ: вес и цены — временные, заменить на актуальные из меню ресторана.
const dish = (slug) => `/images/menu/${slug}.webp`

export const dishes = [
  { id: 101, category: 'Блюда с мангала', name: 'Шашлык из свиной шеи', weight: '250 г', price: 720, description: 'Свиная шейка, лаваш, красный лук и соус.', image: dish('shashlyk-svinina') },
  { id: 102, category: 'Блюда с мангала', name: 'Шашлык из куриного бедра', weight: '250 г', price: 680, description: 'Филе куриного бедра, красный лук, лаваш и соус.', image: dish('shashlyk-kurica') },
  { id: 103, category: 'Блюда с мангала', name: 'Люля-кебаб', weight: '250 г', price: 720, description: 'Фарш из говядины и свинины, лаваш, красный лук и соус.', image: dish('lyulya-kebab') },
  { id: 104, category: 'Блюда с мангала', name: 'Овощное ассорти на мангале', weight: null, price: 490, description: 'Овощи, приготовленные на мангале, с зеленью.', image: dish('ovoshi-mangal') },
  { id: 105, category: 'Блюда с мангала', name: 'Лосось на мангале', weight: null, price: 950, description: 'Филе лосося на мангале с лимоном и соусом.', image: dish('losos-mangal') },
  { id: 106, category: 'Блюда с мангала', name: 'Рыба на мангале', weight: null, price: 1100, description: 'Рыба, приготовленная на мангале, с лимоном, зеленью и соусом.', image: dish('ryba-mangal') },
  { id: 107, category: 'Блюда с мангала', name: 'Каре ягнёнка на мангале', weight: null, price: 1450, description: 'Каре ягнёнка с лавашом, красным луком, зеленью и соусом.', image: dish('kare-yagnenka') },
  { id: 108, category: 'Блюда с мангала', name: 'Ассорти на мангале', weight: null, price: 2400, description: 'Мясо, овощи и картофель на мангале, подаются с соусами.', image: dish('assorti-mangal') },

  { id: 201, category: 'Горячее', name: 'Куриное филе в сливочно-грибном соусе с картофелем фри', weight: '350 г', price: 590, image: dish('kurica-slivochnyj-sous') },
  { id: 202, category: 'Горячее', name: 'Шаурма с курицей', weight: '350 г', price: 350, image: dish('shaurma-kurica') },
  { id: 203, category: 'Горячее', name: 'Шаурма с говядиной', weight: '350 г', price: 390, image: dish('shaurma-govyadina') },
  { id: 204, category: 'Горячее', name: 'Колбаски-гриль с картофелем фри', weight: null, price: 590, image: dish('kolbaski-gril-kartofel') },
  { id: 205, category: 'Горячие закуски', name: 'Куриные крылья в соусе сладкий чили', weight: '250 г', price: 550, description: 'Куриные крылья, соус сладкий чили.', image: dish('kurinye-krylyshki-sladkij-chili') },

  { id: 701, category: 'Пицца', name: 'Пицца с сыром и зеленью', weight: null, price: 540, image: '/images/gallery/food-01.webp' },
  { id: 702, category: 'Пицца', name: 'Пицца с мясной начинкой', weight: null, price: 500, image: '/images/gallery/food-07.webp' },
  { id: 703, category: 'Пицца', name: 'Сырная пицца', weight: null, price: 540, image: '/images/gallery/food-13.webp' },
  { id: 704, category: 'Пицца', name: 'Пицца с колбасками и луком', weight: null, price: 500, image: '/images/gallery/food-15.webp' },
  { id: 705, category: 'Пицца', name: 'Пицца с пепперони', weight: null, price: 500, image: '/images/gallery/food-16.webp' },
  { id: 706, category: 'Пицца', name: 'Пицца с лососем и томатами', weight: null, price: 690, image: dish('pizza-losos-tomaty') },
  { id: 707, category: 'Пицца', name: 'Пицца Цезарь с курицей', weight: '570 г', price: 900, description: 'Тесто, моцарелла, соус «Цезарь», куриное филе, томаты черри, айсберг и пармезан.', image: dish('pizza-cezar-kurica') },
  { id: 708, category: 'Пицца', name: 'Пицца с курицей и пепперони', weight: null, price: 600, image: dish('pizza-kurica-pepperoni') },
  { id: 709, category: 'Пицца', name: 'Пицца с лососем терияки', weight: '550 г', price: 900, description: 'Тесто, моцарелла, сливочный соус, лосось, томаты черри, болгарский перец, соус терияки, кунжут и зелёный лук.', image: dish('pizza-losos-teriyaki') },
  { id: 710, category: 'Пицца', name: 'Пицца «Ассорти»', weight: '600 г', price: 850, description: 'Тесто, моцарелла, томатный соус, пепперони, куриное филе, шампиньоны, маслины, болгарский перец и красный лук.', image: dish('pizza-assorti') },

  { id: 711, category: 'Паста', name: 'Паста с креветками', weight: null, price: 590, image: '/images/gallery/food-02.webp' },
  { id: 712, category: 'Паста', name: 'Паста в сливочном соусе', weight: null, price: 540, image: dish('pasta-slivochnyj-sous-18-11') },
  { id: 713, category: 'Паста', name: 'Паста с томатами', weight: null, price: 490, image: '/images/gallery/food-04.webp' },
  { id: 714, category: 'Паста', name: 'Спагетти в сливочном соусе', weight: null, price: 550, image: '/images/gallery/food-05.webp' },
  { id: 715, category: 'Паста', name: 'Паста с курицей', weight: null, price: 590, image: '/images/gallery/food-09.webp' },

  { id: 301, category: 'Закуски', name: 'Пивная тарелка', weight: '800 г', price: 1290, image: dish('pivnaya-tarelka') },
  { id: 302, category: 'Закуски', name: 'Сырные палочки с брусничным соусом', weight: '200 г', price: 390, image: dish('syrnye-palochki') },
  { id: 304, category: 'Закуски', name: 'Гренки из бородинского хлеба', weight: '200 г', price: 250, image: dish('grenki') },
  { id: 308, category: 'Закуски', name: 'Мясное ассорти', weight: null, price: 850, description: 'Мясная нарезка с соусом.', image: dish('myasnoe-assorti-zakuska') },
  { id: 309, category: 'Закуски', name: 'Сырная тарелка', weight: null, price: 990, description: 'Ассорти сыров с фруктами, орехами и мёдом.', image: dish('syrnaya-tarelka') },
  { id: 303, category: 'Брускетты', name: 'Брускетта с креветкой', weight: '100 г', price: 400, description: 'Багет, творожный сыр, соус, паста том ям, тигровая креветка, томаты черри и руккола.', image: dish('brusketta-krevetki') },
  { id: 305, category: 'Брускетты', name: 'Брускетта с лососем', weight: '100 г', price: 400, description: 'Багет, творожный сыр, апельсин, слабосолёный лосось и руккола.', image: dish('brusketta-losos') },
  { id: 306, category: 'Брускетты', name: 'Брускетта с пармской ветчиной', weight: '100 г', price: 400, description: 'Багет, творожный сыр, трюфельное масло, пармская ветчина, бальзамический крем-соус и руккола.', image: dish('brusketta-parmskaya-vetchina') },
  { id: 307, category: 'Горячие закуски', name: 'Куриные наггетсы', weight: '150 г', price: 350, description: 'Куриные наггетсы с соусом.', image: dish('kurinye-naggetsy') },
  { id: 310, category: 'Горячие закуски', name: 'Кабачки с зеленью', weight: null, price: 450, description: 'Обжаренные кабачки с красным луком и зеленью.', image: dish('kabachki-zharennye') },
  { id: 801, category: 'Детское меню', name: 'Картофель фри с куриной колбаской', weight: null, price: 400, description: 'Сосиски «Чикен-Спайси», картофель фри, зелень и специи.', image: dish('detskoe-kartofel-kolbaska') },
  { id: 802, category: 'Детское меню', name: 'Детская паста с курочкой', weight: null, price: 400, description: 'Паста, куриное филе, томаты черри, сливки, оливковое масло и соль.', image: dish('detskoe-pasta-kurica') },

  { id: 401, category: 'Салаты', name: 'Цезарь с курицей', weight: '250 г', price: 490, image: dish('cezar-kurica') },
  { id: 402, category: 'Салаты', name: 'Цезарь с креветками', weight: '250 г', price: 590, image: dish('cezar-krevetki') },
  { id: 403, category: 'Салаты', name: 'Греческий салат', weight: '250 г', price: 420, image: dish('grecheskij-salat') },
  { id: 404, category: 'Салаты', name: 'Тёплый салат с баклажаном и фетой', weight: '250 г', price: 450, image: dish('salat-baklazhan') },
  { id: 405, category: 'Салаты', name: 'Томаты с соусом песто', weight: null, price: 480, description: 'Томаты с соусом песто и зеленью.', image: dish('salat-tomaty-pesto') },

  { id: 501, category: 'Супы', name: 'Том ям', weight: '400 г', price: 590, image: dish('tom-yam') },
  { id: 502, category: 'Супы', name: 'Грибной крем-суп в хлебе', weight: '400 г', price: 450, image: dish('sup-v-hlebe') },
  { id: 503, category: 'Супы', name: 'Борщ домашний', weight: null, price: 490, description: 'Подаётся со сметаной, зеленью и ржаным хлебом.', image: dish('borshch') },

  { id: 601, category: 'Гарниры', name: 'Картофель фри с сырным соусом', weight: '150 г', price: 220, image: dish('kartofel-fri') },
  { id: 602, category: 'Гарниры', name: 'Картофель по-деревенски с сырным соусом', weight: '200 г', price: 240, image: dish('kartofel-po-derevenski') },
  { id: 603, category: 'Гарниры', name: 'Картофель беби на мангале', weight: null, price: 390, description: 'Молодой картофель, приготовленный на мангале.', image: dish('kartofel-bebi') },

  { id: 721, category: 'Десерты', name: 'Чизкейк', weight: null, price: 350, image: '/images/gallery/food-06.webp' },
  { id: 722, category: 'Десерты', name: 'Ассорти десертов с мороженым', weight: null, price: 550, image: '/images/gallery/food-08.webp' },
  { id: 723, category: 'Десерты', name: 'Десерт с мороженым', weight: null, price: 450, image: '/images/gallery/food-10.webp' },
  { id: 724, category: 'Десерты', name: 'Шоколадный десерт', weight: null, price: 390, image: '/images/gallery/food-11.webp' },
  { id: 725, category: 'Десерты', name: 'Фисташковый чизкейк', weight: null, price: 450, image: '/images/gallery/food-12.webp' },
  { id: 726, category: 'Десерты', name: 'Чизкейк с ягодным соусом', weight: null, price: 420, image: '/images/gallery/food-14.webp' },
  { id: 727, category: 'Десерты', name: 'Чизкейк с фруктовым соусом', weight: null, price: 420, image: '/images/gallery/food-17.webp' },
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
    image: '/images/hall-main-service.webp',
  },
  {
    name: 'Банкетный шатёр',
    capacity: '150–170 гостей',
    rent: '50 000 ₽',
    features: ['Зона для выездной регистрации', 'Фуршетная зона — на выбор'],
    extras: [{ label: 'Аренда экрана', price: '5 000 ₽' }],
    link: vk(9182523),
    images: [
      '/images/banquet-tent-interior.webp',
      '/images/banquet-tent-exterior.webp',
      '/images/banquet-tent-ceremony.webp',
      '/images/banquet-tent-lights.webp',
      '/images/banquet-tent-bride.webp',
    ],
    video: '/videos/banquet-tent.mp4',
    videoPoster: '/images/banquet-tent-video-poster.webp',
  },
  {
    name: 'Белый зал',
    capacity: '40–50 гостей',
    rent: '10 000 ₽',
    features: ['Зона для выездной регистрации', 'Фуршетная зона — на выбор'],
    extras: [],
    link: vk(9091396),
    images: ['/images/hall-white-overview.webp', '/images/hall-white-banquet.webp'],
  },
  {
    name: 'Каминный зал',
    capacity: '25–35 гостей',
    features: ['Уютная камерная атмосфера'],
    extras: [{ label: 'Караоке', price: '20 000 ₽' }],
    link: vk(9624428),
    image: '/images/hall-fireplace.webp',
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
  ...dishes.map(({ image }) => image),
  ...Array.from({ length: 17 }, (_, i) => `/images/gallery/food-${String(i + 1).padStart(2, '0')}.webp`),
]

export const yandexMapsUrl = 'https://yandex.ru/maps/org/okhotnik/1014180583/'
export const yandexReviewsUrl = 'https://yandex.ru/maps/org/okhotnik/1014180583/reviews/'
