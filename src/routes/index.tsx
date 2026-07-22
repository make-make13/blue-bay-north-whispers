import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

/* ---------- Data (verbatim from brief, section 11–17) ---------- */

type Stay = {
  id: string;
  code: string;
  kind: "cottage" | "townhouse";
  name: string;
  capacity: number; // max guests
  price: number; // ₽/night
  summary: string;
  spec: string[];
};

const stays: Stay[] = [
  {
    id: "c1",
    code: "№1",
    kind: "cottage",
    name: "Коттедж №1",
    capacity: 12,
    price: 22000,
    summary:
      "Одноэтажный коттедж с каминным залом, шестью спальнями и собственной беседкой с мангалом.",
    spec: [
      "6 спален · 2 двуспальные, 8 односпальных кроватей",
      "2 душевые · 2 туалета",
      "Кухня: варочная панель, холодильник, СВЧ, чайник, посудомоечная машина",
      "Каминный зал · собственная беседка · мангал",
    ],
  },
  {
    id: "c2",
    code: "№2",
    kind: "cottage",
    name: "Коттедж №2",
    capacity: 10,
    price: 21000,
    summary:
      "Одноэтажный коттедж с просторной гостиной, пятью спальнями и собственной беседкой.",
    spec: [
      "5 комнат · по 2 односпальные кровати в каждой",
      "2 душевые · 2 санузла",
      "Кухня: холодильник, СВЧ, чайник",
      "Гостиная · собственная беседка · мангал",
    ],
  },
  {
    id: "c6",
    code: "№6",
    kind: "cottage",
    name: "Коттедж №6",
    capacity: 2,
    price: 12000,
    summary: "Коттедж с отдельной спальней, кухонной зоной и душевой.",
    spec: [
      "Отдельная спальня, двуспальная кровать",
      "Душевая",
      "Мини-холодильник, варочная панель, СВЧ, чайник",
      "Фен · мангал",
    ],
  },
  {
    id: "c5",
    code: "№5",
    kind: "cottage",
    name: "Коттедж №5",
    capacity: 2,
    price: 8000,
    summary:
      "Компактный коттедж для двух гостей с двуспальной кроватью, кухонной зоной и душевой.",
    spec: [
      "Двуспальная кровать",
      "Душевая",
      "Кухонная зона, мини-холодильник, СВЧ, чайник",
      "Мангал",
    ],
  },
  {
    id: "t3-vip",
    code: "№3 VIP",
    kind: "townhouse",
    name: "VIP-блок таунхауса №3",
    capacity: 6,
    price: 26000,
    summary:
      "Блок с тремя спальнями, собственной электрической сауной, электрокамином и отдельной беседкой с мангалом.",
    spec: [
      "3 комнаты · 1 двуспальная и 4 односпальные кровати",
      "2 душевые · 2 санузла",
      "Электрическая сауна · электрокамин",
      "Отдельная беседка · мангал · Xbox One",
    ],
  },
  {
    id: "t3-2",
    code: "№3/2",
    kind: "townhouse",
    name: "Блок №3/2",
    capacity: 6,
    price: 22000,
    summary:
      "Двухэтажный блок с отдельным входом, тремя спальнями, собственной электрической сауной и двумя душевыми.",
    spec: [
      "3 комнаты · 6 односпальных кроватей",
      "2 душевые · 2 санузла",
      "Электрическая сауна · сушильный шкаф",
      "Кресло-качалка · мангал",
    ],
  },
  {
    id: "t3-3",
    code: "№3/3",
    kind: "townhouse",
    name: "Блок №3/3",
    capacity: 6,
    price: 19000,
    summary:
      "Блок таунхауса с тремя спальнями, залом, кухней и собственной электрической сауной.",
    spec: [
      "3 комнаты · 6 односпальных кроватей",
      "2 душевые · 2 санузла",
      "Электрическая сауна · сушильный шкаф",
      "Мангал",
    ],
  },
  {
    id: "t3-4",
    code: "№3/4",
    kind: "townhouse",
    name: "Блок №3/4",
    capacity: 6,
    price: 19000,
    summary:
      "Блок таунхауса с тремя спальнями, залом, кухней и собственной электрической сауной.",
    spec: [
      "3 комнаты · 1 двуспальная и 4 односпальные",
      "2 душевые · 2 санузла",
      "Электрическая сауна · сушильный шкаф",
      "Мангал",
    ],
  },
  {
    id: "t3-5",
    code: "№3/5",
    kind: "townhouse",
    name: "Блок №3/5",
    capacity: 6,
    price: 19000,
    summary:
      "Блок таунхауса с тремя спальнями, залом, кухней и собственной электрической сауной.",
    spec: [
      "3 комнаты · 1 двуспальная и 4 односпальные",
      "2 душевые · 2 санузла",
      "Электрическая сауна · сушильный шкаф",
      "Мангал",
    ],
  },
];

