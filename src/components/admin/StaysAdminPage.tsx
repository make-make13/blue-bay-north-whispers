// Shared list+editor page for cottages ("cottage" kind) and rooms
// ("townhouse" kind). Same data model, different filter and labels.
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { api } from "../../lib/api";
import type { Cottage } from "../../lib/api/types";
import { AdminShell } from "./AdminShell";
import { Button, Field, SectionBlock, Switch, TextArea, TextInput } from "./ui";
import { ConfirmDialog } from "./ConfirmDialog";
import { PhotoUploader } from "./PhotoUploader";
import {
  EditorLayout,
  EmptyState,
  ItemCard,
  ListToolbar,
  StringList,
} from "./CardList";
import { useDirtyState, useDraft, useUnsavedGuard } from "./hooks";

type Kind = "cottage" | "townhouse";

interface Copy {
  singular: string;      // "коттедж"
  singularAcc: string;   // "коттедж" (accusative)
  addLabel: string;      // "Добавить коттедж"
  emptyTitle: string;
  emptyHint: string;
  newTitleExample: string; // "Например: Коттедж №1"
  priceUnitDefault: string;
  sectionTitle: string;    // "Коттеджи"
}

const COPY: Record<Kind, Copy> = {
  cottage: {
    singular: "коттедж",
    singularAcc: "коттедж",
    addLabel: "Добавить коттедж",
    emptyTitle: "Пока нет ни одного коттеджа",
    emptyHint: "Добавьте первый коттедж, чтобы он появился на сайте.",
    newTitleExample: "Например: Коттедж №1",
    priceUnitDefault: "/ сутки",
    sectionTitle: "Коттеджи",
  },
  townhouse: {
    singular: "номер",
    singularAcc: "номер",
    addLabel: "Добавить номер",
    emptyTitle: "Пока нет ни одного номера",
    emptyHint: "Добавьте номер (блок таунхауса), чтобы он появился на сайте.",
    newTitleExample: "Например: Таунхаус №3, блок 1",
    priceUnitDefault: "/ блок / сутки",
    sectionTitle: "Номера",
  },
};

function emptyItem(kind: Kind, copy: Copy): Omit<Cottage, "id"> {
  return {
    slug: "",
    title: "",
    kind,
    tagline: "",
    description: "",
    price: 0,
    priceUnit: copy.priceUnitDefault,
    capacity: 2,
    bedrooms: 1,
    hasSauna: false,
    hasGrill: false,
    images: [],
    included: [],
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
    title
      .toLowerCase()
      .split("")
      .map((c) => map[c] ?? c)
      .join("")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "item-" + Date.now().toString(36)
  );
}

