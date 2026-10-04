"use client";

import { useState } from "react";
import { ORDER_STATUSES, statusMeta } from "./orderStatus";

/**
 * The status picker in an order row. It looks like the status pill until you
 * touch it, so a row reads as information rather than a wall of form
 * controls, and it is still a real <select> for keyboard and screen readers.
 */
export default function OrderStatus({ orderId, currentStatus, onStatusUpdate }) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  const meta = statusMeta(status);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    const previous = status;

    setSaving(true);
    setFailed(false);
    setStatus(newStatus); // optimistic

    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status.");
      onStatusUpdate?.(orderId, newStatus);
    } catch {
      setStatus(previous); // put it back rather than lie about the state
      setFailed(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <span className="inline-flex flex-col gap-1">
      <span className="relative inline-flex items-center">
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 h-2 w-2 rounded-full"
          style={{ backgroundColor: meta.color }}
        />
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={saving}
          aria-label="Order status"
          className="min-h-[36px] cursor-pointer appearance-none rounded-full border py-1 pl-7 pr-7 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:opacity-60"
          style={{
            borderColor: `${meta.color}55`,
            backgroundColor: `${meta.color}14`,
            color: meta.color,
          }}
        >
          {ORDER_STATUSES.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-grey-dark">
              {opt.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 text-[10px]"
          style={{ color: meta.color }}
        >
          ▾
        </span>
      </span>

      {failed && (
        <span role="alert" className="text-xs text-primary">
          Could not save. Try again.
        </span>
      )}
    </span>
  );
}
