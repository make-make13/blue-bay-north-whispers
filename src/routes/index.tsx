import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import logoAsset from "@/assets/golubaya-buhta-logo.webp.asset.json";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Загородный отель «Голубая Бухта» — Мурманск, берег Туломы" },
      {
        name: "description",
        content:
          "Коттеджи и блоки таунхауса на 2–12 гостей, русская баня на дровах, купель фурако, беседки, трансфер и сезонные активности в 40 км от Мурманска.",
      },
      { property: "og:title", content: "Загородный отель «Голубая Бухта»" },
      {
        property: "og:description",
        content: "9 объектов размещения на берегу Туломы, баня, фурако, беседки, трансфер из Мурманска.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* ---------- Data (строго из брифа) ---------- */

type DetailGroup = {
  group: "beds" | "bath" | "kitchen" | "media" | "outdoor";
  title: string;
  items: string[];
};

type Stay = {
  id: string;
  code: string;
  kind: "cottage" | "townhouse";
  name: string;
  capacity: number;
  price: number;
  priceUnit?: string;
  tagline: string;
  description: string;
  bullets: string[];
  tags: string[];
  details: DetailGroup[];
};

const stays: Stay[] = [
  {
    id: "c1",
    code: "Коттедж №1",
    kind: "cottage",
    name: "Коттедж №1",
    capacity: 12,
    price: 22000,
    tagline: "Для праздников и больших компаний",
    description:
      "Каминный зал, шесть спален и просторная атмосфера для тёплого отдыха за городом.",
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
    id: "c2",
    code: "Коттедж №2",
    kind: "cottage",
    name: "Коттедж №2",
    capacity: 10,
    price: 21000,
    tagline: "Для семьи и отдыха с друзьями",
    description:
      "Пять спален, гостиная и уютная планировка для спокойных выходных с близкими.",
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
    id: "c6",
    code: "Коттедж №6",
    kind: "cottage",
    name: "Коттедж №6",
    capacity: 2,
    price: 12000,
    tagline: "Для пары или небольшой семьи",
    description:
      "Отдельная спальня и дополнительное место — удобный вариант для пары или семьи.",
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
    id: "c5",
    code: "Коттедж №5",
    kind: "cottage",
    name: "Коттедж №5",
    capacity: 2,
    price: 8000,
    tagline: "Компактный домик для двоих",
    description:
      "Мини-коттедж с кроватью, кухонной зоной и душевой для спокойного отдыха вдвоём.",
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
    id: "t3-vip",
    code: "№3 VIP",
    kind: "townhouse",
    name: "VIP-блок таунхауса №3",
    capacity: 6,
    price: 26000,
    tagline: "Премиальный отдых с беседкой",
    description:
      "Сауна, электрокамин и просторные комнаты создают самый уютный формат отдыха в таунхаусе.",
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
    id: "t3-2",
    code: "№3/2",
    kind: "townhouse",
    name: "Блок таунхауса №3/2",
    capacity: 6,
    price: 22000,
    tagline: "Двухэтажный комфорт с сауной",
    description:
      "Просторный двухэтажный блок с отдельными спальными местами, сауной и двумя душевыми.",
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
    id: "t3-3",
    code: "№3/3",
    kind: "townhouse",
    name: "Блок таунхауса №3/3",
    capacity: 6,
    price: 19000,
    priceUnit: "/ блок / сутки",
    tagline: "Уютный блок с собственной сауной",
    description:
      "Три спальни, просторный зал и сауна — удобный формат отдыха для небольшой компании.",
    bullets: [
      "3 комнаты · 6 односпальных кроватей",
      "2 душевые, 2 санузла",
      "Электросауна, сушильный шкаф",
      "Мангал",
    ],
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
    id: "t3-4",
    code: "№3/4",
    kind: "townhouse",
    name: "Блок таунхауса №3/4",
    capacity: 6,
    price: 19000,
    priceUnit: "/ блок / сутки",
    tagline: "Уютный блок с собственной сауной",
    description:
      "Три спальни, просторный зал и сауна — удобный формат отдыха для небольшой компании.",
    bullets: [
      "3 комнаты · 1 двуспальная + 4 односпальные",
      "2 душевые, 2 санузла",
      "Электросауна, сушильный шкаф",
      "Мангал",
    ],
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
    id: "t3-5",
    code: "№3/5",
    kind: "townhouse",
    name: "Блок таунхауса №3/5",
    capacity: 6,
    price: 19000,
    priceUnit: "/ блок / сутки",
    tagline: "Уютный блок с собственной сауной",
    description:
      "Три спальни, просторный зал и сауна — удобный формат отдыха для небольшой компании.",
    bullets: [
      "3 комнаты · 1 двуспальная + 4 односпальные",
      "2 душевые, 2 санузла",
      "Электросауна, сушильный шкаф",
      "Мангал",
    ],
    tags: ["сауна"],
    details: [
      { group: "beds", title: "Спальные места", items: ["3 спальные комнаты", "1 двуспальная кровать и 4 односпальные кровати"] },
      { group: "bath", title: "Санузлы", items: ["2 душевые", "2 санузла"] },
      { group: "kitchen", title: "Кухня и техника", items: ["Варочная панель", "Холодильник", "СВЧ-печь", "Чайник", "Посудомоечная машина", "Сушильный шкаф для одежды"] },
      { group: "media", title: "Медиа и комфорт", items: ["Электрическая сауна", "ЖК-телевизор", "Музыкальный центр"] },
      { group: "outdoor", title: "На улице", items: ["Мангал"] },
    ],
  },
];

const transferRows: Array<[string, string]> = [
  ["Аэропорт Мурманск → база", "3 000 ₽"],
  ["ж/д вокзал Мурманск → база", "3 000 ₽"],
  ["База → Мурманск (город)", "3 000 ₽"],
  ["База → Териберка (в одну сторону)", "12 000 ₽"],
  ["База → Териберка и обратно", "24 000 ₽"],
  ["Час ожидания сверх маршрута", "1 000 ₽"],
];

const banyaRows: Array<[string, string]> = [
  ["Первый час русской бани", "4 000 ₽"],
  ["Каждый следующий час", "3 000 ₽"],
  ["Минимальный заказ бани", "7 000 ₽ (≈ 2 часа)"],
  ["Фурако — первый час", "3 000 ₽"],
  ["Фурако — каждый следующий час", "2 000 ₽"],
  ["Веник дубовый / берёзовый", "500 ₽"],
];

const extrasRows: Array<[string, string]> = [
  ["Дрова для мангала (мешок)", "500 ₽"],
  ["Мангальный набор (уголь + розжиг)", "700 ₽"],
  ["Постельное бельё, доп. комплект", "500 ₽"],
  ["Полотенца, доп. комплект", "300 ₽"],
];

function formatPrice(n: number) {
  return n.toLocaleString("ru-RU").replace(/,/g, "\u00A0") + " ₽";
}

/* ---------- Root ---------- */

function Index() {
  return (
    <div className="min-h-screen bg-resin-950 text-resin-200 selection:bg-teal/30 selection:text-resin-50">
      <TopBar />
      <main>
        <Hero />
        <StaysSection />
        <GazeboSection />
        <ActivitiesSection />
        <TransferSection />
        <TrustSection />
        <RequestSection />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ---------- Top bar ---------- */

function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-resin-800/70 bg-resin-950/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-resin-900 ring-1 ring-resin-800">
            <img src={logoAsset.url} alt="Голубая Бухта" className="h-full w-full object-cover" />
          </span>
          <span className="text-sm font-medium tracking-tight text-resin-50">Голубая&nbsp;Бухта</span>
        </a>
        <nav className="hidden gap-7 text-sm text-resin-200/70 md:flex">
          <a href="#stays" className="hover:text-resin-50">Коттеджи</a>
          <a href="#banya" className="hover:text-resin-50">Баня и фурако</a>
          <a href="#activities" className="hover:text-resin-50">Активности</a>
          <a href="#transfer" className="hover:text-resin-50">Трансфер</a>
          <a href="#request" className="hover:text-resin-50">Контакты</a>
        </nav>
        <a
          href="#request"
          className="rounded-full bg-teal px-4 py-2 text-xs font-semibold tracking-wide text-resin-950 transition-colors hover:bg-teal-dim"
        >
          Оставить заявку
        </a>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-resin-800/60">
      <Placeholder
        label="Фото · вид на коттеджи и Тулому"
        className="absolute inset-0 opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-resin-950/40 via-resin-950/70 to-resin-950" />
      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 md:pb-32 md:pt-28">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-resin-800 bg-resin-950/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-teal">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            68° N · берег Туломы · 40 км от Мурманска
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-resin-50 md:text-6xl">
            &nbsp;Голубая&nbsp;Бухта - отдых на природе с городским комфортом
          </h1>
          <p className="mt-6 max-w-xl text-base text-resin-200/75 md:text-lg">
            Загородный отель, на берегу реки Тулома в 40 км от Мурманска. Коттеджи, беседки,
            баня, фурако и активный досуг.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#request"
              className="rounded-full bg-teal px-6 py-3 text-sm font-semibold text-resin-950 transition-colors hover:bg-teal-dim"
            >
              Забронировать
            </a>
            <a
              href="#stays"
              className="rounded-full border border-resin-200/25 px-6 py-3 text-sm text-resin-50 transition-colors hover:border-teal hover:text-teal"
            >
              Посмотреть коттеджи
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Stays ---------- */

function StaysSection() {
  const [tab, setTab] = useState<"all" | "cottage" | "townhouse">("all");
  const list = stays.filter((s) => (tab === "all" ? true : s.kind === tab));
  return (
    <Section id="stays" eyebrow="Размещение" title="Коттеджи для компаний, семьи и уютных пар"
      lede="Отдельные коттеджи и блоки таунхауса №3 — это разные типы объектов. Вместимость у каждого своя, от 2 до 12 гостей.">
      <div className="mb-8 flex flex-wrap gap-2">
        <Tab active={tab === "all"} onClick={() => setTab("all")}>Все · {stays.length}</Tab>
        <Tab active={tab === "cottage"} onClick={() => setTab("cottage")}>
          Отдельные коттеджи · {stays.filter((s) => s.kind === "cottage").length}
        </Tab>
        <Tab active={tab === "townhouse"} onClick={() => setTab("townhouse")}>
          Блоки таунхауса №3 · {stays.filter((s) => s.kind === "townhouse").length}
        </Tab>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <StayCard key={s.id} stay={s} />
        ))}
      </div>
    </Section>
  );
}

