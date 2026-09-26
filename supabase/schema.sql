-- Rang-o-Riwaaj catalogue schema.
-- src/lib/catalog.ts is the only read layer — swap its internals to these tables when you go live.

create table if not exists products (
  id text primary key,
  slug text unique not null,
  sku text unique not null,
  name text not null,
  department text not null check (department in ('women', 'men', 'accessories')),
  construction text not null check (construction in ('stitched', 'unstitched', 'accessory')),
  category text not null,
  tags text[] not null default '{}',
  collections text[] not null default '{}',
  badges text[] not null default '{}',
  fabric text not null,
  price integer not null,
  compare_at_price integer,
  colors jsonb not null default '[]',
  sizes text[] not null default '{}',
  stock jsonb not null default '{}',
  images jsonb not null default '[]',
  rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  sold integer not null default 0,
  views integer not null default 0,
  created_at date not null,
  pieces smallint,
  includes text[] not null default '{}',
  short_description text not null,
  description text not null,
  details text[] not null default '{}',
  fabric_length text,
  season text not null,
  fit text not null,
  care text[] not null default '{}',
  complete_the_look text[]
);

create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  href text,
  sort integer not null default 0,
  active boolean not null default true
);

create table if not exists coupons (
  code text primary key,
  label text not null,
  type text not null check (type in ('percent', 'fixed', 'shipping')),
  value integer not null,
  min_subtotal integer
);

create table if not exists orders (
  id text primary key,
  created_at timestamptz not null default now(),
  items jsonb not null,
  address jsonb not null,
  delivery text not null,
  payment text not null,
  subtotal integer not null,
  discount integer not null,
  shipping integer not null,
  total integer not null,
  coupon text,
  status text not null default 'placed'
);

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  topic text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table products enable row level security;
alter table announcements enable row level security;
alter table coupons enable row level security;
alter table orders enable row level security;
alter table inquiries enable row level security;
