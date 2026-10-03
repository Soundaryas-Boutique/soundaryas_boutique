// Mirrors ProfileClient's signed-in shell. ProfileClient already shows its own
// pulse while the NextAuth session resolves, but that only starts once the
// page has rendered -- this covers the server-side user fetch before it.

export default function Loading() {
  return (
    <main
      className="max-w-[1440px] mx-auto py-10 lg:py-14 px-6 md:px-12 bg-white min-h-screen"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading profile…</span>

      {/* Header */}
      <div className="mb-10 border-b border-gray-100 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="h-8 w-56 bg-grey-light motion-safe:animate-pulse" />
          <div className="mt-2 h-3 w-64 bg-grey-light motion-safe:animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-grey-light motion-safe:animate-pulse" />
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Sidebar nav */}
        <div className="lg:w-64 shrink-0 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-full bg-grey-light motion-safe:animate-pulse"
            />
          ))}
        </div>

        {/* Content panel */}
        <div className="flex-1 lg:max-w-4xl space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-gray-100 p-6">
              <div className="h-4 w-40 bg-grey-light motion-safe:animate-pulse" />
              <div className="mt-4 h-3 w-full bg-grey-light motion-safe:animate-pulse" />
              <div className="mt-2 h-3 w-2/3 bg-grey-light motion-safe:animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
