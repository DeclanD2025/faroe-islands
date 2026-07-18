// /places — Topographic navigation chart feel.
// Muted land background, dark sea, ferry route lines in deep fjord blue,
// numbered village markers in signal yellow, village names + compact
// coordinates. No Google Maps style. The Faroe Islands silhouette is
// drawn purely as an SVG contour with the Otago-style paler wash.

import { PLACES } from "@/lib/data/itinerary";

// Topographic chart palette — bound to palette tokens (modern SVG supports
// `var(--token)` in fill, so a later palette edit propagates everywhere).
const LAND = "var(--fog)";
const WATER = "var(--fjord)";

export default function PlacesPage() {
  return (
    <article className="px-6 sm:px-8 lg:px-12 pt-10 pb-20 max-w-[64rem]">
      <header className="pb-8">
        <p className="label">Map · topographic chart</p>
        <h1 className="font-sans font-medium text-[clamp(2rem,4.4vw,3rem)] leading-[1.04] mt-3 text-basalt tracking-[-0.012em]">
          Walk, drive, sail. In that order.
        </h1>
        <p className="caption mt-3 max-w-[36rem]">
          Numbered markers — read left to right. Suðuroy on the south, the
          ferry runway between Krambatangi and Tórshavn, the airport island
          on the west. Coordinates in degrees-minutes.
        </p>
      </header>

      <div className="border border-basalt/15 mb-10 p-2 sm:p-4 bg-fog/30">
        <svg viewBox="0 0 600 320" className="w-full h-auto" role="img" aria-label="Topographic navigation chart of the Faroe Islands showing the trip route">
          <defs>
            <pattern id="contour" width="18" height="14" patternUnits="userSpaceOnUse">
              <path d="M0 7 Q 4.5 0 9 7 T 18 7" fill="none" stroke={LAND} strokeOpacity="0.9" strokeWidth="0.6" />
            </pattern>
          </defs>
          {/* Sea */}
          <rect width="600" height="320" fill={WATER} />

          {/* Faroe archipelago hand-drawn */}
          <g>
            {/* Streymoy */}
            <path d="M150,80 C 200,60 260,75 290,90 C 305,100 295,115 280,120 C 240,140 200,135 170,120 C 145,110 135,95 150,80 Z" fill={LAND} stroke="var(--moss)" strokeWidth="0.7" />
            {/* Eysturoy */}
            <path d="M320,90 C 360,75 390,90 380,110 C 365,135 320,125 310,110 Z" fill={LAND} stroke="var(--moss)" strokeWidth="0.7" />
            {/* Vágar */}
            <path d="M70,90 C 100,80 130,82 130,105 C 115,120 80,115 70,100 Z" fill={LAND} stroke="var(--moss)" strokeWidth="0.7" />
            {/* Suðuroy */}
            <path d="M250,200 C 300,180 350,195 360,210 C 350,235 290,235 250,220 C 235,215 240,205 250,200 Z" fill={LAND} stroke="var(--moss)" strokeWidth="0.7" />
            {/* Sandoy */}
            <path d="M240,180 C 255,170 280,170 295,180 C 290,195 260,195 240,185 Z" fill={LAND} stroke="var(--moss)" strokeWidth="0.7" />

            {/* Contour textures inside each landmass */}
            <rect x="60" y="80" width="320" height="160" fill="url(#contour)" opacity="0.6" />
          </g>

          {/* Plot numbered markers. Coordinates are illustrative. */}
          {MARKERS.map((m) => (
            <g key={m.num} transform={`translate(${m.x} ${m.y})`}>
              <circle r="9" fill="var(--yellow)" stroke="var(--basalt)" strokeWidth="0.7" />
              <text x="0" y="3.5" fontFamily="ui-monospace, monospace" fontSize="9" textAnchor="middle" fill="var(--basalt)" fontWeight="600">
                {m.num}
              </text>
              <text x="13" y="-2" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="10" fill="var(--wool)" fontWeight="500">
                {m.name}
              </text>
              <text x="13" y="11" fontFamily="ui-monospace, monospace" fontSize="8.5" fill="var(--wool)" opacity="0.85">
                {m.coord}
              </text>
            </g>
          ))}

          {/* Ferry route lines — Route 7, the spine of the trip. */}
          {/* Tórshavn → Krambatangi */}
          <line x1="245" y1="100" x2="295" y2="190" stroke="var(--yellow)" strokeWidth="1" strokeDasharray="3 3" />
          {/* Tórshavn ↔ Suðuroy → meaning also the bottom ferry */}
          <line x1="245" y1="100" x2="305" y2="200" stroke="var(--rust)" strokeWidth="1.4" />
          <line x1="305" y1="200" x2="295" y2="190" stroke="var(--rust)" strokeWidth="1.4" />

          {/* Subtle weather-station indicator at Vágar */}
          <circle cx="100" cy="95" r="3" fill="none" stroke="var(--yellow)" strokeWidth="1" />
          <text x="108" y="98" fontFamily="ui-monospace, monospace" fontSize="7" fill="var(--yellow)">WSW 18 kt</text>

          {/* Compass rose */}
          <g transform="translate(560,40)">
            <circle r="22" fill="none" stroke="var(--wool)" strokeWidth="0.6" strokeDasharray="1 3" opacity="0.65" />
            <path d="M0,-20 L3,0 L0,3 L-3,0 Z" fill="var(--wool)" />
            <text x="0" y="-25" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="9" textAnchor="middle" fill="var(--wool)">N</text>
          </g>
        </svg>
      </div>

      {/* Numbered places list — paper-style coordinate reference. */}
      <ol>
        {MARKERS.map((m, i) => {
          const place = PLACES[i];
          return (
            <li key={m.num} className="grid grid-cols-[3rem_8rem_1fr] sm:grid-cols-[3.5rem_10rem_1fr] gap-x-4 py-4 border-b border-basalt/10 items-baseline">
              <span className="font-mono text-[14px] tnum text-basalt font-medium" aria-hidden>{m.num}</span>
              <div>
                <p className="font-medium text-basalt text-[15px]">{m.name}</p>
                <p className="caption mono-label tnum mt-0.5">{m.coord} · {m.island}</p>
              </div>
              <div>
                <p className="caption max-w-[36rem]">{place?.caption ?? "—"}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="caption mt-10 max-w-[40rem]">
        Marker positions are illustrative. Coordinates converted from
        decimal degrees to degrees-and-minutes for the chart panel.
      </p>
    </article>
  );
}

const MARKERS = [
  { num: "1", name: "Edinburgh",    island: "Scotland",    coord: "55°57′N · 03°11′W", x: 30,  y: 180 },
  { num: "2", name: "Vágar",        island: "Vágar",       coord: "62°04′N · 07°16′W", x: 100, y: 100 },
  { num: "3", name: "Tórshavn",     island: "Streymoy",    coord: "62°01′N · 06°46′W", x: 245, y: 100 },
  { num: "4", name: "Krambatangi",  island: "Suðuroy",     coord: "61°27′N · 06°45′W", x: 295, y: 190 },
  { num: "5", name: "Øravík",       island: "Suðuroy",     coord: "61°32′N · 06°46′W", x: 320, y: 210 },
  { num: "6", name: "Tórsvøllur",   island: "Streymoy",    coord: "62°01′N · 06°46′W", x: 235, y: 130 },
  { num: "7", name: "Sørvágur",     island: "Vágar",       coord: "62°05′N · 07°20′W", x: 110, y: 132 },
];
