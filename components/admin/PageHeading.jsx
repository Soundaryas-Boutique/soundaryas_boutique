/**
 * The one display moment on an admin screen.
 *
 * Yeseva One appears here and nowhere else in the back office -- it is what
 * ties these screens to the storefront without the admin having to shout.
 * Everything below this line is Poppins.
 */
export default function PageHeading({ title, count, children }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-ivory pb-5">
      <div>
        <h1 className="font-secondary text-2xl text-primary md:text-3xl">
          {title}
        </h1>
        {count != null && (
          <p className="mt-1 text-sm text-grey-medium tabular-nums">
            {count} {count === 1 ? "entry" : "entries"}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </header>
  );
}
