// =============================================================================
// DayOneDetail — "Getting to Edinburgh Airport" page.
// Spec-driven rebuild: page intro, journey summary strip, 6-step vertical
// timeline, train departure alternatives, trip status panel, route map.
// Desktop: main column (~68%) + secondary column (~32%).  Mobile: different order.
// =============================================================================

"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type maplibregl from "maplibre-gl";

const FaroesMap = dynamic(() => import("@/components/map/faroes-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full border border-basalt/15 bg-fog/20 flex items-center justify-center" style={{ minHeight: 280 }}>
      <p className="caption">Loading map…</p>
    </div>
  ),
});

// =============================================================================
// Data — journey steps, summary, train options
// =============================================================================

const TIMELINE_STEPS = [
  {
    num: 1,
    icon: "✦",
    title: "Home",
    subtitle: "40 Liberty Road, Bellshill ML4 2EX",
    middleLabel: "Walk",
    middleValue: "~6 min",
    rightLabel: "Leave by",
    rightValue: "08:35",
  },
  {
    num: 2,
    icon: "⌂",
    title: "Bellshill Station",
    subtitle: "ScotRail",
    middleLabel: "Platform",
    middleValue: "1",
    rightLabel: "Arrive by",
    rightValue: "08:50",
  },
  {
    num: 3,
    icon: "⏻",
    title: "ScotRail",
    subtitle: "Bellshill → Haymarket",
    middleLabel: "Departs",
    middleValue: "08:59",
    middleLabel2: "Arrives",
    middleValue2: "10:02",
    rightLabel: "Journey",
    rightValue: "1h 03m",
    footer: "Recommended service — gives you plenty of time at the airport.",
    footerLink: { label: "Live times on ScotRail →", href: "https://www.scotrail.co.uk/plan-your-journey" },
  },
  {
    num: 4,
    icon: "⇄",
    title: "Haymarket Station",
    subtitle: "Exit towards the tram stop directly outside.",
    middleLabel: "Transfer",
    middleValue: "~2 min",
    rightLabel: "Depart by",
    rightValue: "10:05",
  },
  {
    num: 5,
    icon: "⏻",
    title: "Edinburgh Tram",
    subtitle: "Haymarket → Edinburgh Airport",
    middleLabel: "Every",
    middleValue: "7–8 min",
    middleLabel2: "Arrives",
    middleValue2: "~10:35",
    rightLabel: "Journey",
    rightValue: "~30 min",
    footer: "Tap-on, tap-off contactless or ticket machine.",
  },
  {
    num: 6,
    icon: "✈",
    title: "Edinburgh Airport",
    subtitle: "Domestic Departures",
    middleLabel: "Arrive by",
    middleValue: "~10:40",
    rightLabel: "Contingency",
    rightValue: "~6h 30m",
  },
];

const TRAIN_OPTIONS = {
  recommended: { dep: "08:59", arr: "10:02", duration: "1h 03m", type: "Direct", note: "Best balance of time and contingency. Arrive at airport approximately 6h 30m before flight." },
  backup:     { dep: "09:59", arr: "11:02", duration: "1h 03m", type: "Direct", note: "Still provides substantial airport contingency." },
  later: [
    { dep: "10:59", arr: "12:02", duration: "1h 03m" },
    { dep: "11:59", arr: "13:02", duration: "1h 03m" },
    { dep: "12:59", arr: "14:02", duration: "1h 03m" },
    { dep: "13:59", arr: "15:02", duration: "1h 03m" },
  ],
};

const SUMMARY_ITEMS = [
  { icon: "⌂", label: "Leave home by", time: "08:35", note: "Bellshill" },
  { icon: "⏻", label: "Take the train", time: "08:59", note: "ScotRail" },
  { icon: "✈", label: "Airport arrival", time: "~10:40", note: "Edinburgh" },
  { icon: "◷", label: "Contingency", time: "~6h 30m", note: "before flight" },
  { icon: "✈", label: "Flight departs", time: "17:10", note: "Edinburgh Airport" },
];

