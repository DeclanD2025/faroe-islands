import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hikes & Sights · Faroe Islands",
  description: "Suðuroy hikes, Tórshavn match-day sights, and pubs near Tórsvøllur.",
};

const categories = [
  {
    name: "Suðuroy — Doorstep & By Bus",
    spots: [
      {
        name: "Hvannhagi",
        village: "Above Tvøroyri · 2–3 hrs, moderate",
        description:
          "The island's signature hike. Start on Ovaravegur above Tvøroyri, follow orange posts to a sheep gate, then a mid-slope path to a second gate. The final narrow descent drops to a lake cradled on the edge of the sea, facing Stóra and Lítla Dímun. Free. Bus 700 to Tvøroyri, then walk up.",
        mustSee: true,
        emoji: "🥾",
        access: "Bus 700",
      },
      {
        name: "Ásmundarstakkur & the Bridge",
        village: "Sandvík, north tip · 30–40 min each way, easy",
        description:
          "Park at Sandvík, walk up to a gate, follow gravel track to the 'Ásmundarstakkur' signpost, then strike across boggy grassland on blue/yellow markers to the cliff edge — dramatic sea stack and the famous wooden bridge. Flat but muddy. Skip in fog: markers vanish and the cliff loop is dangerous.",
        mustSee: true,
        emoji: "🌉",
        access: "Bus 701",
      },
      {
        name: "Hov",
        village: "~2 km south of Øravík · easy, flat",
        description:
          "Saga-history village right next door — old church and chieftain Havgrímur's burial mound. A short, gentle wander; perfect first evening straight from the guesthouse. Bus 700 (one stop) or ~30-min walk.",
        mustSee: false,
        emoji: "🏛️",
        access: "Walk / Bus 700",
      },
      {
        name: "Fámjin",
        village: "West coast",
        description:
          "Over the hill to the west side. The church keeps the original 1919 Faroese flag (Merkið); there's a waterfall behind and gentle shoreline walks. Quiet and historic. Bus 701.",
        mustSee: false,
        emoji: "🚩",
        access: "Bus 701",
      },
      {
        name: "Froðba",
        village: "Just east of Tvøroyri",
        description:
          "Basalt columns, red cliffs and a blowhole stretch along the coast — an easy add-on either side of a Hvannhagi day. Bus 700 or short walk from Tvøroyri.",
        mustSee: false,
        emoji: "🪨",
        access: "Bus 700",
      },
    ],
  },
  {
    name: "Suðuroy — Car or Taxi",
    spots: [
      {
        name: "Eggjarnar",
        village: "Above Vágur",
        description:
          "Clifftop row of sea stacks with old NATO-era ruins and views toward Beinisvørð. Short walk from parking — but access is a steep, narrow, unmaintained mountain road. Car or taxi only.",
        mustSee: false,
        emoji: "🗻",
        access: "Car/taxi",
      },
      {
        name: "Beinisvørð",
        village: "Near Lopra/Sumba",
        description:
          "One of the Faroes' highest sea cliffs at 469 m — raw and enormous, with roadside viewpoints and ridge walks above it. Car or taxi.",
        mustSee: false,
        emoji: "🧗",
        access: "Car/taxi",
      },
      {
        name: "Akraberg Lighthouse",
        village: "Southern tip, Sumba",
        description:
          "The southernmost point of the Faroe Islands — lighthouse, big horizons, a step-over stile in the fence, and views to the Munkurin sea stack. Bus 700 to Sumba + long walk or car.",
        mustSee: false,
        emoji: "🔦",
        access: "Car/taxi",
      },
    ],
  },
  {
    name: "Tórshavn — Match Day Sights",
    spots: [
      {
        name: "Tinganes",
        village: "Old-town peninsula · free · 5 min from harbour",
        description:
          "The turf-roofed timber houses of one of the world's oldest parliamentary sites, jutting into the harbour. Wander the red-painted lanes — peak Faroese postcard. Perfect pre-match wander.",
        mustSee: true,
        emoji: "🏛️",
        access: "Walk",
      },
      {
        name: "Reyn & Vesturkirkjan",
        village: "Old quarter · free",
        description:
          "The lanes above Tinganes, plus the white 'Vesturkirkjan' landmark church with a tall spire — quiet and atmospheric.",
        mustSee: false,
        emoji: "⛪",
        access: "Walk",
      },
      {
        name: "Skansin",
        village: "Harbour fort · free · 10 min from centre",
        description:
          "A 1580 fort guarding the harbour, with old cannons, a lighthouse and WWII relics. Good sea views.",
        mustSee: false,
        emoji: "🏰",
        access: "Walk",
      },
      {
        name: "Listasavn Føroya",
        village: "National Gallery · by Viðarlund park",
        description:
          "Faroese art in a calm modern space beside the wooded park — a solid rain plan before the match.",
        mustSee: false,
        emoji: "🎨",
        access: "Walk",
      },
    ],
  },
  {
    name: "Tórshavn — Pubs Near the Ground",
    spots: [
      {
        name: "OY Brewing",
        village: "Brewpub · ~5 min from ground · Thu 11:30–22:00",
        description:
          "Brewed on site, plus food. The closest pour to Tórsvøllur — the natural pre-match base. Get in early before the away crowd fills it.",
        mustSee: true,
        emoji: "🍺",
        access: "Walk",
      },
      {
        name: "Tórshøll",
        village: "Locals' pub · harbour, ~15 min · Thu 11:00–23:45",
        description:
          "Cheap Faroese beer and a proper football crowd. Lively and unpretentious.",
        mustSee: false,
        emoji: "🍻",
        access: "Walk",
      },
      {
        name: "Glitnir",
        village: "Sports bar · waterfront · Thu to ~23:45",
        description: "Live football, Gull and Slupp on tap, harbour views.",
        mustSee: false,
        emoji: "📺",
        access: "Walk",
      },
      {
        name: "Irish Pub Tórshavn",
        village: "Pub-restaurant · harbour · Thu 11:30–23:00",
        description:
          "Fish & chips, full bar, busy — the away-day classic.",
        mustSee: false,
        emoji: "🍀",
        access: "Walk",
      },
      {
        name: "Mikkeller Tórshavn",
        village: "Craft beer · old lanes · Thu 17:00–24:00",
        description:
          "Tiny and cosy; opens late afternoon. Fills after the whistle — perfect post-match.",
        mustSee: false,
        emoji: "🍺",
        access: "Walk",
      },
      {
        name: "Sirkus Bar",
        village: "Bar · central · eve",
        description:
          "Eccentric and characterful — a good last stop before the dash to the pier.",
        mustSee: false,
        emoji: "🎪",
        access: "Walk",
      },
    ],
  },
];

