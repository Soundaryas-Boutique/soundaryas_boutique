"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null); // opens modal when set
  const [search, setSearch] = useState("");
  const [activeSubject, setActiveSubject] = useState("All");
  const chartRef = useRef(null);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/contact");
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  // Subject counts
  const subjectCounts = useMemo(() => {
    const counts = {};
    for (const m of messages) {
      const s = m?.subject || "Uncategorized";
      counts[s] = (counts[s] || 0) + 1;
    }
    return counts;
  }, [messages]);

  const subjectList = useMemo(() => {
    const list = Object.keys(subjectCounts).sort((a, b) => a.localeCompare(b));
    return ["All", ...list];
  }, [subjectCounts]);

  // Filter + search
  const filteredMessages = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter((m) => {
      const subject = m?.subject || "Uncategorized";
      const subjectOk = activeSubject === "All" ? true : subject === activeSubject;
      if (!q) return subjectOk;
      const blob =
        `${m?.name ?? ""} ${m?.email ?? ""} ${m?.phone ?? ""} ${m?.subject ?? ""} ${m?.message ?? ""}`.toLowerCase();
      return subjectOk && blob.includes(q);
    });
  }, [messages, search, activeSubject]);

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await fetch(`/api/contact/${id}`, { method: "DELETE" });
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
    } catch (e) {
      console.error("Failed to delete:", e);
      alert("Delete failed. Please try again.");
    }
  };

  const totalCount = messages.length;

  // Chart
  const pieData = useMemo(() => {
    const entries = Object.entries(subjectCounts);
    const labels = entries.map(([s]) => s);
    const data = entries.map(([, c]) => c);

    const palette = [
      "#1D4ED8", "#059669", "#D97706", "#DC2626", "#0891B2",
      "#7C3AED", "#65A30D", "#BE123C", "#0284C7", "#EA580C",
      "#0EA5E9", "#DB2777", "#14B8A6", "#8B5CF6", "#3B82F6",
    ];
    const colors = labels.map((_, i) => palette[i % palette.length]);

    return {
      labels,
      datasets: [
        {
          label: "Message Subjects",
          data,
          backgroundColor: colors,
          borderWidth: 1,
        },
      ],
    };
  }, [subjectCounts]);

  const pieOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const count = ctx.parsed || 0;
              const pct = totalCount ? ((count / totalCount) * 100).toFixed(1) : 0;
              return `${ctx.label}: ${count} (${pct}%)`;
            },
          },
        },
        title: {
          display: true,
          text: "Distribution of Message Topics",
          font: { size: 16, weight: "bold" },
        },
      },
    }),
    [totalCount]
  );

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50">
      {/* Page header */}
      <div className="border-b bg-white/70 backdrop-blur px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">User Messages</h1>
            <p className="text-sm text-gray-600">
              {totalCount} {totalCount === 1 ? "message" : "messages"} • Review, filter, and analyze
            </p>
          </div>
          <div className="hidden md:block">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              Admin Dashboard
            </span>
          </div>
        </div>
      </div>

      {/* Single-section container */}
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        {/* Chart on top */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Total: <span className="font-semibold text-gray-700">{totalCount}</span>
            </span>
            {activeSubject !== "All" && (
              <button
                className="text-xs text-indigo-600 hover:underline"
                onClick={() => setActiveSubject("All")}
              >
                Reset subject filter
              </button>
            )}
          </div>
          <div className="h-80">
            <Pie ref={chartRef} data={pieData} options={pieOptions} />
          </div>
          {Object.keys(subjectCounts).length === 0 && !loading && (
            <p className="mt-3 text-center text-sm text-gray-500">No data to plot yet.</p>
          )}
        </div>

        {/* Filters (pills) + Search */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {subjectList.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSubject(s)}
                className={`rounded-full px-3 py-1 text-sm transition ${
                  activeSubject === s
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {s}
                {s !== "All" && (
                  <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs text-gray-900">
                    {subjectCounts[s]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, subject, message…"
              className="w-full rounded-xl border px-3 py-2 outline-none transition focus:border-indigo-400 md:w-1/2"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Messages grid */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-bold">Messages</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border p-4">
                  <div className="mb-2 h-4 w-32 rounded bg-gray-200" />
                  <div className="mb-1 h-3 w-64 rounded bg-gray-200" />
                  <div className="h-3 w-40 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
              <div className="text-3xl">📭</div>
              <p className="text-lg font-semibold">No messages match your filters</p>
              <p className="text-sm text-gray-600">Try clearing the search or picking a different subject.</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {filteredMessages.map((msg) => (
                <button
                  key={msg._id}
                  className="text-left rounded-xl border p-4 transition hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={() => setSelectedMessage(msg)}
                  aria-label={`Open details for message from ${msg?.name || "Unknown"}`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <p className="font-semibold">{msg?.name || "Unknown user"}</p>
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">
                      {(msg?.subject || "Uncategorized").slice(0, 28)}
                      {(msg?.subject || "").length > 28 ? "…" : ""}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{msg?.email}</p>
                  {msg?.createdAt && (
                    <p className="mt-1 text-xs text-gray-400">{formatDate(msg.createdAt)}</p>
                  )}
                  <p className="mt-2 line-clamp-2 text-sm text-gray-700">{msg?.message}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for details */}
      <Modal open={!!selectedMessage} onClose={() => setSelectedMessage(null)} title="Message Details">
        {selectedMessage && (
          <div className="space-y-3">
            <div className="rounded-xl bg-gray-50 p-3">
              <DetailRow label="Name" value={selectedMessage.name} />
              <DetailRow label="Email" value={selectedMessage.email} />
              <DetailRow label="Phone" value={selectedMessage.phone || "N/A"} />
              <DetailRow label="Subject" value={selectedMessage.subject || "Uncategorized"} />
              {selectedMessage.createdAt && (
                <DetailRow label="Received" value={formatDate(selectedMessage.createdAt)} />
              )}
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold">Message</p>
              <p className="whitespace-pre-line rounded-xl border bg-white p-3 text-sm">
                {selectedMessage.message}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedMessage(null)}
                className="rounded-xl border px-4 py-2 text-sm transition hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => handleDelete(selectedMessage._id)}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm text-white transition hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ---------- UI bits ---------- */

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="w-24 shrink-0 text-gray-500">{label}:</span>
      <span className="break-all font-medium text-gray-900">{value || "—"}</span>
    </div>
  );
}

function Modal({ open, onClose, title, children }) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      onClick={onClose} // click outside to close
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Dialog */}
      <div
        className="relative z-10 mx-4 w-full max-w-2xl rounded-2xl border bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()} // prevent outside click
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 id="modal-title" className="text-lg font-bold">
            {title}
          </h3>
          <button
            aria-label="Close"
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            onClick={onClose}
          >
            {/* Close icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
