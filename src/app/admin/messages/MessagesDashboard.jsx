"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import PageHeading from "../../../../components/admin/PageHeading";

const UNCATEGORISED = "Uncategorised";

const subjectOf = (m) => m?.subject?.trim() || UNCATEGORISED;

const dateLabel = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const timeLabel = (iso) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

function Modal({ open, onClose, labelledBy, children }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto border border-ivory bg-white p-6"
      >
        {children}
        <button ref={closeRef} type="button" className="sr-only" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="border-b border-ivory py-3 last:border-0">
      <dt className="text-xs text-grey-medium">{label}</dt>
      <dd className="mt-0.5 break-words text-grey-dark">{value || "—"}</dd>
    </div>
  );
}

export default function MessagesDashboard({ initialMessages }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [confirmingId, setConfirmingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const subjectCounts = useMemo(() => {
    const counts = {};
    for (const m of messages) {
      const s = subjectOf(m);
      counts[s] = (counts[s] || 0) + 1;
    }
    return counts;
  }, [messages]);

  const subjects = useMemo(
    () => Object.keys(subjectCounts).sort((a, b) => a.localeCompare(b)),
    [subjectCounts]
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter((m) => {
      if (subject !== "All" && subjectOf(m) !== subject) return false;
      if (!q) return true;
      return `${m.name} ${m.email} ${m.phone ?? ""} ${m.subject ?? ""} ${m.message}`
        .toLowerCase()
        .includes(q);
    });
  }, [messages, search, subject]);

  const handleDelete = async (id) => {
    setError("");
    setBusyId(id);
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete that message.");
      setMessages((cur) => cur.filter((m) => m.id !== id));
      setConfirmingId(null);
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  if (messages.length === 0) {
    return (
      <>
        <PageHeading title="Messages" />
        <p className="border border-ivory bg-white px-6 py-16 text-center text-grey-medium">
          No messages yet. Anything sent through the contact form lands here.
        </p>
      </>
    );
  }

  return (
    <>
      <PageHeading title="Messages" count={messages.length} />

      {error && (
        <p role="alert" className="mb-4 border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
          {error}
        </p>
      )}

      <label className="mb-4 block sm:max-w-xs">
        <span className="sr-only">Search messages</span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email or text"
          /* 16px keeps iOS from zooming the page on focus */
          className="min-h-[44px] w-full border border-ivory bg-white px-4 text-base text-grey-dark placeholder:text-grey-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary sm:text-sm"
        />
      </label>

      {/* Counts per subject, as a filter rather than a chart that only
          restates them. */}
      <div className="mb-8 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div role="group" aria-label="Filter by subject" className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
          {["All", ...subjects].map((s) => {
            const active = subject === s;
            const count = s === "All" ? messages.length : subjectCounts[s];
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSubject(s)}
                aria-pressed={active}
                className={`inline-flex min-h-[40px] items-center gap-2 whitespace-nowrap border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
                  active
                    ? "border-grey-dark bg-grey-dark text-white"
                    : "border-ivory bg-white text-grey-medium hover:text-grey-dark"
                }`}
              >
                {s}
                <span className="tabular-nums opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="border border-ivory bg-white px-6 py-12 text-center text-grey-medium">
          No messages match that search.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((m) => (
            <li key={m.id} className="flex flex-col border border-ivory bg-white">
              <button
                type="button"
                onClick={() => setSelected(m)}
                className="flex-1 p-4 text-left transition-colors hover:bg-grey-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-grey-dark">{m.name}</span>
                  <span className="shrink-0 text-xs text-grey-medium tabular-nums">
                    {dateLabel(m.createdAt)}
                  </span>
                </span>
                <span className="mt-0.5 block truncate text-sm text-grey-medium">
                  {m.email}
                </span>
                <span className="mt-3 block text-sm text-grey-dark">
                  {subjectOf(m)}
                </span>
                <span className="mt-1 line-clamp-2 block text-sm text-grey-medium">
                  {m.message}
                </span>
              </button>

              <div className="flex items-center justify-between border-t border-ivory px-4 py-2">
                <span className="text-xs text-grey-medium">
                  {m.phone || "No phone"}
                </span>
                {confirmingId === m.id ? (
                  <span className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id)}
                      disabled={busyId === m.id}
                      className="min-h-[36px] bg-primary px-3 text-sm text-white disabled:opacity-60"
                    >
                      {busyId === m.id ? "Deleting…" : "Delete"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingId(null)}
                      className="min-h-[36px] px-2 text-sm text-grey-medium"
                    >
                      Keep
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmingId(m.id)}
                    aria-label={`Delete message from ${m.name}`}
                    className="inline-flex h-11 w-11 items-center justify-center text-grey-medium transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                  >
                    <Trash2 size={16} aria-hidden />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} labelledBy="message-dialog-title">
        {selected && (
          <>
            <h2 id="message-dialog-title" className="font-admin text-xl font-semibold text-grey-dark">
              {selected.name}
            </h2>

            <dl className="mt-4 text-sm">
              <DetailRow label="Email" value={selected.email} />
              <DetailRow label="Phone" value={selected.phone} />
              <DetailRow label="Subject" value={subjectOf(selected)} />
              <DetailRow label="Received" value={timeLabel(selected.createdAt)} />
            </dl>

            <p className="mt-4 whitespace-pre-line border border-ivory bg-grey-light p-4 text-sm text-grey-dark">
              {selected.message}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent(
                  `Re: ${subjectOf(selected)}`
                )}`}
                className="inline-flex min-h-[44px] items-center bg-primary px-4 text-sm text-white transition-colors hover:bg-rail"
              >
                Reply by email
              </a>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="inline-flex min-h-[44px] items-center border border-ivory px-4 text-sm text-grey-dark hover:bg-grey-light"
              >
                Close
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
