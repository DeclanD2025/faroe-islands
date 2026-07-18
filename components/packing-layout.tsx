"use client";

// Packing layout — under-seat bag (40 × 30 × 20 cm), drawn as four physical
// zones (Wear / Pack / Keep accessible / Leave at home). We render a SVG
// cross-section sketch of the bag instead of a generic 4-cell cartesian
// diagram. Personal copy carries the personal-character brief.

import { PACKING, PACK_DIMENSIONS, type PackItem } from "@/lib/data/itinerary";
import { useChecklist } from "@/lib/hooks/use-checklist";

const ZONE_ORDER: PackItem["zone"][] = ["Wear", "Pack", "Keep accessible", "Leave at home"];

const ZONE_BLURB: Record<PackItem["zone"], string> = {
  "Wear": "Heavy things travel on the body — shoes, waterproofs, the warmest layer.",
  "Pack": "What you’d actually miss if you left it behind. Tight, low-volume.",
  "Keep accessible": "Things the turnstile, the ferry, or the rain might need in a hurry.",
  "Leave at home": "What we’re deliberately not taking. The discipline of fewer.",
};

export function PackingLayout() {
  const ids = PACKING.map((p) => p.id);
  const checklist = useChecklist(ids);

  return (
    <section className="relative mx-auto px-6 sm:px-10 pt-24 pb-24 sm:pt-28 sm:pb-32" style={{ maxWidth: "min(80rem, 100%)" }}>
      <header className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-x-12 mb-14 sm:mb-20">
        <p className="font-serif italic text-[13px] text-bone md:pt-2">
          Packing · under-seat
        </p>
        <div>
          <h2 className="headline text-[clamp(2.4rem,5.6vw,3.6rem)] leading-[1.04] tracking-tight max-w-[24ch]">
            The{" "}
            <span className="italic font-normal">{PACK_DIMENSIONS.width}&nbsp;×&nbsp;{PACK_DIMENSIONS.depth}&nbsp;×&nbsp;{PACK_DIMENSIONS.height}</span>{" "}
            bag.
          </h2>
          <p className="prose-trip mt-7 max-w-[40rem]">
            Frontier-fare under-seat allowance, drawn as four physical zones.
            Wear the heavier shoes. Pack what you&apos;d miss. Keep accessible
            what the turnstile or the ferry might need.
          </p>
          <p className="script script--atlantic text-[1.55rem] rotate-[-2deg] mt-7 max-w-[28ch]" aria-hidden>
            the smallest bag I&apos;ve ever packed for a long weekend.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-x-14 gap-y-16">
        {/* Left — the four zone lists with reasoned blurb. */}
        <div>
          <ol className="space-y-14">
            {ZONE_ORDER.map((zone, i) => {
              const items = PACKING.filter((p) => p.zone === zone);
              return (
                <li key={zone}>
                  <header className="grid grid-cols-[3.5rem_1fr] gap-x-4 mb-2">
                    <span className="code text-[14px] tracking-[0.16em] text-bone">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-serif italic text-[1.6rem] text-ink leading-snug">
                        {zone}
                      </h3>
                      <p className="caption mt-1.5 max-w-[40rem]">{ZONE_BLURB[zone]}</p>
                    </div>
                  </header>
                  <ul className="border-t border-stone">
                    {items.map((item) => (
                      <PackingRow
                        key={item.id}
                        item={item}
                        isChecked={checklist.isChecked(item.id)}
                        onToggle={() => checklist.toggle(item.id)}
                      />
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>

          {checklist.phrase && (
            <p className="caption mt-12 max-w-[40rem]">
              <span className="font-serif italic text-ink">{checklist.phrase}</span>{" "}
              · this device only.
            </p>
          )}
        </div>

        {/* Right — a hand-drawn top-down sketch of the bag, with the zones
            labelled in italic serif. The sketch is pure SVG — no cartoon. */}
        <aside className="space-y-4">
          <p className="font-serif italic text-[13px] text-bone">
            Compartment sketch · top-down at 1:4
          </p>
          <BagSketch />
          <p className="caption max-w-[34rem]">
            {PACK_DIMENSIONS.width}&nbsp;×&nbsp;{PACK_DIMENSIONS.depth}&nbsp;×&nbsp;{PACK_DIMENSIONS.height}&nbsp;cm
            {" — "}
            {PACK_DIMENSIONS.note}
          </p>
          <p className="caption mt-2 max-w-[34rem]">
            Rough layout. Treat it like the printed bag sketch at the back of
            an expedition guide, not a hard rule.
          </p>
        </aside>
      </div>
    </section>
  );
}

function PackingRow({
  item,
  isChecked,
  onToggle,
}: {
  item: PackItem;
  isChecked: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <label
        htmlFor={`pack-${item.id}`}
        className="flex items-start gap-3 py-3 cursor-pointer"
      >
        <input
          type="checkbox"
          id={`pack-${item.id}`}
          checked={isChecked}
          onChange={onToggle}
          className="sr-only"
        />
        <span
          aria-hidden
          className={`mt-1 block w-4 h-4 shrink-0 border ${
            isChecked ? "border-atlantic" : "border-stone"
          }`}
          style={{
            background: isChecked
              ? "color-mix(in oklab, var(--atlantic) 18%, transparent)"
              : "transparent",
          }}
        >
          {isChecked ? (
            <svg viewBox="0 0 14 14" className="block w-full h-full" stroke="currentColor" strokeWidth="1.6" fill="none" aria-hidden style={{ color: "var(--atlantic)" }}>
              <path d="M3 7.5 L6 10.5 L11 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : null}
        </span>
        <span className="flex-1">
          <span
            className={`block leading-snug text-[14.5px] ${
              isChecked ? "text-bone line-through" : "text-ink"
            }`}
          >
            {item.what}
          </span>
          {item.why ? <span className="block caption mt-1.5">{item.why}</span> : null}
        </span>
      </label>
    </li>
  );
}

function BagSketch() {
  // A 40 × 30 cm rectangle seen from the top, divided into four zones by
  // dashed pencil-line rules. Items are typeset at hand-drawn positions.
  return (
    <svg
      viewBox="0 0 800 600"
      className="w-full h-[360px] sm:h-[480px]"
      role="img"
      aria-label="Top-down schematic of the under-seat bag, with compartments labelled."
    >
      <defs>
        <linearGradient id="bag-tone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EFE9DB" />
          <stop offset="1" stopColor="#E2DCC8" />
        </linearGradient>
        <pattern id="bag-cloth" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M0 14 L14 0" stroke="#B5AC97" strokeOpacity="0.2" strokeWidth="0.7" />
        </pattern>
      </defs>
      {/* Background */}
      <rect x="20" y="20" width="760" height="560" fill="url(#bag-tone)" />
      <rect x="20" y="20" width="760" height="560" fill="url(#bag-cloth)" />

      {/* Bag outline */}
      <g>
        <rect x="60" y="60" width="680" height="480" fill="none" stroke="#1B1F22" strokeWidth="1.7" />
        {/* Top zipper line, slightly wavy. */}
        <path d="M60 60 q 100 -2 200 1 t 280 -2 t 200 0" fill="none" stroke="#1B1F22" strokeWidth="1.2" />
        {/* Corner rivets */}
        <circle cx="60" cy="60" r="3" fill="#1B1F22" />
        <circle cx="740" cy="60" r="3" fill="#1B1F22" />
        <circle cx="60" cy="540" r="3" fill="#1B1F22" />
        <circle cx="740" cy="540" r="3" fill="#1B1F22" />
      </g>

      {/* Compartment rules — dashed pencil lines. */}
      <g stroke="#6B6557" strokeWidth="0.9" strokeDasharray="6 5" fill="none">
        <line x1="60" y1="200" x2="740" y2="200" />
        <line x1="60" y1="380" x2="740" y2="380" />
        <line x1="400" y1="60" x2="400" y2="540" />
      </g>

      {/* Compartment labels in italic Newsreader. */}
      <g fontFamily="var(--font-serif), Georgia, serif" fontStyle="italic" fill="#1B1F22">
        {/* Wear */}
        <text x="80" y="90" fontSize="22">Wear</text>
        <text x="80" y="115" fontSize="12.5" fill="#6B6557" fontStyle="normal">(on the body)</text>
        <text x="80" y="155" fontSize="13.5">Trail-runners, waterproof shell,</text>
        <text x="80" y="172" fontSize="13.5">wool baselayer, hat.</text>

        {/* Pack */}
        <text x="420" y="90" fontSize="22">Pack</text>
        <text x="420" y="115" fontSize="12.5" fill="#6B6557" fontStyle="normal">(in the bag)</text>
        <text x="420" y="155" fontSize="13.5">Laptop, chargers,</text>
        <text x="420" y="172" fontSize="13.5">change of clothes, swim.</text>

        {/* Keep accessible */}
        <text x="80" y="225" fontSize="22">Keep accessible</text>
        <text x="80" y="248" fontSize="12.5" fill="#6B6557" fontStyle="normal">(top pocket)</text>
        <text x="80" y="290" fontSize="13.5">Tickets, passport, wallet,</text>
        <text x="80" y="307" fontSize="13.5">power bank, ear plugs.</text>
        <text x="80" y="345" fontSize="13.5">Medication, toiletries,</text>
        <text x="80" y="362" fontSize="13.5">hand sanitiser.</text>

        {/* Leave at home */}
        <text x="420" y="225" fontSize="22">Leave at home</text>
        <text x="420" y="248" fontSize="12.5" fill="#6B6557" fontStyle="normal">(this trip)</text>
        <text x="420" y="290" fontSize="13.5">Suit, smart shoes,</text>
        <text x="420" y="307" fontSize="13.5">spare passport, cotton layers,</text>
        <text x="420" y="324" fontSize="13.5">spare &quot;just in case&quot; packet.</text>

        {/* Dimension lines */}
        <text x="60" y="582" fontSize="11" fill="#6B6557" fontStyle="normal" fontFamily="var(--font-mono), monospace">
          40&nbsp;cm&nbsp;→
        </text>
        <text x="744" y="582" fontSize="11" fill="#6B6557" fontStyle="normal" fontFamily="var(--font-mono), monospace" textAnchor="end">
          ←&nbsp;40&nbsp;cm
        </text>
      </g>

      {/* A small hand-drawn dimension bracket bottom-left. */}
      <g stroke="#1B1F22" strokeWidth="0.9" fill="none">
        <line x1="20" y1="100" x2="20" y2="540" />
        <line x1="14" y1="100" x2="26" y2="100" />
        <line x1="14" y1="540" x2="26" y2="540" />
      </g>
      <text x="34" y="320" fontFamily="var(--font-mono), monospace" fontSize="11" fill="#1B1F22" transform="rotate(-90 34 320)">
        20&nbsp;cm deep
      </text>

      {/* Caveat scribble in the bottom-right corner. */}
      <text x="700" y="525" fontFamily="var(--font-script), cursive" fontSize="20" fill="#6F2042" transform="rotate(-3 700 525)" opacity="0.85">
        yes, the laptop cuts in.
      </text>
    </svg>
  );
}
