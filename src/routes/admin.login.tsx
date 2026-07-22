import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useAuth } from "../lib/auth/AuthContext";
import { DEMO_CREDENTIALS, USE_MOCK } from "../lib/api";
import { Button, Field, TextInput } from "../components/admin/ui";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/admin", replace: true });
  }, [user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось войти");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-900">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-600 text-white">
            <span className="text-lg font-bold">ГБ</span>
          </div>
          <div>
            <div className="text-lg font-semibold">Голубая Бухта</div>
            <div className="text-sm text-slate-500">Вход в панель управления</div>
          </div>
        </div>
        <div className="space-y-4">
          <Field label="Электронная почта">
            <TextInput
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field label="Пароль">
            <TextInput
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}
          <Button type="submit" size="lg" disabled={submitting} className="w-full">
            {submitting ? "Входим…" : "Войти"}
          </Button>
        </div>
        {USE_MOCK && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <div className="font-medium">Демонстрационный доступ</div>
            <div className="mt-1">
              Логин: <b>{DEMO_CREDENTIALS.email}</b>
              <br />
              Пароль: <b>{DEMO_CREDENTIALS.password}</b>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
