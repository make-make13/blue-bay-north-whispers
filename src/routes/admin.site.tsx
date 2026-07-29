import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, ChevronDown, RotateCcw } from "lucide-react";

import { AdminShell } from "../components/admin/AdminShell";
import {
  Button,
  Card,
  Field,
  SectionBlock,
  TextArea,
  TextInput,
} from "../components/admin/ui";
import { useDirtyState, useUnsavedGuard } from "../components/admin/hooks";
import { ConfirmDialog } from "../components/admin/ConfirmDialog";
import { api } from "../lib/api";
import type {
  Gazebo,
  GazeboIconKind,
  ServiceCategory,
  ServiceItem,
  Stay,
  StayDetails,
  StayDetailGroup,
  StayKind,
  TransferIconKind,
  TransferRouteGroup,
} from "../lib/site-content-default";
import type { SiteContent } from "../lib/api/types";

export const Route = createFileRoute("/admin/site")({
  component: SiteAdmin,
});

const uid = () => Math.random().toString(36).slice(2, 10);

type TabId =
  | "hero"
  | "nav"
  | "sections"
  | "stays"
  | "gazebos"
  | "services"
  | "extras"
  | "transfer"
  | "steps"
  | "trust"
  | "contact"
  | "misc";

const TABS: { id: TabId; label: string }[] = [
  { id: "hero", label: "Главный экран" },
  { id: "nav", label: "Меню" },
  { id: "sections", label: "Заголовки разделов" },
  { id: "stays", label: "Коттеджи" },
  { id: "gazebos", label: "Беседки" },
  { id: "services", label: "Услуги" },
  { id: "extras", label: "Доп. на месте" },
  { id: "transfer", label: "Трансфер" },
  { id: "steps", label: "Как забронировать" },
  { id: "trust", label: "О базе" },
  { id: "contact", label: "Контакты и футер" },
  { id: "misc", label: "Прочее" },
];

