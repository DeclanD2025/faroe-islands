import Link from "next/link";
import WeatherWidget from "@/app/components/weather";

const daysUntilTrip = () => {
  const tripStart = new Date("2026-07-28");
  const now = new Date();
  const diff = Math.ceil((tripStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};

const highlights = [
  {
    emoji: "⚽",
    title: "Motherwell v HB",
    description:
      "A UEFA Conference League qualifier at Tórsvøllur, Tórshavn. Thursday 30 July, 18:00 KO. The whole trip orbits this match.",
  },
  {
    emoji: "🎉",
    title: "Ólavsøka Festival",
    description:
      "We arrive during the national holiday (July 28–29) — rowing races, chain dancing, the whole of Tórshavn out celebrating St Olaf.",
  },
  {
    emoji: "🏝️",
    title: "Suðuroy Base",
    description:
      "Our guesthouse is in Øravík on Suðuroy — the southernmost island. Quiet, dramatic, and connected by ferry to the capital.",
  },
  {
    emoji: "⛴️",
    title: "The Ferry Mission",
    description:
      "Route 7 — M/F Smyril — is our lifeline. 2h05 each way between Suðuroy and Tórshavn. Plan around the timetable or get stranded.",
  },
];

const quickFacts = [
  { label: "Dates", value: "28 Jul – 1 Aug 2026" },
  { label: "Base", value: "Øravík, Suðuroy" },
  { label: "Match", value: "Thu 30 Jul, 18:00" },
  { label: "Flight from", value: "Edinburgh (EDI)" },
  { label: "Airline", value: "Atlantic Airways" },
  { label: "Currency", value: "DKK (≈ £0.115)" },
  { label: "Daylight", value: "~17–18 hours" },
];

export default function Home() {
  const days = daysUntilTrip();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-6 py-24 md:py-36 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sea/40 via-storm to-background pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(196,154,63,0.10),transparent_70%)]" />
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block rounded-full border border-golden/20 bg-golden/5 px-4 py-1.5 text-sm font-medium text-golden/80 backdrop-blur-sm mb-8">
            {days > 0 ? `${days} days until departure` : "We're here! 🎉"}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-cream mb-4 leading-[1.1]">
            Suðuroy &amp;
            <br />
            the Tórshavn Tie
          </h1>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fog/60 mb-4">
            Motherwell v HB · 30 July · Tórsvøllur
          </p>
          <p className="text-lg text-fog max-w-xl mx-auto leading-relaxed">
            A football away day at the edge of the North Atlantic. Ólavsøka
            festival, Suðuroy&apos;s cliffs, and a European qualifier under the
            midnight sun.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/itinerary"
              className="inline-flex items-center gap-2 rounded-xl bg-cream px-6 py-3 text-sm font-semibold text-background transition-all hover:bg-white hover:shadow-[0_0_30px_rgba(196,154,63,0.15)]"
            >
              View Itinerary →
            </Link>
            <Link
              href="/match-day"
              className="inline-flex items-center gap-2 rounded-xl border border-golden/20 bg-golden/5 px-6 py-3 text-sm font-semibold text-golden/90 transition-all hover:bg-golden/10 hover:border-golden/30"
            >
              Match Day Plan
            </Link>
          </div>
        </div>
      </section>

      {/* Journey map */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-fog/60 mb-8 text-center">
          The Journey
        </h2>
        <div className="rounded-2xl border border-white/[0.06] bg-storm/30 p-6">
          <div className="relative pl-10 border-l-2 border-dashed border-white/[0.08] space-y-6 py-2">
            {[
              { dot: "bg-cream", label: "Edinburgh", sub: "EDI · Atlantic Airways · 1h25", badge: "✈️" },
              { dot: "bg-peak", label: "Vágar Airport", sub: "FAE · Bus 300 · ~45 min to Tórshavn", badge: "🚌" },
              { dot: "bg-peak", label: "Tórshavn", sub: "Capital · the match city", badge: "🏙️" },
              { dot: "bg-sea", label: "Ferry Route 7", sub: "M/F Smyril · 2h05 · pre-book", badge: "⛴️" },
              { dot: "bg-peak", label: "Krambatangi", sub: "Suðuroy ferry port · Bus 700, 2 stops", badge: "🚌" },
              { dot: "bg-golden", label: "Øravík ★ base", sub: "Við á 7, 827 · guesthouse", badge: "🏠", star: true },
            ].map((step, i) => (
              <div key={i} className="relative pl-6">
                <div className={`absolute left-[-41px] top-1 h-3 w-3 rounded-full ${step.dot} ${step.star ? "ring-2 ring-golden/30" : ""}`} />
                <div className="text-sm font-semibold text-cream">
                  {step.badge} {step.label}
                </div>
                <div className="text-xs text-fog/60 mt-0.5 font-mono">{step.sub}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-golden/10 bg-golden/[0.03] p-5 text-sm text-fog leading-relaxed">
          <span className="font-semibold text-cream">The rhythm:</span> land into
          Ólavsøka in Tórshavn, ferry south to our Øravík base, ferry back up
          for the match on Thursday, reposition north Friday night for the
          Saturday morning flight home.
        </div>
      </section>

      {/* Highlights grid */}
      <section className="mx-auto max-w-5xl px-6 py-16 border-t border-white/[0.06]">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-fog/60 mb-10 text-center">
          This Trip
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="group rounded-2xl border border-white/[0.06] bg-storm/50 p-6 transition-all hover:border-white/[0.12] hover:bg-storm"
            >
              <span className="text-3xl mb-4 block">{h.emoji}</span>
              <h3 className="text-lg font-semibold text-cream mb-2">
                {h.title}
              </h3>
              <p className="text-sm text-fog leading-relaxed">{h.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Weather */}
      <WeatherWidget />

      {/* Quick facts */}
      <section className="mx-auto max-w-5xl px-6 py-16 border-t border-white/[0.06]">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-fog/60 mb-10 text-center">
          At a Glance
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
          {quickFacts.map((f) => (
            <div
              key={f.label}
              className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-4 text-center"
            >
              <p className="text-xs font-medium text-fog/50 mb-1 uppercase tracking-wider">
                {f.label}
              </p>
              <p className="text-sm font-semibold text-cream">{f.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-16 text-center border-t border-white/[0.06]">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/itinerary"
            className="inline-flex items-center gap-2 rounded-xl bg-cream px-6 py-3 text-sm font-semibold text-background transition-all hover:bg-white hover:shadow-[0_0_30px_rgba(196,154,63,0.15)]"
          >
            Full Itinerary →
          </Link>
          <Link
            href="/match-day"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-6 py-3 text-sm font-semibold text-cream transition-all hover:bg-white/[0.06]"
          >
            Match Day Plan
          </Link>
        </div>
      </section>
    </div>
  );
}
