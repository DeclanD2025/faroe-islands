// "Before we leave" — the editorial strip for the three practical items that
// genuinely remain to do before departure. The copy is in Declan's voice, not
// in a generic SaaS blueprint. The strip sits in a narrow column with a Caveat
// marginalia hung off the page edge.

import { BEFORE_WE_LEAVE } from "@/lib/data/itinerary";

export function BeforeWeLeave() {
  return (
    <section
      id="before-we-leave"
      aria-label="Three open items before departure"
      className="relative mx-auto px-6 sm:px-10 pt-24 pb-24 sm:pt-28 sm:pb-28"
      style={{ maxWidth: "min(46rem, 100%)" }}
    >
      {/* A handwritten marginalia hung slightly rotated, off the right edge
          of the column. */}
      <p
        className="absolute -right-2 sm:right-[-3rem] top-24 script script--atlantic text-[1.45rem] rotate-[3deg] max-w-[16ch] hidden sm:block"
        aria-hidden
      >
        solve these<br />before we fly.
      </p>

      <header className="mb-12">
        <p className="font-serif italic text-[13px] text-bone mb-3">
          Folio note · read first
        </p>
        <h2 className="headline text-[clamp(2.4rem,5.6vw,3.4rem)] leading-[1.04] tracking-tight max-w-[20ch]">
          <span className="italic font-normal">Before</span> we leave.
        </h2>
        <p className="prose-trip mt-5 text-paper/0 max-w-[40rem]">
          <span className="text-ink">
            Three practical things that genuinely matter right now. If any of
            these is unhandled by Sunday night, the trip changes shape — not
            just the schedule. The days below assume they&apos;re sorted.
          </span>
        </p>
      </header>

      <ol className="space-y-0">
        {BEFORE_WE_LEAVE.map((item, i) => (
          <li
            key={item.title}
            className="grid grid-cols-[3.5rem_1fr] gap-x-4 py-8 border-t border-stone first:border-t-0"
          >
            <div className="pt-1">
              <span className="code text-[14px] tracking-[0.16em] text-bone">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div>
              <h3 className="font-serif text-[1.4rem] leading-snug tracking-tight text-ink">
                {item.title}
              </h3>
              <p className="prose-trip mt-3 text-[1.0625rem] leading-[1.7] text-ink/90 max-w-[34rem]">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {/* A smaller handwritten scrawl in the bottom-left margin, as if a
          reader had circled back and added a note. */}
      <p
        className="mt-12 script script--claret text-[1.4rem] rotate-[-2deg] max-w-[28ch]"
        aria-hidden
      >
        if anything here is still red on Monday, tell me — we can&apos;t wing it from Vágar at 19:00.
      </p>
    </section>
  );
}
