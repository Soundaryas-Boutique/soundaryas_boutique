// Mirrors ProductDetailsClient: max-w-6xl container, breadcrumb, then the
// two-column gallery/details split with an aspect-[3/4] main image.

export default function Loading() {
  return (
    <main
      className="max-w-6xl mx-auto py-8 md:py-12 px-6 bg-white font-main"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading product…</span>

      {/* Breadcrumb */}
      <div className="h-3 w-56 bg-grey-light motion-safe:animate-pulse mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14">
        {/* Gallery: thumbnail rail + main image */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <div className="flex flex-row md:flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-16 h-20 shrink-0 bg-grey-light motion-safe:animate-pulse"
              />
            ))}
          </div>
          <div className="flex-1 aspect-[3/4] max-w-[500px] border border-ivory/50 bg-grey-light motion-safe:animate-pulse" />
        </div>

        {/* Details column */}
        <div className="flex flex-col pt-2 max-w-lg w-full">
          <div className="h-7 w-4/5 bg-grey-light motion-safe:animate-pulse" />
          <div className="mt-3 h-3 w-32 bg-grey-light motion-safe:animate-pulse" />

          {/* Price row */}
          <div className="flex items-baseline gap-2 mt-6 mb-6">
            <div className="h-7 w-28 bg-grey-light motion-safe:animate-pulse" />
            <div className="h-4 w-20 bg-grey-light motion-safe:animate-pulse" />
          </div>

          {/* Spec rows */}
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between border-b border-white pb-2"
              >
                <div className="h-3 w-24 bg-grey-light motion-safe:animate-pulse" />
                <div className="h-3 w-20 bg-grey-light motion-safe:animate-pulse" />
              </div>
            ))}
          </div>

          {/* Action buttons: match the 48px control height */}
          <div className="flex gap-3 mt-8 mb-4">
            <div className="h-12 flex-1 bg-grey-light motion-safe:animate-pulse" />
            <div className="h-12 w-12 bg-grey-light motion-safe:animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}
