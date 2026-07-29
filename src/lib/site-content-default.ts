// Default site content. Serves as (a) the fallback that renders before the
// API call completes, (b) the seed for the mock backend, and (c) the initial
// value that the admin "Управление сайтом" page edits.
//
// Everything here must be plain data (no JSX, no functions) so it can be
// serialised as JSON for the REST backend.

export type StayKind = "cottage" | "townhouse";

export type StayDetailGroup =
  | "beds"
  | "bath"
  | "kitchen"
  | "media"
  | "outdoor";

export interface StayDetails {
  group: StayDetailGroup;
  title: string;
  items: string[];
}

export interface Stay {
  id: string;
  slug: string;
  code: string;
  kind: StayKind;
  name: string;
  capacity: number;
  price: number;
  priceUnit?: string;
  tagline: string;
  description: string;
  bullets: string[];
  tags: string[];
  details: StayDetails[];
}

export type GazeboIconKind = "house" | "house2" | "crown" | "people";

export interface Gazebo {
  id: string;
  title: string;
  body: string;
  icon: GazeboIconKind;
  slug: string;
}

export type ServiceCategory = "banya" | "summer" | "winter" | "activities";

export interface ServicePriceRow {
  label: string;
  price: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  body: string;
  slug: string;
  categories: ServiceCategory[];
  meta?: string;
  prices?: ServicePriceRow[];
  included?: string[];
  notes?: string[];
}

export interface ExtraRow {
  id: string;
  label: string;
  price: string;
}

export type TransferIconKind =
  | "to-hotel"
  | "from-hotel"
  | "to-airport"
  | "from-airport";

export interface TransferRouteGroup {
  id: string;
  title: string;
  column: "Откуда" | "Куда";
  icon: TransferIconKind;
  routes: Array<{ id: string; label: string; price: string }>;
}

export interface TransferTeriberkaRow {
  id: string;
  label: string;
  price: string;
}

export interface BookingStep {
  id: string;
  title: string;
  body: string;
}

export interface TrustItem {
  id: string;
  num: string;
  title: string;
  body: string;
}

export interface SectionText {
  eyebrow: string;
  title: string;
  lede: string;
}

