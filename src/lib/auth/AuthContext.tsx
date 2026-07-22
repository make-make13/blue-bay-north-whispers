// Client-side auth state. Only a bearer token + non-secret user info are
// stored in localStorage. No passwords, admin flags or role checks are
// trusted from the client — the server MUST re-verify on every request.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { api } from "../api";
import { getToken, setToken } from "../api/client";
import type { AuthUser, LoginPayload } from "../api/types";

const USER_KEY = "gb.admin.user";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

function loadUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function saveUser(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const cached = loadUser();
    if (!token) {
      setLoading(false);
      return;
    }
    if (cached) setUser(cached);
    // Re-validate against the server; on failure clear session.
    api.auth
      .me()
      .then((u) => {
        setUser(u);
        saveUser(u);
      })
      .catch(() => {
        setToken(null);
        saveUser(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const session = await api.auth.login(payload);
    setToken(session.token);
    saveUser(session.user);
    setUser(session.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch {
      /* ignore network errors on logout */
    }
    setToken(null);
    saveUser(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
