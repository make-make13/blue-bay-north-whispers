import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";

import { AdminShell } from "../components/admin/AdminShell";
import { Button, Field, SectionBlock, TextArea, TextInput } from "../components/admin/ui";
import { useDirtyState, useDraft, useUnsavedGuard } from "../components/admin/hooks";
import { api } from "../lib/api";
import type { SiteSettings } from "../lib/api/types";

export const Route = createFileRoute("/admin/texts")({
  component: TextsAdmin,
});

function TextsAdmin() {
  const [initial, setInitial] = useState<SiteSettings | null>(null);
  const [value, setValue, { dirty, reset }] = useDirtyState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  useDraft(value ? "texts" : null, value, setValue);
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
      <AdminShell title="Тексты" subtitle="Тексты на сайте">
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
    <AdminShell title="Тексты на сайте" subtitle="Тексты на сайте">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Тексты на сайте</h2>
          <p className="mt-1 text-base text-slate-600">
            Заголовки и описания, которые видят посетители сайта.
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

      <SectionBlock title="Главная страница" description="Первое, что видят посетители сайта">
        <Field label="Крупный заголовок" hint="Верхняя надпись на главной">
          <TextInput
            value={value.heroTitle}
            onChange={(e) => set({ heroTitle: e.target.value })}
          />
        </Field>
        <Field label="Описание под заголовком">
          <TextArea
            rows={3}
            value={value.heroDescription}
            onChange={(e) => set({ heroDescription: e.target.value })}
          />
        </Field>
        <a
          href="/#hero"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          <ExternalLink className="h-4 w-4" />
          Посмотреть, где находится этот текст
        </a>
      </SectionBlock>

      <SectionBlock title="Форма заявки" description="Текст рядом с формой бронирования">
        <Field label="Примечание к заявке" hint="Например: «Заявка не является мгновенным подтверждением»">
          <TextArea
            rows={2}
            value={value.bookingNote}
            onChange={(e) => set({ bookingNote: e.target.value })}
          />
        </Field>
        <a
          href="/#request"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          <ExternalLink className="h-4 w-4" />
          Посмотреть, где находится этот текст
        </a>
      </SectionBlock>

      <SectionBlock title="Название сайта">
        <Field label="Название">
          <TextInput
            value={value.siteName}
            onChange={(e) => set({ siteName: e.target.value })}
          />
        </Field>
      </SectionBlock>
    </AdminShell>
  );
}
