// Hand-drawn Atlantic cliff silhouette. Used at the foot of the hero as a
// background band — pure SVG so it scales crisply on any device, no PNG to
// round-trip. The shape is abstract on purpose: a tall grass-topped island
// wall, a small sea-stack to its right, and a second one further out.

export function CliffSilhouette() {
  return (
    <svg
      viewBox="0 0 1440 220"
      preserveAspectRatio="none"
      className="w-full h-full"
      role="presentation"
      aria-hidden
    >
      <defs>
        <linearGradient id="cliff-tone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2D3344" stopOpacity="0.95" />
          <stop offset="1" stopColor="#1A2230" stopOpacity="1" />
        </linearGradient>
        <pattern id="cliff-rain" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 0 L6 6" stroke="#FFFFFF" strokeOpacity="0.07" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Main headland — we let it overdraw the bottom edge so the eye finds the
          horizon at about 2/3 of the height. */}
      <path
        d="M0,220 L0,150 C 60,140 70,120 110,128 C 140,134 150,150 200,148 C 260,146 260,90 320,90 C 380,90 380,160 460,150 C 540,140 540,90 620,80 C 720,68 820,80 900,90 C 980,100 1020,140 1100,150 C 1180,160 1240,140 1320,130 C 1360,124 1400,150 1440,158 L 1440,220 Z"
        fill="url(#cliff-tone)"
      />
      {/* Subtle grazing rain-pattern over the top to keep it from feeling
          cardboard-flat. */}
      <path
        d="M0,220 L0,150 C 60,140 70,120 110,128 C 140,134 150,150 200,148 C 260,146 260,90 320,90 C 380,90 380,160 460,150 C 540,140 540,90 620,80 C 720,68 820,80 900,90 C 980,100 1020,140 1100,150 C 1180,160 1240,140 1320,130 C 1360,124 1400,150 1440,158 L 1440,220 Z"
        fill="url(#cliff-rain)"
      />
      {/* Three small sea-stacks behind the headland. */}
      <path d="M340,200 L360,180 L380,200 Z" fill="#1A2230" />
      <path d="M720,210 L740,190 L760,210 Z" fill="#1A2230" />
      <path d="M1080,210 L1100,194 L1120,210 Z" fill="#1A2230" />
      {/* Two low puffin-shaped silhouettes further out. */}
      <ellipse cx="290" cy="200" rx="3" ry="2" fill="#1A2230" />
      <ellipse cx="1250" cy="206" rx="3" ry="2" fill="#1A2230" />
    </svg>
  );
}
