import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Trees,
  BedDouble,
  Sparkles,
  Tag,
  Images,
  FileText,
  Inbox,
  Settings as SettingsIcon,
  ArrowRight,
  Plus,
  ImagePlus,
  Type,
  PenLine,
} from "lucide-react";

import { AdminShell } from "../components/admin/AdminShell";
import { api } from "../lib/api";

export const Route = createFileRoute("/admin/")({
  component: AdminIndex,
});

interface Counts {
  cottages: number;
  rooms: number;
  services: number;
  prices: number;
  gallery: number;
  bookings: number;
}

function AdminIndex() {
  const [c, setC] = useState<Counts>({
    cottages: 0,
    rooms: 0,
    services: 0,
    prices: 0,
    gallery: 0,
    bookings: 0,
  });

  useEffect(() => {
    (async () => {
      const [cot, srv, prc, gal, bkg] = await Promise.all([
        api.cottages.list(),
        api.services.list(),
        api.prices.list(),
        api.gallery.list(),
        api.bookings.list(),
      ]);
      setC({
        cottages: cot.filter((x) => x.kind === "cottage").length,
        rooms: cot.filter((x) => x.kind === "townhouse").length,
        services: srv.length,
        prices: prc.length,
        gallery: gal.length,
        bookings: bkg.filter((b) => b.status === "new").length,
      });
    })();
  }, []);

  const sections = [
    { to: "/admin/cottages", label: "Коттеджи", desc: "Отдельные дома с сауной и мангалом", count: c.cottages, icon: Trees },
    { to: "/admin/rooms", label: "Номера", desc: "Блоки таунхауса", count: c.rooms, icon: BedDouble },
    { to: "/admin/services", label: "Услуги", desc: "Баня, купель, активности", count: c.services, icon: Sparkles },
    { to: "/admin/prices", label: "Цены", desc: "Быстрое изменение стоимости", count: c.prices, icon: Tag },
    { to: "/admin/gallery", label: "Фотографии", desc: "Общая галерея сайта", count: c.gallery, icon: Images },
    { to: "/admin/texts", label: "Тексты на сайте", desc: "Заголовки и описания", icon: FileText },
    { to: "/admin/bookings", label: "Заявки", desc: "Новые запросы с сайта", count: c.bookings, icon: Inbox },
    { to: "/admin/settings", label: "Контакты и настройки", desc: "Телефон, адрес, Telegram", icon: SettingsIcon },
  ];

  const quick = [
    { to: "/admin/prices", label: "Изменить цену", icon: Tag },
    { to: "/admin/gallery", label: "Добавить фотографию", icon: ImagePlus },
    { to: "/admin/texts", label: "Изменить текст", icon: Type },
    { to: "/admin/services", label: "Добавить услугу", icon: PenLine },
  ];

  return (
    <AdminShell title="Главная" subtitle="Главная">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Здравствуйте! Что вы хотите изменить на сайте?
        </h2>
        <p className="mt-2 text-base text-slate-600">
          Выберите нужный раздел ниже или воспользуйтесь быстрыми действиями.
        </p>
      </div>

      <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quick.map((q) => {
          const Icon = q.icon;
          return (
            <Link
              key={q.to}
              to={q.to}
              className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-400 hover:shadow-md"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-700">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 text-sm font-medium text-slate-800">{q.label}</div>
              <Plus className="h-4 w-4 text-slate-400 transition group-hover:text-teal-600" />
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.to}
              to={s.to}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-teal-700">
                  <Icon className="h-6 w-6" />
                </div>
                {typeof s.count === "number" && (
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    {s.count}
                  </div>
                )}
              </div>
              <div className="text-xl font-semibold text-slate-900">{s.label}</div>
              <div className="mt-1 text-sm text-slate-600">{s.desc}</div>
              <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-teal-700 group-hover:text-teal-800">
                Открыть <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </AdminShell>
  );
}
