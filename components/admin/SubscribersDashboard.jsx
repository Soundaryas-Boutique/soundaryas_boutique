"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PageHeading from "./PageHeading";

// Rows come from the server page. This component used to mock its own
// next-auth session and its own subscriber list, so it rendered invented
// people and granted itself access -- both are gone.

const monthKey = (iso) => (iso ?? "").slice(0, 7); // YYYY-MM

const monthLabel = (key) => {
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("en-IN", {
    month: "short",
    year: "2-digit",
  });
};

const dateLabel = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function Stat({ label, value }) {
  return (
    <div className="border border-ivory bg-white p-5">
      <p className="text-sm text-grey-medium">{label}</p>
      <p className="mt-1 text-3xl text-grey-dark tabular-nums">{value}</p>
    </div>
  );
}

export default function SubscribersDashboard({ subscribers }) {
  const chartData = useMemo(() => {
    const counts = subscribers.reduce((acc, sub) => {
      const key = monthKey(sub.createdAt);
      if (key) acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([key, count]) => ({ month: monthLabel(key), subscribers: count }));
  }, [subscribers]);

  const thisMonth = useMemo(() => {
    const key = monthKey(new Date().toISOString());
    return subscribers.filter((s) => monthKey(s.createdAt) === key).length;
  }, [subscribers]);

  const offers = subscribers.filter((s) => s.exclusiveOffer).length;

  if (subscribers.length === 0) {
    return (
      <>
        <PageHeading title="Subscribers" />
        <p className="border border-ivory bg-white px-6 py-16 text-center text-grey-medium">
          No one has subscribed yet. Sign-ups from the newsletter form will
          appear here.
        </p>
      </>
    );
  }

  return (
    <>
      <PageHeading title="Subscribers" count={subscribers.length} />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Total" value={subscribers.length} />
        <Stat label="Joined this month" value={thisMonth} />
        <Stat label="Opted into offers" value={offers} />
      </div>

      <section className="mb-8 border border-ivory bg-white p-5">
        <h2 className="mb-4 font-main text-base font-medium text-grey-dark">
          Sign-ups by month
        </h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F9F7F2" vertical={false} />
              <XAxis dataKey="month" stroke="#757575" fontSize={12} tickLine={false} />
              <YAxis allowDecimals={false} stroke="#757575" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "#F9F7F2" }}
                contentStyle={{ border: "1px solid #FFFDD0", borderRadius: 0, fontSize: 13 }}
                formatter={(value) => [value, "Sign-ups"]}
              />
              <Bar dataKey="subscribers" name="Sign-ups" fill="#B71C1C" maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Table on tablet and up; the same rows stack as cards on a phone,
          where a six-column table cannot be read. */}
      <section>
        <h2 className="mb-4 font-main text-base font-medium text-grey-dark">Everyone</h2>

        <div className="hidden overflow-x-auto border border-ivory bg-white md:block">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-ivory text-left text-grey-medium">
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Profession</th>
                <th className="px-5 py-3 font-medium">Plan</th>
                <th className="px-5 py-3 font-medium">Offers</th>
                <th className="px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-ivory/60 last:border-0 hover:bg-grey-light">
                  <td className="px-5 py-3 text-grey-dark">{sub.email}</td>
                  <td className="px-5 py-3 text-grey-medium tabular-nums">{sub.phone || "—"}</td>
                  <td className="px-5 py-3 text-grey-medium">{sub.profession}</td>
                  <td className="px-5 py-3 text-grey-medium">{sub.subscriptionType}</td>
                  <td className="px-5 py-3 text-grey-medium">{sub.exclusiveOffer ? "Yes" : "No"}</td>
                  <td className="px-5 py-3 text-grey-medium tabular-nums">{dateLabel(sub.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="space-y-3 md:hidden">
          {subscribers.map((sub) => (
            <li key={sub.id} className="border border-ivory bg-white p-4">
              <p className="break-all text-grey-dark">{sub.email}</p>
              <p className="mt-1 text-sm text-grey-medium tabular-nums">
                {sub.phone || "No phone"} · joined {dateLabel(sub.createdAt)}
              </p>
              <p className="mt-2 text-sm text-grey-medium">
                {sub.profession} · {sub.subscriptionType}
                {sub.exclusiveOffer ? " · wants offers" : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