export function StaysAdminPage({ kind }: { kind: Kind }) {
  const copy = COPY[kind];
  const [items, setItems] = useState<Cottage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Cottage | Omit<Cottage, "id"> | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Cottage | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const all = await api.cottages.list();
      setItems(all.filter((x) => x.kind === kind));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  const filtered = useMemo(
    () =>
      items.filter((x) => x.title.toLowerCase().includes(search.trim().toLowerCase())),
    [items, search],
  );

  async function onToggleVisible(item: Cottage) {
    await api.cottages.update(item.id, { published: !item.published });
    toast.success(
      item.published ? "Скрыто с сайта" : "Изменения сохранены и уже отображаются на сайте",
    );
    refresh();
  }

  async function reallyDelete(item: Cottage) {
    try {
      await api.cottages.remove(item.id);
      toast.success(`«${item.title}» удалён`);
      setConfirmDelete(null);
      refresh();
    } catch {
      toast.error("Не удалось удалить. Проверьте интернет и попробуйте ещё раз");
    }
  }

  if (editing) {
    return (
      <AdminShell title={copy.sectionTitle} subtitle={copy.sectionTitle}>
        <StaysEditor
          kind={kind}
          copy={copy}
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
    <AdminShell title={copy.sectionTitle} subtitle={copy.sectionTitle}>
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-slate-900">{copy.sectionTitle}</h2>
        <p className="mt-1 text-base text-slate-600">
          Управляйте {kind === "cottage" ? "коттеджами" : "номерами"} — добавляйте, изменяйте,
          скрывайте и удаляйте.
        </p>
      </div>

      <ListToolbar
        addLabel={copy.addLabel}
        onAdd={() => setEditing(emptyItem(kind, copy))}
        search={search}
        onSearchChange={setSearch}
      />

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          Загрузка…
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={search ? "Ничего не найдено" : copy.emptyTitle}
          hint={search ? "Попробуйте изменить поисковый запрос." : copy.emptyHint}
          actionLabel={search ? undefined : copy.addLabel}
          onAction={search ? undefined : () => setEditing(emptyItem(kind, copy))}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              cover={item.images[0]}
              title={item.title}
              subtitle={item.tagline ?? item.description}
              price={`${item.price.toLocaleString("ru-RU")} ₽ ${item.priceUnit}`}
              visible={item.published}
              onEdit={() => setEditing(item)}
              onToggleVisible={() => onToggleVisible(item)}
              onDelete={() => setConfirmDelete(item)}
              publicUrl="/#stays"
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title={`Удалить ${copy.singularAcc} «${confirmDelete?.title ?? ""}»?`}
        description="Он перестанет отображаться на сайте. Это действие нельзя отменить."
        confirmLabel="Да, удалить"
        cancelLabel="Не удалять"
        onConfirm={() => confirmDelete && reallyDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </AdminShell>
  );
}

function StaysEditor({
  kind,
  copy,
  initial,
  onCancel,
  onSaved,
  onRequestDelete,
}: {
  kind: Kind;
  copy: Copy;
  initial: Cottage | Omit<Cottage, "id">;
  onCancel: () => void;
  onSaved: () => void;
  onRequestDelete: (item: Cottage) => void;
}) {
  const existingId = "id" in initial ? initial.id : null;
  const [value, setValue, { dirty }] = useDirtyState<Cottage | Omit<Cottage, "id">>(initial);
  const [saving, setSaving] = useState(false);
  const draftKey = existingId ? `${kind}.${existingId}` : `${kind}.new`;
  const { clear } = useDraft(draftKey, value, setValue);
  useUnsavedGuard(dirty && !saving);

  const v = value as Cottage;
  const set = (patch: Partial<Cottage>) => setValue({ ...v, ...patch });

  async function save() {
    setSaving(true);
    try {
      if (existingId) {
        const { id: _id, ...rest } = v;
        await api.cottages.update(existingId, rest);
      } else {
        await api.cottages.create({
          ...(v as Omit<Cottage, "id">),
          kind,
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
      title={existingId ? v.title || `Новый ${copy.singular}` : `Новый ${copy.singular}`}
      backTo={kind === "cottage" ? "/admin/cottages" : "/admin/rooms"}
      onSave={save}
      onCancel={onCancel}
      onDelete={existingId ? () => onRequestDelete(v as Cottage) : undefined}
      deleteLabel={`Удалить ${copy.singularAcc}`}
      saving={saving}
      dirty={dirty}
    >
      <SectionBlock title="Основная информация">
        <Field label="Название">
          <TextInput
            value={v.title}
            onChange={(e) => set({ title: e.target.value })}
            placeholder={copy.newTitleExample}
          />
        </Field>
        <Field
          label="Короткое описание"
          hint="Этот текст будет виден на карточке объекта"
        >
          <TextInput
            value={v.tagline ?? ""}
            onChange={(e) => set({ tagline: e.target.value })}
            placeholder="Например: Двухэтажный коттедж с сауной"
          />
        </Field>
        <Field label="Полное описание" hint="Подробная информация для страницы объекта">
          <TextArea
            rows={4}
            value={v.description}
            onChange={(e) => set({ description: e.target.value })}
          />
        </Field>
      </SectionBlock>

      <SectionBlock title="Цена">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Стоимость" hint="Укажите стоимость в рублях">
            <TextInput
              type="number"
              inputMode="numeric"
              value={v.price}
              onChange={(e) => set({ price: Number(e.target.value) })}
            />
          </Field>
          <Field label="За что берётся плата" hint="Например: / сутки">
            <TextInput
              value={v.priceUnit}
              onChange={(e) => set({ priceUnit: e.target.value })}
            />
          </Field>
        </div>
      </SectionBlock>

      <SectionBlock title="Вместимость">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Максимум гостей">
            <TextInput
              type="number"
              inputMode="numeric"
              value={v.capacity}
              onChange={(e) => set({ capacity: Number(e.target.value) })}
            />
          </Field>
          <Field label="Спальных комнат">
            <TextInput
              type="number"
              inputMode="numeric"
              value={v.bedrooms ?? 0}
              onChange={(e) => set({ bedrooms: Number(e.target.value) })}
            />
          </Field>
        </div>
        <div className="flex flex-wrap gap-2">
          <Switch
            checked={!!v.hasSauna}
            onChange={(x) => set({ hasSauna: x })}
            label="Есть сауна"
          />
          <Switch
            checked={!!v.hasGrill}
            onChange={(x) => set({ hasGrill: x })}
            label="Есть мангал"
          />
        </div>
      </SectionBlock>

      <SectionBlock
        title="Фотографии"
        description="Первая фотография — главная. Её видят на карточке и в шапке страницы."
      >
        <PhotoUploader value={v.images} onChange={(images) => set({ images })} />
      </SectionBlock>

      <SectionBlock title="Что входит в стоимость">
        <StringList
          value={v.included}
          onChange={(included) => set({ included })}
          addLabel="Добавить пункт"
          placeholder="Например: Сауна, камин, мангал"
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
