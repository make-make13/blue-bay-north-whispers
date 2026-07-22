import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import {
  Home,
  Trees,
  BedDouble,
  Sparkles,
  Tag,
  Images,
  FileText,
  Inbox,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../../lib/auth/AuthContext";

const NAV: { to: string; label: string; icon: typeof Home; exact?: boolean }[] = [
  { to: "/admin", label: "Главная", icon: Home, exact: true },
  { to: "/admin/cottages", label: "Коттеджи", icon: Trees },
  { to: "/admin/rooms", label: "Номера", icon: BedDouble },
  { to: "/admin/services", label: "Услуги", icon: Sparkles },
  { to: "/admin/prices", label: "Цены", icon: Tag },
  { to: "/admin/gallery", label: "Фотографии", icon: Images },
  { to: "/admin/texts", label: "Тексты", icon: FileText },
  { to: "/admin/bookings", label: "Заявки", icon: Inbox },
  { to: "/admin/settings", label: "Настройки", icon: SettingsIcon },
];

export function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/admin/login", replace: true });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">
        Загрузка…
      </div>
    );
  }

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact
      ? pathname === item.to
      : pathname === item.to || pathname.startsWith(item.to + "/");

  const Sidebar = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-5">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-600 text-white">
          <span className="text-lg font-bold">ГБ</span>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">Голубая Бухта</div>
          <div className="text-xs text-slate-500">Панель управления</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-teal-50 text-teal-800"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${active ? "text-teal-600" : "text-slate-500"}`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 p-3">
        <div className="mb-2 truncate px-2 text-xs text-slate-500">{user.email}</div>
        <button
          type="button"
          onClick={async () => {
            await logout();
            navigate({ to: "/admin/login", replace: true });
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          <LogOut className="h-5 w-5 text-slate-500" />
          Выйти
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 md:block">
        {Sidebar}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-slate-200 bg-white shadow-xl">
            {Sidebar}
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Меню"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="min-w-0">
              <div className="truncate text-sm text-slate-500">
                {subtitle ?? "Панель управления"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              <ExternalLink className="h-4 w-4" />
              Посмотреть сайт
            </a>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
          <h1 className="sr-only">{title}</h1>
          {children}
        </div>
      </main>

      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: { fontSize: 15 },
        }}
      />
      {mobileOpen && (
        <button
          className="sr-only"
          onClick={() => setMobileOpen(false)}
          aria-label="Закрыть меню"
        >
          <X className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
