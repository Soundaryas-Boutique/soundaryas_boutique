"use client";

import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

function Row({ label, value }) {
  return (
    <div className="border-b border-ivory py-3 last:border-0">
      <dt className="text-xs text-grey-medium">{label}</dt>
      <dd className="mt-0.5 text-grey-dark">{value || "—"}</dd>
    </div>
  );
}

export default function CustomerDetailsModal({ customer, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  if (!customer) return null;

  const address = [
    customer.address,
    customer.city,
    customer.state,
    customer.country,
    customer.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      {/* Full-width sheet on a phone, centred panel from sm up. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-dialog-title"
        className="relative w-full max-w-md border border-ivory bg-white p-6 pb-8 sm:pb-6"
      >
        <div className="mb-2 flex items-start justify-between gap-4">
          <h2 id="customer-dialog-title" className="font-secondary text-xl text-primary">
            {customer.name}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-2 inline-flex h-11 w-11 items-center justify-center text-grey-medium transition-colors hover:text-grey-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            <FiX size={20} aria-hidden />
          </button>
        </div>

        <dl className="text-sm">
          <Row label="Email" value={customer.email} />
          <Row label="Phone" value={customer.phone} />
          <Row label="Address" value={address} />
        </dl>
      </div>
    </div>
  );
}
