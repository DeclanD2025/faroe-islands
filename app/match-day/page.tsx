import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Match Day · Faroe Islands",
  description: "Motherwell v HB — ferry timeline, pubs, and stadium info for 30 July 2026.",
};

const timeline = [
  { time: "~10:50", label: "Bus 700 from Øravík", detail: "To Krambatangi (Ferjuleðan stop). Confirm the run for your date.", key: false, warn: false },
  { time: "11:30", label: "Ferry to Tórshavn", detail: "Pre-booked. Arrive ~13:35 — 2h05 crossing on M/F Smyril.", key: true, warn: false },
  { time: "14:00+", label: "Old-town wander", detail: "Tinganes, Reyn, harbour. Tórsvøllur is a 15-min walk from the harbour.", key: false, warn: false },
  { time: "15:30", label: "Pre-match", detail: "OY Brewing by the ground, then the harbour pubs.", key: false, warn: false },
  { time: "18:00", label: "Kick-off", detail: "Motherwell v HB — UEFA Conference League qualifier at Tórsvøllur, Gundadalur, Tórshavn.", key: true, warn: false },
  { time: "~19:50", label: "Full time", detail: "Pier is ~5 min from the ground. Don't dawdle.", key: false, warn: false },
  { time: "21:15", label: "Last ferry south", detail: "Krambatangi ~23:20, then bus 700 to Øravík. Miss it and you're in Tórshavn overnight.", key: false, warn: true },
];

const ferryTimes = {
  northbound: [
    { dep: "Tvøroyri 06:00", note: "" },
    { dep: "Tvøroyri 11:30", note: "→ arr ~13:35 ✓", highlight: true },
    { dep: "Tvøroyri 17:30", note: "too late for KO" },
  ],
  southbound: [
    { dep: "Tórshavn 08:45", note: "" },
    { dep: "Tórshavn 14:15", note: "" },
    { dep: "Tórshavn 21:15", note: "→ arr ~23:20 ✓ LAST", highlight: true },
  ],
};

const matchInfo = [
  { label: "Competition", value: "UEFA Conference League — Qualifying Round" },
  { label: "Teams", value: "Motherwell FC v Havnar Bóltfelag (HB)" },
  { label: "Venue", value: "Tórsvøllur, Gundadalur, Tórshavn" },
  { label: "Kick-off", value: "18:00 local (Faroese time, GMT+1)" },
  { label: "Full time", value: "~19:50" },
  { label: "Capacity", value: "~6,000" },
];

