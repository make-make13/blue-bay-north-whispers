import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "../components/admin/AdminShell";
import { ImageListEditor } from "../components/admin/ImageListEditor";
import { ResourceEditor } from "../components/admin/ResourceEditor";
import { Field, TextArea, TextInput } from "../components/admin/ui";
import { api } from "../lib/api";
import type { Service } from "../lib/api/types";

export const Route = createFileRoute("/admin/services")({
  component: ServicesAdmin,
});

const empty: Omit<Service, "id"> = {
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

function pricesToText(p: Service["prices"]): string {
  return p.map((row) => `${row.label} | ${row.amount} | ${row.unit ?? ""}`).join("\n");
}

function textToPrices(text: string): Service["prices"] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, amount, unit] = line.split("|").map((s) => s.trim());
      return { label: label ?? "", amount: Number(amount ?? 0), unit: unit || undefined };
    });
}

function ServicesAdmin() {
  return (
    <AdminShell title="Услуги">
      <ResourceEditor<Service>
        crud={api.services}
        empty={empty}
        addLabel="Добавить услугу"
        renderRow={(item) => (
          <div>
            <div className="font-medium text-white">{item.title}</div>
            <div className="text-xs text-neutral-500">
              {item.category} · {item.prices.length} тариф(ов)
            </div>
          </div>
        )}
        renderForm={({ value, setValue }) => {
          const v = value as Service;
          const set = (patch: Partial<Service>) => setValue({ ...v, ...patch });
          return (
            <>
              <Field label="Название">
                <TextInput value={v.title} onChange={(e) => set({ title: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Slug">
                  <TextInput value={v.slug} onChange={(e) => set({ slug: e.target.value })} />
                </Field>
                <Field label="Категория">
                  <select
                    value={v.category}
                    onChange={(e) => set({ category: e.target.value as Service["category"] })}
                    className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm"
                  >
                    <option value="banya">Баня и фурако</option>
                    <option value="summer">Лето</option>
                    <option value="winter">Зима</option>
                    <option value="extras">Дополнительно</option>
                    <option value="gift">Сертификаты</option>
                  </select>
                </Field>
              </div>
              <Field label="Описание">
                <TextArea
                  rows={4}
                  value={v.description}
                  onChange={(e) => set({ description: e.target.value })}
                />
              </Field>
              <Field
                label="Тарифы"
                hint="По строке на тариф в формате: название | сумма | единица"
              >
                <TextArea
                  rows={4}
                  value={pricesToText(v.prices)}
                  onChange={(e) => set({ prices: textToPrices(e.target.value) })}
                />
              </Field>
              <Field label="Что включено (по строке)">
                <TextArea
                  rows={3}
                  value={v.included.join("\n")}
                  onChange={(e) => set({ included: e.target.value.split("\n").filter(Boolean) })}
                />
              </Field>
              <Field label="Примечания (по строке)">
                <TextArea
                  rows={3}
                  value={v.notes.join("\n")}
                  onChange={(e) => set({ notes: e.target.value.split("\n").filter(Boolean) })}
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
