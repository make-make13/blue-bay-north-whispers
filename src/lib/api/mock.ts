// Mock API backed by localStorage. Used while VITE_API_URL is not set so
// admin flows can be developed without a backend. Shape mirrors the future
// REST endpoints defined in src/lib/api/index.ts.

import type {
  AuthSession,
  Cottage,
  GalleryImage,
  ListParams,
  LoginPayload,
  PriceRow,
  Service,
  SiteSettings,
} from "./types";

const DB_KEY = "gb.admin.mockdb.v1";
const DEMO_EMAIL = "admin@golubaya-buhta.ru";
const DEMO_PASSWORD = "admin123";

interface DB {
  cottages: Cottage[];
  services: Service[];
  prices: PriceRow[];
  gallery: GalleryImage[];
  settings: SiteSettings;
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function seed(): DB {
  return {
    cottages: [
      {
        id: uid(),
        slug: "cottage-1",
        title: "Коттедж №1",
        kind: "cottage",
        tagline: "Панорамный вид на реку",
        description: "Двухэтажный коттедж с сауной и камином.",
        price: 18000,
        priceUnit: "/ сутки",
        capacity: 6,
        bedrooms: 3,
        hasSauna: true,
        hasGrill: true,
        images: [],
        included: ["Сауна", "Камин", "Мангальная зона", "Кухня"],
        published: true,
        sortOrder: 1,
      },
    ],
    services: [
      {
        id: uid(),
        slug: "banya",
        title: "Русская баня на дровах",
        category: "banya",
        description: "Классическая рубленая баня с парной и купелью.",
        images: [],
        prices: [{ label: "Час аренды", amount: 3500, unit: "₽/час" }],
        included: ["Веники по запросу", "Полотенца", "Чай"],
        notes: ["Минимальное бронирование — 2 часа."],
        published: true,
        sortOrder: 1,
      },
    ],
    prices: [
      {
        id: uid(),
        section: "transfer",
        label: "Мурманск → отель (минивэн)",
        amount: 4500,
        unit: "₽",
        sortOrder: 1,
      },
    ],
    gallery: [],
    settings: {
      siteName: "Голубая Бухта",
      phone: "+7 (900) 000-00-00",
      telegram: "@golubayabuhta",
      address: "Мурманская обл., р. Тулома, 40 км от Мурманска",
      heroTitle: "Голубая Бухта — отдых на природе с городским комфортом",
      heroDescription:
        "Загородный отель на берегу реки Тулома в 40 км от Мурманска.",
      bookingNote: "Заявка не является мгновенным подтверждением бронирования.",
    },
  };
}

function load(): DB {
  if (typeof window === "undefined") return seed();
  const raw = window.localStorage.getItem(DB_KEY);
  if (!raw) {
    const s = seed();
    window.localStorage.setItem(DB_KEY, JSON.stringify(s));
    return s;
  }
  try {
    return JSON.parse(raw) as DB;
  } catch {
    const s = seed();
    window.localStorage.setItem(DB_KEY, JSON.stringify(s));
    return s;
  }
}

function save(db: DB) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function delay<T>(v: T): Promise<T> {
  return new Promise((r) => setTimeout(() => r(v), 120));
}

function sortByOrder<T extends { sortOrder: number }>(arr: T[]): T[] {
  return [...arr].sort((a, b) => a.sortOrder - b.sortOrder);
}

// ---- Auth ----
export const mockAuth = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    if (payload.email !== DEMO_EMAIL || payload.password !== DEMO_PASSWORD) {
      throw new Error("Неверный email или пароль");
    }
    return delay({
      token: "mock-token-" + uid(),
      user: {
        id: "admin",
        email: DEMO_EMAIL,
        name: "Администратор",
        role: "admin" as const,
      },
    });
  },
  async me(): Promise<AuthSession["user"]> {
    return delay({
      id: "admin",
      email: DEMO_EMAIL,
      name: "Администратор",
      role: "admin" as const,
    });
  },
  async logout(): Promise<void> {
    return delay(undefined);
  },
};

// ---- Generic CRUD factory ----
function makeCrud<K extends keyof DB>(key: K) {
  type T = DB[K] extends Array<infer U> ? U : never;
  return {
    async list(params?: ListParams): Promise<T[]> {
      const db = load();
      let items = db[key] as unknown as T[];
      if (params?.category) {
        items = items.filter((i) => (i as any).category === params.category);
      }
      if (params?.published !== undefined) {
        items = items.filter((i) => (i as any).published === params.published);
      }
      return delay(sortByOrder(items as any));
    },
    async get(id: string): Promise<T | null> {
      const db = load();
      const items = db[key] as unknown as T[];
      return delay((items.find((i) => (i as any).id === id) ?? null) as T | null);
    },
    async create(input: Omit<T, "id">): Promise<T> {
      const db = load();
      const items = db[key] as unknown as T[];
      const item = { ...(input as any), id: uid() } as T;
      (db[key] as unknown as T[]) = [...items, item];
      save(db);
      return delay(item);
    },
    async update(id: string, patch: Partial<T>): Promise<T> {
      const db = load();
      const items = db[key] as unknown as T[];
      const next = items.map((i) => ((i as any).id === id ? { ...i, ...patch } : i));
      (db[key] as unknown as T[]) = next;
      save(db);
      return delay(next.find((i) => (i as any).id === id) as T);
    },
    async remove(id: string): Promise<void> {
      const db = load();
      const items = db[key] as unknown as T[];
      (db[key] as unknown as T[]) = items.filter((i) => (i as any).id !== id);
      save(db);
      return delay(undefined);
    },
    async reorder(orderedIds: string[]): Promise<void> {
      const db = load();
      const items = db[key] as unknown as T[];
      const next = items.map((i) => {
        const idx = orderedIds.indexOf((i as any).id);
        return idx >= 0 ? { ...i, sortOrder: idx + 1 } : i;
      });
      (db[key] as unknown as T[]) = next;
      save(db);
      return delay(undefined);
    },
  };
}

export const mockCottages = makeCrud("cottages");
export const mockServices = makeCrud("services");
export const mockPrices = makeCrud("prices");
export const mockGallery = makeCrud("gallery");

// ---- Settings ----
export const mockSettings = {
  async get(): Promise<SiteSettings> {
    return delay(load().settings);
  },
  async update(patch: Partial<SiteSettings>): Promise<SiteSettings> {
    const db = load();
    db.settings = { ...db.settings, ...patch };
    save(db);
    return delay(db.settings);
  },
};

// ---- Uploads ----
// Real backend returns { url }. In mock we store as data URLs.
export const mockUploads = {
  async upload(file: File): Promise<{ url: string }> {
    const url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    return { url };
  },
  async remove(_url: string): Promise<void> {
    return delay(undefined);
  },
};

export const MOCK_DEMO_CREDENTIALS = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