export default function Places() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-14">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-golden">
          Suðuroy &amp; Tórshavn
        </span>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-cream">
          Hikes &amp; Sights
        </h1>
        <p className="mt-4 text-fog leading-relaxed max-w-xl">
          Hikes ordered by access difficulty from our Øravík base. Plus
          Tórshavn match-day sights and every pub worth knowing near the ground.
        </p>
      </div>

      <div className="flex flex-col gap-14">
        {categories.map((cat) => (
          <div key={cat.name}>
            <h2 className="text-lg font-semibold text-cream mb-6 pb-3 border-b border-white/[0.06]">
              {cat.name}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {cat.spots.map((spot) => (
                <div
                  key={spot.name}
                  className="group rounded-2xl border border-white/[0.06] bg-storm/30 p-6 transition-all hover:border-white/[0.12] hover:bg-storm/50"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-base font-semibold text-cream flex items-center gap-2 flex-wrap">
                        {spot.name}
                        {spot.mustSee && (
                          <span className="inline-block rounded-md bg-golden/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-golden">
                            Must
                          </span>
                        )}
                      </h3>
                      <p className="text-xs font-medium text-fog/50 mt-1">
                        {spot.village}
                      </p>
                    </div>
                    <span className="text-2xl shrink-0">{spot.emoji}</span>
                  </div>
                  <p className="text-sm text-fog leading-relaxed">
                    {spot.description}
                  </p>
                  <p className="mt-3 text-xs font-medium text-peak/70 font-mono">
                    Access: {spot.access}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
