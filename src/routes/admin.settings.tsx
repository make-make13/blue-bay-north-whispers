import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminShell } from "../components/admin/AdminShell";
import { Button, Field, SectionBlock, TextInput } from "../components/admin/ui";
import { useDirtyState, useDraft, useUnsavedGuard } from "../components/admin/hooks";
import { api } from "../lib/api";
import type { SiteSettings } from "../lib/api/types";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const [initial, setInitial] = useState<SiteSettings | null>(null);
  const [value, setValue, { dirty, reset }] = useDirtyState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  useDraft(value ? "settings" : null, value, setValue);
  useUnsavedGuard(dirty && !saving);

  useEffect(() => {
    api.settings.get().then((s) => {
      setInitial(s);
      reset(s);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!value || !initial) {
    return (
      <AdminShell title="Настройки" subtitle="Контакты и настройки">
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          Загрузка…
        </div>
      </AdminShell>
    );
  }

  const set = (patch: Partial<SiteSettings>) => setValue({ ...value, ...patch });

  async function save() {
    if (!value) return;
    setSaving(true);
    try {
      const next = await api.settings.update(value);
      reset(next);
      toast.success("Изменения сохранены и уже отображаются на сайте");
    } catch {
      toast.error("Не удалось сохранить изменения. Проверьте интернет и попробуйте ещё раз");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell title="Настройки" subtitle="Контакты и настройки">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Контакты и настройки</h2>
          <p className="mt-1 text-base text-slate-600">
            Контактные данные и общая информация об отеле.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => reset(initial)}>
            Отмена
          </Button>
          <Button variant="primary" size="lg" onClick={save} disabled={saving || !dirty}>
            {saving ? "Сохраняем…" : "Сохранить изменения"}
          </Button>
        </div>
      </div>

      {dirty && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          У вас есть несохранённые изменения — не забудьте нажать «Сохранить».
        </div>
      )}

      <SectionBlock title="Как с вами связаться">
        <Field label="Телефон" hint="Отображается в шапке сайта и в подвале">
          <TextInput
            value={value.phone}
            onChange={(e) => set({ phone: e.target.value })}
            placeholder="+7 (900) 000-00-00"
          />
        </Field>
        <Field label="Telegram" hint="Например: @golubayabuhta">
          <TextInput
            value={value.telegram}
            onChange={(e) => set({ telegram: e.target.value })}
          />
        </Field>
        <Field label="Адрес">
          <TextInput
            value={value.address}
            onChange={(e) => set({ address: e.target.value })}
          />
        </Field>
      </SectionBlock>
    </AdminShell>
  );
}
