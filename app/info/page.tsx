import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Info · Faroe Islands",
  description: "Flights, costs, ferry timetables, buses, phrasebook, and practical tips.",
};

const sections = [
  {
    title: "Flights",
    emoji: "✈️",
    items: [
      { label: "Route", value: "Edinburgh (EDI) → Vágar (FAE), Atlantic Airways, ~1h25 direct. Some options route via Copenhagen." },
      { label: "Departure options", value: "27 Jul (£445 pp, 5 nts), 28 Jul (£510–£520 pp, 4 nts), 29 Jul (£483–£575 pp, 3 nts). All return Sat 1 Aug." },
      { label: "Return", value: "Sat 1 Aug, 09:10 flight home. Build slack — FAE is notorious for fog delays." },
      { label: "Luggage", value: "Carless trip — pack light. One carry-on-size bag each if possible." },
    ],
  },
  {
    title: "Stays",
    emoji: "🏠",
    items: [
      { label: "Øravík guesthouse ★", value: "Við á 7, Øravík 827, Suðuroy. £234/2 nts (~£117/night). Bus 700 stop 200 m, ferry 2 km. Our base." },
      { label: "Guesthouse Hugo", value: "2 Bakkavegur, 380 Sørvágur, Vágar. £136.27. Fri 31 Jul — the sensible last night near the airport." },
      { label: "Hotel Runavík", value: "Heiðavegur 6, 620 Runavík, Eysturoy. £391.99. Booked, cancellable. Carless awkward." },
      { label: "Summer house, Vágur", value: "10 Smillavegur, 900 Vágur. £171.76. Booked but furthest from everything — likely cancel." },
    ],
  },
  {
    title: "Ferry — Route 7",
    emoji: "⛴️",
    items: [
      { label: "Vessel", value: "M/F Smyril, Krambatangi (Suðuroy) ⇄ Tórshavn. 2h05 crossing." },
      { label: "Match day plan", value: "Thu 30 Jul: Tvøroyri 11:30 north (arr ~13:35), Tórshavn 21:15 south (arr ~23:20) — last boat." },
      { label: "Ólavsøka (Tue 28)", value: "Deviations: Tvøroyri→Tórshavn 06:00, Tórshavn→Tvøroyri 08:30, Tvøroyri→Tórshavn 11:00, Tórshavn→Tvøroyri 21:15." },
      { label: "Ólavsøka (Wed 29)", value: "Deviations: Tvøroyri→Tórshavn 07:00, Tórshavn→Tvøroyri 11:30, Tvøroyri→Tórshavn 14:30, Tórshavn→Tvøroyri 21:15." },
      { label: "Booking", value: "Pre-book at booking.ssl.fo. Foot passengers: gate closes 5 min before departure. Vehicles: queue 15 min before." },
    ],
  },
  {
    title: "Buses",
    emoji: "🚌",
    items: [
      { label: "700 (local)", value: "Sumba – Vágur – Tvøroyri. Stops at Øravík and Krambatangi. Timed to meet the ferry — confirm summer holiday service." },
      { label: "701 (hikes)", value: "Fámjin – Tvøroyri – Sandvík. Your route to Ásmundarstakkur and Fámjin. Same holiday caveats. Book request runs: +298 239550 / 239551." },
      { label: "300 (airport)", value: "Tórshavn – Airport – Sørvágur. New summer timetable from 1 July — confirm times. ~45 min each way." },
      { label: "SSL Travel Card", value: "4-day: 500 DKK (~£58 pp). 7-day: 700 DKK (~£80 pp). Covers all buses and foot-ferry crossings. Buy at Tórshavn terminal." },
    ],
  },
  {
    title: "Costs (for two)",
    emoji: "💰",
    items: [
      { label: "Flights (mid option × 2)", value: "£1,040" },
      { label: "Øravík guesthouse · 3 nts", value: "£351" },
      { label: "Guesthouse Hugo · 1 nt", value: "£136" },
      { label: "Travel cards · 7-day × 2", value: "£160 (~£80 pp)" },
      { label: "Ferry pre-book / sundries", value: "£30" },
      { label: "Food & drink · ~4 days", value: "£420" },
      { label: "Subtotal (est.)", value: "£2,137", highlight: true },
      { label: "Match tickets", value: "TBC — Motherwell allocation not yet confirmed" },
    ],
  },
  {
    title: "Food & Drink — Suðuroy",
    emoji: "🍽️",
    items: [
      { label: "ESLA (grocery)", value: "Við Sílá, Tvøroyri — open daily 07:00–22:00 incl. Sundays. Your self-catering best friend." },
      { label: "Bónus (grocery)", value: "54 Havnarlagið, Tvøroyri — bigger, cheaper, but closed Sundays." },
      { label: "Hotel Tvøroyri", value: "5 Miðbrekkan — pub + pizzeria, most dependable evening pint near base." },
      { label: "Café MorMor", value: "38 Undir Heygnum — the island gem. Brilliant soup and cake. Wed–Fri 12:00–18:00 only." },
      { label: "Bryggjan", value: "1 Bryggjan, Vágur — Filipino buffet, best-value dinner. Daily 16:00–21:00." },
      { label: "Harbour Fastfood", value: "25 Tvørávegur, by the ferry — pizza and coffee, handy for pre-sailing bites. Thu to 24:00." },
    ],
  },
  {
    title: "Faroese Phrasebook",
    emoji: "🗣️",
    items: [
      { label: "Hey", value: "Hi (informal) — hey" },
      { label: "Góðan dag", value: "Good day — GOH-an day" },
      { label: "Takk / Takk fyri", value: "Thanks / thank you — tahk FEE-ree" },
      { label: "Gjørðu so væl", value: "Please / here you go — JUR-oo so vatl" },
      { label: "Ja / Nei", value: "Yes / no — yah / nigh" },
      { label: "Orsaka", value: "Sorry / excuse me — OR-sa-ka" },
      { label: "Ein bjór, takk", value: "One beer, please — ayn byohr, tahk" },
      { label: "Skál!", value: "Cheers! — skoal" },
      { label: "Tórsvøllur", value: "The stadium — TORS-vur-lur" },
    ],
  },
  {
    title: "Practical Tips",
    emoji: "💡",
    items: [
      { label: "Insurance ⚠️", value: "Faroe Islands are NOT in the EU/EEA — GHIC/EHIC is not valid. Get travel insurance with medical + hiking cover." },
      { label: "Phone data ⚠️", value: "Outside UK 'roam-like-home' deals. Check your tariff — consider an eSIM or download offline maps." },
      { label: "Money", value: "Faroese króna = Danish krone (1:1). Cards accepted almost everywhere, including buses. Tipping not expected." },
      { label: "Weather", value: "Check yr.no and dmi.dk before you fly and each morning. Fog can hide a cliff in minutes." },
      { label: "Daylight", value: "~17–18 hrs in late July. Sunrise ~04:45, sunset ~22:15. Eye mask essential." },
      { label: "Power", value: "230V, Type C/F plugs (standard EU two-pin). Bring an adapter." },
      { label: "Alcohol", value: "Spirits/strong beer from state Rúsdrekkasøla; bars serve normally. Pricey." },
      { label: "Sundays", value: "Much is closed; ferries/buses run reduced. ESLA opens Sundays, Bónus doesn't." },
      { label: "Emergency", value: "112. Hospital (Suðuroyar Sjúkrahús) and pharmacy are in Tvøroyri." },
    ],
  },
  {
    title: "Useful Links",
    emoji: "🔗",
    links: true,
    items: [
      { label: "SSL Ferry Booking", href: "https://booking.ssl.fo", value: "booking.ssl.fo — pre-book all ferry crossings." },
      { label: "Weather", href: "https://www.yr.no/en", value: "yr.no — most accurate Faroese forecasts." },
      { label: "Visit Suðuroy", href: "https://visitsuduroy.fo", value: "visitsuduroy.fo — local info, Vágur tourist office." },
      { label: "Hiking Info", href: "https://visitfaroeislands.com/en/see-do/activities/hiking", value: "visitfaroeislands.com/hiking — fees, trail status." },
      { label: "Motherwell FC", href: "https://www.motherwellfc.co.uk", value: "motherwellfc.co.uk — away ticket info." },
    ],
  },
];

export default function TravelInfo() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-14">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-golden">
          Everything Else
        </span>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-cream">
          Travel Info
        </h1>
        <p className="mt-4 text-fog leading-relaxed max-w-xl">
          Flights, costs, ferries, buses, food, a Faroese phrasebook, and the
          practical fine print — including two things UK travellers routinely
          get wrong.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-2xl border border-white/[0.06] bg-storm/30 p-6 md:p-8"
          >
            <h2 className="text-xl font-semibold text-cream mb-6 flex items-center gap-3">
              <span>{section.emoji}</span>
              {section.title}
            </h2>
            <dl className="grid gap-4">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-1 sm:gap-4 py-3 border-b border-white/[0.04] last:border-0"
                >
                  <dt className="text-sm font-medium text-cream/80">
                    {item.label}
                  </dt>
                  <dd className={`text-sm leading-relaxed ${(item as { highlight?: boolean }).highlight ? "font-bold text-golden" : "text-fog"}`}>
                    {section.links && (item as { href?: string }).href ? (
                      <a
                        href={(item as { href: string }).href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-peak hover:text-cream transition-colors underline underline-offset-4"
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