// =============================================================================
// Weather data type
// =============================================================================

interface WeatherData {
  temp: number | null;
  wind: number | null;
  desc: string;
  loading: boolean;
  error: boolean;
}

function formatSymbol(code: string): string {
  const map: Record<string, string> = {
    clearsky_day: "Clear sky", clearsky_night: "Clear sky",
    fair_day: "Fair", fair_night: "Fair",
    partlycloudy_day: "Partly cloudy", partlycloudy_night: "Partly cloudy",
    cloudy: "Cloudy",
    rainshowers_day: "Rain showers", rainshowers_night: "Rain showers",
    heavyrainshowers_day: "Heavy rain showers",
    rain: "Rain", lightrain: "Light rain", heavyrain: "Heavy rain",
    lightrainshowers_day: "Light rain showers",
    fog: "Fog",
    snow: "Snow", lightsnow: "Light snow", heavysnow: "Heavy snow",
    snowshowers_day: "Snow showers",
    sleet: "Sleet",
    rainshowersandthunder_day: "Rain & thunder",
    heavyrainshowersandthunder_day: "Heavy rain & thunder",
  };
  return map[code] ?? code.replace(/_/g, " ");
}

// =============================================================================
// Widget: Faroe Islands clock (no seconds — spec says no continuously ticking)
// =============================================================================

function FaroeClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const t = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Atlantic/Faroe",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);
      const d = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Atlantic/Faroe",
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(now);
      setTime(t);
      setDate(d);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <p className="text-[11px] text-basalt/60 mb-0.5">Faroe Islands</p>
      <p className="code tnum text-[22px] font-medium text-basalt leading-none">{time || "—:—"}</p>
      <p className="text-[10.5px] text-basalt/45 mt-0.5">{date || "—"} · WEST · UTC+1</p>
    </div>
  );
}

// =============================================================================
// Widget: Tórshavn weather — yr.no, no fabricated data
// =============================================================================

