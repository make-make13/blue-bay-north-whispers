// Domain types shared between mock API and real REST backend.
export type ID = string;

export interface AuthUser {
  id: ID;
  email: string;
  name: string;
  role: "admin" | "editor";
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface Cottage {
  id: ID;
  slug: string;
  title: string;
  kind: "cottage" | "townhouse";
  tagline?: string;
  description: string;
  price: number;
  priceUnit: string;
  capacity: number;
  bedrooms?: number;
  hasSauna?: boolean;
  hasGrill?: boolean;
  images: string[];
  included: string[];
  published: boolean;
  sortOrder: number;
}

export interface Service {
  id: ID;
  slug: string;
  title: string;
  category: "banya" | "summer" | "winter" | "extras" | "gift";
  description: string;
  cover?: string;
  images: string[];
  prices: { label: string; amount: number; unit?: string }[];
  included: string[];
  notes: string[];
  published: boolean;
  sortOrder: number;
}

export interface PriceRow {
  id: ID;
  section: string;
  label: string;
  amount: number;
  unit?: string;
  note?: string;
  sortOrder: number;
}

export interface GalleryImage {
  id: ID;
  url: string;
  alt?: string;
  category: string;
  sortOrder: number;
}

export interface SiteSettings {
  siteName: string;
  phone: string;
  telegram: string;
  address: string;
  heroTitle: string;
  heroDescription: string;
  bookingNote: string;
}

export interface Booking {
  id: ID;
  createdAt: string;
  name: string;
  phone: string;
  subject: string;
  dates?: string;
  guests?: number;
  comment?: string;
  status: "new" | "processed";
  sortOrder: number;
  published?: boolean;
}

export interface ListParams {
  category?: string;
  published?: boolean;
}
