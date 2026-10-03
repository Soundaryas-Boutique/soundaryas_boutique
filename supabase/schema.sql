-- Soundarya's Boutique — Postgres schema (Supabase)
--
-- Column names are camelCase and quoted deliberately: they match the JSON keys
-- the app already reads (saree.productName, order.createdAt), so supabase-js
-- rows drop straight into the existing components with no mapping layer.
--
-- Run once against a fresh project: psql "$DATABASE_URL" -f supabase/schema.sql
-- or paste into the Supabase SQL editor.

-- updatedAt bookkeeping, shared by every table that tracks it.
create or replace function set_updated_at() returns trigger as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------- users

create table users (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null unique,
  password    text not null,
  phone       text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  address     text,
  city        text,
  state       text,
  country     text,
  pincode     text,
  "resetToken"       text,
  "resetTokenExpiry" timestamptz,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index users_reset_token_idx on users ("resetToken") where "resetToken" is not null;

create trigger users_set_updated_at before update on users
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------- sarees

create table sarees (
  id              uuid primary key default gen_random_uuid(),
  "productName"   text not null,
  description     text not null,
  price           numeric(10, 2) not null check (price >= 0),
  "discountPrice" numeric(10, 2) check ("discountPrice" >= 0),
  stock           integer not null default 0 check (stock >= 0),
  sold            integer not null default 0 check (sold >= 0),
  category        text not null check (category in ('Silk', 'Cotton', 'Designer', 'Banarasi', 'Casual', 'Other')),
  tags            text[] not null default '{}',
  colors          text[] not null default '{}',
  sizes           text[] not null default '{}',
  material        text,
  -- [{ url, alt }]; kept as jsonb because it is always read and written whole.
  images          jsonb not null default '[]',
  slug            text not null unique,
  "isFeatured"    boolean not null default false,
  status          text not null default 'active' check (status in ('active', 'inactive')),
  "createdAt"     timestamptz not null default now(),
  "updatedAt"     timestamptz not null default now()
);

create index sarees_status_category_idx on sarees (status, category);
create index sarees_sold_idx on sarees (sold desc);
create index sarees_created_at_idx on sarees ("createdAt" desc);

create trigger sarees_set_updated_at before update on sarees
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------- carts

create table carts (
  id          uuid primary key default gen_random_uuid(),
  "userId"    uuid not null unique references users (id) on delete cascade,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create trigger carts_set_updated_at before update on carts
  for each row execute function set_updated_at();

-- productName and price are denormalised on purpose: they freeze what the
-- shopper saw when they added the item.
--
-- selectedColor defaults to '' rather than null so the unique constraint can do
-- its job -- in Postgres two null colours would not collide, which would let
-- duplicate rows for the same product pile up.
create table cart_items (
  id              uuid primary key default gen_random_uuid(),
  "cartId"        uuid not null references carts (id) on delete cascade,
  "productId"     uuid not null references sarees (id) on delete cascade,
  "productName"   text not null,
  price           numeric(10, 2) not null check (price >= 0),
  "selectedColor" text not null default '',
  quantity        integer not null check (quantity >= 1),
  unique ("cartId", "productId", "selectedColor")
);

create index cart_items_cart_id_idx on cart_items ("cartId");

-- ---------------------------------------------------------------- orders

create table orders (
  id                uuid primary key default gen_random_uuid(),
  "userId"          uuid not null references users (id) on delete cascade,
  "totalAmount"     numeric(10, 2) not null check ("totalAmount" >= 0),
  "stripeSessionId" text not null unique,
  "paymentStatus"   text not null default 'pending' check ("paymentStatus" in ('pending', 'paid', 'failed')),
  "orderStatus"     text not null default 'pending' check ("orderStatus" in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  -- { name, address, city, pincode }; written once from the Stripe session.
  "shippingDetails" jsonb not null default '{}',
  "createdAt"       timestamptz not null default now(),
  "updatedAt"       timestamptz not null default now()
);

create index orders_user_id_created_at_idx on orders ("userId", "createdAt" desc);

create trigger orders_set_updated_at before update on orders
  for each row execute function set_updated_at();

-- productId is nullable: orders are built from Stripe line items, which carry a
-- description rather than our product id. It also survives the product being
-- deleted, which an order must.
create table order_items (
  id            uuid primary key default gen_random_uuid(),
  "orderId"     uuid not null references orders (id) on delete cascade,
  "productId"   uuid references sarees (id) on delete set null,
  "productName" text not null,
  quantity      integer not null check (quantity >= 1),
  price         numeric(10, 2) not null check (price >= 0)
);

create index order_items_order_id_idx on order_items ("orderId");

-- ---------------------------------------------------------------- contacts

create table contacts (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text,
  email       text not null,
  subject     text,
  message     text not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index contacts_created_at_idx on contacts ("createdAt" desc);

create trigger contacts_set_updated_at before update on contacts
  for each row execute function set_updated_at();

-- ------------------------------------------------------------ site_reviews

-- The timestamp column is "date", not "createdAt" -- the review UI sorts and
-- displays it under that name.
create table site_reviews (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null,
  email       text not null,
  category    text not null,
  material    text not null,
  rating      integer not null check (rating between 1 and 5),
  comment     text,
  -- { quality, comfort, price, recommend, overall }
  poll        jsonb not null default '{}',
  date        timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index site_reviews_date_idx on site_reviews (date desc);

create trigger site_reviews_set_updated_at before update on site_reviews
  for each row execute function set_updated_at();

-- ------------------------------------------------------------- subscribers

create table subscribers (
  id                 uuid primary key default gen_random_uuid(),
  email              text not null unique,
  profession         text not null default 'Other' check (profession in ('Doctor', 'Teacher', 'Engineer', 'Student', 'Other')),
  phone              text,
  gender             text not null check (gender in ('Male', 'Female', 'Other')),
  "exclusiveOffer"   boolean not null default false,
  "subscriptionType" text not null default 'Monthly' check ("subscriptionType" in ('Weekly', 'Monthly', 'Yearly')),
  "createdAt"        timestamptz not null default now(),
  "updatedAt"        timestamptz not null default now()
);

create index subscribers_profession_idx on subscribers (profession);

create trigger subscribers_set_updated_at before update on subscribers
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------- access
--
-- Every query runs server-side through a route handler that checks the NextAuth
-- session, using the service-role key. RLS is enabled with no policies so that
-- the anon key -- if it ever reaches a browser -- can read nothing. Add
-- policies here before querying any table from client code.

alter table users        enable row level security;
alter table sarees       enable row level security;
alter table carts        enable row level security;
alter table cart_items   enable row level security;
alter table orders       enable row level security;
alter table order_items  enable row level security;
alter table contacts     enable row level security;
alter table site_reviews enable row level security;
alter table subscribers  enable row level security;
