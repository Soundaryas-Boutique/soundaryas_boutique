/**
 * The one display moment on an admin screen.
 *
 * Fraunces appears here and nowhere else in the back office. Everything
 * below this line is Poppins -- the heading carries the character so the
 * data underneath does not have to.
 */
export default function PageHeading({ title, count, children }) {
  // items-start, not items-end: with bottom alignment a page that has an
  // action button drops its title by the height difference, which left
  // Products sitting 8px lower than every other page.
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-ivory pb-5">
      <div>
        <h1 className="font-admin text-3xl font-semibold text-grey-dark">
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
