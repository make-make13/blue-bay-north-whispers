import { createFileRoute } from "@tanstack/react-router";

import { AdminShell } from "../components/admin/AdminShell";
import { ResourceEditor } from "../components/admin/ResourceEditor";
import { Field, TextInput } from "../components/admin/ui";
import { ImageListEditor } from "../components/admin/ImageListEditor";
import { api } from "../lib/api";
import type { GalleryImage } from "../lib/api/types";

export const Route = createFileRoute("/admin/gallery")({
  component: GalleryAdmin,
});

const empty: Omit<GalleryImage, "id"> = {
  url: "",
  alt: "",
  category: "general",
  sortOrder: 0,
};

function GalleryAdmin() {
  return (
    <AdminShell title="Галерея">
      <ResourceEditor<GalleryImage>
        crud={api.gallery as any}
        empty={empty}
        supportsPublish={false}
        addLabel="Добавить фото"
        renderRow={(item) => (
          <div className="flex items-center gap-3">
            {item.url ? (
              <img src={item.url} alt="" className="h-12 w-16 rounded object-cover" />
            ) : (
              <div className="flex h-12 w-16 items-center justify-center rounded bg-neutral-800 text-xs text-neutral-500">
                нет
              </div>
            )}
            <div>
              <div className="text-sm text-white">{item.alt || "(без описания)"}</div>
              <div className="text-xs text-neutral-500">{item.category}</div>
            </div>
          </div>
        )}
        renderForm={({ value, setValue }) => {
          const v = value as GalleryImage;
          const set = (patch: Partial<GalleryImage>) => setValue({ ...v, ...patch });
          return (
            <>
              <Field label="Категория" hint="например: cottage-1, banya, transfer">
                <TextInput
                  value={v.category}
                  onChange={(e) => set({ category: e.target.value })}
                />
              </Field>
              <Field label="Alt-текст">
                <TextInput value={v.alt ?? ""} onChange={(e) => set({ alt: e.target.value })} />
              </Field>
              <Field label="Файл">
                <ImageListEditor
                  value={v.url ? [v.url] : []}
                  onChange={(urls) => set({ url: urls[0] ?? "" })}
                />
              </Field>
            </>
          );
        }}
      />
    </AdminShell>
  );
}
