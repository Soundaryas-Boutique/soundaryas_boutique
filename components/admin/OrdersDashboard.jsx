"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { formatPrice } from "@/app/lib/money";
import PageHeading from "./PageHeading";
import OrderStatus from "./OrderStatus";
import CustomerDetailsModal from "./CustomerDetailsModal";
import { ORDER_STATUSES, OPEN_STATUSES, statusMeta } from "./orderStatus";

const shortId = (id) => id.slice(0, 8).toUpperCase();

const dateLabel = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function Stat({ label, value, hint }) {
  return (
    <div className="border border-ivory bg-white p-5">
      <p className="text-sm text-grey-medium">{label}</p>
      <p className="mt-1 text-3xl text-grey-dark tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-grey-medium">{hint}</p>}
    </div>
  );
}

/** Top sellers as plain proportional bars. Three rows do not need a chart
 *  library, and an empty one does not draw a pair of bare axes. */
function TopProducts({ rows }) {
  if (rows.length === 0) return null;
  const max = Math.max(...rows.map((r) => r.quantity));

  return (
    <section className="mb-8 border border-ivory bg-white p-5">
      <h2 className="mb-4 font-main text-base font-medium text-grey-dark">
        Best sellers
      </h2>
      <ul className="space-y-3">
        {rows.map((row) => (
          <li key={row.name}>
            <div className="mb-1 flex items-baseline justify-between gap-4">
              <span className="truncate text-sm text-grey-dark">{row.name}</span>
              <span className="shrink-0 text-sm text-grey-medium tabular-nums">
                {row.quantity} sold
              </span>
            </div>
            <div className="h-2 w-full bg-grey-light">
              <div
                className="h-2 bg-primary"
                style={{ width: `${(row.quantity / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function OrdersDashboard({ initialOrders }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("all");
  const [customer, setCustomer] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const counts = useMemo(() => {
    const c = { all: orders.length };
    for (const s of ORDER_STATUSES) c[s.value] = 0;
    for (const o of orders) if (c[o.orderStatus] !== undefined) c[o.orderStatus]++;
    return c;
  }, [orders]);

  const revenue = useMemo(
    () =>
      orders
        .filter((o) => o.paymentStatus === "paid")
        .reduce((sum, o) => sum + Number(o.totalAmount), 0),
    [orders]
  );

  const openCount = orders.filter((o) => OPEN_STATUSES.includes(o.orderStatus)).length;

  const topProducts = useMemo(() => {
    const tally = {};
    for (const o of orders) {
      for (const p of o.products ?? []) {
        tally[p.productName] = (tally[p.productName] || 0) + p.quantity;
      }
    }
    return Object.entries(tally)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));
  }, [orders]);

  const visible = filter === "all" ? orders : orders.filter((o) => o.orderStatus === filter);

  const handleDelete = async (orderId) => {
    setError("");
    setBusyId(orderId);
    try {
      const res = await fetch(`/api/admin/orders?id=${orderId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete that order.");
      setOrders((cur) => cur.filter((o) => o.id !== orderId));
      setConfirmingId(null);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  if (orders.length === 0) {
    return (
      <>
        <PageHeading title="Orders" />
        <p className="border border-ivory bg-white px-6 py-16 text-center text-grey-medium">
          No orders yet. They will appear here as soon as a customer checks out.
        </p>
      </>
    );
  }

  return (
    <>
      <PageHeading title="Orders" count={orders.length} />

      {error && (
        <p role="alert" className="mb-4 border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
          {error}
        </p>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Orders" value={orders.length} />
        <Stat label="Revenue" value={formatPrice(revenue)} hint="Paid orders only" />
        <Stat label="Needs attention" value={openCount} hint="Pending or processing" />
      </div>

      {/* The filter doubles as the status breakdown, so there is no pie chart
          restating what these counts already say. */}
      <div className="mb-8 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div role="group" aria-label="Filter by status" className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
          {[{ value: "all", label: "All", color: "#333333" }, ...ORDER_STATUSES].map((s) => {
            const active = filter === s.value;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => setFilter(s.value)}
                aria-pressed={active}
                className="inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                style={
                  active
                    ? { borderColor: s.color, backgroundColor: `${s.color}14`, color: s.color }
                    : { borderColor: "#FFFDD0", backgroundColor: "#FFFFFF", color: "#757575" }
                }
              >
                {s.label}
                <span className="tabular-nums opacity-70">{counts[s.value] ?? 0}</span>
              </button>
            );
          })}
        </div>
      </div>

      <TopProducts rows={topProducts} />

      {visible.length === 0 ? (
        <p className="border border-ivory bg-white px-6 py-12 text-center text-grey-medium">
          No {statusMeta(filter).label.toLowerCase()} orders.
        </p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto border border-ivory bg-white md:block">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-ivory text-left text-grey-medium">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Items</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((order) => (
                  <tr key={order.id} className="border-b border-ivory/60 align-top last:border-0 hover:bg-grey-light">
                    <td className="px-5 py-4">
                      <span className="text-grey-dark tabular-nums">{shortId(order.id)}</span>
                      <span className="mt-0.5 block text-xs text-grey-medium tabular-nums">
                        {dateLabel(order.createdAt)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {order.userId ? (
                        <button
                          type="button"
                          onClick={() => setCustomer(order.userId)}
                          className="text-left text-grey-dark underline decoration-ivory underline-offset-4 hover:decoration-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                        >
                          {order.userId.name}
                          <span className="mt-0.5 block text-xs text-grey-medium">
                            {order.userId.email}
                          </span>
                        </button>
                      ) : (
                        <span className="text-grey-medium italic">Account removed</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-grey-medium">
                      {order.products.map((p) => (
                        <span key={p.id} className="block">
                          {p.productName}
                          <span className="tabular-nums"> ×{p.quantity}</span>
                        </span>
                      ))}
                    </td>
                    <td className="px-5 py-4 text-grey-dark tabular-nums">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-5 py-4">
                      <OrderStatus orderId={order.id} currentStatus={order.orderStatus} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      {confirmingId === order.id ? (
                        <span className="inline-flex items-center gap-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleDelete(order.id)}
                            disabled={busyId === order.id}
                            className="min-h-[36px] bg-primary px-3 text-sm text-white disabled:opacity-60"
                          >
                            {busyId === order.id ? "Deleting…" : "Delete"}
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
                        <button
                          type="button"
                          onClick={() => setConfirmingId(order.id)}
                          aria-label={`Delete order ${shortId(order.id)}`}
                          className="inline-flex h-11 w-11 items-center justify-center text-grey-medium transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                        >
                          <Trash2 size={16} aria-hidden />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phone cards: a six column table cannot be read at 390px */}
          <ul className="space-y-3 md:hidden">
            {visible.map((order) => (
              <li key={order.id} className="border border-ivory bg-white p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-grey-dark tabular-nums">{shortId(order.id)}</span>
                  <span className="text-lg text-grey-dark tabular-nums">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-grey-medium tabular-nums">
                  {dateLabel(order.createdAt)}
                </p>

                <div className="mt-3">
                  {order.userId ? (
                    <button
                      type="button"
                      onClick={() => setCustomer(order.userId)}
                      className="text-left text-sm text-grey-dark underline decoration-ivory underline-offset-4"
                    >
                      {order.userId.name}
                      <span className="block text-xs text-grey-medium">{order.userId.email}</span>
                    </button>
                  ) : (
                    <span className="text-sm text-grey-medium italic">Account removed</span>
                  )}
                </div>

                <ul className="mt-3 space-y-0.5 text-sm text-grey-medium">
                  {order.products.map((p) => (
                    <li key={p.id}>
                      {p.productName}
                      <span className="tabular-nums"> ×{p.quantity}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-ivory pt-3">
                  <OrderStatus orderId={order.id} currentStatus={order.orderStatus} />
                  {confirmingId === order.id ? (
                    <span className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(order.id)}
                        disabled={busyId === order.id}
                        className="min-h-[44px] bg-primary px-3 text-sm text-white disabled:opacity-60"
                      >
                        {busyId === order.id ? "Deleting…" : "Delete"}
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
                    <button
                      type="button"
                      onClick={() => setConfirmingId(order.id)}
                      aria-label={`Delete order ${shortId(order.id)}`}
                      className="inline-flex h-11 w-11 items-center justify-center text-grey-medium hover:text-primary"
                    >
                      <Trash2 size={16} aria-hidden />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {customer && (
        <CustomerDetailsModal customer={customer} onClose={() => setCustomer(null)} />
      )}
    </>
  );
}
