import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "../components/admin/AdminShell";
import { Button, Card } from "../components/admin/ui";
import { api } from "../lib/api";
import type { Cottage, Service } from "../lib/api/types";

export const Route = createFileRoute("/admin/prices")({
  component: PricesAdmin,
});

type Row = {
  id: string;
  kind: "cottage" | "service";
  title: string;
  subtitle?: string;
  cover?: string;
  amount: number;
  unit: string;
};

function PricesAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [edits, setEdits] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const [cottages, services] = await Promise.all([
        api.cottages.list(),
        api.services.list(),
      ]);
      const r: Row[] = [];
      for (const c of cottages) {
        r.push({
          id: "c:" + c.id,
          kind: "cottage",
          title: c.title,
          subtitle: c.kind === "cottage" ? "Коттедж" : "Номер",
          cover: c.images[0],
          amount: c.price,
          unit: c.priceUnit,
        });
      }
      for (const s of services) {
        if (s.prices[0]) {
          r.push({
            id: "s:" + s.id,
            kind: "service",
            title: s.title,
            subtitle: "Услуга",
            cover: s.cover ?? s.images[0],
            amount: s.prices[0].amount,
            unit: s.prices[0].unit ?? "₽",
          });
        }
      }
      setRows(r);
      setEdits({});
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);

  const changedCount = useMemo(
    () =>
      Object.entries(edits).filter(([id, val]) => {
        const row = rows.find((r) => r.id === id);
        return row && row.amount !== val;
      }).length,
    [edits, rows],
  );

  async function saveAll() {
    setSaving(true);
    try {
      const jobs: Promise<unknown>[] = [];
      for (const [id, val] of Object.entries(edits)) {
        const row = rows.find((r) => r.id === id);
        if (!row || row.amount === val) continue;
        const realId = id.slice(2);
        if (row.kind === "cottage") {
          jobs.push(api.cottages.update(realId, { price: val } as Partial<Cottage>));
        } else {
          const srv = (await api.services.get(realId)) as Service | null;
          if (srv && srv.prices[0]) {
            const nextPrices = [...srv.prices];
            nextPrices[0] = { ...nextPrices[0], amount: val };
            jobs.push(api.services.update(realId, { prices: nextPrices }));
          }
        }
      }
      await Promise.all(jobs);
      toast.success("Изменения сохранены и уже отображаются на сайте");
      refresh();
    } catch {
      toast.error("Не удалось сохранить. Проверьте интернет и попробуйте ещё раз");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell title="Цены" subtitle="Цены">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-slate-900">Цены</h2>
        <p className="mt-1 text-base text-slate-600">
          Здесь можно быстро изменить стоимость любого объекта или услуги.
        </p>
      </div>

      {changedCount > 0 && (
        <div className="sticky top-16 z-20 mb-4 flex items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 shadow-sm">
          <div className="text-sm font-medium text-amber-900">
            Не сохранённых изменений: {changedCount}
          </div>
          <Button variant="primary" onClick={saveAll} disabled={saving}>
            {saving ? "Сохраняем…" : "Сохранить все изменения"}
          </Button>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          Загрузка…
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          Пока нет объектов и услуг с ценой.
        </div>
      ) : (
        <Card className="divide-y divide-slate-100">
          {rows.map((row) => {
            const editedVal = edits[row.id];
            const val = editedVal ?? row.amount;
            const changed = editedVal !== undefined && editedVal !== row.amount;
            return (
              <div
                key={row.id}
                className={`flex flex-wrap items-center gap-4 p-4 transition ${
                  changed ? "bg-amber-50/60" : ""
                }`}
              >
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {row.cover ? (
                    <img src={row.cover} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-base font-semibold text-slate-900">
                    {row.title}
                  </div>
                  <div className="text-sm text-slate-500">{row.subtitle}</div>
                </div>
                <div className="text-sm text-slate-500 sm:min-w-[130px]">
                  Текущая: <b className="text-slate-800">{row.amount.toLocaleString("ru-RU")}</b>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={val}
                    onChange={(e) =>
                      setEdits((prev) => ({ ...prev, [row.id]: Number(e.target.value) }))
                    }
                    className="w-32 rounded-xl border border-slate-300 bg-white px-4 py-3 text-right text-base font-semibold outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/40"
                  />
                  <span className="text-sm text-slate-500">{row.unit}</span>
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </AdminShell>
  );
}
