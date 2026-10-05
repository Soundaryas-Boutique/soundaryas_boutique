-- Drop the product fields nothing consumed, and add a SKU.
--
-- tags and isFeatured were written by the admin form and read nowhere.
-- sizes and colors were only ever read by components/ProductPageClient.jsx,
-- which no route rendered, so no customer could pick either one.
--
-- cart_items.selectedColor existed solely to carry the product colour, and
-- its unique key was built on it. With colours gone, a cart line is
-- identified by its product alone.
--
-- Safe as written only while both tables are empty, which they were when
-- this was produced (sarees: 0 rows, cart_items: 0 rows). If rows exist by
-- the time you run it, backfill sku first -- see the note at the bottom.

begin;

-- ---------------------------------------------------------------- sarees

alter table sarees
  drop column if exists tags,
  drop column if exists colors,
  drop column if exists sizes,
  drop column if exists "isFeatured";

-- The code the shop says out loud, on the phone and on a label. Order ids
-- are uuids, so without this there is nothing human to quote.
alter table sarees
  add column sku text not null unique;

-- ------------------------------------------------------------ cart_items

alter table cart_items
  drop constraint if exists "cart_items_cartId_productId_selectedColor_key";

alter table cart_items
  drop column if exists "selectedColor";

alter table cart_items
  add constraint "cart_items_cartId_productId_key" unique ("cartId", "productId");

commit;

-- If sarees already holds rows when you run this, the `not null` on sku will
-- fail. Add it nullable, fill it, then tighten:
--
--   alter table sarees add column sku text;
--   update sarees set sku = 'SKU-' || upper(substr(id::text, 1, 8)) where sku is null;
--   alter table sarees alter column sku set not null;
--   alter table sarees add constraint sarees_sku_key unique (sku);
