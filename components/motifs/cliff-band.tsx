// A tiny hand-drawn Suðuroy map sketch — it's deliberately simplified rather
// than accurate, used as a motif on Day 2 ("the cliffs of Suðuroy") so the
// page never leans on raster placeholders or third-party tiles.

export function SuduroyMapMotif() {
  return (
    <svg
      viewBox="0 0 400 200"
      className="w-full h-[180px]"
      role="img"
      aria-label="Hand-drawn outline map of the Suðuroy island and its places."
    >
      <defs>
        <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFD3B7" />
          <stop offset="1" stopColor="#B3BB9C" />
        </linearGradient>
        <linearGradient id="sea-su" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E5E5DA" />
          <stop offset="1" stopColor="#D6D6CB" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="200" fill="url(#sea-su)" />
      {/* The island hand drawn as a rough pentagon — we won't pretend to be
          cartographically accurate. */}
      <path
        d="M70,30 L150,18 L210,40 L260,68 L308,80 L322,140 L260,160 L200,170 L130,150 L80,120 Z"
        fill="url(#land)"
        stroke="#40512B"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      {/* A couple of interior contour hints. */}
      <path d="M120,80 q40,-20 80,10" stroke="#40512B" strokeOpacity="0.45" fill="none" strokeWidth="0.8" />
      <path d="M180,120 q40,30 90,-10" stroke="#40512B" strokeOpacity="0.45" fill="none" strokeWidth="0.8" />
      {/* Beinisvørð — a long cliff dotted at the SW corner. */}
      <path d="M85,135 q-15,15 -5,30" stroke="#40512B" strokeOpacity="0.6" fill="none" strokeWidth="0.9" />

      {/* Named places, typographic only. */}
      <g fontFamily="var(--font-serif), Georgia, serif" fontStyle="italic" fontSize="11" fill="#1B1F22">
        <circle cx="160" cy="50"  r="2.8" fill="#1B1F22" />
        <text x="170" y="48">Øravík · base</text>
        <circle cx="200" cy="105" r="2.4" fill="#1B1F22" />
        <text x="208" y="108">Tvøroyri</text>
        <circle cx="120" cy="139"  r="2.4" fill="#1B1F22" />
        <text x="80"  y="155">Beinisvørð</text>
        <circle cx="240" cy="78"  r="2.4" fill="#1B1F22" />
        <text x="248" y="80">Fámjin</text>
      </g>

      {/* Compass mark in the corner. */}
      <g transform="translate(360,180)">
        <circle cx="0" cy="0" r="14" fill="none" stroke="#8C8576" strokeWidth="0.8" />
        <text x="0" y="-6" fontFamily="var(--font-serif), serif" fontStyle="italic" fontSize="9" textAnchor="middle" fill="#8C8576">N</text>
      </g>
    </svg>
  );
}

// A low-cloud horizontal wash — used between Day 4 and Day 5, where the
// page needs to "breathe" before the curve lands the trip.
export function LowCloudWash() {
  return (
    <svg
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      className="w-full h-full"
      role="presentation"
      aria-hidden
    >
      <defs>
        <linearGradient id="cloud-tone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EFE9DD" />
          <stop offset="0.45" stopColor="#E5E0D2" />
          <stop offset="1" stopColor="#D5CFC0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1440" height="320" fill="url(#cloud-tone)" />
      {/* Two faint cloud bands. */}
      <path
        d="M0,90 q120,-10 240,0 t480,10 t720,-10 l0,12 l-1440,0 z"
        fill="#F4EFE0"
      />
      <path
        d="M0,180 q160,18 320,0 t640,12 t480,-18 l0,12 l-1440,0 z"
        fill="#EAE4D2"
        opacity="0.7"
      />
      {/* A single seagull-ish wing gesture up high. */}
      <path d="M320 50 q 14 -10 28 0" stroke="#8C8576" strokeWidth="0.7" fill="none" />
      <path d="M780 30 q 14 -8 28 0" stroke="#8C8576" strokeWidth="0.7" fill="none" />
      <path d="M1180 70 q 14 -10 28 0" stroke="#8C8576" strokeWidth="0.7" fill="none" />
    </svg>
  );
}
