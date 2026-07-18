// Full-bleed Claret/Amber match-day climax.
// This is the emotional peak of the trip. The page earns a single devoted
// section with Motherwell colours — but everything on it should read as a
// printed match programme + ferry-ticket fragment, NOT as a Stripe receipt or
// a SaaS audit-log stepper.
//
// Notable moves:
//   * Fixture wordmark set in Anton (heavy condensed sans) at large size,
//     stacked vertically like a 1970s programme cover.
//   * The ticket fragment uses a torn-paper SVG mask (right + bottom edges).
//   * The "AWAY END" stamp uses mix-blend-mode multiply + a slight rotation
//     so it reads as physical ink overlay rather than a UI badge.
//   * The operational timeline is a hand-drawn jagged SVG connector rather
//     than a coloured-circle stepper.

import { FERRY, MATCH_FIXTURE, PUBS_NEAR_GROUND } from "@/lib/data/itinerary";
import { TripCountdown } from "./trip-countdown";

type FerryRow = { dep: string; arr: string; note: string; highlight: boolean };

export function MatchDayClimax() {
  return (
    <section
      id="match-climax"
      aria-label="Motherwell v HB on Thursday 30 July 2026"
      className="relative isolate overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #6F2042 0%, #5A1B38 100%)",
      }}
    >
      {/* A faint amber wash low in the frame — the field lights. */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 opacity-30 -z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(80% 100% at 50% 100%, rgba(232,163,61,0.45), transparent 70%)",
        }}
      />
      {/* A 1.5px amber vertical rule pinned right. */}
      <div
        className="absolute right-0 top-0 bottom-0 w-px md:w-[1.5px]"
        aria-hidden
        style={{ background: "rgba(232,163,61,0.35)" }}
      />

      <div className="mx-auto px-6 sm:px-12 pt-24 pb-24 sm:pt-28 sm:pb-32 text-paper relative z-[1]">
        {/* Programme banner — Anton-style fixture wordmark stacked, the way
            a stapled matchday programme of the 70s/80s would have done it. */}
        <header className="mb-14 sm:mb-20">
          <p className="programme text-paper/70 text-[12.5px] tracking-[0.35em] uppercase mb-3">
            Match programme · Thursday 30 July 2026
          </p>
          <div className="grid grid-cols-12 items-end gap-x-6">
            <h2 className="programme col-span-12 sm:col-span-7 text-paper text-[clamp(3.6rem,9vw,7.2rem)] leading-[0.82] tracking-tight">
              <span className="block">MOTHERWELL</span>
              <span className="block my-2 sm:my-3 text-[clamp(0.78rem,1.4vw,1.2rem)] tracking-[0.5em] pl-1" style={{ color: "rgba(245,240,232,0.7)" }}>v</span>
              <span className="block">HB&nbsp;TÓRSHAVN</span>
            </h2>
            <div className="col-span-12 sm:col-span-5 sm:pl-6 mt-6 sm:mt-0">
              <p className="programme text-amber text-[12.5px] tracking-[0.3em] uppercase mb-2" style={{ color: "rgba(232,163,61,0.95)" }}>
                The fixture
              </p>
              <p className="font-serif text-paper text-[1.05rem] leading-snug">
                {MATCH_FIXTURE.competition}
              </p>
              <p className="caption mt-2 text-paper/80 max-w-[24rem]">
                {MATCH_FIXTURE.venue} · capacity {MATCH_FIXTURE.capacity}.
              </p>
            </div>
          </div>

          {/* The claret AWAY END stamp — multiply-blended so it bleeds into
              the surface like physical ink. */}
          <div className="mt-8 sm:mt-10 flex items-center gap-6">
            <span className="stamp text-paper" style={{ color: "#FBF8F1", borderColor: "#FBF8F1" }}>AWAY&nbsp;END</span>
            <span className="caption text-paper/70 max-w-[24rem]">
              Stamp drawn on top of the programme — the way a return-bus driver might mark &quot;sold out&quot;.
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr] gap-x-16 gap-y-16 pt-8 border-t border-amber/40" style={{ borderColor: "rgba(232,163,61,0.4)" }}>
          {/* LEFT — torn-paper ticket fragment + the kickoff countdown. */}
          <div>
            {/* The torn-paper ticket SVG clip — drawn with a real jagged
                right + bottom edge. */}
            <div className="relative inline-block w-full max-w-[30rem]">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 600 360"
                preserveAspectRatio="none"
                aria-hidden
              >
                <defs>
                  <clipPath id="tear" clipPathUnits="userSpaceOnUse">
                    <path d="M0,0 H600 V340 L588,348 L572,338 L554,346 L534,340 L516,348 L494,338 L476,346 L452,340 L430,348 L408,338 L386,346 L362,340 L344,348 L320,338 L298,346 L274,340 L252,348 L226,338 L204,346 L180,340 L160,348 L138,340 L116,346 L96,338 L78,348 L60,340 L42,346 L24,338 L8,348 L0,340 Z M584,0 L596,12 L584,28 L596,42 L584,58 L596,72 L584,90 L596,108 L584,128 L596,148 L584,168 L596,188 L584,212 L596,236 L584,262 L596,288 L584,316 L596,344 L584,360" />
                  </clipPath>
                </defs>
                <g clipPath="url(#tear)">
                  <rect x="0" y="0" width="600" height="360" fill="rgba(245,240,232,0.06)" />
                </g>
              </svg>
              <div className="relative p-7 sm:p-9 max-w-[30rem]">
                <p className="programme text-paper/55 text-[10.5px] tracking-[0.35em] uppercase mb-3">
                  Gate · Stand · Block · Seat
                </p>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-paper">
                  <Stat label="Kick-off" value={MATCH_FIXTURE.kickoffLocal} />
                  <Stat label="Full time" value={MATCH_FIXTURE.fullTime} />
                  <Stat label="Referee" value={MATCH_FIXTURE.referee ?? "TBC"} />
                  <Stat label="Allocation" value="Motherwell FC" />
                </div>
                <p className="caption mt-5 text-paper/65 max-w-[24rem]">
                  The away end opens on the north terrace. Match tickets served
                  up the Motherwell allocation; save offline and bring a paper
                  copy — the turnstile has been known not to scan.
                </p>
              </div>
            </div>

            {/* The kickoff countdown — a single line. */}
            <div className="mt-10 sm:mt-14 flex items-baseline gap-6">
              <div>
                <p className="caption text-paper/65 mb-2">Kick-off in</p>
                <TripCountdown target="2026-07-30T17:00:00Z" />
              </div>
              <span
                className="script script--atlantic text-[1.4rem] rotate-[-2deg] max-w-[18rem] text-paper/75"
                aria-hidden
              >
                one line — not a tactical framework.
              </span>
            </div>
          </div>

          {/* RIGHT — operational spine. Two ferry columns + hand-drawn
              timeline. */}
          <div className="relative">
            <p className="programme text-paper/65 text-[10.5px] tracking-[0.35em] uppercase mb-4">
              Operational spine
            </p>
            <h3 className="font-serif text-[1.7rem] italic text-paper leading-snug mb-8 max-w-[26ch]">
              Øravík to Tórsvøllur, back by the last boat.
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-12">
              <FerryColumn
                title="Northbound · Thu"
                rows={FERRY.matchNorthbound.map((r: { dep: string; arr: string; note?: string; highlight?: boolean }): FerryRow => ({
                  dep: r.dep,
                  arr: r.arr.replace(/^Krambatangi\s/, "→ Tórshavn "),
                  note: r.note ?? "",
                  highlight: r.highlight ?? false,
                }))}
              />
              <FerryColumn
                title="Southbound · Thu"
                rows={FERRY.matchSouthbound.map((r: { dep: string; arr: string; note?: string; highlight?: boolean }): FerryRow => ({
                  dep: r.dep,
                  arr: r.arr.replace(/^Krambatangi\s/, "→ Suðuroy "),
                  note: r.note ?? "",
                  highlight: r.highlight ?? false,
                }))}
              />
            </div>

            <p
              className="programme text-paper/75 mb-4 text-[10.5px] tracking-[0.35em] uppercase"
              style={{ color: "rgba(232,163,61,0.85)" }}
            >
              Timeline · top to bottom
            </p>

            {/* Hand-drawn jagged timeline. Each node hangs off a vertical
                wavy SVG path rather than a perfect 1px rule + bubble. */}
            <div className="grid grid-cols-[2.5rem_1fr] gap-x-4">
              <div className="relative">
                <svg
                  viewBox="0 0 32 560"
                  className="w-8 h-[560px]"
                  aria-hidden
                  preserveAspectRatio="none"
                >
                  <path
                    d="M16 4 q-4 32 4 60 q8 28 -2 60 q-10 32 6 60 q8 28 -4 60 q-12 32 4 60 q8 28 -2 60 q-10 32 4 60 q-4 28 -2 60 q4 28 0 56"
                    fill="none"
                    stroke="rgba(232,163,61,0.55)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <ol className="space-y-7 pb-2">
                <TimelineNode time="11:30" title="Ferry north · Krambatangi → Tórshavn" />
                <TimelineNode time="13:35" title="Tinganes & the harbour" sub="OY Brewing, 5 min from the ground." />
                <TimelineNode time="18:00" title="Kick-off · Tórsvøllur" highlight />
                <TimelineNode time="~19:50" title="Full time · walk for the pier" />
                <TimelineNode time="20:15" title="Foot-passenger queue" sub="An hour is plenty." />
                <TimelineNode time="21:15" title="Last ferry south" critical />
                <TimelineNode time="~23:20" title="Krambatangi · brief hop to Øravík" />
              </ol>
            </div>

            <p className="programme text-paper/65 mt-12 mb-3 text-[10.5px] tracking-[0.35em] uppercase">
              Three pubs · within twenty minutes of the ground
            </p>
            <ul className="space-y-2 max-w-[34rem]">
              {PUBS_NEAR_GROUND.map((p) => (
                <li key={p.name} className="grid grid-cols-[10rem_1fr] text-[13.5px] leading-snug">
                  <span className="font-serif italic text-paper">{p.name}</span>
                  <span className="text-paper/75">{p.walk} · {p.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Operational caveat pinned to the amber line. */}
        <div
          className="mt-20 sm:mt-28 border-t pt-6 text-paper/85 max-w-[40rem]"
          style={{ borderColor: "rgba(232,163,61,0.35)" }}
        >
          <p className="programme text-[10.5px] tracking-[0.35em] uppercase mb-2" style={{ color: "rgba(232,163,61,0.9)" }}>
            Operational caveat
          </p>
          <p className="font-serif text-[1.15rem] italic leading-snug">
            Stadium to ferry terminal is roughly one kilometre, fifteen to
            twenty minutes on foot. The 21:15 is the last sailing of the
            day; miss it and we sleep in Tórshavn.
          </p>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="caption text-paper/55 mb-1">{label}</p>
      <p className="font-serif text-[1.05rem] text-paper">{value}</p>
    </div>
  );
}

function FerryColumn({ title, rows }: { title: string; rows: FerryRow[] }) {
  return (
    <div>
      <p className="caption text-paper/65 mb-4">{title}</p>
      <ul className="space-y-2.5">
        {rows.map((r) => (
          <li
            key={r.dep}
            className="font-serif text-[13.5px] leading-snug"
            style={{ color: r.highlight ? "#FBF8F1" : "rgba(245,240,232,0.78)" }}
          >
            <span className="font-mono tracking-wide text-amber text-[12px]">{r.dep}</span>
            <span style={{ color: r.highlight ? "#FBF8F1" : "rgba(232,163,61,0.85)" }} className="ml-1">
              {r.arr}
            </span>
            {r.note ? (
              <span className="ml-2 text-paper/55 font-serif italic text-[12px]">{r.note}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TimelineNode({
  time,
  title,
  sub,
  highlight,
  critical,
}: {
  time: string;
  title: string;
  sub?: string;
  highlight?: boolean;
  critical?: boolean;
}) {
  return (
    <li className="relative">
      <span
        className="absolute -left-[1.65rem] top-[0.45rem] block"
        aria-hidden
      >
        {/* A hand-drawn X glyph instead of a generic circle. */}
        <svg width="14" height="14" viewBox="0 0 14 14">
          <line x1="2" y1="2" x2="12" y2="12" stroke={critical ? "#E8A33D" : highlight ? "#FBF8F1" : "rgba(232,163,61,0.85)"} strokeWidth="1.7" />
          <line x1="2" y1="12" x2="12" y2="2" stroke={critical ? "#E8A33D" : highlight ? "#FBF8F1" : "rgba(232,163,61,0.85)"} strokeWidth="1.7" />
        </svg>
      </span>
      <div>
        <p className="font-mono text-[12px] tracking-wide" style={{ color: "rgba(232,163,61,0.85)" }}>
          {time}
        </p>
        <p
          className="font-serif text-[1.05rem] leading-snug"
          style={{ color: critical || highlight ? "#FBF8F1" : "rgba(245,240,232,0.95)" }}
        >
          {title}
        </p>
        {sub ? <p className="caption text-paper/65 mt-1">{sub}</p> : null}
      </div>
    </li>
  );
}
