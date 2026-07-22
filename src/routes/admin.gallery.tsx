import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { AdminShell } from "../components/admin/AdminShell";
import { PhotoUploader } from "../components/admin/PhotoUploader";
import { Card, SectionBlock } from "../components/admin/ui";
import { ConfirmDialog } from "../components/admin/ConfirmDialog";
import { api } from "../lib/api";
import type { GalleryImage } from "../lib/api/types";

export const Route = createFileRoute("/admin/gallery")({
  component: GalleryAdmin,
});

function GalleryAdmin() {
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<GalleryImage | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      setItems(await api.gallery.list());
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);

  async function onAdd(urls: string[]) {
    // Uploader gives back an updated list — treat additions as new items.
    const known = new Set(items.map((i) => i.url));
    const added = urls.filter((u) => !known.has(u));
    for (const url of added) {
      await api.gallery.create({
        url,
        alt: "",
        category: "general",
        sortOrder: items.length + 1,
      });
    }
    if (added.length) toast.success("Фотография добавлена");
    refresh();
  }

  return (
    <AdminShell title="Фотографии" subtitle="Фотографии">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-slate-900">Фотографии</h2>
        <p className="mt-1 text-base text-slate-600">
          Общая галерея сайта. Для фотографий конкретного коттеджа или услуги —
          откройте нужный объект и добавьте фотографии там.
        </p>
      </div>

      <SectionBlock
        title="Загрузить новые фотографии"
        description="Перетащите файлы в область ниже или нажмите «Выбрать фотографии»."
      >
        <PhotoUploader
          value={items.map((i) => i.url)}
          onChange={onAdd}
        />
      </SectionBlock>

      {loading ? null : items.length > 0 && (
        <Card className="mt-6 p-6">
          <div className="mb-4 text-lg font-semibold text-slate-900">
            В галерее сейчас — {items.length}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((img) => (
              <div
                key={img.id}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <img src={img.url} alt={img.alt ?? ""} className="aspect-[4/3] w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setConfirmDelete(img)}
                  className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-lg bg-white/95 px-2 py-1 text-xs font-medium text-red-600 opacity-0 shadow transition group-hover:opacity-100 hover:bg-white"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Удалить фотографию?"
        description="Она перестанет отображаться на сайте. Это действие нельзя отменить."
        onConfirm={async () => {
          if (!confirmDelete) return;
          try {
            await api.gallery.remove(confirmDelete.id);
            toast.success("Фотография удалена");
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