export default function MatchDay() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-14">
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-golden">
          Thursday 30 July 2026
        </span>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-cream">
          Match Day
        </h1>
        <p className="mt-2 text-xl font-semibold text-cliff">
          Motherwell v HB
        </p>
        <p className="mt-4 text-fog leading-relaxed max-w-xl">
          The ferry mission, end to end. Regular Thursday sailings — the 11:30
          up and the 21:15 back are the only viable pair. Miss the last boat and
          you&apos;re sleeping in Tórshavn.
        </p>
      </div>

      {/* Match info */}
      <section className="mb-14">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-fog/60 mb-4">
          The Fixture
        </h2>
        <div className="rounded-2xl border border-golden/10 bg-storm/30 p-6 grid gap-3">
          {matchInfo.map((m) => (
            <div key={m.label} className="flex justify-between items-baseline gap-4 py-2 border-b border-white/[0.04] last:border-0">
              <dt className="text-xs font-medium text-fog/50 uppercase tracking-wider">{m.label}</dt>
              <dd className="text-sm font-semibold text-cream text-right">{m.value}</dd>
            </div>
          ))}
        </div>
      </section>

      {/* Ferry timetable */}
      <section className="mb-14">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-fog/60 mb-4">
          Ferry Route 7 — Thursday
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/[0.06] bg-storm/30 p-6">
            <h3 className="text-sm font-semibold text-sea mb-4 flex items-center gap-2">
              ⬆ Northbound (to the match)
            </h3>
            <div className="space-y-3">
              {ferryTimes.northbound.map((f) => (
                <div
                  key={f.dep}
                  className={`rounded-xl px-4 py-3 text-sm ${
                    f.highlight
                      ? "bg-golden/10 border border-golden/20 text-cream font-semibold"
                      : "text-fog"
                  }`}
                >
                  {f.dep}
                  {f.note && <span className="text-xs ml-2 opacity-70">{f.note}</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-storm/30 p-6">
            <h3 className="text-sm font-semibold text-peak mb-4 flex items-center gap-2">
              ⬇ Southbound (back to base)
            </h3>
            <div className="space-y-3">
              {ferryTimes.southbound.map((f) => (
                <div
                  key={f.dep}
                  className={`rounded-xl px-4 py-3 text-sm ${
                    f.highlight
                      ? "bg-golden/10 border border-golden/20 text-cream font-semibold"
                      : "text-fog"
                  }`}
                >
                  {f.dep}
                  {f.note && <span className="text-xs ml-2 opacity-70">{f.note}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-rust/20 bg-rust/[0.04] p-5 text-sm text-fog leading-relaxed">
          <span className="font-semibold text-cream">⚠️ Critical:</span> The 21:15 is the last boat south. Stadium → pier is ~5 min.
          A ~19:50 final whistle gives comfortable time. Miss it and you&apos;re stuck in Tórshavn overnight.
        </div>
      </section>

      {/* Timeline */}
      <section className="mb-14">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-fog/60 mb-6">
          Match-Day Timeline
        </h2>
        <div className="relative">
          <div className="absolute left-[22px] top-2 bottom-2 w-px bg-white/[0.06]" />
          <div className="flex flex-col gap-4">
            {timeline.map((t) => (
              <div key={t.time} className="relative pl-14">
                <div
                  className={`absolute left-[14px] top-1.5 z-10 h-4 w-4 rounded-full border-2 ${
                    t.key
                      ? "border-golden bg-golden/20 shadow-[0_0_12px_rgba(196,154,63,0.3)]"
                      : t.warn
                      ? "border-rust/50 bg-rust/20"
                      : "border-white/[0.15] bg-storm"
                  }`}
                />
                <div className="rounded-xl border border-white/[0.06] bg-storm/40 p-4 transition-all hover:bg-storm/60">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-sm font-bold text-golden font-mono">
                      {t.time}
                    </span>
                    <span className="text-sm font-semibold text-cream">
                      {t.label}
                    </span>
                  </div>
                  <p className="text-xs text-fog mt-1 leading-relaxed">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pubs */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-fog/60 mb-6">
          Pubs Near the Ground
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { name: "OY Brewing", meta: "5 min from ground · Thu 11:30–22:00", desc: "Brewed on site, food. The pre-match HQ — arrive early." },
            { name: "Tórshøll", meta: "Harbour, ~15 min · Thu 11:00–23:45", desc: "Cheap Faroese beer, proper football crowd." },
            { name: "Glitnir", meta: "Waterfront · Thu to ~23:45", desc: "Live football, Gull and Slupp on tap." },
            { name: "Irish Pub Tórshavn", meta: "Harbour · Thu 11:30–23:00", desc: "Fish & chips, full bar — the away-day classic." },
            { name: "Mikkeller Tórshavn", meta: "Old lanes · Thu 17:00–24:00", desc: "Tiny craft beer bar — perfect post-match." },
            { name: "Sirkus Bar", meta: "Central · eve", desc: "Eccentric — good last stop before the pier." },
          ].map((pub) => (
            <div
              key={pub.name}
              className="rounded-xl border border-white/[0.06] bg-storm/30 p-4"
            >
              <h3 className="text-sm font-semibold text-cream">{pub.name}</h3>
              <p className="text-xs text-fog/50 mt-0.5 font-mono">{pub.meta}</p>
              <p className="text-xs text-fog mt-2 leading-relaxed">{pub.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
