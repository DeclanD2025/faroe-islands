import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Itinerary · Faroe Islands",
  description: "4-night itinerary — 28 July to 1 August 2026, Suðuroy base with match day in Tórshavn.",
};

const days = [
  {
    day: "Tuesday",
    date: "July 28 — St Olaf's Eve",
    title: "Arrival & Ólavsøka",
    emoji: "✈️",
    highlight: true,
    items: [
      "Fly Edinburgh → Vágar. Take bus 300 to Tórshavn (~45 min).",
      "You land into the tail of Ólavsøka — the whole nation is out. Rowing crews, music, streets packed with traditional dress.",
      "Soak up the festival evening: the kappróður rowing championship in the harbour, the midnight communal singing (Midnátt) on Vaglið square.",
      "Catch the 21:15 ferry south (St Olaf's Eve deviation) → Krambatangi ~23:20 → bus 700 or taxi 2 km to Øravík guesthouse.",
    ],
  },
  {
    day: "Wednesday",
    date: "July 29 — St Olaf's Day",
    title: "Suðuroy Day (or Festival)",
    emoji: "🏔️",
    highlight: false,
    items: [
      "Option A — settle in: walk to Hov next door (old church, chieftain's burial mound), then Hvannhagi hike above Tvøroyri (2–3 hrs, orange posts to a lake cradled above the sea). Lunch at Café MorMor.",
      "Option B — back for St Olaf's Day: ferry up at 07:00, the festival's big day in Tórshavn, ferry back 21:15.",
      "Evening: pint at Hotel Tvøroyri or shop-and-cook with ESLA groceries (open daily 07:00–22:00, incl. Sundays).",
    ],
  },
  {
    day: "Thursday",
    date: "July 30",
    title: "MATCH DAY — Motherwell v HB",
    emoji: "⚽",
    highlight: true,
    items: [
      "Bus 700 from Øravík to Krambatangi. 11:30 ferry to Tórshavn → arrive ~13:35.",
      "Afternoon in the capital: wander Tinganes old town, pre-match at OY Brewing (5 min from the ground).",
      "18:00 kick-off at Tórsvøllur. Full time ~19:50.",
      "Pier is 5 min from the ground. 21:15 last ferry south → Krambatangi ~23:20 → bus 700 back to Øravík. Do not miss it.",
    ],
  },
  {
    day: "Friday",
    date: "July 31",
    title: "Last Hike & Reposition North",
    emoji: "🧭",
    highlight: false,
    items: [
      "Morning on Suðuroy: Ásmundarstakkur sea stack (bus 701 to Sandvík, 30–40 min each way) or Fámjin (flag church, waterfall). Weather permitting.",
      "Catch the 16:00 ferry north to Tórshavn.",
      "Bus 300 toward the airport — overnight at Guesthouse Hugo in Sørvágur (10 min from Vágar).",
      "You reposition tonight because a 09:10 flight cannot be made from Suðuroy the same morning.",
    ],
  },
  {
    day: "Saturday",
    date: "August 1",
    title: "Home",
    emoji: "🏠",
    highlight: false,
    items: [
      "Short hop to Vágar Airport (early bus 300 or quick taxi from Hugo).",
      "09:10 flight home. Build slack for fog — FAE is notorious for delays.",
    ],
  },
];

export default function Itinerary() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-14">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-golden">
          4 Nights · 28 Jul – 1 Aug
        </span>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-cream">
          The Plan
        </h1>
        <p className="mt-4 text-fog leading-relaxed max-w-xl">
          Built on the Øravík base and verified ferry sailings. Carless — buses
          and the M/F Smyril run the show. Match day is Thursday.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-[22px] top-3 bottom-3 w-px bg-white/[0.06]" />

        <div className="flex flex-col gap-8">
          {days.map((d) => (
            <div key={d.date} className="relative pl-14 group">
              <div
                className={`absolute left-[14px] top-2 z-10 h-4 w-4 rounded-full border-2 transition-all ${
                  d.highlight
                    ? "border-golden bg-golden/20 shadow-[0_0_12px_rgba(196,154,63,0.3)]"
                    : "border-white/[0.15] bg-storm"
                }`}
              />

              <div className="rounded-2xl border border-white/[0.06] bg-storm/40 p-6 transition-all hover:border-white/[0.1] hover:bg-storm/60">
                <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-medium text-fog/50 uppercase tracking-wider">
                      {d.day}
                    </span>
                    <span className="mx-2 text-white/[0.1]">·</span>
                    <span className="text-xs font-medium text-golden/60">
                      {d.date}
                    </span>
                  </div>
                  <span className="text-2xl">{d.emoji}</span>
                </div>
                <h2 className="text-xl font-semibold text-cream mb-3">
                  {d.title}
                </h2>
                <ul className="space-y-2">
                  {d.items.map((item, i) => (
                    <li key={i} className="text-sm text-fog leading-relaxed flex gap-3">
                      <span className="text-golden/60 shrink-0 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {d.day === "Thursday" && (
                  <div className="mt-4 pt-4 border-t border-white/[0.06]">
                    <a
                      href="/match-day"
                      className="text-sm font-semibold text-golden hover:text-cream transition-colors inline-flex items-center gap-1"
                    >
                      Full match-day timeline →
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
