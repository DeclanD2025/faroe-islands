// =============================================================================
// MobileNav — bottom navigation for narrow viewports.
// Maximum 5 primary items. "More" opens a drawer for secondary items.
// =============================================================================

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavItem = { href: string; label: string };

const PRIMARY_LABELS = new Set(["Now", "Trip", "Map", "Match", "Prepare"]);

export function MobileNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" || pathname === "" : pathname?.startsWith(href);

  const primary = items.filter((i) => PRIMARY_LABELS.has(i.label));
  const secondary = items.filter((i) => !PRIMARY_LABELS.has(i.label));

  if (primary.length === 0) return null;

  return (
    <>
      {/* Bottom nav bar */}
      <nav
        aria-label="Primary navigation"
        className="sm:hidden fixed inset-x-0 bottom-0 z-40 bg-navy text-wool border-t border-fog/15"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul
          className="grid gap-0"
          style={{ gridTemplateColumns: `repeat(${primary.length + (secondary.length > 0 ? 1 : 0)}, 1fr)` }}
        >
          {primary.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`block text-center py-3 text-[10px] tracking-[0.12em] uppercase font-medium whitespace-nowrap border-t-2 transition-colors min-h-[48px] flex items-center justify-center ${
                  isActive(item.href)
                    ? "text-wool border-rust"
                    : "text-fog/75 border-transparent"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          {secondary.length > 0 && (
            <li>
              <button
                type="button"
                onClick={() => setMoreOpen(true)}
                aria-expanded={moreOpen}
                className="w-full text-center py-3 text-[10px] tracking-[0.12em] uppercase font-medium text-fog/75 whitespace-nowrap border-t-2 border-transparent min-h-[48px] flex items-center justify-center"
              >
                More
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* More drawer */}
      {moreOpen && (
        <div className="sm:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-basalt/30"
            onClick={() => setMoreOpen(false)}
            aria-hidden
          />
          <div
            className="absolute inset-x-0 bottom-0 bg-navy text-wool border-t border-fog/15 rounded-t-lg"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            role="dialog"
            aria-label="More navigation"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-fog/10">
              <p className="label text-wool/60">More</p>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="text-wool/60 text-[20px] leading-none p-1 min-h-[44px] min-w-[44px]"
                aria-label="Close more menu"
              >
                ×
              </button>
            </div>
            <ul className="py-2">
              {secondary.map((item) => (
                <li key={item.href + "-m"}>
                  <Link
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`block px-4 py-3 text-[13px] font-medium border-l-2 transition-colors ${
                      isActive(item.href)
                        ? "text-wool border-rust bg-fjord/30"
                        : "text-fog/85 border-transparent hover:bg-fjord/20"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
