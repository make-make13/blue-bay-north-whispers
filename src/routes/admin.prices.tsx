import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "../components/admin/AdminShell";
import { ResourceEditor } from "../components/admin/ResourceEditor";
import { Field, TextInput } from "../components/admin/ui";
import { api } from "../lib/api";
import type { PriceRow } from "../lib/api/types";

export const Route = createFileRoute("/admin/prices")({
  component: PricesAdmin,
});

const empty: Omit<PriceRow, "id"> = {
  section: "transfer",
  label: "",
  amount: 0,
  unit: "₽",
  note: "",
  sortOrder: 0,
};

function PricesAdmin() {
  return (
    <AdminShell title="Прайс">
      <ResourceEditor<PriceRow>
        crud={api.prices as any}
        empty={empty}
        supportsPublish={false}
        addLabel="Добавить строку"
        renderRow={(item) => (
          <div>
            <div className="font-medium text-white">{item.label}</div>
            <div className="text-xs text-neutral-500">
              {item.section} · {item.amount.toLocaleString("ru-RU")} {item.unit}
              {item.note ? ` · ${item.note}` : ""}
            </div>
          </div>
        )}
        renderForm={({ value, setValue }) => {
          const v = value as PriceRow;
          const set = (patch: Partial<PriceRow>) => setValue({ ...v, ...patch });
          return (
            <>
              <Field label="Раздел" hint="например: transfer, extras, teribera">
                <TextInput value={v.section} onChange={(e) => set({ section: e.target.value })} />
              </Field>
              <Field label="Название">
                <TextInput value={v.label} onChange={(e) => set({ label: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Сумма">
                  <TextInput
                    type="number"
                    value={v.amount}
                    onChange={(e) => set({ amount: Number(e.target.value) })}
                  />
                </Field>
                <Field label="Единица">
                  <TextInput
                    value={v.unit ?? ""}
                    onChange={(e) => set({ unit: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Примечание">
                <TextInput
                  value={v.note ?? ""}
                  onChange={(e) => set({ note: e.target.value })}
                />
              </Field>
            </>
          );
        }}
      />
    </AdminShell>
  );
}
