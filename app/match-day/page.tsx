// /match-day — the match programme as a full page. Anton wordmark hero,
// ferry schedule section, hand-drawn timeline under it. Claret programme
// throughout (this is the only place claret is loud).

import { FERRY, MATCH_FIXTURE, PUBS_NEAR_GROUND } from "@/lib/data/itinerary";
import { TripCountdown } from "@/components/trip-countdown";

export default function MatchDayPage() {
  return (
    <article
      className="relative isolate overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #6F2042 0%, #5A1B38 100%)",
      }}
    >
      <div
        className="absolute inset-x-0 bottom-0 h-40 opacity-30"
        aria-hidden
        style={{
          background:
            "radial-gradient(80% 100% at 50% 100%, rgba(232,163,61,0.45), transparent 70%)",
        }}
      />

      <header className="relative mx-auto px-6 sm:px-12 pt-24 pb-16 sm:pt-28 sm:pb-20 text-paper">
        <p className="programme text-paper/70 text-[12.5px] tracking-[0.35em] uppercase mb-4">
          Match programme · Thursday 30 July 2026
        </p>
        <h1 className="programme text-paper text-[clamp(3.6rem,9vw,7.6rem)] leading-[0.82] tracking-tight">
          <span className="block">MOTHERWELL</span>
          <span className="block my-2 sm:my-3 text-[clamp(0.78rem,1.4vw,1.2rem)] tracking-[0.5em] pl-1" style={{ color: "rgba(245,240,232,0.7)" }}>v</span>
          <span className="block">HB&nbsp;TÓRSHAVN</span>
        </h1>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 max-w-[64rem]">
          <p className="font-serif text-paper text-[1.05rem] leading-snug">
            {MATCH_FIXTURE.competition}
          </p>
          <p className="caption text-paper/80 max-w-[24rem]">
            {MATCH_FIXTURE.venue} · capacity {MATCH_FIXTURE.capacity}.
          </p>
        </div>

        <div className="mt-8">
          <span className="stamp text-paper" style={{ color: "#FBF8F1", borderColor: "#FBF8F1" }}>AWAY&nbsp;END</span>
        </div>

        <div className="mt-12 flex flex-wrap items-baseline gap-x-10 gap-y-4 max-w-[64rem]">
          <div>
            <p className="caption text-paper/65 mb-2">Kick-off in</p>
            <TripCountdown target="2026-07-30T17:00:00Z" />
          </div>
          <p
            className="font-serif italic text-paper/80 text-[15.5px] max-w-[28rem]"
          >
            Stadium to ferry terminal is one kilometre, fifteen to twenty minutes
            on foot. The last sailing is at 21:15 — that&apos;s the deadline.
          </p>
        </div>
      </header>

      <div className="relative mx-auto px-6 sm:px-12 pb-24 sm:pb-32 text-paper">
        <section className="border-t pt-10" style={{ borderColor: "rgba(232,163,61,0.4)" }}>
          <p className="programme text-paper/65 text-[10.5px] tracking-[0.35em] uppercase mb-4">
            Ferry schedule · match day
          </p>
          <h2 className="font-serif italic text-[2rem] leading-tight max-w-[24rem] mb-8">
            The ferries that decide whether the day works.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <FerryColumn
              title="Northbound · Thu"
              rows={FERRY.matchNorthbound.map((r: { dep: string; arr: string; note?: string; highlight?: boolean }) => ({
                dep: r.dep,
                arr: r.arr.replace(/^Krambatangi\s/, "→ Tórshavn "),
                note: r.note ?? "",
                highlight: r.highlight ?? false,
              }))}
            />
            <FerryColumn
              title="Southbound · Thu"
              rows={FERRY.matchSouthbound.map((r: { dep: string; arr: string; note?: string; highlight?: boolean }) => ({
                dep: r.dep,
                arr: r.arr.replace(/^Krambatangi\s/, "→ Suðuroy "),
                note: r.note ?? "",
                highlight: r.highlight ?? false,
              }))}
            />
          </div>
        </section>

        <section className="mt-20 border-t pt-10" style={{ borderColor: "rgba(232,163,61,0.4)" }}>
          <p className="programme text-paper/65 text-[10.5px] tracking-[0.35em] uppercase mb-4">
            Timeline · read top to bottom
          </p>
          <h2 className="font-serif italic text-[2rem] leading-tight max-w-[24rem] mb-8">
            Øravík to Tórsvøllur, back by the last boat.
          </h2>

          <div className="grid grid-cols-[2.5rem_1fr] gap-x-4">
            <div className="relative">
              <svg viewBox="0 0 32 560" className="w-8 h-[560px]" aria-hidden preserveAspectRatio="none">
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
        </section>

        <section className="mt-20 border-t pt-10" style={{ borderColor: "rgba(232,163,61,0.4)" }}>
          <p className="programme text-paper/65 text-[10.5px] tracking-[0.35em] uppercase mb-4">
            Three pubs · within twenty minutes of the ground
          </p>
          <ul className="space-y-2 max-w-[40rem]">
            {PUBS_NEAR_GROUND.map((p) => (
              <li key={p.name} className="grid grid-cols-[10rem_1fr] text-[13.5px] leading-snug">
                <span className="font-serif italic text-paper">{p.name}</span>
                <span className="text-paper/75">{p.walk} · {p.note}</span>
              </li>
            ))}
          </ul>

          <div
            className="mt-16 border-t pt-6"
            style={{ borderColor: "rgba(232,163,61,0.35)" }}
          >
            <p className="programme text-[10.5px] tracking-[0.35em] uppercase mb-2" style={{ color: "rgba(232,163,61,0.9)" }}>
              Operational caveat
            </p>
            <p className="font-serif text-[1.15rem] italic leading-snug max-w-[40rem]">
              Stadium to ferry terminal is roughly one kilometre, fifteen to
              twenty minutes on foot. The 21:15 is the last sailing of the
              day; miss it and we sleep in Tórshavn.
            </p>
          </div>
        </section>
      </div>
    </article>
  );
}

type FerryRow = { dep: string; arr: string; note: string; highlight: boolean };

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
  time, title, sub, highlight, critical,
}: {
  time: string;
  title: string;
  sub?: string;
  highlight?: boolean;
  critical?: boolean;
}) {
  return (
    <li className="relative">
      <span className="absolute -left-[1.65rem] top-[0.45rem] block" aria-hidden>
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
