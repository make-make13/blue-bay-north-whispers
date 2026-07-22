import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { useAuth } from "../../lib/auth/AuthContext";
import { USE_MOCK } from "../../lib/api";

const NAV = [
  { to: "/admin", label: "Обзор", exact: true },
  { to: "/admin/cottages", label: "Коттеджи" },
  { to: "/admin/services", label: "Услуги" },
  { to: "/admin/prices", label: "Цены" },
  { to: "/admin/gallery", label: "Галерея" },
  { to: "/admin/settings", label: "Настройки" },
] as const;

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/admin/login", replace: true });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-400">
        Загрузка…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-neutral-800 bg-neutral-900 md:flex">
        <div className="border-b border-neutral-800 px-5 py-5">
          <div className="text-xs uppercase tracking-widest text-neutral-500">Админпанель</div>
          <div className="mt-1 text-base font-semibold">Голубая Бухта</div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`block rounded-md px-3 py-2 text-sm transition ${
                  active
                    ? "bg-teal-500/15 text-teal-300"
                    : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-neutral-800 p-3 text-xs text-neutral-500">
          <div className="mb-2 truncate">{user.email}</div>
          <button
            type="button"
            onClick={async () => {
              await logout();
              navigate({ to: "/admin/login", replace: true });
            }}
            className="w-full rounded-md border border-neutral-700 px-3 py-2 text-sm text-neutral-200 hover:border-neutral-500 hover:text-white"
          >
            Выйти
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/70 px-6 py-4">
          <h1 className="text-lg font-semibold">{title}</h1>
          {USE_MOCK && (
            <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
              Mock API — данные хранятся локально
            </span>
          )}
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