function WeatherBlock() {
  const [w, setW] = useState<WeatherData>({ temp: null, wind: null, desc: "", loading: true, error: false });

  useEffect(() => {
    let cancelled = false;
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=62.0097&lon=-6.7716",
          { headers: { "User-Agent": "faroe-islands-expedition-log/1.0 github.com/DeclanD2025" } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (cancelled) return;
        const ts = json.properties.timeseries[0];
        const instant = ts.data.instant.details;
        const next1h = ts.data.next_1_hours;
        setW({
          temp: instant.air_temperature,
          wind: instant.wind_speed,
          desc: formatSymbol(next1h?.summary?.symbol_code ?? ""),
          loading: false,
          error: false,
        });
      } catch {
        if (!cancelled) setW((prev) => ({ ...prev, loading: false, error: true }));
      }
    };
    fetchWeather();
    const id = setInterval(fetchWeather, 1_800_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return (
    <div>
      <p className="text-[11px] text-basalt/60 mb-0.5">Tórshavn</p>
      {w.loading ? (
        <p className="text-[13px] text-basalt/50">—</p>
      ) : w.error ? (
        <p className="text-[13px] text-rust/70">Unavailable</p>
      ) : (
        <>
          <p className="code tnum text-[22px] font-medium text-basalt leading-none">
            {w.temp?.toFixed(0) ?? "—"}°
          </p>
          <p className="text-[11px] text-basalt/55 mt-0.5">{w.desc || "—"}</p>
        </>
      )}
    </div>
  );
}

// =============================================================================
// Widget: Departure countdown — days only (non-animated, per spec)
// =============================================================================

function DepartureCountdown() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date("2026-07-27T16:10:00Z").getTime(); // 17:10 BST
    const calc = () => {
      const diff = target - Date.now();
      setDays(Math.max(0, Math.ceil(diff / 86_400_000)));
    };
    calc();
    const id = setInterval(calc, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <p className="text-[64px] font-bold text-rust leading-none tabular-nums" style={{ fontFamily: "var(--font-cinzel)" }}>
        {days ?? "—"}
      </p>
      <p className="text-[13px] text-basalt/70 mt-1">days until departure</p>
      <p className="text-[11px] text-basalt/50 mt-2">Monday 27 July 2026</p>
      <p className="text-[11px] text-basalt/50">Flight at 17:10 from Edinburgh Airport</p>
    </>
  );
}

// =============================================================================
// Component: Trip Status Panel
// =============================================================================

function TripStatusPanel() {
  return (
    <div className="border border-basalt/15 p-5">
      <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-3">Trip Status</p>

      <DepartureCountdown />

      <hr className="my-4 border-basalt/10" />

      <div className="grid grid-cols-2 gap-4">
        <FaroeClock />
        <WeatherBlock />
      </div>

      <p className="text-[10px] text-basalt/35 mt-3">Updated 19 Jul, 10:30 · yr.no</p>
    </div>
  );
}

// =============================================================================
// Component: Journey Summary Strip
// =============================================================================

function JourneySummaryStrip() {
  return (
    <div className="grid grid-cols-5 border border-basalt/15 rounded-[8px] divide-x divide-basalt/10" style={{ minHeight: 96 }}>                  {SUMMARY_ITEMS.map((item, i) => (
        <div key={i} className="flex flex-col justify-center px-4 py-3">
          <p className="text-[11px] text-basalt/55 mb-1">{item.icon} {item.label}</p>
          <p className="code tnum text-[20px] font-medium text-basalt leading-none">{item.time}</p>
          <p className="text-[11px] text-basalt/45 mt-1">{item.note}</p>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Component: Journey Timeline
// =============================================================================

function JourneyTimeline() {
  return (
    <div className="relative">
      {/* Vertical connector line */}
      <div className="absolute left-[17px] top-8 bottom-8 w-px border-l border-dashed border-fjord/25" aria-hidden />

      <div className="space-y-2.5">
        {TIMELINE_STEPS.map((step) => (
          <div key={step.num} className="flex gap-4">
            {/* Circle + number */}
            <div className="flex flex-col items-center shrink-0" style={{ width: 36 }}>
              <div className="w-[34px] h-[34px] rounded-full bg-navy flex items-center justify-center shrink-0 z-10">
                <span className="text-[13px] font-medium text-wool">{step.num}</span>
              </div>
            </div>

            {/* Content card */}
            <div className="flex-1 min-w-0">
              <div className="border border-basalt/15 rounded-[7px] p-3.5 flex items-center gap-4 flex-wrap">
                {/* Title block */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[15px] text-basalt leading-tight">{step.title}</p>
                  <p className="text-[12px] text-basalt/55 mt-0.5">{step.subtitle}</p>
                </div>

                {/* Middle detail */}
                {"middleLabel2" in step ? (
                  <div className="flex gap-5">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">{step.middleLabel}</p>
                      <p className="code tnum text-[13px] text-fjord font-medium">{step.middleValue}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">{step.middleLabel2}</p>
                      <p className="code tnum text-[13px] text-fjord font-medium">{step.middleValue2}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">{step.middleLabel}</p>
                    <p className="code tnum text-[13px] text-fjord font-medium">{step.middleValue}</p>
                  </div>
                )}

                {/* Right time inset */}
                <div className="bg-basalt/[0.03] border border-basalt/8 px-3 py-2 rounded-[4px] min-w-[72px] text-center">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">{step.rightLabel}</p>
                  <p className="code tnum text-[15px] font-medium text-basalt leading-tight mt-0.5">{step.rightValue}</p>
                </div>
              </div>

              {/* Footer note */}
              {"footer" in step && (
                <div className="flex items-center justify-between mt-1.5 px-1">
                  <p className="text-[11px] text-basalt/50">{step.footer}</p>
                  {"footerLink" in step && step.footerLink && (
                    <a
                      href={step.footerLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-fjord/70 underline underline-offset-2 decoration-fjord/30 hover:text-rust transition-colors shrink-0 ml-4"
                    >
                      {step.footerLink.label}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Component: Train Departures
// =============================================================================

function TrainDepartures() {
  const [showLater, setShowLater] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <div>
          <p className="font-medium text-[17px] text-basalt">Bellshill → Haymarket departures</p>
          <p className="text-[13px] text-basalt/55 mt-0.5">Monday 27 July 2026</p>
        </div>
        <p className="text-[11px] text-basalt/50">
          All times planned timetable ·{" "}
          <a
            href="https://www.scotrail.co.uk/plan-your-journey"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 decoration-basalt/30 hover:text-rust transition-colors"
          >
            Check live times on ScotRail →
          </a>
        </p>
      </div>

      {/* Three columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 border border-basalt/15 rounded-[8px] divide-y md:divide-y-0 md:divide-x divide-basalt/10">
        {/* Recommended */}
        <div className="p-4 border-l-[3px] border-moss/40">
          <p className="text-[10px] uppercase tracking-[0.12em] text-moss/80 mb-2 flex items-center gap-1.5">
            <span>✓</span> RECOMMENDED
          </p>
          <p className="code tnum text-[18px] font-medium text-basalt">{TRAIN_OPTIONS.recommended.dep} → {TRAIN_OPTIONS.recommended.arr}</p>
          <p className="text-[12px] text-basalt/55 mt-1">{TRAIN_OPTIONS.recommended.duration} · {TRAIN_OPTIONS.recommended.type}</p>
          <p className="text-[12px] text-basalt/60 mt-2 leading-[1.4]">{TRAIN_OPTIONS.recommended.note}</p>
        </div>

        {/* Backup */}
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60 mb-2">BACKUP OPTION</p>
          <p className="code tnum text-[18px] font-medium text-basalt">{TRAIN_OPTIONS.backup.dep} → {TRAIN_OPTIONS.backup.arr}</p>
          <p className="text-[12px] text-basalt/55 mt-1">{TRAIN_OPTIONS.backup.duration} · {TRAIN_OPTIONS.backup.type}</p>
          <p className="text-[12px] text-basalt/60 mt-2 leading-[1.4]">{TRAIN_OPTIONS.backup.note}</p>
        </div>

        {/* Later alternatives */}
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60 mb-2">LATER ALTERNATIVES</p>
          <div className="space-y-2">
            {TRAIN_OPTIONS.later.slice(0, 2).map((t, i) => (
              <p key={i} className="code tnum text-[14px] text-basalt">{t.dep} → {t.arr}</p>
            ))}

            {showLater && (
              <div className="space-y-2">
                {TRAIN_OPTIONS.later.slice(2).map((t, i) => (
                  <p key={i} className="code tnum text-[14px] text-basalt">{t.dep} → {t.arr}</p>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowLater(!showLater)}
              className="text-[12px] text-fjord/70 underline underline-offset-2 decoration-fjord/30 hover:text-rust transition-colors mt-2"
            >
              {showLater ? "Show fewer" : `+ ${TRAIN_OPTIONS.later.length - 2} more services`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Component: Mobile Header
// =============================================================================

function MobileDecisionPanel() {
  return (
    <div className="border border-basalt/15 rounded-[8px] p-4">
      <p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60">Leave home by</p>
      <p className="code tnum text-[36px] font-medium text-basalt leading-none mt-1">08:35</p>
      <p className="text-[13px] text-basalt/65 mt-2">
        Take the <strong>08:59</strong> train from Bellshill.
        Expected airport arrival around <strong>10:40</strong>.
      </p>
      <div className="flex gap-6 mt-3 pt-3 border-t border-basalt/10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">Contingency</p>
          <p className="code tnum text-[15px] font-medium text-basalt">~6h 30m</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">Flight</p>
          <p className="code tnum text-[15px] font-medium text-basalt">17:10</p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Component: Mobile Trip Status
// =============================================================================

function MobileTripStatus() {
  return (
    <div className="border border-basalt/15 rounded-[8px] p-4">
      <div className="flex items-baseline gap-3">
        <p className="text-[48px] font-bold text-rust leading-none" style={{ fontFamily: "var(--font-cinzel)" }}>8</p>
        <p className="text-[14px] font-medium text-basalt">days until departure</p>
      </div>
      <p className="text-[12px] text-basalt/55 mt-1">Monday 27 July 2026</p>
      <p className="text-[12px] text-basalt/55">Flight at 17:10 from Edinburgh Airport</p>
      <hr className="my-3.5 border-basalt/10" />
      <div className="grid grid-cols-2 gap-4">
        <FaroeClock />
        <WeatherBlock />
      </div>
    </div>
  );
}

// =============================================================================
// Component: Mobile Train Options
// =============================================================================

function MobileTrainOptions() {
  const [showLater, setShowLater] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <div>
          <p className="font-medium text-[16px] text-basalt">Train departures</p>
          <p className="text-[12px] text-basalt/55">Mon 27 Jul · Bellshill → Haymarket</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Recommended */}
        <div className="border border-moss/30 rounded-[8px] p-4 border-l-[3px] border-l-moss/40">
          <p className="text-[10px] uppercase tracking-[0.12em] text-moss/80 flex items-center gap-1.5 mb-1.5">
            <span>✓</span> RECOMMENDED
          </p>
          <p className="code tnum text-[18px] font-medium text-basalt">08:59 → 10:02</p>
          <p className="text-[12px] text-basalt/55 mt-0.5">1h 03m · Direct</p>
          <p className="text-[12px] text-basalt/60 mt-1.5">{TRAIN_OPTIONS.recommended.note}</p>
        </div>

        {/* Backup */}
        <div className="border border-basalt/15 rounded-[8px] p-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60 mb-1.5">BACKUP OPTION</p>
          <p className="code tnum text-[16px] font-medium text-basalt">09:59 → 11:02</p>
          <p className="text-[12px] text-basalt/55 mt-0.5">1h 03m · Direct</p>
          <p className="text-[12px] text-basalt/60 mt-1.5">{TRAIN_OPTIONS.backup.note}</p>
        </div>

        {/* Later */}
        <div className="border border-basalt/15 rounded-[8px] p-4">
          <button
            type="button"
            onClick={() => setShowLater(!showLater)}
            className="text-[13px] font-medium text-fjord w-full text-left flex items-center justify-between min-h-[44px]"
            aria-expanded={showLater}
          >
            {showLater ? "Hide later services" : `View ${TRAIN_OPTIONS.later.length} later services`}
            <span className="text-[11px] text-fjord/60">{showLater ? "▲" : "▼"}</span>
          </button>
          {showLater && (
            <div className="space-y-2 pt-2 border-t border-basalt/10 mt-2">
              {TRAIN_OPTIONS.later.map((t, i) => (
                <div key={i} className="flex items-center gap-4 py-1.5">
                  <p className="code tnum text-[14px] font-medium text-basalt">{t.dep}</p>
                  <p className="text-[12px] text-basalt/40">→</p>
                  <p className="code tnum text-[14px] text-basalt">{t.arr}</p>
                  <p className="text-[12px] text-basalt/50">{t.duration}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Main export
// =============================================================================

export function DayOneDetail() {
  const mapRef = useRef<maplibregl.Map | null>(null);

  return (
    <>
      {/* ================================================================
          DESKTOP LAYOUT
          ================================================================ */}
      <article className="hidden lg:grid grid-cols-[1fr_340px] gap-8 px-8 pt-8 pb-20 max-w-[1280px]">
        {/* MAIN COLUMN */}
        <div className="min-w-0">
          {/* Page introduction */}
          <div className="mb-8">
            <p className="text-[12px] tracking-[0.14em] uppercase text-rust font-medium">Day 1</p>
            <h1
              className="text-[clamp(2.5rem,3.5vw,3.2rem)] leading-[1.04] mt-1.5 text-basalt tracking-[-0.01em]"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              The journey north
            </h1>
            <p className="text-[20px] font-medium text-basalt/80 mt-2">Getting to Edinburgh Airport</p>
            <p className="text-[14px] text-basalt/60 mt-2 max-w-[38rem]">
              Your journey from home to Edinburgh Airport on 27 July 2026.
              Leave with time to spare. Enjoy the day.
            </p>
          </div>

          {/* Journey summary strip */}
          <section className="mb-8">
            <JourneySummaryStrip />
          </section>

          {/* Journey timeline */}
          <section className="mb-10">
            <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-4">Journey timeline</p>
            <JourneyTimeline />
          </section>

          {/* Train departures */}
          <section>
            <TrainDepartures />
          </section>
        </div>

        {/* SECONDARY COLUMN */}
        <aside className="min-w-0">
          <div className="space-y-8">
            <TripStatusPanel />
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-2">SCOTLAND → FØROYAR</p>
              <div style={{ minHeight: 500 }}>
                <FaroesMap onSelect={() => {}} selected={null} filter="journey" mapRef={mapRef} />
              </div>
            </div>
          </div>
        </aside>
      </article>

      {/* ================================================================
          MOBILE LAYOUT
          ================================================================ */}
      <article className="lg:hidden px-4 pt-6 pb-24 max-w-[640px] mx-auto">
        {/* Page introduction */}
        <div className="mb-6">
          <p className="text-[11px] tracking-[0.14em] uppercase text-rust font-medium">Day 1</p>
          <h1
            className="text-[clamp(2rem,8vw,2.6rem)] leading-[1.06] mt-1 text-basalt tracking-[-0.01em]"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            The journey north
          </h1>
          <p className="text-[17px] font-medium text-basalt/80 mt-1.5">Getting to Edinburgh Airport</p>
          <p className="text-[14px] text-basalt/60 mt-2">
            Your journey from home to Edinburgh Airport on 27 July 2026.
          </p>
        </div>

        {/* Mobile decision panel */}
        <section className="mb-6">
          <MobileDecisionPanel />
        </section>

        {/* Mobile trip status */}
        <section className="mb-8">
          <MobileTripStatus />
        </section>

        {/* Mobile timeline */}
        <section className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-3">Journey</p>
          <div className="space-y-2.5">
            {TIMELINE_STEPS.map((step) => (
              <div key={step.num} className="flex gap-3">
                <div className="w-[34px] h-[34px] rounded-full bg-navy flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[13px] font-medium text-wool">{step.num}</span>
                </div>
                <div className="flex-1 min-w-0 border border-basalt/15 rounded-[7px] p-3">
                  <p className="font-medium text-[15px] text-basalt">{step.title}</p>
                  <p className="text-[12px] text-basalt/55">{step.subtitle}</p>
                  <div className="flex items-baseline gap-3 mt-2">
                    <p className="text-[11px] text-basalt/45">{step.rightLabel}:</p>
                    <p className="code tnum text-[15px] font-medium text-basalt">{step.rightValue}</p>
                    {("middleLabel2" in step) ? (
                      <>
                        <span className="text-basalt/30">·</span>
                        <p className="code tnum text-[14px] text-fjord">{step.middleValue}–{step.middleValue2}</p>
                        <span className="text-basalt/30">·</span>
                        <p className="text-[12px] text-fjord/70">{step.rightValue}</p>
                      </>
                    ) : (
                      <>
                        <span className="text-basalt/30">·</span>
                        <p className="text-[12px] text-fjord/70">{step.middleLabel}: {step.middleValue}</p>
                      </>
                    )}
                  </div>
                  {"footer" in step && (
                    <div className="mt-2 pt-2 border-t border-basalt/5">
                      <p className="text-[11px] text-basalt/50">{step.footer}</p>
                      {"footerLink" in step && step.footerLink && (
                        <a
                          href={step.footerLink.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-[11px] text-fjord/70 underline underline-offset-2 mt-1"
                        >
                          {step.footerLink.label}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mobile train options */}
        <section className="mb-8">
          <MobileTrainOptions />
        </section>

        {/* Mobile map */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-2">SCOTLAND → FØROYAR</p>
          <div style={{ minHeight: 420 }}>
            <FaroesMap onSelect={() => {}} selected={null} filter="journey" mapRef={mapRef} />
          </div>
        </section>
      </article>
    </>
  );
}
