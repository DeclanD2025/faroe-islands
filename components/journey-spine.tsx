// The journey spine — a single composed ribbon.
// The brief wanted a "geographically informed route composition". The honest
// version of this is NOT a literal map of the Faroes — it is the route as a
// single ribbon of stops arranged by travel order, with X marks for each
// stop, a hand-lettered itinerary line running across the page, the ferry
// segments marked in their own tone, and a compass + Caveat scrollheader.
// The Faroe Islands themselves are present everywhere else (the photos,
// the chapter images, the place stamps on /places), so the spine doesn't
// need to fake cartography.

"use client";

import { useEffect, useState } from "react";

const STOPS = [
  { id: "edi", x: 60,  y: 200, label: "Edinburgh",    w: "Wear", brief: "RC 415 lifts 17:10." },
  { id: "fae", x: 140, y: 220, label: "Vágar · FAE",  w: "Sea",  brief: "Atlantic Airways touches down 18:35." },
  { id: "thv", x: 220, y: 240, label: "Tórshavn",     w: "Sea",  brief: "Forty-five minutes by bus." },
  { id: "kbg", x: 320, y: 270, label: "Krambatangi",  w: "Sea",  brief: "Smyril boards at 21:15." },
  { id: "rav", x: 380, y: 290, label: "Øravík",       w: "Land", brief: "Base. Four nights.", emphasis: true },
  { id: "svg", x: 480, y: 230, label: "Sørvágur",     w: "Land", brief: "Guesthouse Hugo." },
  { id: "lgw", x: 620, y: 190, label: "London · LGW", w: "Wear", brief: "RC 416 home, lands 11:25." },
  { id: "stn", x: 720, y: 190, label: "London · STN", w: "Wear", brief: "Coach across · RK 330 19:35." },
  { id: "gla", x: 820, y: 180, label: "Glasgow",      w: "Wear", brief: "Home by ~21:10." },
];

const MODES = [
  { between: [0, 1], kind: "Flight", note: "RC 415",                  tone: "ink" },
  { between: [1, 2], kind: "Bus",    note: "Bus 300",                  tone: "ink" },
  { between: [2, 3], kind: "Ferry",  note: "Smyril",                   tone: "atlantic" },
  { between: [3, 4], kind: "Bus",    note: "Bus 700",                  tone: "ink" },
  { between: [4, 3], kind: "Ferry",  note: "Smyril north · match out", tone: "atlantic" },
  { between: [3, 4], kind: "Ferry",  note: "Smyril south · back",      tone: "atlantic" },
  { between: [4, 5], kind: "Bus",    note: "Bus 700",                  tone: "ink" },
  { between: [5, 1], kind: "Bus",    note: "Bus 300 back through tunnel", tone: "ink" },
  { between: [1, 6], kind: "Flight", note: "RC 416",                  tone: "ink" },
  { between: [6, 7], kind: "Coach",  note: "National Express",        tone: "ink" },
  { between: [7, 8], kind: "Flight", note: "RK 330",                  tone: "ink" },
];

function curvePath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const c1x = a.x + (b.x - a.x) * 0.45;
    const c1y = a.y + 14;
    const c2x = b.x - (b.x - a.x) * 0.45;
    const c2y = b.y - 14;
    d += ` Q ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`;
  }
  return d;
}

