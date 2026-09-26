export type Department = "women" | "men" | "accessories";
export type Construction = "stitched" | "unstitched" | "accessory";
export type Season = "Summer" | "Winter" | "All Season";
export type CollectionTag = "eid" | "summer" | "winter" | "festive" | "wedding";
export type Badge = "new" | "bestseller" | "trending" | "limited";
export type ImageView = "front" | "back" | "detail" | "styled";

export interface ColorOption {
  name: string;
  hex: string;
  /** Index into `images` shown when this colour is selected. */
  imageIndex?: number;
}

export interface ProductImage {
  src: string;
  alt: string;
  view: ImageView;
}

export interface Product {
  id: string;
  slug: string;
  sku: string;
  name: string;
  department: Department;
  construction: Construction;
  /** Primary category slug, e.g. "formal-wear", "kurta", "lawn". */
  category: string;
  /** Extra category slugs this product should appear under. */
  tags: string[];
  collections: CollectionTag[];
  badges: Badge[];
  fabric: string;
  price: number;
  compareAtPrice?: number;
  colors: ColorOption[];
  sizes: string[];
  /** Stock quantity per size. */
  stock: Record<string, number>;
  images: ProductImage[];
  video?: { src: string; poster: string };
  rating: number;
  reviewCount: number;
  sold: number;
  views: number;
  createdAt: string;
  pieces?: 1 | 2 | 3;
  includes: string[];
  shortDescription: string;
  description: string;
  details: string[];
  fabricLength?: string;
  season: Season;
  fit: string;
  care: string[];
  completeTheLook?: string[];
}

export interface CategoryCard {
  slug: string;
  name: string;
  group: "women" | "men" | "stitched" | "unstitched";
  image: string;
  blurb: string;
}

export interface Criteria {
  department?: Department;
  construction?: Construction;
  categories?: string[];
  badge?: Badge;
  collection?: CollectionTag;
  onSale?: boolean;
}

export interface CollectionDef {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  seoDescription: string;
  image: string;
  criteria: Criteria;
  subcategories?: { slug: string; name: string; criteria: Criteria }[];
  theme?: "light" | "dark";
}

export interface Review {
  id: string;
  productId?: string;
  name: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  purchased: string;
  verified: boolean;
}

export interface CartItem {
  key: string;
  productId: string;
  color: string;
  size: string;
  qty: number;
}

export interface OrderAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  notes?: string;
}

export type PaymentMethod = "cod" | "card" | "bank" | "wallet";
export type DeliveryMethod = "standard" | "express";
export type OrderStatus = "placed" | "confirmed" | "packed" | "shipped" | "out-for-delivery" | "delivered";

export interface Order {
  id: string;
  createdAt: string;
  items: (CartItem & { name: string; price: number; image: string; slug: string })[];
  address: OrderAddress;
  delivery: DeliveryMethod;
  payment: PaymentMethod;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  coupon?: string;
}

export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  readMinutes: number;
  date: string;
  body: { heading?: string; paragraphs: string[]; bullets?: string[] }[];
  relatedLinks?: { label: string; href: string }[];
}
