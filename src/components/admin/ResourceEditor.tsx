// Shared list-editor scaffolding: table with reorder + publish toggle + delete,
// plus a slide-in form panel. Kept intentionally simple — good enough for
// content editing, not a full DnD grid.

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { Button, Card, Toolbar } from "./ui";

export interface Resource {
  id: string;
  title?: string;
  label?: string;
  published?: boolean;
  sortOrder: number;
}

export interface ResourceCrud<T extends Resource> {
  list(): Promise<T[]>;
  create(input: Omit<T, "id">): Promise<T>;
  update(id: string, patch: Partial<T>): Promise<T>;
  remove(id: string): Promise<void>;
  reorder(ids: string[]): Promise<void>;
}

interface Props<T extends Resource> {
  crud: ResourceCrud<T>;
  empty: Omit<T, "id">;
  renderRow: (item: T) => ReactNode;
  renderForm: (state: {
    value: Omit<T, "id"> | T;
    setValue: (v: Omit<T, "id"> | T) => void;
  }) => ReactNode;
  addLabel?: string;
  supportsPublish?: boolean;
}

export function ResourceEditor<T extends Resource>({
  crud,
  empty,
  renderRow,
  renderForm,
  addLabel = "Добавить",
  supportsPublish = true,
}: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Omit<T, "id"> | T | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await crud.list());
    } finally {
      setLoading(false);
    }
  }, [crud]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function togglePublish(item: T) {
    await crud.update(item.id, { published: !item.published } as Partial<T>);
    refresh();
  }

  async function remove(item: T) {
    if (!confirm(`Удалить «${item.title ?? item.label ?? item.id}»?`)) return;
    await crud.remove(item.id);
    refresh();
  }

  async function move(item: T, dir: -1 | 1) {
    const idx = items.findIndex((i) => i.id === item.id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const next = [...items];
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    setItems(next);
    await crud.reorder(next.map((i) => i.id));
  }

  async function submit() {
    if (!editing) return;
    setSaving(true);
    try {
      if ("id" in editing && editing.id) {
        const { id, ...rest } = editing as T;
        await crud.update(id, rest as Partial<T>);
      } else {
        await crud.create(editing);
      }
      setEditing(null);
      refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Toolbar>
        <Button
          onClick={() =>
            setEditing({ ...(empty as object), sortOrder: items.length + 1 } as Omit<T, "id">)
          }
        >
          {addLabel}
        </Button>
        <Button variant="ghost" onClick={refresh}>
          Обновить
        </Button>
      </Toolbar>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-neutral-500">Загрузка…</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-neutral-500">Пусто. Добавьте первую запись.</div>
        ) : (
          <ul className="divide-y divide-neutral-800">
            {items.map((item, idx) => (
              <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex flex-col text-neutral-500">
                  <button
                    className="rounded px-1 text-xs hover:text-white disabled:opacity-30"
                    disabled={idx === 0}
                    onClick={() => move(item, -1)}
                    title="Выше"
                  >
                    ▲
                  </button>
                  <button
                    className="rounded px-1 text-xs hover:text-white disabled:opacity-30"
                    disabled={idx === items.length - 1}
                    onClick={() => move(item, 1)}
                    title="Ниже"
                  >
                    ▼
                  </button>
                </div>
                <div className="min-w-0 flex-1">{renderRow(item)}</div>
                {supportsPublish && (
                  <button
                    onClick={() => togglePublish(item)}
                    className={`rounded-full px-3 py-1 text-xs ${
                      item.published
                        ? "bg-teal-500/15 text-teal-300"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {item.published ? "Опубликовано" : "Скрыто"}
                  </button>
                )}
                <Button variant="ghost" onClick={() => setEditing(item)}>
                  Изменить
                </Button>
                <Button variant="danger" onClick={() => remove(item)}>
                  Удалить
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/60">
          <div className="flex w-full max-w-xl flex-col border-l border-neutral-800 bg-neutral-950">
            <header className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
              <h2 className="text-base font-semibold text-white">
                {"id" in editing && editing.id ? "Редактирование" : "Новая запись"}
              </h2>
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Закрыть
              </Button>
            </header>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {renderForm({ value: editing, setValue: setEditing })}
            </div>
            <footer className="flex justify-end gap-2 border-t border-neutral-800 px-5 py-4">
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Отмена
              </Button>
              <Button onClick={submit} disabled={saving}>
                {saving ? "Сохраняем…" : "Сохранить"}
              </Button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
