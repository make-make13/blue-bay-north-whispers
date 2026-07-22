import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "../components/admin/AdminShell";
import { Button, Field, SectionBlock, Switch, TextArea, TextInput } from "../components/admin/ui";
import { ConfirmDialog } from "../components/admin/ConfirmDialog";
import { PhotoUploader } from "../components/admin/PhotoUploader";
import {
  EditorLayout,
  EmptyState,
  ItemCard,
  ListToolbar,
  StringList,
} from "../components/admin/CardList";
import { useDirtyState, useDraft, useUnsavedGuard } from "../components/admin/hooks";
import { api } from "../lib/api";
import type { Service } from "../lib/api/types";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/services")({
  component: ServicesAdmin,
});

const CATEGORY_LABEL: Record<Service["category"], string> = {
  banya: "Баня и купель",
  summer: "Летние услуги",
  winter: "Зимние услуги",
  extras: "Дополнительно",
  gift: "Подарочные сертификаты",
};

const CATEGORIES: Service["category"][] = ["banya", "summer", "winter", "extras", "gift"];

function emptyService(): Omit<Service, "id"> {
  return {
    slug: "",
    title: "",
    category: "banya",
    description: "",
    images: [],
    prices: [],
    included: [],
    notes: [],
    published: true,
    sortOrder: 0,
  };
}

function makeSlug(title: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
    з: "z", и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
    ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
    я: "ya",
  };
  return (
    title.toLowerCase().split("").map((c) => map[c] ?? c).join("")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60)
    || "service-" + Date.now().toString(36)
  );
}

function ServicesAdmin() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Service | Omit<Service, "id"> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Service | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      setItems(await api.services.list());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(
    () => items.filter((s) => s.title.toLowerCase().includes(search.trim().toLowerCase())),
    [items, search],
  );

  if (editing) {
    return (
      <AdminShell title="Услуги" subtitle="Услуги">
        <ServiceEditor
          initial={editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refresh();
          }}
          onRequestDelete={(item) => {
            setEditing(null);
            setConfirmDelete(item);
          }}
        />
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Услуги" subtitle="Услуги">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-slate-900">Услуги</h2>
        <p className="mt-1 text-base text-slate-600">
          Баня, купель, беседки, активности и подарочные сертификаты.
        </p>
      </div>

      <ListToolbar
        addLabel="Добавить услугу"
        onAdd={() => setEditing(emptyService())}
        search={search}
        onSearchChange={setSearch}
      />

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          Загрузка…
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? "Ничего не найдено" : "Пока нет ни одной услуги"}
          hint={search ? undefined : "Добавьте первую услугу, чтобы она появилась на сайте."}
          actionLabel={search ? undefined : "Добавить услугу"}
          onAction={search ? undefined : () => setEditing(emptyService())}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              cover={item.cover ?? item.images[0]}
              title={item.title}
              subtitle={`${CATEGORY_LABEL[item.category]} · ${item.description || ""}`}
              price={
                item.prices[0]
                  ? `${item.prices[0].amount.toLocaleString("ru-RU")} ${item.prices[0].unit ?? "₽"}`
                  : undefined
              }
              visible={item.published}
              onEdit={() => setEditing(item)}
              onToggleVisible={async () => {
                await api.services.update(item.id, { published: !item.published });
                toast.success(
                  item.published ? "Скрыто с сайта" : "Изменения сохранены и уже отображаются на сайте",
                );
                refresh();
              }}
              onDelete={() => setConfirmDelete(item)}
              publicUrl="/#services"
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title={`Удалить услугу «${confirmDelete?.title ?? ""}»?`}
        description="Она перестанет отображаться на сайте. Это действие нельзя отменить."
        onConfirm={async () => {
          if (!confirmDelete) return;
          try {
            await api.services.remove(confirmDelete.id);
            toast.success(`«${confirmDelete.title}» удалена`);
            setConfirmDelete(null);
            refresh();
          } catch {
            toast.error("Не удалось удалить. Проверьте интернет и попробуйте ещё раз");
          }
        }}
        onCancel={() => setConfirmDelete(null)}
      />
    </AdminShell>
  );
}

