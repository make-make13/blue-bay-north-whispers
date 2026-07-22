import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "../components/admin/AdminShell";
import { ImageListEditor } from "../components/admin/ImageListEditor";
import { ResourceEditor } from "../components/admin/ResourceEditor";
import { Field, TextArea, TextInput } from "../components/admin/ui";
import { api } from "../lib/api";
import type { Cottage } from "../lib/api/types";

export const Route = createFileRoute("/admin/cottages")({
  component: CottagesAdmin,
});

const empty: Omit<Cottage, "id"> = {
  slug: "",
  title: "",
  kind: "cottage",
  tagline: "",
  description: "",
  price: 0,
  priceUnit: "/ сутки",
  capacity: 2,
  bedrooms: 1,
  hasSauna: false,
  hasGrill: false,
  images: [],
  included: [],
  published: true,
  sortOrder: 0,
};

function CottagesAdmin() {
  return (
    <AdminShell title="Коттеджи и таунхаус">
      <ResourceEditor<Cottage>
        crud={api.cottages}
        empty={empty}
        addLabel="Добавить объект"
        renderRow={(item) => (
          <div>
            <div className="font-medium text-white">{item.title}</div>
            <div className="text-xs text-neutral-500">
              {item.kind === "cottage" ? "Коттедж" : "Таунхаус"} · до {item.capacity} гостей ·{" "}
              {item.price.toLocaleString("ru-RU")} ₽ {item.priceUnit}
            </div>
          </div>
        )}
        renderForm={({ value, setValue }) => {
          const v = value as Cottage;
          const set = (patch: Partial<Cottage>) => setValue({ ...v, ...patch });
          return (
            <>
              <Field label="Название">
                <TextInput value={v.title} onChange={(e) => set({ title: e.target.value })} />
              </Field>
              <Field label="Slug" hint="используется в URL, латиница">
                <TextInput value={v.slug} onChange={(e) => set({ slug: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Тип">
                  <select
                    value={v.kind}
                    onChange={(e) => set({ kind: e.target.value as Cottage["kind"] })}
                    className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm"
                  >
                    <option value="cottage">Коттедж</option>
                    <option value="townhouse">Таунхаус</option>
                  </select>
                </Field>
                <Field label="Вместимость">
                  <TextInput
                    type="number"
                    value={v.capacity}
                    onChange={(e) => set({ capacity: Number(e.target.value) })}
                  />
                </Field>
                <Field label="Цена, ₽">
                  <TextInput
                    type="number"
                    value={v.price}
                    onChange={(e) => set({ price: Number(e.target.value) })}
                  />
                </Field>
                <Field label="Единица">
                  <TextInput
                    value={v.priceUnit}
                    onChange={(e) => set({ priceUnit: e.target.value })}
                  />
                </Field>
                <Field label="Спальни">
                  <TextInput
                    type="number"
                    value={v.bedrooms ?? 0}
                    onChange={(e) => set({ bedrooms: Number(e.target.value) })}
                  />
                </Field>
                <Field label="Флаги">
                  <div className="flex gap-4 pt-2 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!v.hasSauna}
                        onChange={(e) => set({ hasSauna: e.target.checked })}
                      />
                      Сауна
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!v.hasGrill}
                        onChange={(e) => set({ hasGrill: e.target.checked })}
                      />
                      Мангал
                    </label>
                  </div>
                </Field>
              </div>
              <Field label="Подзаголовок">
                <TextInput
                  value={v.tagline ?? ""}
                  onChange={(e) => set({ tagline: e.target.value })}
                />
              </Field>
              <Field label="Описание">
                <TextArea
                  rows={4}
                  value={v.description}
                  onChange={(e) => set({ description: e.target.value })}
                />
              </Field>
              <Field label="Что включено (по одному пункту в строку)">
                <TextArea
                  rows={4}
                  value={v.included.join("\n")}
                  onChange={(e) =>
                    set({ included: e.target.value.split("\n").filter(Boolean) })
                  }
                />
              </Field>
              <Field label="Фотографии">
                <ImageListEditor value={v.images} onChange={(images) => set({ images })} />
              </Field>
            </>
          );
        }}
      />
    </AdminShell>
  );
}
