"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FiPackage,
  FiShoppingBag,
  FiMessageSquare,
  FiMail,
  FiBell,
  FiSend,
  FiMoreHorizontal,
  FiArrowLeft,
  FiX,
} from "react-icons/fi";

// Ordered by how often the shop actually opens them. The first four also
// become the phone tab bar, so that order is load-bearing.
const NAV = [
  { name: "Orders", href: "/admin/orders", icon: FiShoppingBag },
  { name: "Products", href: "/admin/products", icon: FiPackage },
  { name: "Messages", href: "/admin/messages", icon: FiMessageSquare },
  { name: "Subscribers", href: "/admin/subscribers", icon: FiMail },
  { name: "Promotions", href: "/admin/email-marketing", icon: FiBell },
  { name: "WhatsApp", href: "/admin/whatsapp-marketing", icon: FiSend },
];

const PRIMARY = NAV.slice(0, 4);
const OVERFLOW = NAV.slice(4);

function isCurrent(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Shared by the rail and the overflow sheet. */
function RailLink({ item, current, onNavigate }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={current ? "page" : undefined}
      className={`relative flex items-center gap-3 rounded-sm px-4 py-3 text-sm transition-colors
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary
        ${
          current
            ? "bg-white/10 text-rail-ink font-medium"
            : "text-rail-muted hover:bg-white/5 hover:text-rail-ink"
        }`}
    >
      {/* The zari thread: the only gold on the page. */}
      {current && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 bg-secondary"
        />
      )}
      <Icon className="h-5 w-5 shrink-0" aria-hidden />
      {item.name}
    </Link>
  );
}

export default function AdminNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {/* ---------------------------------------------- Side rail (md and up) */}
      {/* sticky + h-dvh pins the rail to the viewport. Sticky rather than
          fixed so the rail keeps its place in the flex row and the main
          column does not need a matching left margin. */}
      <aside className="hidden md:sticky md:top-0 md:flex md:h-dvh md:w-60 md:shrink-0 md:flex-col bg-rail text-rail-ink">
        <div className="px-6 py-7">
          <p className="font-secondary text-lg leading-tight text-rail-ink">
            Soundarya&rsquo;s
          </p>
          <p className="text-xs text-rail-muted">Back office</p>
        </div>

        <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3">
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <RailLink item={item} current={isCurrent(pathname, item.href)} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-sm px-4 py-3 text-sm text-rail-muted transition-colors hover:bg-white/5 hover:text-rail-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            <FiArrowLeft className="h-4 w-4" aria-hidden />
            Back to store
          </Link>
        </div>
      </aside>

      {/* ------------------------------------------ Tab bar (below md only) */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMoreOpen(false)}
          aria-hidden
        />
      )}

      <nav
        aria-label="Admin"
        /* The safe-area padding below clears the iOS home indicator. There is
           no Tailwind token for it, so it has to be an arbitrary value.
           Careful: do not write a class name inside a comment here -- the
           scanner reads raw file text and will try to generate it. */
        className="fixed inset-x-0 bottom-0 z-50 bg-rail pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {moreOpen && (
          <div className="border-b border-white/10 px-3 py-2">
            <div className="mb-1 flex items-center justify-between px-4 pt-1">
              <span className="text-xs text-rail-muted">More</span>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center text-rail-muted hover:text-rail-ink"
              >
                <FiX className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <ul className="space-y-1">
              {OVERFLOW.map((item) => (
                <li key={item.href}>
                  <RailLink
                    item={item}
                    current={isCurrent(pathname, item.href)}
                    onNavigate={() => setMoreOpen(false)}
                  />
                </li>
              ))}
              <li>
                <Link
                  href="/"
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-3 rounded-sm px-4 py-3 text-sm text-rail-muted hover:bg-white/5 hover:text-rail-ink"
                >
                  <FiArrowLeft className="h-5 w-5 shrink-0" aria-hidden />
                  Back to store
                </Link>
              </li>
            </ul>
          </div>
        )}

        <ul className="flex">
          {PRIMARY.map((item) => {
            const Icon = item.icon;
            const current = isCurrent(pathname, item.href);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={`relative flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] transition-colors
                    ${current ? "text-rail-ink" : "text-rail-muted"}`}
                >
                  {current && (
                    <span
                      aria-hidden
                      className="absolute inset-x-4 top-0 h-[3px] bg-secondary"
                    />
                  )}
                  <Icon className="h-5 w-5" aria-hidden />
                  {item.name}
                </Link>
              </li>
            );
          })}
          <li className="flex-1">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              className={`flex min-h-[56px] w-full flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] transition-colors
                ${moreOpen ? "text-rail-ink" : "text-rail-muted"}`}
            >
              <FiMoreHorizontal className="h-5 w-5" aria-hidden />
              More
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
