// Editorial hero — art-directed cover.
// Real photo (Drangarnir, Faroe Islands · Wikimedia Commons) at full-bleed 100svh.
// Typography does NOT live in a glass panel. It floats organically: a massive
// Newsreader italic countdown overlapping the cliff edge in the bottom-left,
// a handwritten Caveat scribble hung off-axis in the upper-right margin, a
// tabular mono date line set against the wash. The cover should feel like the
// first page of a printed expedition guide, not the top of a website.

"use client";

import { TRIP } from "@/lib/data/itinerary";
import { useCountdown } from "@/lib/hooks/use-countdown";

export function EditorialHero() {
  const countdown = useCountdown(TRIP.countdownTarget);

  return (
    <section
      className="relative isolate overflow-hidden"
      style={{ height: "100svh", minHeight: "640px" }}
    >
      {/* The photograph itself. Sharp-edged by intent; sepia-toned so the
          photo melts into the parchment palette without looking digitally
          pasted on. */}
      <picture className="absolute inset-0 -z-30 block">
        <img
          src="/images/faroes/drangarnir.jpg"
          alt="Drangarnir and Tindholmur seen across the sea — Vágar, Faroe Islands."
          className="h-full w-full object-cover photo-tone-deep"
          loading="eager"
          decoding="async"
        />
      </picture>

      {/* Two narrow tonal layers that draw the eye to the cliff edge where the
          floating typography sits. */}
      <div
        className="absolute inset-0 -z-20 mix-blend-multiply"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(11,17,22,0.40) 0%, rgba(11,17,22,0.10) 28%, transparent 48%, rgba(11,17,22,0.05) 70%, rgba(11,17,22,0.42) 100%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(50% 50% at 12% 88%, rgba(251,248,241,0.18), transparent 60%)",
        }}
      />

      {/* Sentinel for the top-nav IntersectionObserver. Hero ends here. */}
      <span id="hero-end" className="absolute bottom-0 left-0 block h-px w-full" aria-hidden />

      {/* Caveat marginalia — handwritten note slightly rotated, hung off the
          upper-right inner edge. */}
      <p
        className="hidden sm:block absolute top-7 right-9 text-[1.55rem] max-w-[18ch] rotate-[-2deg] script script--atlantic"
        aria-hidden
      >
        the smallest bag<br />
        I&apos;ve ever packed.
      </p>

      {/* An eyebrow set against the upper-left margin, in tiny Newsreader
          italic. The "cover line" — like the title block of a magazine cover. */}
      <header className="absolute top-7 left-6 sm:left-10 max-w-[26rem]">
        <p className="font-serif italic text-[13px] text-paper/85">
          A private field guide · 2026
        </p>
        <p className="font-serif italic text-[13px] text-paper/70 mt-1">
          Motherwell v HB Tórshavn
        </p>
      </header>

      {/* The main rallying type sits in the lower-left, deliberately
          overlapping the bottom 1/4 where the cliff becomes water. */}
      <div className="absolute left-6 sm:left-10 bottom-10 right-10 max-w-[min(60rem,calc(100vw-5rem))]">
        <h1 className="text-paper leading-[0.92] font-serif">
          <span className="block text-[clamp(2.6rem,7.4vw,5.5rem)] tracking-[-0.012em]">
            <span className="italic font-normal">Faroe</span> Islands.
          </span>
          <span className="block mt-3 text-[clamp(2.4rem,6.6vw,4.6rem)] italic font-normal opacity-90">
            at the edge of the North Atlantic.
          </span>
        </h1>

        <div className="mt-8 sm:mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-4">
          <p className="code text-paper/85 text-[14px] tracking-[0.18em]">
            27 JUL — 1 AUG 2026
          </p>
          <p className="font-serif italic text-paper/80 text-[14.5px] max-w-[24rem]">
            Edinburgh → Vágar → Tórshavn → Øravík → Sørvágur → LGW → STN → GLA
          </p>
        </div>

        {/* The countdown — single line, massive Newsreader italic. The hook
            suppresses mismatch by returning a stable em-dash until the client
            has ticked. */}
        <div className="mt-12 sm:mt-16 flex flex-wrap items-baseline gap-x-6 gap-y-3">
          <span suppressHydrationWarning className="font-serif italic text-paper text-[clamp(3.4rem,9vw,6.4rem)] leading-none opacity-95">
            {countdown.phrase ?? "—"}
          </span>
          <span className="font-serif italic text-paper/72 text-[14.5px] max-w-[22rem]">
            until RC 415 lifts from Edinburgh,
            <br />
            bound for Vágar, Atlantic Airways.
          </span>
        </div>
      </div>

      {/* A bottom-strip of mono operating times set against the tonal
          wash — the cover's small print line, beneath the picture. */}
      <div className="absolute inset-x-6 sm:inset-x-10 bottom-3 flex items-baseline justify-between text-[11.5px] text-paper/55 font-mono">
        <span>FAE 18:35 · Tórsvøllur 19:50 local</span>
        <span>Sunset 22:14 · daylight til ~23:00</span>
      </div>
    </section>
  );
}