function StayCard({ stay }: { stay: Stay }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <article className="group flex flex-col overflow-hidden rounded-2xl border border-resin-800 bg-[color:var(--color-surface)] transition-colors hover:border-teal/50">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Placeholder
            label={stay.kind === "cottage" ? "Фото · коттедж" : "Фото · блок таунхауса"}
            className="absolute inset-0"
          />
          <span className="absolute left-3 top-3 rounded-full bg-resin-950/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-resin-200 backdrop-blur">
            {stay.kind === "cottage" ? "Коттедж" : "Таунхаус"}
          </span>
          <span className="absolute right-3 top-3 rounded-full bg-teal px-3 py-1 font-mono text-[11px] font-semibold tabular-nums text-resin-950">
            {formatPrice(stay.price)}<span className="opacity-70"> / сут</span>
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5">
          <header className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-medium text-resin-50">{stay.name}</h3>
            <span className="shrink-0 font-mono text-xs tabular-nums text-teal">
              до {stay.capacity} гостей
            </span>
          </header>
          <ul className="space-y-1.5 text-sm text-resin-200/75">
            {stay.bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-teal/70" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {stay.tags.map((t) => (
              <span key={t} className="rounded-full border border-resin-800 px-2.5 py-0.5 text-[11px] text-resin-200/60">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <a
              href="#request"
              className="inline-flex flex-1 items-center justify-center rounded-full bg-teal px-4 py-2 text-xs font-semibold text-resin-950 transition-colors hover:bg-teal-dim"
            >
              Забронировать
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-resin-200/25 px-4 py-2 text-xs font-semibold text-resin-50 transition-colors hover:border-teal hover:text-teal"
            >
              Подробнее
            </button>
          </div>
        </div>
      </article>

      {open && <StayModal stay={stay} onClose={() => setOpen(false)} />}
    </>
  );
}

