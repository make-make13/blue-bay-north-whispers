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
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-neutral-100">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-900/70 p-8 shadow-lg"
      >
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-neutral-500">Админпанель</div>
          <h1 className="mt-1 text-xl font-semibold">Голубая Бухта</h1>
        </div>
        <div className="space-y-4">
          <Field label="Email">
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
            <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Входим…" : "Войти"}
          </Button>
        </div>
        {USE_MOCK && (
          <p className="mt-6 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-300">
            Демо-режим (mock API). Логин: <b>{DEMO_CREDENTIALS.email}</b>, пароль:{" "}
            <b>{DEMO_CREDENTIALS.password}</b>
          </p>
        )}
      </form>
    </div>
  );
}
