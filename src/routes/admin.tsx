import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AuthProvider } from "../lib/auth/AuthContext";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Админпанель — Голубая Бухта" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminRoot,
});

function AdminRoot() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
