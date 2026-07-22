import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AdminShell } from "../components/admin/AdminShell";
import { Button, Card, Field, TextArea, TextInput } from "../components/admin/ui";
import { api } from "../lib/api";
import type { SiteSettings } from "../lib/api/types";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const [value, setValue] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.settings.get().then(setValue);
  }, []);

  async function save() {
    if (!value) return;
    setSaving(true);
    try {
      const next = await api.settings.update(value);
      setValue(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (!value) {
    return (
      <AdminShell title="Настройки">
        <div className="text-sm text-neutral-500">Загрузка…</div>
      </AdminShell>
    );
  }

  const set = (patch: Partial<SiteSettings>) => setValue({ ...value, ...patch });

  return (
    <AdminShell title="Настройки сайта">
      <Card className="max-w-2xl space-y-4 p-6">
        <Field label="Название">
          <TextInput value={value.siteName} onChange={(e) => set({ siteName: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Телефон">
            <TextInput value={value.phone} onChange={(e) => set({ phone: e.target.value })} />
          </Field>
          <Field label="Telegram">
            <TextInput
              value={value.telegram}
              onChange={(e) => set({ telegram: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Адрес">
          <TextInput value={value.address} onChange={(e) => set({ address: e.target.value })} />
        </Field>
        <Field label="Заголовок Hero">
          <TextInput
            value={value.heroTitle}
            onChange={(e) => set({ heroTitle: e.target.value })}
          />
        </Field>
        <Field label="Описание Hero">
          <TextArea
            rows={3}
            value={value.heroDescription}
            onChange={(e) => set({ heroDescription: e.target.value })}
          />
        </Field>
        <Field label="Примечание к заявкам">
          <TextArea
            rows={2}
            value={value.bookingNote}
            onChange={(e) => set({ bookingNote: e.target.value })}
          />
        </Field>
        <div className="flex items-center gap-3 pt-2">
          <Button onClick={save} disabled={saving}>
            {saving ? "Сохраняем…" : "Сохранить"}
          </Button>
          {saved && <span className="text-sm text-teal-300">Сохранено</span>}
        </div>
      </Card>
    </AdminShell>
  );
}