function StayModal({ stay, onClose }: { stay: Stay; onClose: () => void }) {
  const [active, setActive] = useState(0);
  const slides = [
    `${stay.name} · гостиная`,
    `${stay.name} · спальня`,
    `${stay.name} · кухня`,
    `${stay.name} · санузел`,
    `${stay.name} · внешний вид`,
    `${stay.name} · беседка`,
  ];
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-resin-950/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-resin-800 bg-[color:var(--color-surface)] p-6 md:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full border border-resin-800 bg-resin-950/80 text-resin-200 hover:border-teal hover:text-teal"
          aria-label="Закрыть"
        >
          ✕
        </button>

        <div className="grid gap-8 md:grid-cols-[1fr_1.15fr]">
          {/* Left: info */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-4 py-1.5 text-xs font-medium text-teal">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
                  <circle cx="16" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M3.5 18c.6-2.4 2.8-4 5.5-4s4.9 1.6 5.5 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  <path d="M14.5 17c.5-1.8 2-3 4-3s3.5 1.2 4 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                До {stay.capacity} гостей
              </span>
            </div>

            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-resin-200/50">
                {stay.kind === "cottage" ? "Отдельный коттедж" : "Блок таунхауса №3"}
              </p>
              <h3 className="font-serif text-4xl leading-tight text-resin-50 md:text-5xl">{stay.name}</h3>
              <p className="mt-3 text-sm font-medium text-teal">{stay.tagline}</p>
              <p className="mt-2 text-sm leading-relaxed text-resin-200/75">{stay.description}</p>
            </div>

            <div className="flex items-baseline gap-3">
              <p className="font-mono text-3xl font-semibold tabular-nums text-teal">
                {formatPrice(stay.price)}
              </p>
              <p className="text-sm text-resin-200/60">{stay.priceUnit ?? "/ сутки"}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {stay.details.map((d) => (
                <div key={d.title} className="rounded-2xl border border-resin-800 bg-resin-950/40 p-4">
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-resin-50">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-teal/10 text-teal">
                      <DetailIcon kind={d.group} />
                    </span>
                    {d.title}
                  </p>
                  <ul className="space-y-1.5 text-[13px] text-resin-200/80">
                    {d.items.map((it) => (
                      <li key={it} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-teal/70" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {stay.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {stay.tags.map((t) => (
                  <span key={t} className="rounded-full border border-resin-800 px-3 py-1 text-[11px] text-resin-200/70">
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto flex flex-wrap gap-3 pt-2">
              <a
                href="#request"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-semibold text-resin-950 transition-colors hover:bg-teal-dim"
              >
                Забронировать
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full border border-resin-200/25 px-6 py-3 text-sm text-resin-50 transition-colors hover:border-teal hover:text-teal"
              >
                Закрыть
              </button>
            </div>
          </div>

          {/* Right: gallery */}
          <div className="flex gap-3">
            <div className="relative flex-1 overflow-hidden rounded-2xl border border-resin-800">
              <Placeholder label={slides[active]} className="absolute inset-0" />
              <span className="absolute bottom-3 left-3 rounded-full bg-resin-950/80 px-3 py-1 font-mono text-[11px] tabular-nums text-resin-200 backdrop-blur">
                {active + 1} / {slides.length}
              </span>
            </div>
            <div className="flex w-20 flex-col gap-2 md:w-24">
              {slides.slice(0, 5).map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`relative aspect-square overflow-hidden rounded-xl border transition-colors ${
                    active === i ? "border-teal ring-2 ring-teal/40" : "border-resin-800 hover:border-resin-200/40"
                  }`}
                  aria-label={label}
                >
                  <Placeholder label="" className="absolute inset-0" />
                </button>
              ))}
              {slides.length > 5 && (
                <div className="grid aspect-square place-items-center rounded-xl border border-resin-800 bg-resin-950/60 text-center">
                  <div>
                    <p className="font-mono text-sm font-semibold text-resin-50">+{slides.length - 5}</p>
                    <p className="text-[10px] text-resin-200/60">фото</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Gazebos ---------- */

const GAZEBO_SLIDES = [
  "Беседка · внешний вид",
  "Беседка · внутри, стол и лавки",
  "Беседка · мангал",
  "Беседка · вечер у огня",
];

const GAZEBO_CARDS: {
  title: string;
  body: string;
  icon: "house" | "house2" | "crown" | "people";
}[] = [
  { title: "Беседка №1*", body: "Закреплена за Коттеджем №1.", icon: "house" },
  { title: "Беседка №2*", body: "Закреплена за Коттеджем №2.", icon: "house2" },
  { title: "Беседка VIP*", body: "Закреплена за VIP-блоком №3.", icon: "crown" },
  { title: "Общая беседка", body: "Доступна по предварительному запросу.", icon: "people" },
];

function DetailIcon({ kind }: { kind: "beds" | "bath" | "kitchen" | "media" | "outdoor" }) {
  const s = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true } as const;
  const stroke = { stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  if (kind === "beds")
    return (
      <svg {...s}><path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" {...stroke} /><path d="M3 15h18M3 20v-2M21 20v-2" {...stroke} /><path d="M7 9V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" {...stroke} /></svg>
    );
  if (kind === "bath")
    return (
      <svg {...s}><path d="M4 11h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3z" {...stroke} /><path d="M7 11V6a2 2 0 0 1 2-2h1M6 20l-1 1M18 20l1 1" {...stroke} /></svg>
    );
  if (kind === "kitchen")
    return (
      <svg {...s}><path d="M4 4h16v6H4zM4 10v10M20 10v10M8 14h8M8 17h5" {...stroke} /></svg>
    );
  if (kind === "media")
    return (
      <svg {...s}><rect x="3" y="5" width="18" height="12" rx="2" {...stroke} /><path d="M8 21h8M12 17v4" {...stroke} /></svg>
    );
  return (
    <svg {...s}><path d="M12 3l3 4h-2v4h4l3 4h-2v6H6v-6H4l3-4h4V7H9l3-4z" {...stroke} /></svg>
  );
}

function GazeboIcon({ kind }: { kind: "house" | "house2" | "crown" | "people" }) {
  const cls = "h-5 w-5";
  if (kind === "crown")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={cls}>
        <path d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8z" strokeLinejoin="round" />
      </svg>
    );
  if (kind === "people")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={cls}>
        <circle cx="9" cy="9" r="3" />
        <circle cx="17" cy="10" r="2.5" />
        <path d="M3 19c0-3 3-5 6-5s6 2 6 5" strokeLinecap="round" />
        <path d="M15 18c.4-2 2.2-3.5 4-3.5s2.8 1 2.8 2.5" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={cls}>
      <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9z" strokeLinejoin="round" />
    </svg>
  );
}

function GazeboSection() {
  const [slide, setSlide] = useState(0);
  const [active, setActive] = useState(0);
  const total = GAZEBO_SLIDES.length;
  const prev = () => setSlide((s) => (s - 1 + total) % total);
  const next = () => setSlide((s) => (s + 1) % total);

  return (
    <Section
      id="gazebos"
      eyebrow="Беседки"
      title="Мангальные зоны на свежем воздухе"
      lede="&nbsp;Уютные беседки рядом с коттеджами. Решётки и шампура предоставляются, уголь и розжиг приобретаются отдельно.&nbsp;"
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        {/* Left: image carousel */}
        <div className="rounded-3xl border border-resin-800 bg-[color:var(--color-surface)] p-4 sm:p-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-resin-800">
            <Placeholder label={GAZEBO_SLIDES[slide]} className="absolute inset-0" />
            <button
              type="button"
              aria-label="Предыдущее фото"
              onClick={prev}
              className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-resin-200/15 bg-resin-950/70 text-resin-50 backdrop-blur transition-colors hover:border-teal hover:text-teal"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Следующее фото"
              onClick={next}
              className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-resin-200/15 bg-resin-950/70 text-resin-50 backdrop-blur transition-colors hover:border-teal hover:text-teal"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="absolute bottom-4 right-4 rounded-full border border-resin-200/15 bg-resin-950/70 px-3 py-1 font-mono text-[11px] tabular-nums text-resin-100 backdrop-blur">
              {slide + 1} / {total}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {GAZEBO_SLIDES.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setSlide(i)}
                aria-label={`Открыть фото ${i + 1}`}
                className={`relative aspect-[4/3] overflow-hidden rounded-xl border transition-colors ${
                  slide === i ? "border-teal" : "border-resin-800 hover:border-resin-400"
                }`}
              >
                <Placeholder label={label} className="absolute inset-0" />
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {GAZEBO_SLIDES.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  slide === i ? "w-6 bg-teal" : "w-1.5 bg-resin-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: cards */}
        <div className="flex flex-col">
          <div className="grid gap-3 sm:grid-cols-2">
            {GAZEBO_CARDS.map((c, i) => {
              const isActive = active === i;
              return (
                <button
                  key={c.title}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`group relative flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-colors ${
                    isActive
                      ? "border-teal bg-teal/5"
                      : "border-resin-800 bg-[color:var(--color-surface)] hover:border-resin-400"
                  }`}
                >
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full ${
                      isActive ? "bg-teal/20 text-teal" : "bg-resin-900 text-resin-200/70"
                    }`}
                  >
                    <GazeboIcon kind={c.icon} />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-resin-50">{c.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-resin-200/70">{c.body}</p>
                  </div>
                  {isActive && (
                    <span className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-teal text-resin-950">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5">
                        <path d="M5 12l5 5 9-11" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-5 text-xs leading-relaxed text-resin-200/55">
            * Закреплена за конкретным коттеджем (№1, №2, VIP-блок №3). Аренда возможна только при отсутствии заезда в соответствующий коттедж.
          </p>

          <a
            href="#request"
            className="mt-6 inline-flex items-center justify-center gap-2 self-start rounded-full bg-teal px-6 py-3 text-sm font-semibold text-resin-950 transition-colors hover:bg-teal-dim"
          >
            Оставить заявку на беседку
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Activities / Баня / Фурако ---------- */

type ServiceCategory = "banya" | "summer" | "winter" | "activities";
type ServiceItem = {
  title: string;
  body: string;
  image: string;
  categories: ServiceCategory[];
};

const serviceItems: ServiceItem[] = [
  {
    title: "Русская баня",
    body: "Парилка на дровах, комната отдыха, душевая, санузел. Вместимость до 10 человек.",
    image: "Фото · русская баня",
    categories: ["banya"],
  },
  {
    title: "Фурако",
    body: "Кедровая купель с подогревом на дровах. Подходит для отдыха 4–6 человек.",
    image: "Фото · фурако",
    categories: ["banya"],
  },
  {
    title: "Гидроциклы",
    body: "Прогулки по воде с инструктором или самостоятельное катание в сезон.",
    image: "Фото · гидроциклы",
    categories: ["summer", "activities"],
  },
  {
    title: "SUP-доска",
    body: "Спокойные прогулки по воде и красивые виды в тёплое время года.",
    image: "Фото · SUP",
    categories: ["summer", "activities"],
  },
  {
    title: "Катамаран",
    body: "Неспешный отдых на воде для пары, семьи или небольшой компании.",
    image: "Фото · катамаран",
    categories: ["summer", "activities"],
  },
  {
    title: "Квадроциклы",
    body: "Маршруты по лесу и активный отдых на природе в сопровождении инструктора.",
    image: "Фото · квадроциклы",
    categories: ["summer", "activities"],
  },
  {
    title: "Снегоходы",
    body: "Маршруты по тундре и лесу с инструктором в устойчивый снежный сезон.",
    image: "Фото · снегоход",
    categories: ["winter", "activities"],
  },
  {
    title: "Беговые лыжи",
    body: "Прокат снаряжения и подготовленная лыжня рядом с базой.",
    image: "Фото · лыжи",
    categories: ["winter", "activities"],
  },
  {
    title: "Северное сияние",
    body: "Выезд к тёмным точкам наблюдения полярной ночью в сопровождении гида.",
    image: "Фото · сияние",
    categories: ["winter", "activities"],
  },
];

function ActivitiesSection() {
  const tabs: { id: "all" | ServiceCategory; label: string }[] = [
    { id: "all", label: "Все" },
    { id: "banya", label: "Баня и фурако" },
    { id: "summer", label: "Лето" },
    { id: "winter", label: "Зима" },
    { id: "activities", label: "Активности" },
  ];
  const [tab, setTab] = useState<"all" | ServiceCategory>("all");
  const visible =
    tab === "all" ? serviceItems : serviceItems.filter((i) => i.categories.includes(tab));

  return (
    <Section
      id="activities"
      eyebrow="Услуги"
      title="Баня, фурако и сезонные развлечения"
      lede="Русская дровяная баня и фурако доступны круглый год. Водные активности — летом, снежные — зимой. Выбирайте отдых по настроению: на воде, в лесу или под открытым небом."
    >
      <div className="mb-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Tab key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </Tab>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((item) => (
          <article
            key={item.title}
            className="group flex flex-col overflow-hidden rounded-2xl border border-resin-800 bg-[color:var(--color-surface)] transition-colors hover:border-teal/40"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-resin-900 to-[#0a1514]">
              <div className="absolute inset-0 grid place-items-center text-center text-xs font-mono uppercase tracking-widest text-resin-200/40">
                {item.image}
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="mb-2 text-base font-semibold text-resin-50">{item.title}</h3>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-resin-200/70">{item.body}</p>
              <a
                href="#request"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-teal transition-colors hover:text-teal-dim"
              >
                Подробнее
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition-transform group-hover:translate-x-0.5">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-14">
        <div className="mb-5 flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-semibold text-resin-50">Дополнительно на месте</h3>
          <p className="text-xs text-resin-200/60">Уточняйте наличие при заезде</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {extrasRows.map(([label, price]) => (
            <div
              key={label}
              className="rounded-2xl border border-resin-800 bg-[color:var(--color-surface)] p-5"
            >
              <p className="text-sm text-resin-200/80">{label}</p>
              <p className="mt-3 font-mono text-lg font-semibold tabular-nums text-teal">{price}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- Transfer ---------- */

const TRANSFER_GALLERY = [
  "Citroen SpaceTourer — вид сбоку",
  "Салон микроавтобуса",
  "Багажное отделение",
  "Микроавтобус у базы",
];

const ROUTE_GROUPS: Array<{ title: string; routes: Array<[string, string?]> }> = [
  {
    title: "До Голубой Бухты",
    routes: [
      ["Первомайский район → Голубая Бухта"],
      ["Октябрьский район → Голубая Бухта"],
      ["Ленинский район → Голубая Бухта"],
      ["Кола → Голубая Бухта"],
      ["Аэропорт → Голубая Бухта", "3 000 ₽"],
    ],
  },
  {
    title: "Из Голубой Бухты",
    routes: [
      ["Голубая Бухта → Кола"],
      ["Голубая Бухта → Первомайский район"],
      ["Голубая Бухта → Октябрьский район"],
      ["Голубая Бухта → Ленинский район", "3 000 ₽"],
      ["Голубая Бухта → Аэропорт", "3 000 ₽"],
    ],
  },
  {
    title: "Аэропорт и Мурманск",
    routes: [
      ["Первомайский район → Аэропорт"],
      ["Октябрьский район → Аэропорт"],
      ["Ленинский район → Аэропорт"],
      ["Аэропорт → Мурманск"],
    ],
  },
  {
    title: "Териберка",
    routes: [
      ["Аэропорт → Териберка"],
      ["Териберка → Аэропорт"],
      ["Мурманск → Териберка"],
      ["Териберка → Мурманск"],
      ["Голубая Бухта → Териберка", "12 000 ₽ / 24 000 ₽ туда-обратно"],
    ],
  },
];

function TransferIcon({ kind }: { kind: "seats" | "luggage" | "comfort" }) {
  const common = "h-4 w-4 text-teal";
  if (kind === "seats") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={common}>
        <circle cx="8" cy="7" r="2.5" /><circle cx="16" cy="7" r="2.5" />
        <path d="M3 20c0-3 2.5-5 5-5s5 2 5 5" /><path d="M11 20c0-3 2.5-5 5-5s5 2 5 5" />
      </svg>
    );
  }
  if (kind === "luggage") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={common}>
        <rect x="5" y="7" width="14" height="13" rx="2" /><path d="M9 7V4h6v3" /><path d="M9 11v6M15 11v6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={common}>
      <path d="M4 17V9l4-4h8l4 4v8" /><path d="M4 17h16" /><circle cx="8" cy="17" r="2" /><circle cx="16" cy="17" r="2" />
    </svg>
  );
}

function TransferSection() {
  const [slide, setSlide] = useState(0);
  const [routesOpen, setRoutesOpen] = useState(false);
  const total = TRANSFER_GALLERY.length;

  return (
    <Section
      id="transfer"
      eyebrow="Логистика"
      title="Комфортный трансфер на микроавтобусе"
      lede="Citroen SpaceTourer на 7 мест. Встречаем в аэропорту и на вокзале Мурманска, возим в город и Териберку."
    >
      <div className="grid gap-6 md:grid-cols-[1.35fr_1fr]">
        {/* Gallery */}
        <div>
          <div className="relative overflow-hidden rounded-2xl border border-resin-800 bg-[color:var(--color-surface)]">
            <div className="relative aspect-[16/10]">
              <Placeholder label={TRANSFER_GALLERY[slide]} className="absolute inset-0" />
            </div>
            <button
              type="button"
              onClick={() => setSlide((s) => (s - 1 + total) % total)}
              className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-resin-800 bg-resin-950/70 text-resin-50 backdrop-blur hover:border-teal hover:text-teal"
              aria-label="Предыдущее фото"
            >‹</button>
            <button
              type="button"
              onClick={() => setSlide((s) => (s + 1) % total)}
              className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-resin-800 bg-resin-950/70 text-resin-50 backdrop-blur hover:border-teal hover:text-teal"
              aria-label="Следующее фото"
            >›</button>
            <span className="absolute bottom-3 right-3 rounded-full bg-resin-950/80 px-3 py-1 font-mono text-[11px] tabular-nums text-resin-200/80">
              {slide + 1}/{total}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {TRANSFER_GALLERY.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setSlide(i)}
                className={`relative aspect-[16/10] overflow-hidden rounded-lg border transition-colors ${
                  i === slide ? "border-teal" : "border-resin-800 hover:border-teal/60"
                }`}
              >
                <Placeholder label={`${i + 1}`} className="absolute inset-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="rounded-2xl border border-resin-800 bg-[color:var(--color-surface)] p-6">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-teal">Автомобиль</p>
          <p className="text-xl font-medium text-resin-50">Citroen SpaceTourer</p>
          <p className="mt-1 text-sm text-resin-200/70">Микроавтобус на 7 мест с багажным отделением. Все поездки — с водителем.</p>

          <div className="mt-6 grid grid-cols-1 gap-3 border-t border-resin-800 pt-6">
            {([
              ["seats", "До 7 пассажиров"],
              ["luggage", "Место для багажа"],
              ["comfort", "Комфортный салон"],
            ] as Array<["seats" | "luggage" | "comfort", string]>).map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3 text-sm text-resin-200/85">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-resin-800 bg-resin-950/60">
                  <TransferIcon kind={icon} />
                </span>
                {text}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setRoutesOpen(true)}
              className="rounded-full border border-resin-700 px-5 py-2.5 text-sm text-resin-50 hover:border-teal hover:text-teal"
            >
              Маршрут и цены
            </button>
            <a
              href="#request"
              className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 text-sm font-medium text-resin-950 hover:bg-teal-dim"
            >
              Заказать →
            </a>
          </div>

          <p className="mt-5 text-xs text-resin-200/50">
            Трансфер организуется по подтверждённой заявке. Стоимость указана за машину, до 7 гостей с багажом.
          </p>
        </div>
      </div>

      {routesOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-resin-950/80 p-4 backdrop-blur-sm"
          onClick={() => setRoutesOpen(false)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-resin-800 bg-[color:var(--color-surface)] p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.25em] text-teal">Направления</p>
                <h3 className="text-2xl font-semibold text-resin-50">Маршрут и цены</h3>
              </div>
              <button
                type="button"
                onClick={() => setRoutesOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-resin-800 text-resin-200 hover:border-teal hover:text-teal"
                aria-label="Закрыть"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {ROUTE_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="mb-3 text-sm font-medium text-teal">{group.title}</p>
                  <ul className="space-y-2 text-sm">
                    {group.routes.map(([label, price]) => (
                      <li key={label} className="flex items-baseline justify-between gap-3 border-b border-resin-800/60 py-2 text-resin-200/85">
                        <span>{label}</span>
                        <span className="shrink-0 font-mono text-xs tabular-nums text-resin-200/60">
                          {price ?? "по запросу"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-resin-200/50">
              Час ожидания сверх маршрута — 1 000 ₽. Точную стоимость по вашему направлению уточним при подтверждении заявки.
            </p>
          </div>
        </div>
      )}
    </Section>
  );
}

/* ---------- Trust ---------- */

function TrustSection() {
  const items = [
    ["01", "9 объектов размещения", "4 отдельных коттеджа и 5 блоков таунхауса №3 — всего до 56 гостей."],
    ["02", "40 км от Мурманска", "Верхнетуломское шоссе, берег реки Тулома, Кольский полуостров."],
    ["03", "Русская баня и фурако", "Дровяная парная и кедровая купель работают круглый год."],
    ["04", "Свои беседки", "У Коттеджей №1, №2 и VIP-блока №3 — закреплённые беседки с мангалом."],
    ["05", "Сезонные активности", "Летом — SUP и гидроцикл, зимой — снегоход, лыжи и северное сияние."],
    ["06", "Трансфер и Териберка", "Организуем встречу в аэропорту и поездки на Северный океан."],
  ];
  return (
    <Section id="trust" eyebrow="О базе" title="Загородная база, которой доверяют"
      lede="Только факты — без отзывов, наград и придуманных рейтингов.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map(([num, title, body]) => (
          <div key={num} className="rounded-2xl border border-resin-800 bg-[color:var(--color-surface)] p-6">
            <p className="mb-3 font-mono text-xs tabular-nums text-teal">{num}</p>
            <p className="mb-2 text-base font-medium text-resin-50">{title}</p>
            <p className="text-sm text-resin-200/70">{body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Steps ---------- */

/* ---------- Request (with steps) ---------- */

const BOOKING_STEPS: Array<[string, string]> = [
  ["Заявка", "Через форму или по телефону."],
  ["Согласование", "Уточняем даты, объект и услуги."],
  ["Предоплата", "Фиксируем бронь по подтверждённой заявке."],
  ["Приезд", "Встречаем на базе, при необходимости — трансфер."],
];

function RequestSection() {
  return (
    <section id="request" className="border-t border-resin-800/60 bg-gradient-to-b from-resin-950 to-[#0a1110] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-12 max-w-3xl">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-teal">Бронирование</p>
          <h2 className="text-3xl font-semibold tracking-tight text-resin-50 md:text-5xl">
            Как забронировать
          </h2>
          <p className="mt-4 text-resin-200/70 md:text-lg">
            Форма — это заявка, не подтверждение брони. Дата закрепляется после ответа менеджера и предоплаты.
          </p>
        </header>

        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col">
            <ol className="space-y-4">
              {BOOKING_STEPS.map(([title, body], i) => (
                <li key={title} className="flex gap-4 rounded-2xl border border-resin-800 bg-[color:var(--color-surface)] p-5">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal/15 font-mono text-sm font-semibold text-teal">
                    {i + 1}
                  </div>
                  <div>
                    <p className="mb-1 text-base font-medium text-resin-50">{title}</p>
                    <p className="text-sm text-resin-200/70">{body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 space-y-2 border-t border-resin-800/60 pt-6 text-sm text-resin-200/80">
              <p><span className="text-resin-200/50">Тел.:</span> <a href="tel:+78152780111" className="text-resin-50 hover:text-teal">8 (8152) 780-111</a></p>
              <p><span className="text-resin-200/50">Адрес:</span> Верхнетуломское шоссе, 36 км</p>
              <p><span className="text-resin-200/50">Telegram:</span> <a href="https://t.me/golubayabuhta" target="_blank" rel="noopener noreferrer" className="text-resin-50 hover:text-teal">@golubayabuhta</a></p>
            </div>
          </div>

          <form
            className="rounded-2xl border border-resin-800 bg-[color:var(--color-surface)] p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Заявка отправлена. Менеджер свяжется с вами.");
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Имя" name="name" placeholder="Как к вам обращаться" required />
              <Field label="Телефон" name="phone" type="tel" placeholder="+7" required />
              <Field label="Дата заезда" name="checkin" type="date" />
              <Field label="Дата выезда" name="checkout" type="date" />
              <Field label="Гостей" name="guests" type="number" placeholder="2" />
              <Field label="Объект" name="stay" placeholder="Например: Коттедж №1" />
            </div>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-xs uppercase tracking-widest text-resin-200/50">Комментарий</span>
              <textarea
                name="note"
                rows={3}
                placeholder="Пожелания, услуги, трансфер"
                className="w-full rounded-lg border border-resin-800 bg-resin-950 px-4 py-3 text-sm text-resin-50 outline-none placeholder:text-resin-200/30 focus:border-teal"
              />
            </label>
            <p className="mt-4 text-xs text-resin-200/45">
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных в соответствии с 152-ФЗ.
            </p>
            <button
              type="submit"
              className="mt-5 w-full rounded-full bg-teal py-3 text-sm font-semibold text-resin-950 transition-colors hover:bg-teal-dim"
            >
              Отправить заявку
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */

function SiteFooter() {
  return (
    <footer className="border-t border-resin-800/60 bg-resin-950 py-10">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 text-sm text-resin-200/60 md:grid-cols-3">
        <div>
          <p className="mb-2 font-medium text-resin-50">Голубая Бухта</p>
          <p>Загородный отель на берегу реки Тулома, 40 км от Мурманска.</p>
        </div>
        <div className="space-y-1">
          <p>Верхнетуломское шоссе, 36 км</p>
          <p>Мурманская область</p>
          <p>68.85° N · 32.78° E</p>
        </div>
        <div className="space-y-1 md:text-right">
          <p><a href="tel:+78152780111" className="hover:text-teal">8 (8152) 780-111</a></p>
          <p><a href="mailto:hello@blue-bay.example" className="hover:text-teal">hello@blue-bay.example</a></p>
          <p className="text-xs text-resin-200/40">© 2026 «Голубая Бухта»</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- UI primitives ---------- */

function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-b border-resin-800/60 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-10 max-w-3xl">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-teal">{eyebrow}</p>
          <h2 className="text-3xl font-semibold tracking-tight text-resin-50 md:text-4xl">{title}</h2>
          {lede && <p className="mt-4 text-resin-200/70 md:text-lg">{lede}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
        active
          ? "border-teal bg-teal text-resin-950"
          : "border-resin-800 text-resin-200/70 hover:border-teal/60 hover:text-resin-50"
      }`}
    >
      {children}
    </button>
  );
}

function FactCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-resin-800 bg-[color:var(--color-surface)] p-5">
      <p className="mb-2 text-sm font-medium text-resin-50">{title}</p>
      <p className="text-sm text-resin-200/70">{body}</p>
    </div>
  );
}

function MediaCard({
  title,
  body,
  image,
  price,
}: {
  title: string;
  body: string;
  image: string;
  price?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-resin-800 bg-[color:var(--color-surface)]">
      <div className="relative aspect-[16/10]">
        <Placeholder label={image} className="absolute inset-0" />
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className="text-sm font-medium text-resin-50">{title}</p>
          {price && <span className="shrink-0 font-mono text-xs tabular-nums text-teal">{price}</span>}
        </div>
        <p className="text-sm text-resin-200/70">{body}</p>
      </div>
    </div>
  );
}

function PriceList({
  title,
  rows,
  note,
}: {
  title: string;
  rows: Array<[string, string]>;
  note?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-resin-800 bg-[color:var(--color-surface)]">
      <p className="border-b border-resin-800 px-5 py-4 text-xs uppercase tracking-widest text-resin-200/50">
        {title}
      </p>
      <ul className="divide-y divide-resin-800">
        {rows.map(([l, p]) => (
          <li key={l} className="flex items-center justify-between px-5 py-3.5 text-sm">
            <span className="text-resin-200/80">{l}</span>
            <span className="font-mono tabular-nums text-teal">{p}</span>
          </li>
        ))}
      </ul>
      {note && <p className="border-t border-resin-800 px-5 py-3 text-xs text-resin-200/45">{note}</p>}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-resin-200/50">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-resin-800 bg-resin-950 px-4 py-3 text-sm text-resin-50 outline-none placeholder:text-resin-200/30 focus:border-teal"
      />
    </label>
  );
}

function Placeholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(45,212,191,0.12),transparent_60%),linear-gradient(135deg,#132321,#0a1413)] ${className}`}
      aria-label={label}
    >
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-resin-200/40">
        <span className="inline-block h-1 w-6 bg-resin-200/30" />
        {label}
      </div>
    </div>
  );
}