export interface SiteContent {
  hero: {
    badge: string;
    title: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  nav: {
    brand: string;
    links: Array<{ id: string; label: string; href: string }>;
    cta: string;
  };
  sections: {
    stays: SectionText;
    gazebos: SectionText;
    activities: SectionText;
    transfer: SectionText;
    trust: SectionText;
    request: SectionText;
  };
  stays: Stay[];
  gazebos: Gazebo[];
  gazeboFootnote: string;
  services: ServiceItem[];
  extrasHeading: string;
  extrasSubheading: string;
  extras: ExtraRow[];
  transfer: {
    car: string;
    carDescription: string;
    features: Array<{
      id: string;
      icon: "seats" | "luggage" | "comfort";
      text: string;
    }>;
    gallerySlug: string;
    routeGroups: TransferRouteGroup[];
    teriberkaTitle: string;
    teriberka: TransferTeriberkaRow[];
    waitPrice: string;
    waitLabel: string;
    waitNote: string;
    footnote: string;
  };
  trustItems: TrustItem[];
  bookingSteps: BookingStep[];
  contact: {
    phone: string;
    phoneHref: string;
    address: string;
    telegram: string;
    telegramHref: string;
    email: string;
    coords: string;
  };
  footer: {
    brand: string;
    description: string;
    addressLines: string[];
    copyright: string;
  };
  bookingConsent: string;
  requestSuccessMessage: string;
}

const s = (i: number) => `id-${i}`;

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    badge: "68° N · берег Туломы · 40 км от Мурманска",
    title: " Голубая\u00A0Бухта - отдых на природе с городским комфортом",
    description:
      "Загородный отель, на берегу реки Тулома в 40 км от Мурманска. Коттеджи, беседки, баня, фурако и активный досуг.",
    ctaPrimary: "Забронировать",
    ctaSecondary: "Посмотреть коттеджи",
  },
  nav: {
    brand: "Голубая\u00A0Бухта",
    links: [
      { id: s(1), label: "Коттеджи", href: "#stays" },
      { id: s(2), label: "Беседки", href: "#gazebos" },
      { id: s(3), label: "Активности", href: "#activities" },
      { id: s(4), label: "Трансфер", href: "#transfer" },
      { id: s(5), label: "Контакты", href: "#request" },
    ],
    cta: "Оставить заявку",
  },
  sections: {
    stays: {
      eyebrow: "Размещение",
      title: "Коттеджи для компаний, семьи и уютных пар",
      lede: "Отдельные коттеджи и блоки таунхауса №3 — это разные типы объектов. Вместимость у каждого своя, от 2 до 12 гостей.",
    },
    gazebos: {
      eyebrow: "Беседки",
      title: "Мангальные зоны на свежем воздухе",
      lede: "\u00A0Уютные беседки рядом с коттеджами. Решётки и шампура предоставляются, уголь и розжиг приобретаются отдельно.\u00A0",
    },
    activities: {
      eyebrow: "Услуги",
      title: "Баня, фурако и сезонные развлечения",
      lede: "Русская дровяная баня и фурако доступны круглый год. Водные активности — летом, снежные — зимой. Выбирайте отдых по настроению: на воде, в лесу или под открытым небом.",
    },
    transfer: {
      eyebrow: "Логистика",
      title: "Комфортный трансфер на микроавтобусе",
      lede: "Citroen SpaceTourer на 7 мест. Встречаем в аэропорту и на вокзале Мурманска, возим в город и Териберку.",
    },
    trust: {
      eyebrow: "О базе",
      title: "Загородная база, которой доверяют",
      lede: "Только факты — без отзывов, наград и придуманных рейтингов.",
    },
    request: {
      eyebrow: "Бронирование",
      title: "Как забронировать",
      lede: "Форма — это заявка, не подтверждение брони. Дата закрепляется после ответа менеджера и предоплаты.",
    },
  },
  stays: [
    {
      id: "c1", slug: "cottage-1", code: "Коттедж №1", kind: "cottage", name: "Коттедж №1",
      capacity: 12, price: 22000,
      tagline: "Для праздников и больших компаний",
      description: "Каминный зал, шесть спален и просторная атмосфера для тёплого отдыха за городом.",
      bullets: [
        "6 спален · 2 двуспальные + 8 односпальных",
        "2 душевые, 2 санузла",
        "Каминный зал, собственная беседка, мангал",
        "Кухня: варочная панель, холодильник, СВЧ, ПМ",
      ],
      tags: ["для компании", "камин", "беседка"],
      details: [
        { group: "beds", title: "Спальные места", items: ["6 спален", "2 двуспальные кровати", "8 односпальных кроватей"] },
        { group: "bath", title: "Санузлы", items: ["2 душевые", "2 туалета"] },
        { group: "kitchen", title: "Кухня и техника", items: ["Варочная панель", "Холодильник", "СВЧ-печь", "Чайник", "Посудомоечная машина"] },
        { group: "media", title: "Медиа и комфорт", items: ["ЖК-телевизор", "Музыкальный центр", "Каминный зал"] },
        { group: "outdoor", title: "На улице", items: ["Беседка", "Мангал"] },
      ],
    },
    {
      id: "c2", slug: "cottage-2", code: "Коттедж №2", kind: "cottage", name: "Коттедж №2",
      capacity: 10, price: 21000,
      tagline: "Для семьи и отдыха с друзьями",
      description: "Пять спален, гостиная и уютная планировка для спокойных выходных с близкими.",
      bullets: [
        "5 комнат · по 2 односпальные кровати",
        "2 душевые, 2 санузла",
        "Гостиная, собственная беседка, мангал",
        "Кухня: холодильник, СВЧ, чайник",
      ],
      tags: ["для компании", "беседка"],
      details: [
        { group: "beds", title: "Спальные места", items: ["5 спальных комнат", "В каждой спальне по 2 односпальные кровати"] },
        { group: "bath", title: "Санузлы", items: ["2 душевые", "2 санузла"] },
        { group: "kitchen", title: "Кухня и техника", items: ["Кухня", "Холодильник", "СВЧ-печь", "Чайник"] },
        { group: "media", title: "Медиа и комфорт", items: ["Телевизор", "Гостиная"] },
        { group: "outdoor", title: "На улице", items: ["Беседка", "Мангал"] },
      ],
    },
    {
      id: "c6", slug: "cottage-6", code: "Коттедж №6", kind: "cottage", name: "Коттедж №6",
      capacity: 2, price: 12000,
      tagline: "Для пары или небольшой семьи",
      description: "Отдельная спальня и дополнительное место — удобный вариант для пары или семьи.",
      bullets: [
        "Отдельная спальня, двуспальная кровать",
        "Душевая",
        "Мини-холодильник, варочная панель, СВЧ",
        "Фен, мангал",
      ],
      tags: ["для двоих"],
      details: [
        { group: "beds", title: "Спальные места", items: ["Отдельная спальня с двуспальной кроватью", "Кухонная зона с диванами", "Диваны трансформируются в дополнительное двуспальное место"] },
        { group: "bath", title: "Санузлы", items: ["Душевая"] },
        { group: "kitchen", title: "Кухня и техника", items: ["Мини-холодильник", "Варочная панель", "СВЧ-печь", "Электрочайник", "Посуда"] },
        { group: "media", title: "Медиа и комфорт", items: ["Фен", "Шкаф", "Вешалка для верхней одежды"] },
        { group: "outdoor", title: "На улице", items: ["Мангал"] },
      ],
    },
    {
      id: "c5", slug: "cottage-5", code: "Коттедж №5", kind: "cottage", name: "Коттедж №5",
      capacity: 2, price: 8000,
      tagline: "Компактный домик для двоих",
      description: "Мини-коттедж с кроватью, кухонной зоной и душевой для спокойного отдыха вдвоём.",
      bullets: [
        "Двуспальная кровать",
        "Душевая",
        "Кухонная зона: мини-холодильник, СВЧ, чайник",
        "Мангал",
      ],
      tags: ["для двоих", "компактный"],
      details: [
        { group: "beds", title: "Спальные места", items: ["Двуспальная кровать"] },
        { group: "bath", title: "Санузлы", items: ["Душевая"] },
        { group: "kitchen", title: "Кухня и техника", items: ["Кухонная зона", "Мини-холодильник", "СВЧ-печь", "Чайник", "Посуда"] },
        { group: "media", title: "Медиа и комфорт", items: ["Шкаф", "Вешалка для верхней одежды", "Обувница"] },
        { group: "outdoor", title: "На улице", items: ["Мангал"] },
      ],
    },
    {
      id: "t3-vip", slug: "townhouse-3-vip", code: "№3 VIP", kind: "townhouse", name: "VIP-блок таунхауса №3",
      capacity: 6, price: 26000,
      tagline: "Премиальный отдых с беседкой",
      description: "Сауна, электрокамин и просторные комнаты создают самый уютный формат отдыха в таунхаусе.",
      bullets: [
        "3 комнаты · 1 двуспальная + 4 односпальные",
        "2 душевые, 2 санузла",
        "Электросауна, электрокамин",
        "Отдельная беседка, мангал, Xbox One",
      ],
      tags: ["VIP", "сауна", "беседка"],
      details: [
        { group: "beds", title: "Спальные места", items: ["3 спальные комнаты", "1 двуспальная кровать", "4 односпальные кровати"] },
        { group: "bath", title: "Санузлы", items: ["2 душевые", "2 санузла"] },
        { group: "kitchen", title: "Кухня и техника", items: ["Варочная панель", "Холодильник", "СВЧ-печь", "Термопот", "Посудомоечная машина", "Сушильный шкаф для одежды"] },
        { group: "media", title: "Медиа и комфорт", items: ["Электрическая сауна", "Электрический камин", "2 телевизора", "Музыкальный центр", "Приставка Xbox One"] },
        { group: "outdoor", title: "На улице", items: ["Отдельная беседка", "Мангал"] },
      ],
    },
    {
      id: "t3-2", slug: "townhouse-3-comfort", code: "№3/2", kind: "townhouse", name: "Блок таунхауса №3/2",
      capacity: 6, price: 22000,
      tagline: "Двухэтажный комфорт с сауной",
      description: "Просторный двухэтажный блок с отдельными спальными местами, сауной и двумя душевыми.",
      bullets: [
        "3 комнаты · 6 односпальных кроватей",
        "2 душевые, 2 санузла",
        "Электросауна, сушильный шкаф",
        "Кресло-качалка, мангал",
      ],
      tags: ["сауна", "отдельный вход"],
      details: [
        { group: "beds", title: "Спальные места", items: ["3 спальные комнаты", "6 односпальных кроватей"] },
        { group: "bath", title: "Санузлы", items: ["2 душевые", "2 санузла"] },
        { group: "kitchen", title: "Кухня и техника", items: ["Варочная панель", "Холодильник", "СВЧ-печь", "Чайник", "Посудомоечная машина", "Сушильный шкаф для одежды"] },
        { group: "media", title: "Медиа и комфорт", items: ["Электрическая сауна", "ЖК-телевизор", "Музыкальный центр", "Кресло-качалка"] },
        { group: "outdoor", title: "На улице", items: ["Мангал"] },
      ],
    },
    {
      id: "t3-3", slug: "townhouse-3", code: "№3/3", kind: "townhouse", name: "Блок №3/3",
      capacity: 6, price: 22000,
      tagline: "Двухэтажный комфорт с сауной",
      description: "Просторный двухэтажный блок с отдельными спальными местами, сауной и двумя душевыми.",
      bullets: ["3 комнаты · 6 односпальных кроватей", "2 душевые, 2 санузла", "Электросауна, сушильный шкаф", "Мангал"],
      tags: ["сауна"],
      details: [
        { group: "beds", title: "Спальные места", items: ["3 спальные комнаты", "В блоке №3/3 — все кровати односпальные"] },
        { group: "bath", title: "Санузлы", items: ["2 душевые", "2 санузла"] },
        { group: "kitchen", title: "Кухня и техника", items: ["Варочная панель", "Холодильник", "СВЧ-печь", "Чайник", "Посудомоечная машина", "Сушильный шкаф для одежды"] },
        { group: "media", title: "Медиа и комфорт", items: ["Электрическая сауна", "ЖК-телевизор", "Музыкальный центр"] },
        { group: "outdoor", title: "На улице", items: ["Мангал"] },
      ],
    },
    {
      id: "t3-4", slug: "townhouse-3", code: "№3/4", kind: "townhouse", name: "Блок №3/4",
      capacity: 6, price: 22000,
      tagline: "Двухэтажный комфорт с сауной",
      description: "Просторный двухэтажный блок с отдельными спальными местами, сауной и двумя душевыми.",
      bullets: ["3 комнаты · 1 двуспальная + 4 односпальные", "2 душевые, 2 санузла", "Электросауна, сушильный шкаф", "Мангал"],
      tags: ["сауна"],
      details: [
        { group: "beds", title: "Спальные места", items: ["3 спальные комнаты", "1 двуспальная кровать и 4 односпальные кровати"] },
        { group: "bath", title: "Санузлы", items: ["2 душевые", "2 санузла"] },
        { group: "kitchen", title: "Кухня и техника", items: ["Варочная панель", "Холодильник", "СВЧ-печь", "Чайник", "Посудомоечная машина", "Сушильный шкаф для одежды"] },
        { group: "media", title: "Медиа и комфорт", items: ["Электрическая сауна", "ЖК-телевизор", "Музыкальный центр"] },
        { group: "outdoor", title: "На улице", items: ["Мангал"] },
      ],
    },
    {
      id: "t3-5", slug: "townhouse-3", code: "№3/5", kind: "townhouse", name: "Блок №3/5",
      capacity: 6, price: 22000,
      tagline: "Двухэтажный комфорт с сауной",
      description: "Просторный двухэтажный блок с отдельными спальными местами, сауной и двумя душевыми.",
      bullets: ["3 комнаты · 1 двуспальная + 4 односпальные", "2 душевые, 2 санузла", "Электросауна, сушильный шкаф", "Мангал"],
      tags: ["сауна"],
      details: [
        { group: "beds", title: "Спальные места", items: ["3 спальные комнаты", "1 двуспальная кровать и 4 односпальные кровати"] },
        { group: "bath", title: "Санузлы", items: ["2 душевые", "2 санузла"] },
        { group: "kitchen", title: "Кухня и техника", items: ["Варочная панель", "Холодильник", "СВЧ-печь", "Чайник", "Посудомоечная машина", "Сушильный шкаф для одежды"] },
        { group: "media", title: "Медиа и комфорт", items: ["Электрическая сауна", "ЖК-телевизор", "Музыкальный центр"] },
        { group: "outdoor", title: "На улице", items: ["Мангал"] },
      ],
    },
    {
      id: "t3-main", slug: "townhouse-3", code: "Таунхаус №3", kind: "townhouse", name: "Таунхаус №3",
      capacity: 6, price: 19000, priceUnit: "/ блок / сутки",
      tagline: "Уютный блок с собственной сауной",
      description: "Три спальни, просторный зал и сауна — удобный формат отдыха для небольшой компании.",
      bullets: ["3 спальни", "Просторный зал", "Электросауна", "Мангал"],
      tags: ["сауна"],
      details: [
        { group: "beds", title: "Спальные места", items: ["3 спальные комнаты"] },
        { group: "bath", title: "Санузлы", items: ["Душевая", "Санузел"] },
        { group: "kitchen", title: "Кухня и техника", items: ["Варочная панель", "Холодильник", "СВЧ-печь", "Чайник"] },
        { group: "media", title: "Медиа и комфорт", items: ["Электрическая сауна", "ЖК-телевизор", "Просторный зал"] },
        { group: "outdoor", title: "На улице", items: ["Мангал"] },
      ],
    },
  ],
  gazebos: [
    { id: "g1", title: "Беседка №1*", body: "Закреплена за Коттеджем №1.", icon: "house", slug: "gazebo-1" },
    { id: "g2", title: "Беседка №2*", body: "Закреплена за Коттеджем №2.", icon: "house2", slug: "gazebo-2" },
    { id: "g3", title: "Беседка VIP*", body: "Закреплена за VIP-блоком №3.", icon: "crown", slug: "gazebo-vip" },
    { id: "g4", title: "Общая беседка", body: "Доступна по предварительному запросу.", icon: "people", slug: "gazebo-3" },
  ],
  gazeboFootnote:
    "* Закреплена за конкретным коттеджем (№1, №2, VIP-блок №3). Аренда возможна только при отсутствии заезда в соответствующий коттедж.",
  services: [
    { id: "s1", title: "Русская баня", body: "Парилка на дровах, комната отдыха, душевая, санузел. Вместимость до 10 человек.", slug: "banya", categories: ["banya"], meta: "На дровах · до 10 человек",
      prices: [{ label: "Первый час", price: "4 000 ₽" }, { label: "Каждый следующий час", price: "3 000 ₽" }, { label: "Минимальный заказ — 2 часа", price: "от 7 000 ₽" }],
      included: ["Чай", "Простыни", "Тапочки", "Головные уборы"] },
    { id: "s2", title: "Фурако", body: "Кедровая купель с подогревом на дровах. Подходит для отдыха 4–6 человек.", slug: "furako", categories: ["banya"], meta: "Кедровая · до 4 человек",
      prices: [{ label: "Вместе с арендой бани", price: "7 000 ₽" }, { label: "Без аренды бани, 3–5 часов", price: "8 000 ₽" }, { label: "С холодной водой", price: "4 000 ₽" }],
      notes: ["Период действия тарифа на купель с холодной водой уточняется отдельно."] },
    { id: "s3", title: "Веник (дуб / берёза)", body: "Свежие банные веники к парной — дубовый или берёзовый на выбор.", slug: "venik", categories: ["banya"],
      prices: [{ label: "Веник дубовый или берёзовый", price: "500 ₽" }] },
    { id: "s4", title: "Гигиенический набор", body: "Одноразовый набор для гостей бани и коттеджа.", slug: "hygiene", categories: ["banya"],
      prices: [{ label: "Гигиенический набор", price: "250 ₽" }, { label: "Одноразовые тапочки", price: "50 ₽" }],
      included: ["Гель для душа", "Шампунь", "Мыло", "Зубной набор"] },
    { id: "s5", title: "Гидроциклы", body: "Прогулки по воде с инструктором или самостоятельное катание в сезон.", slug: "jetski", categories: ["summer", "activities"], meta: "Sea-Doo 130 · 1 шт.",
      prices: [{ label: "30 мин с инструктором", price: "3 500 ₽" }, { label: "30 мин за рулём", price: "5 000 ₽" }, { label: "1 час за рулём", price: "10 000 ₽" }, { label: "Пассажир", price: "1 500 ₽" }],
      included: ["Инструктаж", "Спасательный жилет"], notes: ["Самостоятельное управление — с 18 лет."] },
    { id: "s6", title: "SUP-доска", body: "Спокойные прогулки по воде и красивые виды в тёплое время года.", slug: "sup", categories: ["summer", "activities"], meta: "2 шт.",
      prices: [{ label: "30 мин", price: "1 500 ₽" }, { label: "1 час", price: "2 500 ₽" }],
      notes: ["Без спасательного жилета доски не выдаются."] },
    { id: "s7", title: "Катамаран", body: "Неспешный отдых на воде для пары, семьи или небольшой компании.", slug: "catamaran", categories: ["summer", "activities"], meta: "2 шт. · по 2 человека",
      prices: [{ label: "30 мин", price: "1 000 ₽" }, { label: "1 час", price: "1 500 ₽" }] },
    { id: "s8", title: "Квадроциклы", body: "Маршруты по лесу и активный отдых на природе в сопровождении инструктора.", slug: "atv", categories: ["summer", "activities"], meta: "3 шт.",
      prices: [{ label: "30 мин с инструктором", price: "2 500 ₽" }, { label: "30 мин за рулём", price: "3 500 ₽" }, { label: "1 час за рулём", price: "6 000 ₽" }],
      notes: ["Возраст самостоятельного управления уточняется на месте."] },
    { id: "s9", title: "Детские квадроциклы", body: "Безопасные модели для юных гостей — катание по площадке.", slug: "atv-kids", categories: ["summer", "activities"], meta: "От 6 лет",
      prices: [{ label: "30 мин", price: "2 000 ₽" }, { label: "1 час", price: "3 500 ₽" }],
      included: ["Инструктаж", "Шлем"] },
    { id: "s10", title: "Бадминтон", body: "Ракетки и воланы — активный отдых на свежем воздухе для всей компании.", slug: "badminton", categories: ["summer", "activities"],
      prices: [{ label: "Набор на 1 час", price: "200 ₽" }] },
    { id: "s11", title: "Снегоходы", body: "Маршруты по тундре и лесу с инструктором в устойчивый снежный сезон.", slug: "snowmobile", categories: ["winter", "activities"], meta: "RM-551",
      prices: [{ label: "30 мин с инструктором", price: "2 500 ₽" }, { label: "1 час с инструктором", price: "4 000 ₽" }, { label: "30 мин за рулём", price: "3 000 ₽" }, { label: "1 час за рулём", price: "5 000 ₽" }, { label: "Пассажир", price: "1 000 ₽" }],
      included: ["Шлемы"], notes: ["Самостоятельное управление — с 18 лет."] },
    { id: "s12", title: "Детский снегоход", body: "Отдельная техника для юных гостей — катание под присмотром.", slug: "snowmobile-kids", categories: ["winter", "activities"], meta: "От 7 лет",
      prices: [{ label: "30 мин", price: "1 000 ₽" }] },
    { id: "s13", title: "Беговые лыжи", body: "Прокат снаряжения и подготовленная лыжня рядом с базой.", slug: "ski", categories: ["winter", "activities"], meta: "7 комплектов",
      prices: [{ label: "Комплект", price: "300 ₽" }],
      notes: ["Тариф действует за час или за сутки — уточняется на месте."] },
    { id: "s14", title: "Ватрушки", body: "Тюбинг с горки — простое и весёлое зимнее развлечение.", slug: "tubing", categories: ["winter", "activities"],
      prices: [{ label: "1 час", price: "300 ₽" }] },
    { id: "s15", title: "Снежный банан", body: "Катание с ветерком за снегоходом — азарт для компании.", slug: "banana", categories: ["winter", "activities"], meta: "До 3 человек",
      prices: [{ label: "20 минут, с человека", price: "500 ₽" }] },
    { id: "s16", title: "Тимбилдинг", body: "Программы активностей и командных игр под открытым небом.", slug: "teambuilding", categories: ["activities"],
      prices: [{ label: "Программа", price: "27 000 ₽" }],
      included: ["Соревновательная программа", "2 ведущих", "DJ", "Фотограф"],
      notes: ["Длительность и количество участников согласуются отдельно."] },
  ],
  extrasHeading: "Дополнительно на месте",
  extrasSubheading: "Уточняйте наличие при заезде",
  extras: [
    { id: "e1", label: "Дрова для мангала (мешок)", price: "500 ₽" },
    { id: "e2", label: "Мангальный набор (уголь + розжиг)", price: "700 ₽" },
    { id: "e3", label: "Постельное бельё, доп. комплект", price: "500 ₽" },
    { id: "e4", label: "Полотенца, доп. комплект", price: "300 ₽" },
  ],
  transfer: {
    car: "Citroen SpaceTourer",
    carDescription: "Микроавтобус на 7 мест с багажным отделением. Все поездки — с водителем.",
    features: [
      { id: "f1", icon: "seats", text: "До 7 пассажиров" },
      { id: "f2", icon: "luggage", text: "Место для багажа" },
      { id: "f3", icon: "comfort", text: "Комфортный салон" },
    ],
    gallerySlug: "transfer",
    routeGroups: [
      { id: "r1", title: "В отель «Голубая Бухта»", column: "Откуда", icon: "to-hotel", routes: [
        { id: "r1a", label: "Первомайский район", price: "3 000 ₽" },
        { id: "r1b", label: "Октябрьский район", price: "3 200 ₽" },
        { id: "r1c", label: "Ленинский район", price: "3 600 ₽" },
        { id: "r1d", label: "Кола", price: "3 400 ₽" },
        { id: "r1e", label: "Аэропорт", price: "4 000 ₽" },
      ]},
      { id: "r2", title: "Из отеля «Голубая Бухта»", column: "Куда", icon: "from-hotel", routes: [
        { id: "r2a", label: "Кола", price: "3 600 ₽" },
        { id: "r2b", label: "Первомайский район", price: "3 600 ₽" },
        { id: "r2c", label: "Октябрьский район", price: "3 700 ₽" },
        { id: "r2d", label: "Ленинский район", price: "4 200 ₽" },
        { id: "r2e", label: "Аэропорт", price: "4 200 ₽" },
      ]},
      { id: "r3", title: "В аэропорт", column: "Откуда", icon: "to-airport", routes: [
        { id: "r3a", label: "Первомайский район", price: "2 400 ₽" },
        { id: "r3b", label: "Октябрьский район", price: "2 800 ₽" },
        { id: "r3c", label: "Ленинский район", price: "3 000 ₽" },
        { id: "r3d", label: "Териберка", price: "18 000 ₽" },
      ]},
      { id: "r4", title: "Из аэропорта", column: "Куда", icon: "from-airport", routes: [
        { id: "r4a", label: "Мурманск", price: "3 000 ₽" },
        { id: "r4b", label: "Териберка", price: "14 000 ₽" },
      ]},
    ],
    teriberkaTitle: "Мурманск — Териберка",
    teriberka: [
      { id: "tb1", label: "Мурманск → Териберка", price: "13 000 ₽" },
      { id: "tb2", label: "Териберка → Мурманск", price: "17 000 ₽" },
      { id: "tb3", label: "Мурманск → Териберка → Мурманск", price: "24 000 ₽" },
    ],
    waitPrice: "600 ₽",
    waitLabel: "Дополнительное ожидание",
    waitNote: "Точную стоимость по вашему направлению уточним при подтверждении заявки.",
    footnote: "Трансфер организуется по подтверждённой заявке. Стоимость указана за машину, до 7 гостей с багажом.",
  },
  trustItems: [
    { id: "t1", num: "01", title: "9 объектов размещения", body: "4 отдельных коттеджа и 5 блоков таунхауса №3 — всего до 56 гостей." },
    { id: "t2", num: "02", title: "40 км от Мурманска", body: "Верхнетуломское шоссе, берег реки Тулома, Кольский полуостров." },
    { id: "t3", num: "03", title: "Русская баня и фурако", body: "Дровяная парная и кедровая купель работают круглый год." },
    { id: "t4", num: "04", title: "Свои беседки", body: "У Коттеджей №1, №2 и VIP-блока №3 — закреплённые беседки с мангалом." },
    { id: "t5", num: "05", title: "Сезонные активности", body: "Летом — SUP и гидроцикл, зимой — снегоход, лыжи и северное сияние." },
    { id: "t6", num: "06", title: "Трансфер и Териберка", body: "Организуем встречу в аэропорту и поездки на Северный океан." },
  ],
  bookingSteps: [
    { id: "b1", title: "Заявка", body: "Через форму или по телефону." },
    { id: "b2", title: "Согласование", body: "Уточняем даты, объект и услуги." },
    { id: "b3", title: "Предоплата", body: "Фиксируем бронь по подтверждённой заявке." },
    { id: "b4", title: "Приезд", body: "Встречаем на базе, при необходимости — трансфер." },
  ],
  contact: {
    phone: "8 (8152) 780-111",
    phoneHref: "tel:+78152780111",
    address: "Верхнетуломское шоссе, 36 км",
    telegram: "@golubayabuhta",
    telegramHref: "https://t.me/golubayabuhta",
    email: "hello@blue-bay.example",
    coords: "68.85° N · 32.78° E",
  },
  footer: {
    brand: "Голубая Бухта",
    description: "Загородный отель на берегу реки Тулома, 40 км от Мурманска.",
    addressLines: ["Верхнетуломское шоссе, 36 км", "Мурманская область", "68.85° N · 32.78° E"],
    copyright: "© 2026 «Голубая Бухта»",
  },
  bookingConsent:
    "Нажимая кнопку, вы соглашаетесь на обработку персональных данных в соответствии с 152-ФЗ.",
  requestSuccessMessage: "Заявка отправлена. Менеджер свяжется с вами.",
};
