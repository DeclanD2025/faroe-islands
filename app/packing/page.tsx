import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Packing List · Faroe Islands",
  description: "What to pack for the Faroe Islands — layers, football kit, and essentials for late July.",
};

const categories = [
  {
    emoji: "🧥",
    title: "Outer (Non-Negotiable)",
    description: "The Faroes punish the under-dressed. Layers beat one big coat.",
    items: [
      { name: "Waterproof AND windproof hardshell jacket (taped seams)", essential: true },
      { name: "Waterproof overtrousers — for hikes and exposed cliffs", essential: true },
      { name: "Warm hat + gloves (yes, in July)", essential: true },
      { name: "Buff / neck gaiter for the wind", essential: true },
    ],
  },
  {
    emoji: "👕",
    title: "Layers & Feet",
    description: "No cotton. Merino/synthetic everything.",
    items: [
      { name: "Fleece or light down mid-layer", essential: true },
      { name: "Merino or synthetic base layers (top + bottom)", essential: true },
      { name: "2–3 quick-dry t-shirts", essential: false },
      { name: "Sturdy waterproof hiking boots with grip (broken in!)", essential: true },
      { name: "Spare socks — ground stays wet, Hvannhagi gets boggy", essential: true },
      { name: "Casual shoes for Tórshavn", essential: false },
    ],
  },
  {
    emoji: "⚽",
    title: "Match Day & Kit",
    description: "18:00 KO — it'll be cool and breezy.",
    items: [
      { name: "Motherwell colours / scarf", essential: true },
      { name: "Wear kit under the shell — layer up for the stands", essential: false },
      { name: "Match ticket (offline copy on phone)", essential: true },
    ],
  },
  {
    emoji: "🎒",
    title: "Gear & Electronics",
    description: "Carless trip — pack light, carry smart.",
    items: [
      { name: "Small daypack (waterproof or with rain cover)", essential: true },
      { name: "Dry bag liner for pack contents", essential: true },
      { name: "Power bank (long days out, no car to charge from)", essential: true },
      { name: "EU plug adapter (Type C/F, 230V)", essential: true },
      { name: "Reusable water bottle (tap water is excellent)", essential: false },
      { name: "Offline maps downloaded (Google Maps / Maps.me)", essential: true },
      { name: "Headlamp (not for darkness — for foggy cliff paths)", essential: false },
    ],
  },
  {
    emoji: "📋",
    title: "Documents & Money",
    description: "The Faroes are outside the EU/EEA.",
    items: [
      { name: "Passport (valid 6+ months)", essential: true },
      { name: "Travel insurance with medical + hiking cover (GHIC not valid!)", essential: true },
      { name: "Flight bookings (offline)", essential: true },
      { name: "Ferry pre-booking confirmations (match day, both legs)", essential: true },
      { name: "SSL travel card receipt", essential: false },
      { name: "Credit/debit card (cards accepted everywhere, cash rarely needed)", essential: true },
    ],
  },
  {
    emoji: "💊",
    title: "Health & Comfort",
    description: "Small things that go a long way.",
    items: [
      { name: "Sleep mask (essential — ~17–18 hrs daylight!)", essential: true },
      { name: "Earplugs", essential: false },
      { name: "Sunscreen SPF 30+ (sun is low but constant)", essential: false },
      { name: "Basic first-aid kit + blister plasters", essential: true },
      { name: "Any personal medications", essential: true },
      { name: "Motion sickness tablets (ferries can be rough)", essential: false },
    ],
  },
];

export default function Packing() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-14">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-golden">
          What to Bring
        </span>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-cream">
          Packing List
        </h1>
        <p className="mt-4 text-fog leading-relaxed max-w-xl">
          Late July: avg ~11°C, rain likely, wind guaranteed. The Faroese rule:{' '}
          <span className="text-cream font-medium">
            there&apos;s no bad weather, only bad clothing.
          </span>
        </p>
        <div className="mt-4 rounded-xl border border-golden/10 bg-golden/[0.03] p-4 text-sm text-fog">
          <span className="font-semibold text-cream">⚠️ Insurance:</span> GHIC/EHIC
          is <span className="font-semibold text-rust/80">not valid</span> in the
          Faroes (not in EU/EEA). Get proper travel insurance with medical + hiking cover.
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {categories.map((cat) => (
          <div
            key={cat.title}
            className="rounded-2xl border border-white/[0.06] bg-storm/30 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{cat.emoji}</span>
              <div>
                <h2 className="text-lg font-semibold text-cream">{cat.title}</h2>
                <p className="text-xs text-fog/50 mt-0.5">{cat.description}</p>
              </div>
            </div>
            <ul className="space-y-2">
              {cat.items.map((item) => (
                <li key={item.name}>
                  <label className="flex items-start gap-3 text-sm text-fog cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-white/[0.12] bg-white/[0.03] accent-golden cursor-pointer shrink-0"
                    />
                    <span>
                      {item.name}
                      {item.essential && (
                        <span className="ml-1.5 inline-block rounded-md bg-golden/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-golden">
                          essential
                        </span>
                      )}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
