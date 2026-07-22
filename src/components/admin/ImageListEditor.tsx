// Image list uploader — used for per-item galleries. Uploads via api.uploads
// so switching backends is transparent.

import { useRef, useState } from "react";

import { api } from "../../lib/api";
import { Button } from "./ui";

export function ImageListEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const f of Array.from(files)) {
        const { url } = await api.uploads.upload(f);
        urls.push(url);
      }
      onChange([...value, ...urls]);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function move(idx: number, dir: -1 | 1) {
    const swap = idx + dir;
    if (swap < 0 || swap >= value.length) return;
    const next = [...value];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {value.map((url, i) => (
          <div key={url + i} className="group relative overflow-hidden rounded-md border border-neutral-800 bg-neutral-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-24 w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/70 p-1 opacity-0 transition group-hover:opacity-100">
              <button
                type="button"
                onClick={() => move(i, -1)}
                className="rounded px-2 text-xs text-white hover:bg-white/10"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={() => {
                  api.uploads.remove(url).catch(() => undefined);
                  onChange(value.filter((_, idx) => idx !== i));
                }}
                className="rounded px-2 text-xs text-red-300 hover:bg-white/10"
              >
                Удалить
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                className="rounded px-2 text-xs text-white hover:bg-white/10"
              >
                ▶
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
        <Button
          variant="ghost"
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Загрузка…" : "Загрузить фото"}
        </Button>
      </div>
    </div>
  );
}