function SiteAdmin() {
  const [initial, setInitial] = useState<SiteContent | null>(null);
  const [value, setValue, { dirty, reset }] = useDirtyState<SiteContent | null>(null);
  const [tab, setTab] = useState<TabId>("hero");
  const [saving, setSaving] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  useUnsavedGuard(dirty && !saving);

  useEffect(() => {
    api.content.get().then((c) => {
      setInitial(c);
      reset(c);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!value || !initial) {
    return (
      <AdminShell title="Управление сайтом" subtitle="Управление сайтом">
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          Загрузка…
        </div>
      </AdminShell>
    );
  }

  const patch = (fn: (draft: SiteContent) => void) => {
    // structuredClone-based immutable-ish update
    const next: SiteContent = JSON.parse(JSON.stringify(value));
    fn(next);
    setValue(next);
  };

  async function save() {
    if (!value) return;
    setSaving(true);
    try {
      const next = await api.content.update(value);
      setInitial(next);
      reset(next);
      toast.success("Изменения сохранены и уже отображаются на сайте");
    } catch {
      toast.error("Не удалось сохранить. Попробуйте ещё раз");
    } finally {
      setSaving(false);
    }
  }

  async function resetToDefaults() {
    setSaving(true);
    try {
      const next = await api.content.reset();
      setInitial(next);
      reset(next);
      toast.success("Содержимое сайта сброшено к исходному");
    } catch {
      toast.error("Не удалось сбросить содержимое");
    } finally {
      setSaving(false);
      setConfirmReset(false);
    }
  }

  return (
    <AdminShell title="Управление сайтом" subtitle="Управление сайтом">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Управление сайтом</h2>
          <p className="mt-1 text-base text-slate-600">
            Все тексты, коттеджи, беседки, услуги и трансфер главной страницы.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => setConfirmReset(true)}
            disabled={saving}
          >
            <RotateCcw className="h-4 w-4" />
            Сбросить к исходному
          </Button>
          <Button variant="secondary" onClick={() => reset(initial)} disabled={saving || !dirty}>
            Отмена
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={save}
            disabled={saving || !dirty}
          >
            {saving ? "Сохраняем…" : "Сохранить изменения"}
          </Button>
        </div>
      </div>

      {dirty && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          Есть несохранённые изменения — не забудьте нажать «Сохранить».
        </div>
      )}

      <Card className="mb-6 overflow-hidden">
        <div className="flex flex-wrap gap-1 border-b border-slate-200 p-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                tab === t.id
                  ? "bg-teal-600 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Card>

      {tab === "hero" && <HeroTab value={value} patch={patch} />}
      {tab === "nav" && <NavTab value={value} patch={patch} />}
      {tab === "sections" && <SectionsTab value={value} patch={patch} />}
      {tab === "stays" && <StaysTab value={value} patch={patch} />}
      {tab === "gazebos" && <GazebosTab value={value} patch={patch} />}
      {tab === "services" && <ServicesTab value={value} patch={patch} />}
      {tab === "extras" && <ExtrasTab value={value} patch={patch} />}
      {tab === "transfer" && <TransferTab value={value} patch={patch} />}
      {tab === "steps" && <StepsTab value={value} patch={patch} />}
      {tab === "trust" && <TrustTab value={value} patch={patch} />}
      {tab === "contact" && <ContactTab value={value} patch={patch} />}
      {tab === "misc" && <MiscTab value={value} patch={patch} />}

      <ConfirmDialog
        open={confirmReset}
        title="Сбросить всё содержимое сайта?"
        description="Все ваши правки будут заменены на исходные значения. Это действие нельзя отменить."
        onConfirm={resetToDefaults}
        onCancel={() => setConfirmReset(false)}
      />
    </AdminShell>
  );
}

/* ---------- Shared helpers ---------- */

type PatchFn = (fn: (d: SiteContent) => void) => void;
type Props = { value: SiteContent; patch: PatchFn };

function Accordion({
  title,
  subtitle,
  defaultOpen = false,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-500 transition ${open ? "" : "-rotate-90"}`}
          />
          <div>
            <div className="text-sm font-semibold text-slate-900">{title}</div>
            {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
          </div>
        </button>
        {actions}
      </div>
      {open && <div className="space-y-4 p-5">{children}</div>}
    </Card>
  );
}

function ListActions({ onRemove }: { onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
      Удалить
    </button>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button variant="secondary" onClick={onClick}>
      <Plus className="h-4 w-4" />
      {label}
    </Button>
  );
}

/* String-list editor: array of plain strings, one line per item. */
function StringListEditor({
  label,
  items,
  onChange,
  addLabel = "Добавить пункт",
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  addLabel?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-medium text-slate-800">{label}</div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <TextInput
              value={it}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...items];
                next[i] = e.target.value;
                onChange(next);
              }}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
              aria-label="Удалить"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Button variant="secondary" onClick={() => onChange([...items, ""])}>
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      </div>
    </div>
  );
}

/* ---------- Tab: Hero ---------- */

function HeroTab({ value, patch }: Props) {
  const h = value.hero;
  return (
    <SectionBlock title="Главный экран" description="Первое, что видит посетитель.">
      <Field label="Небольшая надпись сверху" hint="Например: 68° N · берег Туломы · 40 км от Мурманска">
        <TextInput value={h.badge} onChange={(e) => patch((d) => { d.hero.badge = e.target.value; })} />
      </Field>
      <Field label="Крупный заголовок">
        <TextArea rows={2} value={h.title} onChange={(e) => patch((d) => { d.hero.title = e.target.value; })} />
      </Field>
      <Field label="Описание под заголовком">
        <TextArea rows={3} value={h.description} onChange={(e) => patch((d) => { d.hero.description = e.target.value; })} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Кнопка «Основная»">
          <TextInput value={h.ctaPrimary} onChange={(e) => patch((d) => { d.hero.ctaPrimary = e.target.value; })} />
        </Field>
        <Field label="Кнопка «Дополнительная»">
          <TextInput value={h.ctaSecondary} onChange={(e) => patch((d) => { d.hero.ctaSecondary = e.target.value; })} />
        </Field>
      </div>
    </SectionBlock>
  );
}

/* ---------- Tab: Nav ---------- */

function NavTab({ value, patch }: Props) {
  const n = value.nav;
  return (
    <SectionBlock title="Верхнее меню" description="Название, ссылки в шапке, кнопка справа.">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Название сайта в шапке">
          <TextInput value={n.brand} onChange={(e) => patch((d) => { d.nav.brand = e.target.value; })} />
        </Field>
        <Field label="Кнопка в шапке">
          <TextInput value={n.cta} onChange={(e) => patch((d) => { d.nav.cta = e.target.value; })} />
        </Field>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium text-slate-800">Пункты меню</div>
        <div className="space-y-2">
          {n.links.map((l, i) => (
            <div key={l.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <TextInput
                value={l.label}
                placeholder="Название"
                onChange={(e) => patch((d) => { d.nav.links[i].label = e.target.value; })}
              />
              <TextInput
                value={l.href}
                placeholder="#anchor или /page"
                onChange={(e) => patch((d) => { d.nav.links[i].href = e.target.value; })}
              />
              <button
                type="button"
                onClick={() => patch((d) => { d.nav.links.splice(i, 1); })}
                className="grid h-11 w-11 place-items-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Button variant="secondary" onClick={() => patch((d) => { d.nav.links.push({ id: uid(), label: "Новый пункт", href: "#" }); })}>
            <Plus className="h-4 w-4" /> Добавить пункт
          </Button>
        </div>
      </div>
    </SectionBlock>
  );
}

/* ---------- Tab: Sections (eyebrow/title/lede) ---------- */

function SectionsTab({ value, patch }: Props) {
  const keys: Array<keyof SiteContent["sections"]> = [
    "stays", "gazebos", "activities", "transfer", "trust", "request",
  ];
  const labels: Record<string, string> = {
    stays: "Раздел «Коттеджи»",
    gazebos: "Раздел «Беседки»",
    activities: "Раздел «Услуги»",
    transfer: "Раздел «Трансфер»",
    trust: "Раздел «О базе»",
    request: "Раздел «Бронирование»",
  };
  return (
    <div className="space-y-4">
      {keys.map((k) => {
        const s = value.sections[k];
        return (
          <SectionBlock key={k} title={labels[k]}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Небольшая надпись">
                <TextInput value={s.eyebrow} onChange={(e) => patch((d) => { d.sections[k].eyebrow = e.target.value; })} />
              </Field>
              <Field label="Заголовок">
                <TextInput value={s.title} onChange={(e) => patch((d) => { d.sections[k].title = e.target.value; })} />
              </Field>
            </div>
            <Field label="Описание под заголовком">
              <TextArea rows={2} value={s.lede} onChange={(e) => patch((d) => { d.sections[k].lede = e.target.value; })} />
            </Field>
          </SectionBlock>
        );
      })}
    </div>
  );
}

/* ---------- Tab: Stays ---------- */

const STAY_DETAIL_GROUPS: Array<{ id: StayDetailGroup; label: string }> = [
  { id: "beds", label: "Спальные места" },
  { id: "bath", label: "Санузлы" },
  { id: "kitchen", label: "Кухня и техника" },
  { id: "media", label: "Медиа и комфорт" },
  { id: "outdoor", label: "На улице" },
];

function newStay(): Stay {
  return {
    id: uid(), slug: "new-cottage", code: "Новый", kind: "cottage", name: "Новый коттедж",
    capacity: 2, price: 10000, tagline: "", description: "",
    bullets: [], tags: [],
    details: STAY_DETAIL_GROUPS.map((g) => ({ group: g.id, title: g.label, items: [] })),
  };
}

function StaysTab({ value, patch }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddButton label="Добавить коттедж" onClick={() => patch((d) => { d.stays.push(newStay()); })} />
      </div>
      {value.stays.map((s, idx) => (
        <Accordion
          key={s.id}
          title={s.name || "(без названия)"}
          subtitle={`${s.capacity} гостей · ${s.price.toLocaleString("ru-RU")} ₽`}
          actions={<ListActions onRemove={() => patch((d) => { d.stays.splice(idx, 1); })} />}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Название"><TextInput value={s.name} onChange={(e) => patch((d) => { d.stays[idx].name = e.target.value; })} /></Field>
            <Field label="Короткий код (в бейдже)"><TextInput value={s.code} onChange={(e) => patch((d) => { d.stays[idx].code = e.target.value; })} /></Field>
            <Field label="Тип объекта">
              <select
                value={s.kind}
                onChange={(e) => patch((d) => { d.stays[idx].kind = e.target.value as StayKind; })}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900"
              >
                <option value="cottage">Коттедж</option>
                <option value="townhouse">Блок таунхауса</option>
              </select>
            </Field>
            <Field label="Slug (папка с фото)" hint="Имя из gallery.json — например, cottage-1">
              <TextInput value={s.slug} onChange={(e) => patch((d) => { d.stays[idx].slug = e.target.value; })} />
            </Field>
            <Field label="Вместимость (гостей)">
              <TextInput type="number" value={s.capacity} onChange={(e) => patch((d) => { d.stays[idx].capacity = Number(e.target.value) || 0; })} />
            </Field>
            <Field label="Цена (₽ / сутки)">
              <TextInput type="number" value={s.price} onChange={(e) => patch((d) => { d.stays[idx].price = Number(e.target.value) || 0; })} />
            </Field>
            <Field label="Единица (необязательно)" hint="Например: / блок / сутки">
              <TextInput value={s.priceUnit ?? ""} onChange={(e) => patch((d) => { d.stays[idx].priceUnit = e.target.value || undefined; })} />
            </Field>
            <Field label="Подзаголовок">
              <TextInput value={s.tagline} onChange={(e) => patch((d) => { d.stays[idx].tagline = e.target.value; })} />
            </Field>
          </div>
          <Field label="Описание">
            <TextArea rows={2} value={s.description} onChange={(e) => patch((d) => { d.stays[idx].description = e.target.value; })} />
          </Field>

          <StringListEditor
            label="Пункты на карточке (буллеты)"
            items={s.bullets}
            onChange={(next) => patch((d) => { d.stays[idx].bullets = next; })}
          />
          <StringListEditor
            label="Теги (например: сауна, беседка)"
            items={s.tags}
            onChange={(next) => patch((d) => { d.stays[idx].tags = next; })}
          />

          <div>
            <div className="mb-2 text-sm font-medium text-slate-800">
              Подробности (для карточки «Подробнее»)
            </div>
            <div className="space-y-3">
              {s.details.map((det, dIdx) => (
                <div key={det.group} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="mb-2 text-sm font-semibold text-slate-800">{det.title}</div>
                  <StringListEditor
                    label=""
                    items={det.items}
                    onChange={(next) => patch((d) => { d.stays[idx].details[dIdx].items = next; })}
                  />
                </div>
              ))}
            </div>
          </div>
        </Accordion>
      ))}
    </div>
  );
}

/* ---------- Tab: Gazebos ---------- */

const GAZEBO_ICONS: Array<{ id: GazeboIconKind; label: string }> = [
  { id: "house", label: "Дом" },
  { id: "house2", label: "Дом 2" },
  { id: "crown", label: "Корона (VIP)" },
  { id: "people", label: "Люди" },
];

function GazebosTab({ value, patch }: Props) {
  return (
    <div className="space-y-4">
      <SectionBlock title="Беседки" description="Карточки в разделе «Беседки».">
        {value.gazebos.map((g, i) => (
          <div key={g.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-800">{g.title || "(без названия)"}</div>
              <ListActions onRemove={() => patch((d) => { d.gazebos.splice(i, 1); })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Название"><TextInput value={g.title} onChange={(e) => patch((d) => { d.gazebos[i].title = e.target.value; })} /></Field>
              <Field label="Slug (папка с фото)"><TextInput value={g.slug} onChange={(e) => patch((d) => { d.gazebos[i].slug = e.target.value; })} /></Field>
              <Field label="Иконка">
                <select
                  value={g.icon}
                  onChange={(e) => patch((d) => { d.gazebos[i].icon = e.target.value as GazeboIconKind; })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base"
                >
                  {GAZEBO_ICONS.map((ic) => <option key={ic.id} value={ic.id}>{ic.label}</option>)}
                </select>
              </Field>
              <Field label="Описание"><TextInput value={g.body} onChange={(e) => patch((d) => { d.gazebos[i].body = e.target.value; })} /></Field>
            </div>
          </div>
        ))}
        <AddButton
          label="Добавить беседку"
          onClick={() => patch((d) => { d.gazebos.push({ id: uid(), title: "Новая беседка", body: "", icon: "house", slug: "gazebo-1" } as Gazebo); })}
        />
      </SectionBlock>

      <SectionBlock title="Сноска под беседками">
        <Field label="Текст сноски">
          <TextArea rows={2} value={value.gazeboFootnote} onChange={(e) => patch((d) => { d.gazeboFootnote = e.target.value; })} />
        </Field>
      </SectionBlock>
    </div>
  );
}

/* ---------- Tab: Services ---------- */

const SERVICE_CATS: Array<{ id: ServiceCategory; label: string }> = [
  { id: "banya", label: "Баня и фурако" },
  { id: "summer", label: "Лето" },
  { id: "winter", label: "Зима" },
  { id: "activities", label: "Активности" },
];

function ServicesTab({ value, patch }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddButton
          label="Добавить услугу"
          onClick={() => patch((d) => { d.services.push({ id: uid(), title: "Новая услуга", body: "", slug: "banya", categories: ["banya"], prices: [] } as ServiceItem); })}
        />
      </div>
      {value.services.map((s, i) => (
        <Accordion
          key={s.id}
          title={s.title || "(без названия)"}
          subtitle={s.meta || s.categories.join(", ")}
          actions={<ListActions onRemove={() => patch((d) => { d.services.splice(i, 1); })} />}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Название"><TextInput value={s.title} onChange={(e) => patch((d) => { d.services[i].title = e.target.value; })} /></Field>
            <Field label="Slug (папка с фото)"><TextInput value={s.slug} onChange={(e) => patch((d) => { d.services[i].slug = e.target.value; })} /></Field>
          </div>
          <Field label="Короткое описание">
            <TextArea rows={2} value={s.body} onChange={(e) => patch((d) => { d.services[i].body = e.target.value; })} />
          </Field>
          <Field label="Подпись (meta) — необязательно" hint="Например: «Sea-Doo 130 · 1 шт.»">
            <TextInput value={s.meta ?? ""} onChange={(e) => patch((d) => { d.services[i].meta = e.target.value || undefined; })} />
          </Field>

          <div>
            <div className="mb-2 text-sm font-medium text-slate-800">Категории</div>
            <div className="flex flex-wrap gap-2">
              {SERVICE_CATS.map((c) => {
                const active = s.categories.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => patch((d) => {
                      const cats = new Set(d.services[i].categories);
                      active ? cats.delete(c.id) : cats.add(c.id);
                      d.services[i].categories = Array.from(cats);
                    })}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${
                      active
                        ? "border-teal-500 bg-teal-50 text-teal-800"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium text-slate-800">Цены</div>
            <div className="space-y-2">
              {(s.prices ?? []).map((p, pIdx) => (
                <div key={pIdx} className="grid gap-2 sm:grid-cols-[1fr_180px_auto]">
                  <TextInput
                    value={p.label}
                    placeholder="Название"
                    onChange={(e) => patch((d) => { d.services[i].prices![pIdx].label = e.target.value; })}
                  />
                  <TextInput
                    value={p.price}
                    placeholder="4 000 ₽"
                    onChange={(e) => patch((d) => { d.services[i].prices![pIdx].price = e.target.value; })}
                  />
                  <button
                    type="button"
                    onClick={() => patch((d) => { d.services[i].prices!.splice(pIdx, 1); })}
                    className="grid h-11 w-11 place-items-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button variant="secondary" onClick={() => patch((d) => {
                if (!d.services[i].prices) d.services[i].prices = [];
                d.services[i].prices!.push({ label: "", price: "" });
              })}>
                <Plus className="h-4 w-4" /> Добавить цену
              </Button>
            </div>
          </div>

          <StringListEditor
            label="Включено (теги)"
            items={s.included ?? []}
            onChange={(next) => patch((d) => { d.services[i].included = next.length ? next : undefined; })}
          />
          <StringListEditor
            label="Примечания"
            items={s.notes ?? []}
            onChange={(next) => patch((d) => { d.services[i].notes = next.length ? next : undefined; })}
          />
        </Accordion>
      ))}
    </div>
  );
}

/* ---------- Tab: Extras ---------- */

function ExtrasTab({ value, patch }: Props) {
  return (
    <SectionBlock title="Дополнительно на месте" description="Мелкие позиции в конце раздела «Услуги».">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Заголовок блока">
          <TextInput value={value.extrasHeading} onChange={(e) => patch((d) => { d.extrasHeading = e.target.value; })} />
        </Field>
        <Field label="Подзаголовок">
          <TextInput value={value.extrasSubheading} onChange={(e) => patch((d) => { d.extrasSubheading = e.target.value; })} />
        </Field>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium text-slate-800">Позиции</div>
        <div className="space-y-2">
          {value.extras.map((row, i) => (
            <div key={row.id} className="grid gap-2 sm:grid-cols-[1fr_180px_auto]">
              <TextInput value={row.label} placeholder="Название" onChange={(e) => patch((d) => { d.extras[i].label = e.target.value; })} />
              <TextInput value={row.price} placeholder="500 ₽" onChange={(e) => patch((d) => { d.extras[i].price = e.target.value; })} />
              <button
                type="button"
                onClick={() => patch((d) => { d.extras.splice(i, 1); })}
                className="grid h-11 w-11 place-items-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Button variant="secondary" onClick={() => patch((d) => { d.extras.push({ id: uid(), label: "", price: "" }); })}>
            <Plus className="h-4 w-4" /> Добавить позицию
          </Button>
        </div>
      </div>
    </SectionBlock>
  );
}

/* ---------- Tab: Transfer ---------- */

const TRANSFER_ICONS: Array<{ id: TransferIconKind; label: string }> = [
  { id: "to-hotel", label: "В отель" },
  { id: "from-hotel", label: "Из отеля" },
  { id: "to-airport", label: "В аэропорт" },
  { id: "from-airport", label: "Из аэропорта" },
];

function TransferTab({ value, patch }: Props) {
  const t = value.transfer;
  return (
    <div className="space-y-4">
      <SectionBlock title="Автомобиль">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Название авто"><TextInput value={t.car} onChange={(e) => patch((d) => { d.transfer.car = e.target.value; })} /></Field>
          <Field label="Slug фото (в gallery.json)"><TextInput value={t.gallerySlug} onChange={(e) => patch((d) => { d.transfer.gallerySlug = e.target.value; })} /></Field>
        </div>
        <Field label="Описание авто">
          <TextArea rows={2} value={t.carDescription} onChange={(e) => patch((d) => { d.transfer.carDescription = e.target.value; })} />
        </Field>

        <div>
          <div className="mb-2 text-sm font-medium text-slate-800">Особенности (иконка + текст)</div>
          <div className="space-y-2">
            {t.features.map((f, i) => (
              <div key={f.id} className="grid gap-2 sm:grid-cols-[180px_1fr_auto]">
                <select
                  value={f.icon}
                  onChange={(e) => patch((d) => { d.transfer.features[i].icon = e.target.value as "seats" | "luggage" | "comfort"; })}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3"
                >
                  <option value="seats">Пассажиры</option>
                  <option value="luggage">Багаж</option>
                  <option value="comfort">Комфорт</option>
                </select>
                <TextInput value={f.text} onChange={(e) => patch((d) => { d.transfer.features[i].text = e.target.value; })} />
                <button
                  type="button"
                  onClick={() => patch((d) => { d.transfer.features.splice(i, 1); })}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button variant="secondary" onClick={() => patch((d) => { d.transfer.features.push({ id: uid(), icon: "seats", text: "" }); })}>
              <Plus className="h-4 w-4" /> Добавить особенность
            </Button>
          </div>
        </div>

        <Field label="Сноска под кнопками">
          <TextArea rows={2} value={t.footnote} onChange={(e) => patch((d) => { d.transfer.footnote = e.target.value; })} />
        </Field>
      </SectionBlock>

      <SectionBlock title="Направления и цены" description="Основные карточки в окне «Маршрут и цены».">
        <div className="space-y-4">
          {t.routeGroups.map((g, gi) => (
            <div key={g.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-800">{g.title || "(без названия)"}</div>
                <ListActions onRemove={() => patch((d) => { d.transfer.routeGroups.splice(gi, 1); })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Название карточки"><TextInput value={g.title} onChange={(e) => patch((d) => { d.transfer.routeGroups[gi].title = e.target.value; })} /></Field>
                <Field label="Заголовок колонки">
                  <select
                    value={g.column}
                    onChange={(e) => patch((d) => { d.transfer.routeGroups[gi].column = e.target.value as "Откуда" | "Куда"; })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                  >
                    <option value="Откуда">Откуда</option>
                    <option value="Куда">Куда</option>
                  </select>
                </Field>
                <Field label="Иконка">
                  <select
                    value={g.icon}
                    onChange={(e) => patch((d) => { d.transfer.routeGroups[gi].icon = e.target.value as TransferIconKind; })}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
                  >
                    {TRANSFER_ICONS.map((ic) => <option key={ic.id} value={ic.id}>{ic.label}</option>)}
                  </select>
                </Field>
              </div>
              <div className="mt-3 space-y-2">
                {g.routes.map((r, ri) => (
                  <div key={r.id} className="grid gap-2 sm:grid-cols-[1fr_180px_auto]">
                    <TextInput value={r.label} placeholder="Название" onChange={(e) => patch((d) => { d.transfer.routeGroups[gi].routes[ri].label = e.target.value; })} />
                    <TextInput value={r.price} placeholder="3 000 ₽" onChange={(e) => patch((d) => { d.transfer.routeGroups[gi].routes[ri].price = e.target.value; })} />
                    <button
                      type="button"
                      onClick={() => patch((d) => { d.transfer.routeGroups[gi].routes.splice(ri, 1); })}
                      className="grid h-11 w-11 place-items-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Button variant="secondary" onClick={() => patch((d) => { d.transfer.routeGroups[gi].routes.push({ id: uid(), label: "", price: "" }); })}>
                  <Plus className="h-4 w-4" /> Добавить маршрут
                </Button>
              </div>
            </div>
          ))}
          <AddButton
            label="Добавить карточку направления"
            onClick={() => patch((d) => { d.transfer.routeGroups.push({ id: uid(), title: "Новое направление", column: "Откуда", icon: "to-hotel", routes: [] } as TransferRouteGroup); })}
          />
        </div>
      </SectionBlock>

      <SectionBlock title="Мурманск — Териберка">
        <Field label="Заголовок карточки">
          <TextInput value={t.teriberkaTitle} onChange={(e) => patch((d) => { d.transfer.teriberkaTitle = e.target.value; })} />
        </Field>
        <div className="space-y-2">
          {t.teriberka.map((row, i) => (
            <div key={row.id} className="grid gap-2 sm:grid-cols-[1fr_180px_auto]">
              <TextInput value={row.label} placeholder="Маршрут" onChange={(e) => patch((d) => { d.transfer.teriberka[i].label = e.target.value; })} />
              <TextInput value={row.price} placeholder="Стоимость" onChange={(e) => patch((d) => { d.transfer.teriberka[i].price = e.target.value; })} />
              <button
                type="button"
                onClick={() => patch((d) => { d.transfer.teriberka.splice(i, 1); })}
                className="grid h-11 w-11 place-items-center rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <Button variant="secondary" onClick={() => patch((d) => { d.transfer.teriberka.push({ id: uid(), label: "", price: "" }); })}>
            <Plus className="h-4 w-4" /> Добавить маршрут
          </Button>
        </div>
      </SectionBlock>

      <SectionBlock title="Ожидание и примечание">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Подпись"><TextInput value={t.waitLabel} onChange={(e) => patch((d) => { d.transfer.waitLabel = e.target.value; })} /></Field>
          <Field label="Стоимость часа ожидания"><TextInput value={t.waitPrice} onChange={(e) => patch((d) => { d.transfer.waitPrice = e.target.value; })} /></Field>
        </div>
        <Field label="Примечание">
          <TextArea rows={2} value={t.waitNote} onChange={(e) => patch((d) => { d.transfer.waitNote = e.target.value; })} />
        </Field>
      </SectionBlock>
    </div>
  );
}

/* ---------- Tab: Steps ---------- */

function StepsTab({ value, patch }: Props) {
  return (
    <SectionBlock title="Как забронировать" description="Шаги слева от формы бронирования.">
      <div className="space-y-2">
        {value.bookingSteps.map((s, i) => (
          <div key={s.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-800">Шаг {i + 1}</div>
              <ListActions onRemove={() => patch((d) => { d.bookingSteps.splice(i, 1); })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-[220px_1fr]">
              <Field label="Название"><TextInput value={s.title} onChange={(e) => patch((d) => { d.bookingSteps[i].title = e.target.value; })} /></Field>
              <Field label="Описание"><TextInput value={s.body} onChange={(e) => patch((d) => { d.bookingSteps[i].body = e.target.value; })} /></Field>
            </div>
          </div>
        ))}
        <AddButton label="Добавить шаг" onClick={() => patch((d) => { d.bookingSteps.push({ id: uid(), title: "", body: "" }); })} />
      </div>
    </SectionBlock>
  );
}

/* ---------- Tab: Trust ---------- */

function TrustTab({ value, patch }: Props) {
  return (
    <SectionBlock title="О базе" description="Плитки с фактами о базе.">
      <div className="space-y-2">
        {value.trustItems.map((it, i) => (
          <div key={it.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-800">Пункт {i + 1}</div>
              <ListActions onRemove={() => patch((d) => { d.trustItems.splice(i, 1); })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-[100px_1fr]">
              <Field label="Номер"><TextInput value={it.num} onChange={(e) => patch((d) => { d.trustItems[i].num = e.target.value; })} /></Field>
              <Field label="Заголовок"><TextInput value={it.title} onChange={(e) => patch((d) => { d.trustItems[i].title = e.target.value; })} /></Field>
            </div>
            <Field label="Описание"><TextArea rows={2} value={it.body} onChange={(e) => patch((d) => { d.trustItems[i].body = e.target.value; })} /></Field>
          </div>
        ))}
        <AddButton label="Добавить пункт" onClick={() => patch((d) => { d.trustItems.push({ id: uid(), num: "07", title: "", body: "" }); })} />
      </div>
    </SectionBlock>
  );
}

/* ---------- Tab: Contact & Footer ---------- */

function ContactTab({ value, patch }: Props) {
  const c = value.contact;
  const f = value.footer;
  return (
    <div className="space-y-4">
      <SectionBlock title="Контакты" description="Отображаются в разделе бронирования и в футере.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Телефон"><TextInput value={c.phone} onChange={(e) => patch((d) => { d.contact.phone = e.target.value; })} /></Field>
          <Field label="Телефон (ссылка)" hint="Например: tel:+78152780111"><TextInput value={c.phoneHref} onChange={(e) => patch((d) => { d.contact.phoneHref = e.target.value; })} /></Field>
          <Field label="Адрес"><TextInput value={c.address} onChange={(e) => patch((d) => { d.contact.address = e.target.value; })} /></Field>
          <Field label="Email"><TextInput value={c.email} onChange={(e) => patch((d) => { d.contact.email = e.target.value; })} /></Field>
          <Field label="Telegram"><TextInput value={c.telegram} onChange={(e) => patch((d) => { d.contact.telegram = e.target.value; })} /></Field>
          <Field label="Telegram (ссылка)"><TextInput value={c.telegramHref} onChange={(e) => patch((d) => { d.contact.telegramHref = e.target.value; })} /></Field>
          <Field label="Координаты"><TextInput value={c.coords} onChange={(e) => patch((d) => { d.contact.coords = e.target.value; })} /></Field>
        </div>
      </SectionBlock>

      <SectionBlock title="Футер (нижний блок сайта)">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Название"><TextInput value={f.brand} onChange={(e) => patch((d) => { d.footer.brand = e.target.value; })} /></Field>
          <Field label="Копирайт"><TextInput value={f.copyright} onChange={(e) => patch((d) => { d.footer.copyright = e.target.value; })} /></Field>
        </div>
        <Field label="Короткое описание">
          <TextArea rows={2} value={f.description} onChange={(e) => patch((d) => { d.footer.description = e.target.value; })} />
        </Field>
        <StringListEditor
          label="Строки адреса"
          items={f.addressLines}
          onChange={(next) => patch((d) => { d.footer.addressLines = next; })}
        />
      </SectionBlock>
    </div>
  );
}

/* ---------- Tab: Misc ---------- */

function MiscTab({ value, patch }: Props) {
  return (
    <SectionBlock title="Прочие тексты">
      <Field label="Соглашение под кнопкой отправки заявки">
        <TextArea rows={2} value={value.bookingConsent} onChange={(e) => patch((d) => { d.bookingConsent = e.target.value; })} />
      </Field>
      <Field label="Сообщение после отправки заявки">
        <TextArea rows={2} value={value.requestSuccessMessage} onChange={(e) => patch((d) => { d.requestSuccessMessage = e.target.value; })} />
      </Field>
    </SectionBlock>
  );
}