export function JourneySpine() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById("journey-spine-anchor");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.7) setRevealed(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const path = curvePath(STOPS);
  const totalLen = 2200;

  return (
    <section
      id="journey-spine-anchor"
      aria-label="The route as a single composed ribbon"
      className="grain relative mx-auto px-6 sm:px-10 pt-24 pb-24 sm:pt-28 sm:pb-32"
    >
      <header className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-x-12 mb-12 sm:mb-16">
        <p className="font-serif italic text-[13px] text-bone md:pt-2">
          A route, composed
        </p>
        <div>
          <h2 className="headline text-[clamp(2.4rem,5.6vw,3.4rem)] leading-[1.05] tracking-tight max-w-[22ch]">
            <span className="italic font-normal">From</span> one ocean <br />
            to the other, in <br />
            <span className="italic font-normal">nine small&nbsp;legs.</span>
          </h2>
          <p className="prose-trip mt-6 max-w-[36rem]">
            The trip is read left to right below: each X mark is a stop, each
            ink-blob a leg, the ferry sections marked in atlantic blue. Six
            chapter days below it. Suðuroy has no bridge and no tunnel —
            the ferry is the spine, not a side trip.
          </p>
        </div>
      </header>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox="0 0 880 360"
          className="w-full h-[420px] sm:h-[460px]"
          role="img"
          aria-label="Hand-drawn ribbon showing nine stops from Edinburgh to Glasgow, with ferry legs marked in atlantic blue."
        >
          <defs>
            <linearGradient id="ribbon-paper" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FBF8F1" />
              <stop offset="1" stopColor="#EFE9DD" />
            </linearGradient>
          </defs>

          {/* Ribbon background — paper-coloured, not a chart. */}
          <rect width="880" height="360" fill="url(#ribbon-paper)" />

          {/* A pin-prick dotted vertical grid — three faint lines so the
              ribbon reads as printed-on-paper rather than a UI surface. */}
          <g stroke="#B5AC97" strokeOpacity="0.35" strokeWidth="0.5">
            {[120, 200, 280].map((y) => (
              <line key={y} x1="0" x2="880" y1={y} y2={y} strokeDasharray="1 6" />
            ))}
          </g>

          {/* The route curve. Drawn in ink, dashed, animates in on first
              reveal. The ferry segments are drawn over the top in atlantic. */}
          <path
            d={path}
            fill="none"
            stroke="#1B1F22"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2 4"
            style={{
              strokeDasharray: revealed ? "2 4" : totalLen,
              strokeDashoffset: revealed ? 0 : totalLen,
              transition: "stroke-dashoffset 1.8s ease-out, stroke-dasharray 1.8s ease-out",
            }}
          />

          {/* A second copy of the curve hugging the ferry segments in
              atlantic blue, only over the arcs that are boats. */}
          {[
            { from: STOPS[2], to: STOPS[3] },
            { from: STOPS[3], to: STOPS[4] },
            { from: STOPS[4], to: STOPS[3] },
            { from: STOPS[3], to: STOPS[2] },
          ].map((arc, i) => (
            <path
              key={`ferry-${i}`}
              d={`M ${arc.from.x} ${arc.from.y} Q ${(arc.from.x + arc.to.x) / 2} ${(arc.from.y + arc.to.y) / 2 + 14}, ${arc.to.x} ${arc.to.y}`}
              fill="none"
              stroke="#2D4B5F"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.85"
            />
          ))}

          {/* X marks for each stop. Slight rotation per stop, so the ribbon
              reads as stamped rather than vector-perfect. */}
          {STOPS.map((stop, i) => {
            const r = stop.emphasis ? 7.4 : 5.4;
            const angle = -10 + ((i * 7) % 18) - 9;
            const ink = stop.emphasis ? "#6F2042" : "#1B1F22";
            return (
              <g key={stop.id} transform={`translate(${stop.x} ${stop.y}) rotate(${angle})`}>
                <line x1={-r} y1={-r} x2={r} y2={r} stroke={ink} strokeWidth={1.7} />
                <line x1={-r} y1={r} x2={r} y2={-r} stroke={ink} strokeWidth={1.7} />
                <circle r={1.6} fill="#FBF8F1" />
              </g>
            );
          })}

          {/* Stop labels — italic Newsreader serif just above each X. */}
          {STOPS.map((stop) => (
            <g key={`label-${stop.id}`}>
              <text
                x={stop.x}
                y={stop.y - 14}
                fontFamily="var(--font-serif), Georgia, serif"
                fontStyle="italic"
                fontSize="13.5"
                textAnchor="middle"
                fill="#1B1F22"
              >
                {stop.label}
              </text>
              <text
                x={stop.x}
                y={stop.y + 30}
                fontFamily="var(--font-serif), Georgia, serif"
                fontSize="10.5"
                textAnchor="middle"
                fill="#6B6557"
              >
                {stop.brief}
              </text>
            </g>
          ))}

          {/* Mode-note labels in the ribbon between stops, set small and
              handwritten in Caveat so they read like a trip editor's notes. */}
          {MODES.map((mode) => {
            const a = STOPS[mode.between[0]];
            const b = STOPS[mode.between[1]];
            const x = (a.x + b.x) / 2;
            const y = a.y - 32;
            return (
              <g key={mode.kind + mode.note}>
                <text
                  x={x}
                  y={y}
                  fontFamily="var(--font-script), cursive"
                  fontSize="13"
                  textAnchor="middle"
                  fill={mode.tone === "atlantic" ? "#2D4B5F" : "#1B1F22"}
                  transform={`rotate(-3 ${x} ${y})`}
                >
                  {mode.kind.toLowerCase()} · {mode.note}
                </text>
              </g>
            );
          })}

          {/* Compass — top-right. Hand-lettered N, no decorative compass rose. */}
          <g transform="translate(820,46)">
            <circle r="22" fill="none" stroke="#6B6557" strokeWidth="0.6" strokeDasharray="1 4" />
            <path d="M0,-20 L3,0 L0,3 L-3,0 Z" fill="#1B1F22" />
            <path d="M0,20 L3,0 L0,-3 L-3,0 Z" fill="none" stroke="#1B1F22" strokeWidth="0.6" />
            <text x="0" y="-25" fontFamily="var(--font-serif), serif" fontStyle="italic" fontSize="10.5" textAnchor="middle" fill="#6B6557">N</text>
          </g>

          {/* Lower-right footnote — italic, in the parchment margin. */}
          <text x="868" y="338" textAnchor="end" fontFamily="var(--font-serif), serif" fontStyle="italic" fontSize="10.5" fill="#6B6557">
            leg-of-the-trip · hand-drawn · 2026
          </text>
        </svg>
      </div>

      <p className="prose-trip mt-10 max-w-[40rem] italic text-[15.5px] text-bone">
        Two ferries cross the fjord either way. If the sea is high and the
        timetable drops, we wait in Tórshavn; it&apos;s a fine day too.
      </p>
    </section>
  );
}
