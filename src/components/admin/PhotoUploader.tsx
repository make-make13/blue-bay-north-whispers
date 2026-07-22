// Friendly photo uploader — drag & drop, main photo badge, reorder, replace, remove.
// URLs are handled through api.uploads so the user never sees a link.
import { useRef, useState } from "react";
import { ImagePlus, Star, Trash2, ArrowLeft, ArrowRight, Replace } from "lucide-react";

import { api } from "../../lib/api";
import { Button } from "./ui";

export function PhotoUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceIdx, setReplaceIdx] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function ingest(files: FileList | File[] | null) {
    if (!files) return;
    const list = Array.from(files);
    if (list.length === 0) return;
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const f of list) {
        if (!f.type.startsWith("image/")) continue;
        const { url } = await api.uploads.upload(f);
        urls.push(url);
      }
      onChange([...value, ...urls]);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function replace(files: FileList | null) {
    if (replaceIdx == null || !files || files[0] == null) return;
    setBusy(true);
    try {
      const { url } = await api.uploads.upload(files[0]);
      const next = [...value];
      next[replaceIdx] = url;
      onChange(next);
    } finally {
      setBusy(false);
      setReplaceIdx(null);
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  }

  function move(idx: number, dir: -1 | 1) {
    const swap = idx + dir;
    if (swap < 0 || swap >= value.length) return;
    const next = [...value];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    onChange(next);
  }

  function makeMain(idx: number) {
    if (idx === 0) return;
    const next = [...value];
    const [item] = next.splice(idx, 1);
    next.unshift(item);
    onChange(next);
  }

  function remove(idx: number) {
    const url = value[idx];
    api.uploads.remove(url).catch(() => undefined);
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          ingest(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition ${
          dragOver ? "border-teal-500 bg-teal-50" : "border-slate-300 bg-slate-50"
        }`}
      >
        <div className="rounded-full bg-white p-3 shadow-sm">
          <ImagePlus className="h-6 w-6 text-teal-600" />
        </div>
        <div className="text-base font-medium text-slate-800">
          Перетащите фотографии сюда
        </div>
        <div className="text-sm text-slate-500">или</div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => ingest(e.target.files)}
        />
        <input
          ref={replaceInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => replace(e.target.files)}
        />
        <Button
          type="button"
          variant="primary"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Загружаем…" : "Выбрать фотографии"}
        </Button>
        <p className="mt-1 text-xs text-slate-500">JPG или PNG, до 10 МБ</p>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((url, i) => (
            <div
              key={url + i}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[16/10] bg-slate-100">
                <img src={url} alt="" className="h-full w-full object-cover" />
                {i === 0 && (
                  <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-slate-800 shadow">
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    Главная фотография
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1 p-2">
                <div className="flex gap-1">
                  <button
                    type="button"
                    title="Переместить левее"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    title="Переместить правее"
                    onClick={() => move(i, 1)}
                    disabled={i === value.length - 1}
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex gap-1">
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => makeMain(i)}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-50"
                    >
                      <Star className="h-3.5 w-3.5" />
                      Сделать главной
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setReplaceIdx(i);
                      replaceInputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    <Replace className="h-3.5 w-3.5" />
                    Заменить
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