const capacityAxis = [2, 6, 10, 12] as const;

function formatPrice(n: number) {
  return n.toLocaleString("ru-RU").replace(/,/g, "\u00A0") + " ₽";
}

/* ---------- Component ---------- */

function Index() {
  const [filter, setFilter] = useState<number | "all">("all");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredStays = useMemo(() => {
    if (filter === "all") return stays;
    // Filter: capacity that fits the requested group size exactly, plus one-tier-larger.
    return stays.filter((s) => s.capacity >= filter && s.capacity <= filter * 2);
  }, [filter]);

  const totalMatching = filteredStays.length;

  return (
    <div className="min-h-screen bg-resin-950 text-resin-200 selection:bg-amber-pine/40 selection:text-resin-50">
      <SpineNav filter={filter} setFilter={setFilter} />

      <TopBar scrolled={scrolled} />

      <main className="pl-14 md:pl-20">
        <Hero />
        <StaysSection filter={filter} filtered={filteredStays} total={totalMatching} setFilter={setFilter} />
        <BanyaSection />
        <SeasonsSection />
        <LogisticsSection />
        <RequestSection />
        <SiteFooter />
      </main>
    </div>
  );
}

/* ---------- Signature: numeric spine ---------- */

function SpineNav({
  filter,
  setFilter,
}: {
  filter: number | "all";
  setFilter: (v: number | "all") => void;
}) {
  return (
    <nav
      aria-label="Фильтр по вместимости"
      className="fixed left-0 top-0 z-40 flex h-full w-14 flex-col items-center justify-between border-r border-resin-800 bg-resin-950 py-6 md:w-20 md:py-10"
    >
      <a
        href="#top"
        className="rotate-180 font-mono text-[10px] uppercase tracking-[0.3em] text-resin-200/40 hover:text-amber-pine"
        style={{ writingMode: "vertical-rl" }}
      >
        Голубая Бухта · 68° N
      </a>

      <div className="flex flex-col items-center gap-1">
        <span
          className="mb-2 rotate-180 font-mono text-[9px] uppercase tracking-[0.25em] text-resin-200/40"
          style={{ writingMode: "vertical-rl" }}
        >
          Гостей
        </span>

        {capacityAxis.map((n) => {
          const active = filter === n;
          return (
            <button
              key={n}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setFilter(active ? "all" : n);
                document
                  .getElementById("stays")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`w-10 py-2 font-mono text-sm tabular-nums transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-pine ${
                active
                  ? "text-amber-pine"
                  : "text-resin-200/50 hover:text-resin-50"
              }`}
            >
              {String(n).padStart(2, "0")}
            </button>
          );
        })}

        <div className="my-3 h-px w-5 bg-resin-800" />

        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`w-10 py-2 font-mono text-xs tabular-nums transition-colors ${
            filter === "all" ? "text-amber-pine" : "text-resin-200/40 hover:text-resin-50"
          }`}
          aria-label="Показать все объекты"
        >
          56
        </button>
      </div>

      <div
        className="rotate-180 font-mono text-[9px] uppercase tracking-[0.3em] text-resin-200/30"
        style={{ writingMode: "vertical-rl" }}
      >
        Заявка · Тулома
      </div>
    </nav>
  );
}