function ServiceEditor({
  initial,
  onCancel,
  onSaved,
  onRequestDelete,
}: {
  initial: Service | Omit<Service, "id">;
  onCancel: () => void;
  onSaved: () => void;
  onRequestDelete: (item: Service) => void;
}) {
  const existingId = "id" in initial ? initial.id : null;
  const [value, setValue, { dirty }] = useDirtyState<Service | Omit<Service, "id">>(initial);
  const [saving, setSaving] = useState(false);
  const draftKey = existingId ? `service.${existingId}` : "service.new";
  const { clear } = useDraft(draftKey, value, setValue);
  useUnsavedGuard(dirty && !saving);

  const v = value as Service;
  const set = (patch: Partial<Service>) => setValue({ ...v, ...patch });

  async function save() {
    setSaving(true);
    try {
      if (existingId) {
        const { id: _id, ...rest } = v;
        await api.services.update(existingId, rest);
      } else {
        await api.services.create({
          ...(v as Omit<Service, "id">),
          slug: v.slug || makeSlug(v.title),
        });
      }
      toast.success("Изменения сохранены и уже отображаются на сайте");
      clear();
      onSaved();
    } catch {
      toast.error("Не удалось сохранить изменения. Проверьте интернет и попробуйте ещё раз");
    } finally {
      setSaving(false);
    }
  }

  return (
    <EditorLayout
      title={existingId ? v.title || "Новая услуга" : "Новая услуга"}
      backTo="/admin/services"
      onSave={save}
      onCancel={onCancel}
      onDelete={existingId ? () => onRequestDelete(v as Service) : undefined}
      deleteLabel="Удалить услугу"
      saving={saving}
      dirty={dirty}
    >
      <SectionBlock title="Основная информация">
        <Field label="Название">
          <TextInput
            value={v.title}
            onChange={(e) => set({ title: e.target.value })}
            placeholder="Например: Русская баня на дровах"
          />
        </Field>
        <Field label="Раздел" hint="К какой группе относится услуга">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => set({ category: c })}
                className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                  v.category === c
                    ? "border-teal-500 bg-teal-50 text-teal-800"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Описание" hint="Виден на карточке и на странице услуги">
          <TextArea
            rows={4}
            value={v.description}
            onChange={(e) => set({ description: e.target.value })}
          />
        </Field>
      </SectionBlock>

      <SectionBlock title="Тарифы и цены">
        <div className="space-y-2">
          {v.prices.map((p, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_140px_140px_auto]">
              <input
                value={p.label}
                onChange={(e) => {
                  const next = [...v.prices];
                  next[i] = { ...p, label: e.target.value };
                  set({ prices: next });
                }}
                placeholder="Название тарифа"
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/40"
              />
              <input
                type="number"
                value={p.amount}
                onChange={(e) => {
                  const next = [...v.prices];
                  next[i] = { ...p, amount: Number(e.target.value) };
                  set({ prices: next });
                }}
                placeholder="Сумма"
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/40"
              />
              <input
                value={p.unit ?? ""}
                onChange={(e) => {
                  const next = [...v.prices];
                  next[i] = { ...p, unit: e.target.value };
                  set({ prices: next });
                }}
                placeholder="₽/час"
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/40"
              />
              <button
                type="button"
                onClick={() => set({ prices: v.prices.filter((_, idx) => idx !== i) })}
                className="rounded-xl border border-slate-300 bg-white p-3 text-slate-500 hover:bg-red-50 hover:text-red-600"
                aria-label="Удалить тариф"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              set({ prices: [...v.prices, { label: "", amount: 0, unit: "₽" }] })
            }
            className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            + Добавить тариф
          </button>
        </div>
      </SectionBlock>

      <SectionBlock title="Фотографии">
        <PhotoUploader value={v.images} onChange={(images) => set({ images })} />
      </SectionBlock>

      <SectionBlock title="Что входит в стоимость">
        <StringList
          value={v.included}
          onChange={(included) => set({ included })}
          placeholder="Например: Веники, полотенца, чай"
        />
      </SectionBlock>

      <SectionBlock title="Примечания" description="Например, условия бронирования">
        <StringList
          value={v.notes}
          onChange={(notes) => set({ notes })}
          addLabel="Добавить примечание"
          placeholder="Например: Минимальное бронирование — 2 часа"
        />
      </SectionBlock>

      <SectionBlock title="Показывать на сайте">
        <Switch
          checked={v.published}
          onChange={(x) => set({ published: x })}
          label={v.published ? "Показывается на сайте" : "Скрыто"}
        />
      </SectionBlock>
    </EditorLayout>
  );
}
