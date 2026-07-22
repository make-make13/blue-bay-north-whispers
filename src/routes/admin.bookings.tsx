import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Phone, Calendar, Users, MessageSquare } from "lucide-react";

import { AdminShell } from "../components/admin/AdminShell";
import { Button, Card } from "../components/admin/ui";
import { ConfirmDialog } from "../components/admin/ConfirmDialog";
import { api } from "../lib/api";
import type { Booking } from "../lib/api/types";

export const Route = createFileRoute("/admin/bookings")({
  component: BookingsAdmin,
});

function BookingsAdmin() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<Booking | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      const list = await api.bookings.list();
      // Newest first
      setItems(
        [...list].sort((a, b) =>
          (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
        ),
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);

  async function markProcessed(item: Booking) {
    await api.bookings.update(item.id, { status: "processed" });
    toast.success("Заявка отмечена как обработанная");
    refresh();
  }

  return (
    <AdminShell title="Заявки" subtitle="Заявки">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-slate-900">Заявки</h2>
        <p className="mt-1 text-base text-slate-600">
          Все заявки на бронирование, оставленные с сайта.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          Загрузка…
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="text-lg font-medium text-slate-800">Заявок пока нет</div>
          <div className="mt-1 text-sm text-slate-500">
            Когда посетитель заполнит форму на сайте, заявка появится здесь.
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((b) => {
            const isNew = b.status === "new";
            return (
              <Card key={b.id} className={`p-5 ${isNew ? "" : "opacity-70"}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-slate-900">
                        {b.name}
                      </span>
                      {isNew ? (
                        <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800">
                          Новая
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          Обработана
                        </span>
                      )}
                    </div>
                    <div className="grid gap-1 text-sm text-slate-700 sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" /> {b.phone}
                      </div>
                      {b.subject && (
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-slate-400" />
                          {b.subject}
                        </div>
                      )}
                      {b.dates && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" /> {b.dates}
                        </div>
                      )}
                      {typeof b.guests === "number" && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-slate-400" /> Гостей: {b.guests}
                        </div>
                      )}
                    </div>
                    {b.comment && (
                      <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                        {b.comment}
                      </div>
                    )}
                    <div className="text-xs text-slate-400">
                      {new Date(b.createdAt).toLocaleString("ru-RU")}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {isNew && (
                      <Button variant="primary" onClick={() => markProcessed(b)}>
                        <CheckCircle2 className="h-4 w-4" />
                        Отметить обработанной
                      </Button>
                    )}
                    <Button variant="danger-outline" onClick={() => setConfirmDelete(b)}>
                      Удалить
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title={`Удалить заявку от ${confirmDelete?.name ?? ""}?`}
        description="Заявка будет удалена без возможности восстановления."
        onConfirm={async () => {
          if (!confirmDelete) return;
          try {
            await api.bookings.remove(confirmDelete.id);
            toast.success("Заявка удалена");
          } catch {
            toast.error("Не удалось удалить. Попробуйте ещё раз");
          } finally {
            setConfirmDelete(null);
            refresh();
          }
        }}
        onCancel={() => setConfirmDelete(null)}
      />
    </AdminShell>
  );
}
