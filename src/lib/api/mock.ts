// Mock API backed by localStorage. Mirrors REST endpoints in src/lib/api/index.ts.
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

const DB_KEY = "gb.admin.mockdb.v2";
const DEMO_EMAIL = "admin@golubaya-buhta.ru";
const DEMO_PASSWORD = "admin123";

interface DB {
  cottages: Cottage[];
  services: Service[];
  prices: PriceRow[];
  gallery: GalleryImage[];
  bookings: Booking[];
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
      {
        id: uid(),
        slug: "townhouse-3-1",
        title: "Таунхаус №3, блок 1",
        kind: "townhouse",
        tagline: "Уютный блок таунхауса",
        description: "Комфортный блок в общем корпусе с сауной.",
        price: 19000,
        priceUnit: "/ блок / сутки",
        capacity: 4,
        bedrooms: 2,
        hasSauna: true,
        hasGrill: false,
        images: [],
        included: ["Сауна", "Кухня", "Мангальная зона на территории"],
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
    bookings: [],
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
    const parsed = JSON.parse(raw) as DB;
    if (!parsed.bookings) parsed.bookings = [];
    return parsed;
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

function makeCrud<K extends keyof DB>(key: K) {
  type T = any;
  const read = (): T[] => load()[key] as unknown as T[];
  const write = (next: T[]) => {
    const db = load();
    (db[key] as unknown as T[]) = next;
    save(db);
  };
  return {
    async list(params?: ListParams): Promise<T[]> {
      let items = read();
      if (params?.category) items = items.filter((i) => i.category === params.category);
      if (params?.published !== undefined)
        items = items.filter((i) => i.published === params.published);
      return delay(sortByOrder(items));
    },
    async get(id: string): Promise<T | null> {
      return delay(read().find((i) => i.id === id) ?? null);
    },
    async create(input: Omit<T, "id">): Promise<T> {
      const item = { ...(input as object), id: uid() } as T;
      write([...read(), item]);
      return delay(item);
    },
    async update(id: string, patch: Partial<T>): Promise<T> {
      const next = read().map((i) => (i.id === id ? { ...i, ...patch } : i));
      write(next);
      return delay(next.find((i) => i.id === id));
    },
    async remove(id: string): Promise<void> {
      write(read().filter((i) => i.id !== id));
      return delay(undefined);
    },
    async reorder(orderedIds: string[]): Promise<void> {
      write(
        read().map((i) => {
          const idx = orderedIds.indexOf(i.id);
          return idx >= 0 ? { ...i, sortOrder: idx + 1 } : i;
        }),
      );
      return delay(undefined);
    },
  };
}

export const mockCottages = makeCrud("cottages");
export const mockServices = makeCrud("services");
export const mockPrices = makeCrud("prices");
export const mockGallery = makeCrud("gallery");
export const mockBookings = makeCrud("bookings");

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
