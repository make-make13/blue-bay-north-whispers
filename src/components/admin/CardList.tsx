// Shared building blocks for admin CRUD pages: list card, editor layout,
// item card grid. Kept small and dependency-free.
import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff, MoreVertical, Pencil, Trash2, ExternalLink } from "lucide-react";

import { Button, StatusPill } from "./ui";

export function ItemCard({
  cover,
  title,
  subtitle,
  price,
  visible,
  onEdit,
  onToggleVisible,
  onDelete,
  publicUrl,
}: {
  cover?: string;
  title: string;
  subtitle?: string;
  price?: string;
  visible: boolean;
  onEdit: () => void;
  onToggleVisible: () => void;
  onDelete: () => void;
  publicUrl?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[16/10] bg-slate-100">
        {cover ? (
          <img src={cover} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
            Нет фотографии
          </div>
        )}
        <div className="absolute right-2 top-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/95 text-slate-700 shadow hover:bg-white"
              aria-label="Действия"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-11 z-10 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                <button
                  type="button"
                  onMouseDown={onToggleVisible}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-800 hover:bg-slate-50"
                >
                  {visible ? (
                    <>
                      <EyeOff className="h-4 w-4" /> Скрыть с сайта
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" /> Показать на сайте
                    </>
                  )}
                </button>
                {publicUrl && (
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-800 hover:bg-slate-50"
                  >
                    <ExternalLink className="h-4 w-4" /> Посмотреть на сайте
                  </a>
                )}
                <button
                  type="button"
                  onMouseDown={onDelete}
                  className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-3 text-left text-sm text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" /> Удалить
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="text-lg font-semibold text-slate-900">{title}</div>
          {subtitle && (
            <div className="mt-0.5 line-clamp-2 text-sm text-slate-600">{subtitle}</div>
          )}
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            {price && <div className="text-base font-semibold text-slate-900">{price}</div>}
            <div className="mt-1">
              <StatusPill visible={visible} />
            </div>
          </div>
          <Button variant="primary" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
            Изменить
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ListToolbar({
  addLabel,
  onAdd,
  search,
  onSearchChange,
}: {
  addLabel: string;
  onAdd: () => void;
  search: string;
  onSearchChange: (s: string) => void;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Найти по названию"
          className="w-full max-w-md rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/40"
        />
      </div>
      <Button variant="primary" size="lg" onClick={onAdd}>
        + {addLabel}
      </Button>
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  actionLabel,
  onAction,
}: {
  title: string;
  hint?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <div className="text-lg font-medium text-slate-800">{title}</div>
      {hint && <div className="mt-1 text-sm text-slate-500">{hint}</div>}
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button variant="primary" size="lg" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export function EditorLayout({
  title,
  backTo,
  onSave,
  onCancel,
  onDelete,
  deleteLabel,
  saving,
  dirty,
  children,
}: {
  title: string;
  backTo: string;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  deleteLabel?: string;
  saving?: boolean;
  dirty?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={backTo}
            className="text-sm text-slate-500 hover:text-slate-800"
          >
            ← Назад к списку
          </Link>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">{title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="lg" onClick={onCancel}>
            Отмена
          </Button>
          <Button variant="primary" size="lg" onClick={onSave} disabled={saving}>
            {saving ? "Сохраняем…" : "Сохранить изменения"}
          </Button>
        </div>
      </div>

      {dirty && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          У вас есть несохранённые изменения — не забудьте нажать «Сохранить».
        </div>
      )}

      <div className="space-y-6">{children}</div>

      {onDelete && (
        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50/40 p-6">
          <div className="mb-2 text-base font-semibold text-red-800">Опасная зона</div>
          <div className="mb-4 text-sm text-red-700">
            После удаления объект исчезнет с сайта. Это действие нельзя отменить.
          </div>
          <Button variant="danger-outline" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
            {deleteLabel ?? "Удалить"}
          </Button>
        </div>
      )}
    </div>
  );
}

// Editable list of short text lines (used for "Что входит", "Примечания").
export function StringList({
  value,
  onChange,
  addLabel = "Добавить пункт",
  placeholder = "Например: Сауна",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  addLabel?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      {value.map((line, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={line}
            onChange={(e) => {
              const next = [...value];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/40"
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="rounded-xl border border-slate-300 bg-white p-3 text-slate-500 hover:bg-red-50 hover:text-red-600"
            aria-label="Удалить пункт"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        + {addLabel}
      </button>
    </div>
  );
}
