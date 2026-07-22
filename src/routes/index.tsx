import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

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

type Stay = {
  id: string;
  code: string;
  kind: "cottage" | "townhouse";
  name: string;
  capacity: number;
  price: number;
  bullets: string[];
  tags: string[];
};

const stays: Stay[] = [
  {
    id: "c1",
    code: "Коттедж №1",
    kind: "cottage",
    name: "Коттедж №1",
    capacity: 12,
    price: 22000,
    bullets: [
      "6 спален · 2 двуспальные + 8 односпальных",
      "2 душевые, 2 санузла",
      "Каминный зал, собственная беседка, мангал",
      "Кухня: варочная панель, холодильник, СВЧ, ПМ",
    ],
    tags: ["для компании", "камин", "беседка"],
  },
  {
    id: "c2",
    code: "Коттедж №2",
    kind: "cottage",
    name: "Коттедж №2",
    capacity: 10,
    price: 21000,
    bullets: [
      "5 комнат · по 2 односпальные кровати",
      "2 душевые, 2 санузла",
      "Гостиная, собственная беседка, мангал",
      "Кухня: холодильник, СВЧ, чайник",
    ],
    tags: ["для компании", "беседка"],
  },
  {
    id: "c6",
    code: "Коттедж №6",
    kind: "cottage",
    name: "Коттедж №6",
    capacity: 2,
    price: 12000,
    bullets: [
      "Отдельная спальня, двуспальная кровать",
      "Душевая",
      "Мини-холодильник, варочная панель, СВЧ",
      "Фен, мангал",
    ],
    tags: ["для двоих"],
  },
  {
    id: "c5",
    code: "Коттедж №5",
    kind: "cottage",
    name: "Коттедж №5",
    capacity: 2,
    price: 8000,
    bullets: [
      "Двуспальная кровать",
      "Душевая",
      "Кухонная зона: мини-холодильник, СВЧ, чайник",
      "Мангал",
    ],
    tags: ["для двоих", "компактный"],
  },
  {
    id: "t3-vip",
    code: "№3 VIP",
    kind: "townhouse",
    name: "VIP-блок таунхауса №3",
    capacity: 6,
    price: 26000,
    bullets: [
      "3 комнаты · 1 двуспальная + 4 односпальные",
      "2 душевые, 2 санузла",
      "Электросауна, электрокамин",
      "Отдельная беседка, мангал, Xbox One",
    ],
    tags: ["VIP", "сауна", "беседка"],
  },
  {
    id: "t3-2",
    code: "№3/2",
    kind: "townhouse",
    name: "Блок таунхауса №3/2",
    capacity: 6,
    price: 22000,
    bullets: [
      "3 комнаты · 6 односпальных кроватей",
      "2 душевые, 2 санузла",
      "Электросауна, сушильный шкаф",
      "Кресло-качалка, мангал",
    ],
    tags: ["сауна", "отдельный вход"],
  },
  {
    id: "t3-3",
    code: "№3/3",
    kind: "townhouse",
    name: "Блок таунхауса №3/3",
    capacity: 6,
    price: 19000,
    bullets: [
      "3 комнаты · 6 односпальных кроватей",
      "2 душевые, 2 санузла",
      "Электросауна, сушильный шкаф",
      "Мангал",
    ],
    tags: ["сауна"],
  },
  {
    id: "t3-4",
    code: "№3/4",
    kind: "townhouse",
    name: "Блок таунхауса №3/4",
    capacity: 6,
    price: 19000,
    bullets: [
      "3 комнаты · 1 двуспальная + 4 односпальные",
      "2 душевые, 2 санузла",
      "Электросауна, сушильный шкаф",
      "Мангал",
    ],
    tags: ["сауна"],
  },
  {
    id: "t3-5",
    code: "№3/5",
    kind: "townhouse",
    name: "Блок таунхауса №3/5",
    capacity: 6,
    price: 19000,
    bullets: [
      "3 комнаты · 1 двуспальная + 4 односпальные",
      "2 душевые, 2 санузла",
      "Электросауна, сушильный шкаф",
      "Мангал",
    ],
    tags: ["сауна"],
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
        <ExtrasSection />
        <TrustSection />
        <StepsSection />
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
          <span className="grid h-8 w-8 place-items-center rounded-full bg-teal/15 text-teal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 16c3-2 5-2 8 0s5 2 8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 12c3-2 5-2 8 0s5 2 8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".6" />
            </svg>
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
            Загородный отель «Голубая&nbsp;Бухта»: отдых на природе с городским комфортом
          </h1>
          <p className="mt-6 max-w-xl text-base text-resin-200/75 md:text-lg">
            9 объектов размещения — от коттеджа на двоих до дома для компании из двенадцати.
            Русская баня на дровах, кедровая купель фурако, беседки с мангалами, трансфер
            из Мурманска и аэропорта.
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
  return (
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
        <a
          href="#request"
          className="mt-2 inline-flex items-center justify-center rounded-full border border-teal/40 px-4 py-2 text-xs font-semibold text-teal transition-colors hover:bg-teal hover:text-resin-950"
        >
          Оставить заявку
        </a>
      </div>
    </article>
  );
}

/* ---------- Gazebos ---------- */

function GazeboSection() {
  return (
    <Section
      id="gazebos"
      eyebrow="Беседки"
      title="Мангальные зоны на свежем воздухе"
      lede="Часть беседок закреплена за конкретными коттеджами (№1, №2, VIP-блок №3). Отдельная общая беседка доступна по предварительному запросу."
    >
      <div className="grid gap-5 md:grid-cols-[1.1fr_1fr]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-resin-800">
          <Placeholder label="Фото · беседка с мангалом" className="absolute inset-0" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <FactCard title="Беседка №1" body="Закреплена за Коттеджем №1. Стол, лавки, мангал." />
          <FactCard title="Беседка №2" body="Закреплена за Коттеджем №2. Мангал, зона для компании." />
          <FactCard title="Беседка VIP" body="Закреплена за VIP-блоком таунхауса №3." />
          <FactCard title="Общая беседка" body="Доступна остальным гостям по запросу." />
        </div>
      </div>
    </Section>
  );
}

/* ---------- Activities / Баня / Фурако ---------- */

function ActivitiesSection() {
  const [tab, setTab] = useState<"banya" | "summer" | "winter">("banya");
  return (
    <Section
      id="activities"
      eyebrow="Услуги"
      title="Баня, фурако и сезонные развлечения"
      lede="Русская баня и купель фурако работают круглый год. Водные и снежные активности — сезонные: летние доступны в тёплое время, зимние — при устойчивом снежном покрове."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Tab active={tab === "banya"} onClick={() => setTab("banya")}>Баня и фурако</Tab>
        <Tab active={tab === "summer"} onClick={() => setTab("summer")}>Полярный день (лето)</Tab>
        <Tab active={tab === "winter"} onClick={() => setTab("winter")}>Полярная ночь (зима)</Tab>
      </div>

      {tab === "banya" && (
        <div className="grid gap-5 md:grid-cols-[1.1fr_1fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            <MediaCard
              title="Русская баня на дровах"
              body="Отдельно стоящая баня с парной, комнатой отдыха и выходом к купели."
              image="Фото · русская баня"
            />
            <MediaCard
              title="Кедровая купель фурако"
              body="Круглая купель с подогревом на дровах, для 4–6 человек. Работает круглый год."
              image="Фото · фурако"
            />
          </div>
          <PriceList title="Прайс" rows={banyaRows} note="Оплата — час к часу, минимальный заказ бани — 2 часа." />
        </div>
      )}

      {tab === "summer" && (
        <div className="grid gap-5 md:grid-cols-3">
          <MediaCard title="Гидроцикл" body="Прогулки по Туломе с инструктором." image="Фото · гидроцикл" price="от 5 000 ₽ / 30 мин" />
          <MediaCard title="SUP-сёрфинг" body="Аренда доски на воде рядом с базой." image="Фото · SUP" price="1 500 ₽ / час" />
          <MediaCard title="Рыбалка" body="Сопровождение, аренда снастей — по запросу." image="Фото · рыбалка" price="по запросу" />
          <MediaCard title="Пикник у воды" body="Организация выезда на берег с оборудованной точкой." image="Фото · пикник" price="от 3 000 ₽" />
          <MediaCard title="Поход в тундру" body="Пешие маршруты с гидом, 3–6 часов." image="Фото · тундра" price="от 4 000 ₽ / чел." />
          <MediaCard title="Велопрокат" body="Горные велосипеды для маршрутов вдоль реки." image="Фото · велопрокат" price="800 ₽ / час" />
        </div>
      )}

      {tab === "winter" && (
        <div className="grid gap-5 md:grid-cols-3">
          <MediaCard title="Снегоход" body="Прокат с инструктором, маршруты по тундре." image="Фото · снегоход" price="от 6 000 ₽ / 30 мин" />
          <MediaCard title="Беговые лыжи" body="Прокат, подготовленная лыжня рядом с базой." image="Фото · лыжи" price="500 ₽ / час" />
          <MediaCard title="Ватрушки" body="Спуск с горки для детей и взрослых." image="Фото · ватрушки" price="300 ₽ / час" />
          <MediaCard title="Охота за северным сиянием" body="Выезд к точкам наблюдения с гидом." image="Фото · сияние" price="от 5 000 ₽ / чел." />
          <MediaCard title="Прогулка на хаски" body="Организуется партнёрами, по запросу." image="Фото · хаски" price="по запросу" />
          <MediaCard title="Териберка (день)" body="Поездка на Северный Ледовитый океан." image="Фото · Териберка" price="24 000 ₽ / машина" />
        </div>
      )}
    </Section>
  );
}

/* ---------- Transfer ---------- */

function TransferSection() {
  return (
    <Section
      id="transfer"
      eyebrow="Логистика"
      title="Комфортный трансфер на микроавтобусе"
      lede="Встречаем в аэропорту и на вокзале Мурманска, возим в город и Териберку. Все машины — с водителем."
    >
      <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-resin-800 bg-[color:var(--color-surface)]">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-resin-800">
              {transferRows.map(([label, price]) => (
                <tr key={label} className="hover:bg-resin-900/40">
                  <td className="px-5 py-4 text-resin-200/85">{label}</td>
                  <td className="px-5 py-4 text-right font-mono tabular-nums text-teal">{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-2xl border border-resin-800 bg-[color:var(--color-surface)] p-6 text-sm text-resin-200/75">
          <p className="mb-3 font-medium text-resin-50">Как заказать</p>
          <p className="mb-4">
            Сообщите номер рейса или поезда при бронировании. Ориентировочное время в пути от аэропорта — 50–60 минут.
          </p>
          <p className="text-xs text-resin-200/50">
            Трансфер организуется по подтверждённой заявке. Стоимость указана за машину, до 7 гостей с багажом.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Extras ---------- */

function ExtrasSection() {
  return (
    <Section
      id="extras"
      eyebrow="Дополнительно"
      title="Мелочи для комфортного отдыха"
      lede="Всё, что можно докупить на месте. Уточняйте наличие при заезде."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {extrasRows.map(([label, price]) => (
          <div key={label} className="rounded-2xl border border-resin-800 bg-[color:var(--color-surface)] p-5">
            <p className="text-sm text-resin-200/80">{label}</p>
            <p className="mt-3 font-mono text-lg font-semibold tabular-nums text-teal">{price}</p>
          </div>
        ))}
      </div>
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

function StepsSection() {
  const steps = [
    ["Заявка", "Оставляете заявку через форму или по телефону."],
    ["Согласование", "Менеджер уточняет даты, объект и услуги."],
    ["Предоплата", "Фиксируем бронь по подтверждённой заявке."],
    ["Приезд", "Встречаем на базе, при необходимости — трансфер."],
  ];
  return (
    <Section id="steps" eyebrow="Как забронировать" title="Четыре простых шага"
      lede="Форма на сайте — это заявка, а не подтверждение брони. Дата закрепляется после ответа менеджера и предоплаты.">
      <ol className="grid gap-4 md:grid-cols-4">
        {steps.map(([title, body], i) => (
          <li key={title} className="rounded-2xl border border-resin-800 bg-[color:var(--color-surface)] p-6">
            <div className="mb-4 grid h-9 w-9 place-items-center rounded-full bg-teal/15 font-mono text-sm font-semibold text-teal">
              {i + 1}
            </div>
            <p className="mb-1.5 text-base font-medium text-resin-50">{title}</p>
            <p className="text-sm text-resin-200/70">{body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ---------- Request ---------- */

function RequestSection() {
  return (
    <section id="request" className="border-t border-resin-800/60 bg-gradient-to-b from-resin-950 to-[#0a1110] py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-teal">Бронирование</p>
          <h2 className="text-3xl font-semibold tracking-tight text-resin-50 md:text-5xl">
            Забронируйте ваш отдых
          </h2>
          <p className="mt-4 max-w-md text-resin-200/70">
            Заполните форму — менеджер свяжется с вами в течение рабочего дня. Отправка формы не является подтверждением брони.
          </p>
          <div className="mt-8 space-y-3 text-sm text-resin-200/80">
            <p><span className="text-resin-200/50">Тел.:</span> <a href="tel:+78152780111" className="text-resin-50 hover:text-teal">8 (8152) 780-111</a></p>
            <p><span className="text-resin-200/50">Адрес:</span> Мурманская обл., Верхнетуломское шоссе, 36 км</p>
            <p><span className="text-resin-200/50">Координаты:</span> 68.85° N, 32.78° E</p>
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
            Нажимая кнопку, вы соглашаетесь на обработку персональных данных в соответствии с 152-ФЗ. Отправка формы — это заявка, не подтверждение брони.
          </p>
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-teal py-3 text-sm font-semibold text-resin-950 transition-colors hover:bg-teal-dim"
          >
            Отправить заявку
          </button>
        </form>
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
