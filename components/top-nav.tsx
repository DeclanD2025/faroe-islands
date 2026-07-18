"use client";

// Typographic, restrained, hidden until the reader is past the hero.
// The brief is explicit: the navigation must sit AFTER the cover, not on top
// of it. We achieve that with an IntersectionObserver that watches a marker
// placed at the bottom of the hero, and fades the nav once the marker has
// scrolled out of view above the viewport.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = { href: string; label: string };

function useHeroEndVisible(): boolean {
  // We start hidden and let the observer drive shown. The hook returns
  // false when no sentinel exists; the page is responsible for placing
  // a single `<span id="hero-end" />` at the foot of the hero.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sentinel = document.getElementById("hero-end");
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setShown(!e.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px 0px -120px 0px" },
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);
  return shown;
}

export function TopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const shown = useHeroEndVisible();

  return (
    <header
      aria-hidden={!shown}
      className={`fixed inset-x-0 top-0 z-40 transition-opacity duration-500 ${
        shown ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="bg-paper/85 backdrop-blur-md border-b border-stone/60">
        <nav className="mx-auto max-w-[68rem] px-6 sm:px-8 h-14 flex items-center justify-between text-[13px]">
          <Link
            href="/#journey"
            className="font-serif text-[15px] tracking-tight text-ink hover:text-atlantic"
          >
            <span className="italic">Faroe</span>, July.
          </Link>
          <ul className="hidden sm:flex items-center gap-7">
            {items.map((item) => {
              const isCurrent =
                item.href === "/"
                  ? pathname === "/" || pathname === ""
                  : pathname?.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`tracking-[0.02em] transition-colors ${
                      isCurrent ? "text-ink" : "text-bone hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/info"
                className="caption tracking-[0.02em] text-bone hover:text-ink"
                title="Practical reference"
              >
                <span className="sr-only">Reference · </span>Reference
              </Link>
            </li>
          </ul>
          {/* The mobile drawer is intentionally minimal — the FAQ about the
              drawer-less design is: we leave space for the editorial layout
              and let the hero and pages breathe. */}
          <ul className="flex sm:hidden items-center gap-4 overflow-x-auto">
            {items.slice(0, 5).map((item) => (
              <li key={item.href + "-m"}>
                <Link
                  href={item.href}
                  className="caption tracking-[0.02em] text-bone"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
