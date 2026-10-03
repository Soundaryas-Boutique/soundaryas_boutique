// Mirrors src/app/collections/[category]/page.jsx + components/ProductsList.jsx
// so the skeleton occupies the same space the real grid will: same container,
// same column counts, same gaps, and aspect-[3/4] cards.
//
// motion-safe: keeps the pulse away from anyone who asked for reduced motion.

const CARD_COUNT = 8;

export default function Loading() {
  return (
    <main className="bg-white" role="status" aria-live="polite">
      <div className="container-page py-8 lg:py-12">
      <span className="sr-only">Loading collection…</span>

      {/* Header: h1 + breadcrumb */}
      <div className="flex flex-col items-start mb-8 border-b border-ivory pb-6">
        <div className="h-8 md:h-9 w-64 bg-grey-light motion-safe:animate-pulse" />
        <div className="mt-2 h-3 w-48 bg-grey-light motion-safe:animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-16">
        {/* Filter sidebar */}
        <aside className="hidden md:block md:col-span-1 border-r border-ivory/30 pr-8">
          <div className="border-b border-ivory/50 pb-4">
            <div className="h-4 w-28 bg-grey-light motion-safe:animate-pulse" />
            <div className="mt-2 h-3 w-20 bg-grey-light motion-safe:animate-pulse" />
          </div>
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-grey-light motion-safe:animate-pulse" />
                <div className="h-3 flex-1 bg-grey-light motion-safe:animate-pulse" />
              </div>
            ))}
          </div>
        </aside>

        <section className="md:col-span-3 lg:col-span-4">
          {/* Summary bar */}
          <div className="hidden md:flex justify-between items-center mb-8 pb-4 border-b border-ivory/30">
            <div className="h-3 w-40 bg-grey-light motion-safe:animate-pulse" />
            <div className="h-3 w-36 bg-grey-light motion-safe:animate-pulse" />
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {Array.from({ length: CARD_COUNT }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] bg-grey-light motion-safe:animate-pulse" />
                <div className="p-2.5 lg:p-4 flex flex-col items-center">
                  <div className="h-3 w-3/4 bg-grey-light motion-safe:animate-pulse" />
                  <div className="mt-2 h-3 w-16 bg-grey-light motion-safe:animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      </div>
    </main>
  );
}