/* ---------- Top bar ---------- */

function TopBar({ scrolled }: { scrolled: boolean }) {
  return (
    <header
      className={`fixed left-14 right-0 top-0 z-30 flex h-14 items-center justify-between border-b px-6 transition-colors md:left-20 md:h-16 md:px-10 ${
        scrolled
          ? "border-resin-800 bg-resin-950/85 backdrop-blur"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="flex items-baseline gap-4">
        <span className="text-sm font-medium tracking-tight text-resin-50">Голубая Бухта</span>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-resin-200/40 md:inline">
          Загородный отель · Мурманская обл.
        </span>
      </div>
      <div className="flex items-center gap-6">
        <a
          href="tel:+78152780111"
          className="hidden font-mono text-xs text-resin-200 hover:text-amber-pine md:inline"
        >
          8&nbsp;(8152)&nbsp;780-111
        </a>
        <a
          href="#request"
          className="border border-resin-200/70 px-4 py-2 text-xs uppercase tracking-widest text-resin-50 transition-colors hover:border-amber-pine hover:text-amber-pine"
        >
          Заявка
        </a>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  return (
    <section id="top" className="border-b border-resin-800 px-6 pb-16 pt-24 md:px-12 md:pb-24 md:pt-36">
      <div className="max-w-[62ch]">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-amber-pine">
          68°.85 N · 32°.78 E · Верхнетуломское шоссе, 36-й км
        </p>
        <h1 className="mb-8 text-balance text-4xl font-medium leading-[1.05] tracking-tight text-resin-50 md:text-6xl lg:text-7xl">
          Заполярье, берег Туломы,
          <br />
          <span className="text-resin-200/70">40 км от Мурманска.</span>
        </h1>
        <p className="mb-10 max-w-[54ch] text-pretty text-base text-resin-200/70 md:text-lg">
          Девять объектов размещения на берегу реки: от коттеджа на двоих до дома для
          компании из двенадцати. Русская баня на дровах, кедровая купель фурако, беседки
          с мангалами. Летом — вода, зимой — снег. Бронирование через менеджера.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#request"
            className="bg-resin-50 px-6 py-3 text-sm font-medium text-resin-950 transition-colors hover:bg-amber-pine hover:text-resin-50"
          >
            Оставить заявку
          </a>
          <a
            href="tel:+78152780111"
            className="border border-resin-800 px-6 py-3 font-mono text-sm text-resin-200 transition-colors hover:border-resin-200 hover:text-resin-50"
          >
            8&nbsp;(8152)&nbsp;780-111
          </a>
        </div>
      </div>

      {/* Territory bar: 9 objects distributed along a horizontal capacity ruler */}
      <div className="mt-16 border-t border-resin-800 pt-10">
        <div className="mb-4 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-resin-200/40">
          <span>Ось вместимости</span>
          <span>9 объектов · до 56 гостей</span>
        </div>
        <TerritoryBar />
      </div>
    </section>
  );
}

function TerritoryBar() {
  const sorted = [...stays].sort((a, b) => a.capacity - b.capacity || a.price - b.price);
  return (
    <div className="relative">
      <div className="absolute left-0 right-0 top-6 h-px bg-resin-800" aria-hidden />
      <ul className="relative grid grid-cols-9 gap-2">
        {sorted.map((s) => (
          <li key={s.id} className="flex flex-col items-center">
            <span
              className={`mb-2 font-mono text-[10px] tabular-nums ${
                s.kind === "cottage" ? "text-resin-50" : "text-ice"
              }`}
            >
              {s.capacity}
            </span>
            <span
              className={`h-3 w-px ${
                s.kind === "cottage" ? "bg-resin-50" : "bg-ice"
              }`}
              aria-hidden
            />
            <span className="mt-2 font-mono text-[9px] uppercase text-resin-200/40">
              {s.code}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-6 font-mono text-[10px] uppercase tracking-widest text-resin-200/50">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 bg-resin-50" />
          Отдельные коттеджи · 4
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 bg-ice" />
          Блоки таунхауса №3 · 5
        </span>
      </div>
    </div>
  );
}

/* ---------- Accommodations ---------- */

function StaysSection({
  filter,
  filtered,
  total,
  setFilter,
}: {
  filter: number | "all";
  filtered: Stay[];
  total: number;
  setFilter: (v: number | "all") => void;
}) {
  const cottages = filtered.filter((s) => s.kind === "cottage");
  const townhouses = filtered.filter((s) => s.kind === "townhouse");

  return (
    <section id="stays" className="border-b border-resin-800 px-6 py-20 md:px-12 md:py-28">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-pine">
            01 · Размещение
          </p>
          <h2 className="text-3xl font-medium tracking-tight text-resin-50 md:text-5xl">
            Найдите объект под вашу компанию
          </h2>
          <p className="mt-3 max-w-[52ch] text-sm text-resin-200/60">
            Отдельные коттеджи и блоки таунхауса — это разные типы объектов, с разной
            комплектацией и вместимостью.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-resin-200/40">
            Фильтр:
          </span>
          {filter === "all" ? (
            <span className="font-mono text-xs text-resin-200/70">Все · {total} объектов</span>
          ) : (
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="border border-amber-pine px-3 py-1 font-mono text-xs text-amber-pine hover:bg-amber-pine hover:text-resin-950"
            >
              от {filter} гостей · {total} ✕
            </button>
          )}
        </div>
      </div>

      {/* Cottages */}
      <div className="mb-16">
        <SubHeading index="A" label="Отдельные коттеджи" count={cottages.length} />
        {cottages.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="divide-y divide-resin-800 border-y border-resin-800">
            {cottages.map((s) => (
              <StayRow key={s.id} stay={s} />
            ))}
          </ul>
        )}
      </div>

      {/* Townhouses */}
      <div>
        <SubHeading index="B" label="Блоки таунхауса №3" count={townhouses.length} />
        {townhouses.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="grid gap-px bg-resin-800 ring-1 ring-resin-800 md:grid-cols-2 lg:grid-cols-3">
            {townhouses.map((s) => (
              <TownhouseCell key={s.id} stay={s} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function SubHeading({
  index,
  label,
  count,
}: {
  index: string;
  label: string;
  count: number;
}) {
  return (
    <div className="mb-6 flex items-baseline gap-4 border-b border-resin-800 pb-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-pine">
        {index}
      </span>
      <h3 className="text-lg font-medium text-resin-50">{label}</h3>
      <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-resin-200/40">
        {count} {declension(count, ["объект", "объекта", "объектов"])}
      </span>
    </div>
  );
}

function declension(n: number, forms: [string, string, string]) {
  const abs = Math.abs(n) % 100;
  const n1 = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
}

function StayRow({ stay }: { stay: Stay }) {
  return (
    <li className="grid grid-cols-12 items-start gap-4 py-6 md:gap-8">
      <div className="col-span-12 md:col-span-2">
        <div className="font-mono text-[10px] uppercase tracking-widest text-resin-200/40">
          Коттедж
        </div>
        <div className="mt-1 text-2xl font-medium text-resin-50">{stay.code}</div>
      </div>
      <div className="col-span-12 md:col-span-6">
        <p className="text-sm text-resin-200/80">{stay.summary}</p>
        <ul className="mt-3 space-y-1 font-mono text-[11px] text-resin-200/50">
          {stay.spec.map((s) => (
            <li key={s}>· {s}</li>
          ))}
        </ul>
      </div>
      <div className="col-span-6 md:col-span-2">
        <div className="font-mono text-[10px] uppercase tracking-widest text-resin-200/40">
          Вместимость
        </div>
        <div className="mt-1 text-lg text-resin-50">до {stay.capacity} гостей</div>
      </div>
      <div className="col-span-6 md:col-span-2 md:text-right">
        <div className="font-mono text-[10px] uppercase tracking-widest text-resin-200/40">
          Тариф · сутки
        </div>
        <div className="mt-1 font-mono text-lg tabular-nums text-resin-50">
          {formatPrice(stay.price)}
        </div>
        <a
          href={`#request`}
          className="mt-3 inline-block border border-resin-800 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-resin-200/70 hover:border-amber-pine hover:text-amber-pine"
        >
          Запросить
        </a>
      </div>
    </li>
  );
}

function TownhouseCell({ stay }: { stay: Stay }) {
  return (
    <li className="bg-resin-950 p-6">
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-[10px] uppercase tracking-widest text-ice">
          Блок {stay.code}
        </div>
        <div className="font-mono text-[10px] uppercase text-resin-200/40">
          до {stay.capacity}
        </div>
      </div>
      <p className="mt-4 text-sm text-resin-200/70">{stay.summary}</p>
      <ul className="mt-4 space-y-1 font-mono text-[11px] text-resin-200/50">
        {stay.spec.slice(0, 3).map((s) => (
          <li key={s}>· {s}</li>
        ))}
      </ul>
      <div className="mt-6 flex items-end justify-between border-t border-resin-800 pt-4">
        <div className="font-mono text-base tabular-nums text-resin-50">
          {formatPrice(stay.price)}
          <span className="ml-1 text-[10px] uppercase text-resin-200/40">/ сутки</span>
        </div>
        <a
          href="#request"
          className="font-mono text-[10px] uppercase tracking-widest text-amber-pine hover:underline"
        >
          Запросить →
        </a>
      </div>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-resin-800 px-6 py-10 text-center font-mono text-xs text-resin-200/40">
      Нет объектов в этом диапазоне вместимости. Уточните у менеджера.
    </div>
  );
}

/* ---------- Banya + Furako ---------- */

function BanyaSection() {
  return (
    <section
      id="banya"
      className="border-b border-resin-800 bg-resin-900/40 px-6 py-20 md:px-12 md:py-28"
    >
      <div className="mb-12">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-pine">
          02 · Тепло
        </p>
        <h2 className="text-3xl font-medium tracking-tight text-resin-50 md:text-5xl">
          Русская баня на дровах и кедровая купель фурако
        </h2>
      </div>

      <div className="grid gap-px bg-resin-800 ring-1 ring-resin-800 md:grid-cols-2">
        <div className="bg-resin-950 p-8 md:p-10">
          <div className="mb-6 flex items-baseline justify-between">
            <h3 className="text-2xl font-medium text-resin-50">Баня</h3>
            <span className="font-mono text-[10px] uppercase tracking-widest text-resin-200/40">
              До 10 человек
            </span>
          </div>
          <p className="mb-8 text-sm text-resin-200/70">
            Парилка, комната отдыха, душевая и санузел. В наличии — чай, простыни, тапочки
            и головные уборы для бани.
          </p>
          <PriceRow label="Первый час" value="4 000 ₽" />
          <PriceRow label="Каждый следующий час" value="3 000 ₽" />
          <PriceRow label="Минимальный заказ" value="2 часа · от 7 000 ₽" emphasis />

          <div
            data-lov-image-placeholder
            data-prompt="wood-fired russian banya interior with steam"
            data-width="800"
            data-height="500"
            className="mt-8 grid aspect-[8/5] w-full place-items-center border border-resin-800 bg-resin-900"
            role="img"
            aria-label="Плейсхолдер: интерьер русской бани на дровах"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-resin-200/30">
              photos/banya.webp
            </span>
          </div>
        </div>

        <div className="bg-resin-950 p-8 md:p-10">
          <div className="mb-6 flex items-baseline justify-between">
            <h3 className="text-2xl font-medium text-resin-50">Фурако</h3>
            <span className="font-mono text-[10px] uppercase tracking-widest text-resin-200/40">
              До 4 человек
            </span>
          </div>
          <p className="mb-8 text-sm text-resin-200/70">
            Японская купель из кедра рядом с дровяной баней. Горячая вода под открытым
            небом.
          </p>
          <PriceRow label="Вместе с арендой бани" value="7 000 ₽" />
          <PriceRow label="Без бани · 3–5 часов" value="8 000 ₽" />
          <PriceRow label="С холодной водой" value="4 000 ₽" muted />

          <div
            data-lov-image-placeholder
            data-prompt="cedar furako tub outdoors in northern winter"
            data-width="800"
            data-height="500"
            className="mt-8 grid aspect-[8/5] w-full place-items-center border border-resin-800 bg-resin-900"
            role="img"
            aria-label="Плейсхолдер: купель фурако"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-resin-200/30">
              photos/service-furako.webp
            </span>
          </div>
        </div>
      </div>

      <p className="mt-8 max-w-[52ch] font-mono text-[11px] text-resin-200/40">
        Беседки с мангалами — от 600 ₽/час. Часть беседок закреплена за конкретными
        коттеджами и сдаётся отдельно только при отсутствии заезда.
      </p>
    </section>
  );
}

function PriceRow({
  label,
  value,
  emphasis,
  muted,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between border-b border-resin-800 py-3 ${
        muted ? "opacity-60" : ""
      }`}
    >
      <span className="text-sm text-resin-200/80">{label}</span>
      <span
        className={`font-mono text-sm tabular-nums ${
          emphasis ? "text-amber-pine" : "text-resin-50"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* ---------- Seasons ---------- */

function SeasonsSection() {
  return (
    <section className="border-b border-resin-800 px-6 py-20 md:px-12 md:py-28">
      <div className="mb-12 max-w-[62ch]">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-pine">
          03 · Сезон
        </p>
        <h2 className="text-3xl font-medium tracking-tight text-resin-50 md:text-5xl">
          Летом — вода. Зимой — снег.
        </h2>
        <p className="mt-3 text-sm text-resin-200/60">
          Водные и снежные услуги — сезонные. Фактическая доступность зависит от погоды и
          уточняется у менеджера.
        </p>
      </div>

      <div className="grid gap-px bg-resin-800 ring-1 ring-resin-800 md:grid-cols-3">
        <SeasonColumn
          title="Полярный день · Лето"
          tone="summer"
          items={[
            ["Гидроцикл Sea-Doo 130", "30 мин с инструктором — 3 500 ₽"],
            ["Гидроцикл · за рулём", "30 мин — 5 000 ₽ · 1 час — 10 000 ₽"],
            ["SUP-доска", "30 мин — 1 500 ₽ · 1 час — 2 500 ₽"],
            ["Катамаран (на 2)", "30 мин — 1 000 ₽ · 1 час — 1 500 ₽"],
          ]}
        />
        <SeasonColumn
          title="Полярная ночь · Зима"
          tone="winter"
          items={[
            ["Снегоход RM-551 · за рулём", "30 мин — 3 000 ₽ · 1 час — 5 000 ₽"],
            ["Снегоход · с инструктором", "30 мин — 2 500 ₽ · 1 час — 4 000 ₽"],
            ["Лыжи · комплект", "300 ₽"],
            ["Ватрушки", "300 ₽ / час"],
            ["Снежный банан · до 3 чел.", "500 ₽ с человека / 20 мин"],
          ]}
        />
        <SeasonColumn
          title="Круглогодично"
          tone="all"
          items={[
            ["Квадроцикл · за рулём", "30 мин — 3 500 ₽ · 1 час — 6 000 ₽"],
            ["Квадроцикл · с инструктором", "30 мин — 2 500 ₽"],
            ["Детский квадроцикл (от 6 лет)", "30 мин — 2 000 ₽ · 1 час — 3 500 ₽"],
            ["Бадминтон", "200 ₽ / час"],
            ["Тимбилдинг для команд", "27 000 ₽"],
          ]}
        />
      </div>
    </section>
  );
}

function SeasonColumn({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "summer" | "winter" | "all";
  items: [string, string][];
}) {
  const dot =
    tone === "summer" ? "bg-amber-pine" : tone === "winter" ? "bg-ice" : "bg-resin-200/60";
  return (
    <div className="bg-resin-950 p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className={`inline-block h-2 w-2 ${dot}`} aria-hidden />
        <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-resin-50">
          {title}
        </h3>
      </div>
      <ul className="space-y-3">
        {items.map(([name, price]) => (
          <li
            key={name}
            className="flex flex-col gap-1 border-b border-resin-800 pb-3 text-sm"
          >
            <span className="text-resin-50">{name}</span>
            <span className="font-mono text-[11px] tabular-nums text-resin-200/50">
              {price}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Logistics / Transfer ---------- */

function LogisticsSection() {
  const rows: [string, string][] = [
    ["Аэропорт → Голубая Бухта", "4 000 ₽"],
    ["Первомайский район → Голубая Бухта", "3 000 ₽"],
    ["Октябрьский район → Голубая Бухта", "3 200 ₽"],
    ["Ленинский район → Голубая Бухта", "3 600 ₽"],
    ["Кола → Голубая Бухта", "3 400 ₽"],
    ["Мурманск → Териберка → Мурманск", "24 000 ₽"],
    ["Аэропорт → Териберка", "14 000 ₽"],
  ];
  return (
    <section id="transfer" className="border-b border-resin-800 px-6 py-20 md:px-12 md:py-28">
      <div className="grid gap-12 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-pine">
            04 · Дорога
          </p>
          <h2 className="mb-4 text-3xl font-medium tracking-tight text-resin-50 md:text-5xl">
            Трансфер
          </h2>
          <p className="mb-8 max-w-[46ch] text-sm text-resin-200/70">
            Citroën SpaceTourer, до 7 пассажиров, место для багажа. Другие маршруты и
            стоимость — уточняются у менеджера. Ожидание — 600 ₽.
          </p>
          <div className="border border-resin-800 p-6 text-sm">
            <div className="font-mono text-[10px] uppercase tracking-widest text-resin-200/40">
              Консультации
            </div>
            <div className="mt-3 space-y-2">
              <a
                href="tel:+78152780111"
                className="block text-resin-50 hover:text-amber-pine"
              >
                8&nbsp;(8152)&nbsp;780-111
              </a>
              <a
                href="tg://resolve?phone=79217080111"
                className="block text-resin-50 hover:text-amber-pine"
              >
                8&nbsp;(921)&nbsp;708-01-11 · Telegram / WhatsApp
              </a>
              <div className="font-mono text-[11px] text-resin-200/50">10:00–20:00</div>
            </div>
          </div>
        </div>

        <div>
          <ul className="border-y border-resin-800">
            {rows.map(([route, price]) => (
              <li
                key={route}
                className="flex items-baseline justify-between gap-4 border-b border-resin-800 py-3 last:border-b-0"
              >
                <span className="text-sm text-resin-200/80">{route}</span>
                <span className="font-mono text-sm tabular-nums text-resin-50">
                  {price}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-resin-200/40">
            Полный прейскурант маршрутов — по запросу
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Request form ---------- */

function RequestSection() {
  return (
    <section id="request" className="px-6 py-24 md:px-12 md:py-32">
      <div className="grid gap-16 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-pine">
            05 · Заявка
          </p>
          <h2 className="mb-6 text-3xl font-medium tracking-tight text-resin-50 md:text-5xl">
            Форма — это заявка, не подтверждение брони.
          </h2>
          <p className="max-w-[46ch] text-sm text-resin-200/70">
            Менеджер проверит свободные даты, уточнит детали и предложит подходящий
            вариант. Если удобнее — позвоните: 8&nbsp;(8152)&nbsp;780-111, ежедневно
            10:00–20:00.
          </p>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const status = form.querySelector<HTMLDivElement>("[data-status]");
            if (status) {
              status.textContent =
                "Заявка отправлена. Мы свяжемся в рабочие часы 10:00–20:00.";
              status.className =
                "font-mono text-xs text-amber-pine border border-amber-pine px-4 py-3";
            }
            form.reset();
          }}
        >
          <FieldGrid>
            <Field label="Имя" name="name" required />
            <Field label="Телефон" name="phone" type="tel" required placeholder="+7" />
          </FieldGrid>

          <FieldGrid>
            <Field label="Дата заезда" name="in" type="date" />
            <Field label="Дата выезда" name="out" type="date" />
          </FieldGrid>

          <div>
            <label
              htmlFor="interest"
              className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-resin-200/50"
            >
              Что интересует
            </label>
            <select
              id="interest"
              name="interest"
              defaultValue=""
              className="w-full border-b border-resin-800 bg-transparent py-2 text-sm text-resin-50 focus:border-amber-pine focus:outline-none"
            >
              <option value="" disabled>
                Выберите
              </option>
              <option>Размещение</option>
              <option>Беседка</option>
              <option>Баня или фурако</option>
              <option>Активный отдых</option>
              <option>Трансфер</option>
              <option>Другое</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="comment"
              className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-resin-200/50"
            >
              Комментарий
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={3}
              className="w-full resize-none border-b border-resin-800 bg-transparent py-2 text-sm text-resin-50 focus:border-amber-pine focus:outline-none"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              required
              className="mt-1 h-4 w-4 accent-amber-pine"
            />
            <span className="text-[11px] leading-snug text-resin-200/60">
              Я даю согласие на обработку персональных данных в соответствии с
              152-ФЗ и подтверждаю, что понимаю: отправка формы — это заявка, а не
              подтверждение брони.
            </span>
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              className="bg-resin-50 px-8 py-3 text-sm font-medium text-resin-950 transition-colors hover:bg-amber-pine hover:text-resin-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-pine focus-visible:ring-offset-2 focus-visible:ring-offset-resin-950"
            >
              Отправить заявку
            </button>
            <span className="font-mono text-[10px] uppercase tracking-widest text-resin-200/40">
              Ответ обычно в течение рабочего дня
            </span>
          </div>

          <div data-status role="status" aria-live="polite" />
        </form>
      </div>
    </section>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 md:grid-cols-2">{children}</div>;
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-resin-200/50"
      >
        {label}
        {required ? " *" : ""}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border-b border-resin-800 bg-transparent py-2 text-sm text-resin-50 placeholder:text-resin-200/30 focus:border-amber-pine focus:outline-none"
      />
    </div>
  );
}

/* ---------- Footer ---------- */

function SiteFooter() {
  return (
    <footer className="border-t border-resin-800 bg-resin-950 px-6 py-12 md:px-12">
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <div className="text-sm font-medium text-resin-50">Голубая Бухта</div>
          <div className="mt-2 font-mono text-[11px] text-resin-200/50">
            36-й км Верхнетуломского шоссе
            <br />
            берег реки Тулома, ~40 км от Мурманска
          </div>
        </div>
        <div className="font-mono text-[11px] text-resin-200/50">
          <a href="tel:+78152780111" className="block text-resin-200 hover:text-amber-pine">
            8&nbsp;(8152)&nbsp;780-111
          </a>
          <a
            href="tg://resolve?phone=79217080111"
            className="mt-1 block text-resin-200 hover:text-amber-pine"
          >
            8&nbsp;(921)&nbsp;708-01-11
          </a>
          <div className="mt-2">10:00–20:00</div>
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-resin-200/30">
          Заезд с 17:00 · выезд до 14:00
          <br />
          Цены указаны за сутки, если не указано иное
        </div>
      </div>
    </footer>
  );
}
