// Public API surface. Switches automatically between mock and REST backend
// based on VITE_API_URL. Endpoint contract:
//   POST   /auth/login              -> { token, user }
//   GET    /auth/me                 -> user
//   POST   /auth/logout             -> 204
//   GET    /cottages | POST | GET :id | PATCH :id | DELETE :id | POST /reorder
//   (same shape for /services, /prices, /gallery, /bookings)
//   GET    /settings                 | PATCH /settings
//   POST   /uploads (multipart)      -> { url }
//   DELETE /uploads                  (body: { url })

import { request } from "./client";
import * as mock from "./mock";
import type {
  AuthSession,
  Booking,
  Cottage,
  GalleryImage,
  ListParams,
  LoginPayload,
  PriceRow,
  Service,
  SiteSettings,
} from "./types";

const USE_MOCK = !import.meta.env.VITE_API_URL;

function qs(params?: ListParams): string {
  if (!params) return "";
  const s = new URLSearchParams();
  if (params.category) s.set("category", params.category);
  if (params.published !== undefined) s.set("published", String(params.published));
  const str = s.toString();
  return str ? `?${str}` : "";
}

function crud<T extends { id: string }>(base: string, mockImpl: any) {
  return {
    list: (params?: ListParams): Promise<T[]> =>
      USE_MOCK ? mockImpl.list(params) : request<T[]>(`${base}${qs(params)}`),
    get: (id: string): Promise<T | null> =>
      USE_MOCK ? mockImpl.get(id) : request<T>(`${base}/${id}`),
    create: (input: Omit<T, "id">): Promise<T> =>
      USE_MOCK ? mockImpl.create(input) : request<T>(base, { method: "POST", json: input }),
    update: (id: string, patch: Partial<T>): Promise<T> =>
      USE_MOCK
        ? mockImpl.update(id, patch)
        : request<T>(`${base}/${id}`, { method: "PATCH", json: patch }),
    remove: (id: string): Promise<void> =>
      USE_MOCK ? mockImpl.remove(id) : request<void>(`${base}/${id}`, { method: "DELETE" }),
    reorder: (ids: string[]): Promise<void> =>
      USE_MOCK
        ? mockImpl.reorder(ids)
        : request<void>(`${base}/reorder`, { method: "POST", json: { ids } }),
  };
}

export const api = {
  auth: {
    login: (payload: LoginPayload): Promise<AuthSession> =>
      USE_MOCK
        ? mock.mockAuth.login(payload)
        : request<AuthSession>("/auth/login", { method: "POST", json: payload }),
    me: (): Promise<AuthSession["user"]> =>
      USE_MOCK ? mock.mockAuth.me() : request<AuthSession["user"]>("/auth/me"),
    logout: (): Promise<void> =>
      USE_MOCK ? mock.mockAuth.logout() : request<void>("/auth/logout", { method: "POST" }),
  },
  cottages: crud<Cottage>("/cottages", mock.mockCottages),
  services: crud<Service>("/services", mock.mockServices),
  prices: crud<PriceRow>("/prices", mock.mockPrices),
  gallery: crud<GalleryImage>("/gallery", mock.mockGallery),
  bookings: crud<Booking>("/bookings", mock.mockBookings),
  settings: {
    get: (): Promise<SiteSettings> =>
      USE_MOCK ? mock.mockSettings.get() : request<SiteSettings>("/settings"),
    update: (patch: Partial<SiteSettings>): Promise<SiteSettings> =>
      USE_MOCK
        ? mock.mockSettings.update(patch)
        : request<SiteSettings>("/settings", { method: "PATCH", json: patch }),
  },
  uploads: {
    upload: (file: File): Promise<{ url: string }> => {
      if (USE_MOCK) return mock.mockUploads.upload(file);
      const fd = new FormData();
      fd.append("file", file);
      return request<{ url: string }>("/uploads", { method: "POST", body: fd });
    },
    remove: (url: string): Promise<void> =>
      USE_MOCK
        ? mock.mockUploads.remove(url)
        : request<void>("/uploads", { method: "DELETE", json: { url } }),
  },
};

export { USE_MOCK };
export const DEMO_CREDENTIALS = mock.MOCK_DEMO_CREDENTIALS;
export type * from "./types";
