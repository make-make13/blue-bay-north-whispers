import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AdminShell } from "../components/admin/AdminShell";
import { Card } from "../components/admin/ui";
import { api } from "../lib/api";

export const Route = createFileRoute("/admin/")({
  component: AdminIndex,
});

interface Stat {
  label: string;
  value: number;
  href: string;
}

function AdminIndex() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    (async () => {
      const [cottages, services, prices, gallery] = await Promise.all([
        api.cottages.list(),
        api.services.list(),
        api.prices.list(),
        api.gallery.list(),
      ]);
      setStats([
        { label: "Коттеджи", value: cottages.length, href: "/admin/cottages" },
        { label: "Услуги", value: services.length, href: "/admin/services" },
        { label: "Цены", value: prices.length, href: "/admin/prices" },
        { label: "Фотографии", value: gallery.length, href: "/admin/gallery" },
      ]);
    })();
  }, []);

  return (
    <AdminShell title="Обзор">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.href}
            className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-5 transition hover:border-teal-400/60"
          >
            <div className="text-xs uppercase tracking-widest text-neutral-500">{s.label}</div>
            <div className="mt-2 text-3xl font-semibold text-white">{s.value}</div>
          </Link>
        ))}
      </div>
      <Card className="mt-6 p-5 text-sm text-neutral-300">
        <div className="mb-2 font-semibold text-white">Как это устроено</div>
        <ul className="list-disc space-y-1 pl-5 text-neutral-400">
          <li>
            Все данные админпанели читаются и пишутся через единый клиент{" "}
            <code className="rounded bg-neutral-800 px-1">src/lib/api</code>.
          </li>
          <li>
            Пока не задана переменная <code>VITE_API_URL</code>, используется mock-хранилище в
            localStorage.
          </li>
          <li>
            После установки <code>VITE_API_URL</code> запросы автоматически уходят на реальный REST
            API (PHP+MySQL или Node+Postgres).
          </li>
        </ul>
      </Card>
    </AdminShell>
  );
}
