"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Plus } from "lucide-react";
import { formatPrice } from "@/app/lib/money";
import PageHeading from "../../../../components/admin/PageHeading";

const LOW_STOCK = 5;

function Thumb({ product }) {
  const image = product.images?.[0];
  if (!image) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-grey-light text-xs text-grey-medium">
        —
      </div>
    );
  }
  return (
    <Image
      src={image.url}
      alt={image.alt || product.productName}
      width={56}
      height={56}
      sizes="56px"
      className="h-14 w-14 shrink-0 object-cover"
    />
  );
}

/** Stock is the number the shop actually acts on, so it carries the colour. */
function Stock({ value }) {
  const tone =
    value === 0 ? "#B71C1C" : value <= LOW_STOCK ? "#D4AF37" : "#757575";
  const label = value === 0 ? "Out of stock" : `${value} in stock`;
  return (
    <span className="inline-flex items-center gap-2 text-sm tabular-nums" style={{ color: tone }}>
      <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: tone }} />
      {label}
    </span>
  );
}

function Price({ product }) {
  if (product.discountPrice) {
    return (
      <span className="tabular-nums">
        <span className="text-grey-dark">{formatPrice(product.discountPrice)}</span>
        <span className="ml-2 text-grey-medium line-through">
          {formatPrice(product.price)}
        </span>
      </span>
    );
  }
  return <span className="text-grey-dark tabular-nums">{formatPrice(product.price)}</span>;
}

export default function ProductsTable({ initialProducts }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [confirmingId, setConfirmingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const lowStock = products.filter((p) => p.stock <= LOW_STOCK).length;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.productName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [products, query]);

  const handleDelete = async (id) => {
    setError("");
    setBusyId(id);
    try {
      const res = await fetch(`/api/sarees/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete that product.");
      setProducts((cur) => cur.filter((p) => p.id !== id));
      setConfirmingId(null);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const addButton = (
    <Link
      href="/admin/products/add"
      className="inline-flex min-h-[44px] items-center gap-2 bg-primary px-4 text-sm text-white transition-colors hover:bg-rail focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
    >
      <Plus size={16} aria-hidden />
      Add product
    </Link>
  );

  if (products.length === 0) {
    return (
      <>
        <PageHeading title="Products">{addButton}</PageHeading>
        <p className="border border-ivory bg-white px-6 py-16 text-center text-grey-medium">
          No products yet. Add your first one and it will show up in the shop.
        </p>
      </>
    );
  }

  return (
    <>
      <PageHeading title="Products" count={products.length}>
        {addButton}
      </PageHeading>

      {error && (
        <p role="alert" className="mb-4 border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
          {error}
        </p>
      )}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex-1 sm:max-w-xs">
          <span className="sr-only">Search products</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or category"
            /* 16px keeps iOS from zooming the page on focus */
            className="min-h-[44px] w-full border border-ivory bg-white px-4 text-base text-grey-dark placeholder:text-grey-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:text-sm"
          />
        </label>
        {lowStock > 0 && (
          <p className="text-sm text-secondary">
            {lowStock} {lowStock === 1 ? "product is" : "products are"} low or out of stock
          </p>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="border border-ivory bg-white px-6 py-12 text-center text-grey-medium">
          Nothing matches “{query}”.
        </p>
      ) : (
        <>
          <div className="hidden overflow-x-auto border border-ivory bg-white md:block">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-ivory text-left text-grey-medium">
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Stock</th>
                  <th className="px-5 py-3 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => (
                  <tr key={p.id} className="border-b border-ivory/60 last:border-0 hover:bg-grey-light">
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-3">
                        <Thumb product={p} />
                        <span>
                          <span className="block text-grey-dark">{p.productName}</span>
                          {p.status !== "active" && (
                            <span className="text-xs text-grey-medium">Hidden from shop</span>
                          )}
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-3 text-grey-medium">{p.category}</td>
                    <td className="px-5 py-3"><Price product={p} /></td>
                    <td className="px-5 py-3"><Stock value={p.stock} /></td>
                    <td className="px-5 py-3 text-right">
                      {confirmingId === p.id ? (
                        <span className="inline-flex items-center gap-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id)}
                            disabled={busyId === p.id}
                            className="min-h-[36px] bg-primary px-3 text-sm text-white disabled:opacity-60"
                          >
                            {busyId === p.id ? "Deleting…" : "Delete"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmingId(null)}
                            className="min-h-[36px] px-2 text-sm text-grey-medium hover:text-grey-dark"
                          >
                            Keep
                          </button>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <Link
                            href={`/admin/products/edit/${p.id}`}
                            className="inline-flex min-h-[36px] items-center px-3 text-sm text-grey-dark underline decoration-ivory underline-offset-4 hover:decoration-secondary"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => setConfirmingId(p.id)}
                            aria-label={`Delete ${p.productName}`}
                            className="inline-flex h-11 w-11 items-center justify-center text-grey-medium transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                          >
                            <Trash2 size={16} aria-hidden />
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden">
            {visible.map((p) => (
              <li key={p.id} className="border border-ivory bg-white p-4">
                <div className="flex gap-3">
                  <Thumb product={p} />
                  <div className="min-w-0 flex-1">
                    <p className="text-grey-dark">{p.productName}</p>
                    <p className="mt-0.5 text-sm text-grey-medium">{p.category}</p>
                    <p className="mt-1 text-sm"><Price product={p} /></p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-ivory pt-3">
                  <Stock value={p.stock} />
                  {confirmingId === p.id ? (
                    <span className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        disabled={busyId === p.id}
                        className="min-h-[44px] bg-primary px-3 text-sm text-white disabled:opacity-60"
                      >
                        {busyId === p.id ? "Deleting…" : "Delete"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingId(null)}
                        className="min-h-[44px] px-2 text-sm text-grey-medium"
                      >
                        Keep
                      </button>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <Link
                        href={`/admin/products/edit/${p.id}`}
                        className="inline-flex min-h-[44px] items-center px-3 text-sm text-grey-dark underline decoration-ivory underline-offset-4"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setConfirmingId(p.id)}
                        aria-label={`Delete ${p.productName}`}
                        className="inline-flex h-11 w-11 items-center justify-center text-grey-medium hover:text-primary"
                      >
                        <Trash2 size={16} aria-hidden />
                      </button>
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
