// =============================================================================
// DayTwoDetail — "The cliffs of Suðuroy" page.
// Same pattern as Day 1: page intro, summary strip, timeline, trip status, map.
// Desktop: main column (~68%) + secondary column (~32%). Mobile: different order.
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
// Day 2 timeline data
// =============================================================================

const DAY_TWO_TIMELINE = [
  {
    num: 1,
    title: "Øravík base",
    subtitle: "Við á 7, Øravík 827",
    middleLabel: "Wake",
    middleValue: "~08:00",
    rightLabel: "Check",
    rightValue: "yr.no",
    footer: "Check the weather. If the cliffs are in fog, swap Hvannhagi for a Tvøroyri morning.",
  },
  {
    num: 2,
    title: "Bus 700 south",
    subtitle: "Ferjuleðan → Hov · ~15 min",
    middleLabel: "Depart",
    middleValue: "~10:00",
    rightLabel: "Fare",
    rightValue: "DKK 20",
    footer: "Two stops from the Krambatangi junction. Tell the driver 'Hov' — they know the drill.",
  },
  {
    num: 3,
    title: "Hvannhagi ridge walk",
    subtitle: "Orange T-marked posts · 2–3 hrs",
    middleLabel: "Distance",
    middleValue: "~5 km",
    middleLabel2: "Highest",
    middleValue2: "~200 m",
    rightLabel: "Duration",
    rightValue: "2–3 hrs",
    footer: "Cliff-edge lake facing Stóra Dímun. The markers vanish in fog — if visibility is poor, do the Hov chieftain-mound loop instead.",
  },
  {
    num: 4,
    title: "Hov village",
    subtitle: "Chieftain's mound · harbour",
    middleLabel: "Walk",
    middleValue: "~30 min",
    rightLabel: "Free",
    rightValue: "loop",
    footer: "The burial mound of a Viking chieftain overlooking the harbour. Quick, easy, worth the detour.",
  },
  {
    num: 5,
    title: "Beinisvørð",
    subtitle: "469 m · south-west corner of Suðuroy",
    middleLabel: "Drive",
    middleValue: "~20 min",
    rightLabel: "Visit",
    rightValue: "30–60 min",
    footer: "The defining cliff of Suðuroy. Walk past the gate north of the lighthouse. If the cloud base is low, skip it — the view is the point.",
  },
  {
    num: 6,
    title: "Hotel Tvøroyri",
    subtitle: "Pizzeria · bar · evening",
    middleLabel: "Arrive",
    middleValue: "~19:00",
    rightLabel: "Close",
    rightValue: "Late",
    footer: "Pizzeria, dependable pint, the same locals every night. Cash and card accepted. Last Bus 700 north runs ~22:00.",
  },
];

// =============================================================================
// Day 2 summary — quick facts
// =============================================================================

const DAY_TWO_SUMMARY = [
  { icon: "⌂", label: "Base", time: "Øravík", note: "Suðuroy" },
  { icon: "⏻", label: "Bus route", time: "700", note: "Coastal spine" },
  { icon: "▲", label: "Highest point", time: "469 m", note: "Beinisvørð" },
  { icon: "⏱", label: "Walking time", time: "3–4 hrs", note: "Total" },
  { icon: "🍺", label: "Dinner", time: "~19:00", note: "Hotel Tvøroyri" },
];

// =============================================================================
// Weather data type + formatter
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
// Shared widgets
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

function WeatherBlock() {
  const [w, setW] = useState<WeatherData>({ temp: null, wind: null, desc: "", loading: true, error: false });

  useEffect(() => {
    let cancelled = false;
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=61.536&lon=-6.81",
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
      <p className="text-[11px] text-basalt/60 mb-0.5">Øravík</p>
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

function DepartureCountdown() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date("2026-07-27T16:10:00Z").getTime();
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
      <p className="text-[64px] font-bold text-rust leading-none" style={{ fontFamily: "var(--font-cinzel)" }}>
        {days ?? "—"}
      </p>
      <p className="text-[13px] text-basalt/70 mt-1">days until departure</p>
      <p className="text-[11px] text-basalt/50 mt-2">Monday 27 July 2026</p>
      <p className="text-[11px] text-basalt/50">Flight at 17:10 from Edinburgh Airport</p>
    </>
  );
}

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
// Summary strip
// =============================================================================

function SummaryStrip() {
  return (
    <div className="grid grid-cols-5 border border-basalt/15 rounded-[8px] divide-x divide-basalt/10" style={{ minHeight: 96 }}>
      {DAY_TWO_SUMMARY.map((item, i) => (
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
// Timeline
// =============================================================================

function Timeline() {
  return (
    <div className="relative">
      <div className="absolute left-[17px] top-8 bottom-8 w-px border-l border-dashed border-fjord/25" aria-hidden />

      <div className="space-y-2.5">
        {DAY_TWO_TIMELINE.map((step) => (
          <div key={step.num} className="flex gap-4">
            <div className="flex flex-col items-center shrink-0" style={{ width: 36 }}>
              <div className="w-[34px] h-[34px] rounded-full bg-navy flex items-center justify-center shrink-0 z-10">
                <span className="text-[13px] font-medium text-wool">{step.num}</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="border border-basalt/15 rounded-[7px] p-3.5 flex items-center gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[15px] text-basalt leading-tight">{step.title}</p>
                  <p className="text-[12px] text-basalt/55 mt-0.5">{step.subtitle}</p>
                </div>

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

                <div className="bg-basalt/[0.03] border border-basalt/8 px-3 py-2 rounded-[4px] min-w-[72px] text-center">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">{step.rightLabel}</p>
                  <p className="code tnum text-[15px] font-medium text-basalt leading-tight mt-0.5">{step.rightValue}</p>
                </div>
              </div>

              {"footer" in step && (
                <p className="text-[11px] text-basalt/50 mt-1.5 px-1">{step.footer}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Mobile components
// =============================================================================

function MobileDecisionPanel() {
  return (
    <div className="border border-basalt/15 rounded-[8px] p-4">
      <p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60">First move</p>
      <p className="code tnum text-[36px] font-medium text-basalt leading-none mt-1">Bus 700 · 10:00</p>
      <p className="text-[13px] text-basalt/65 mt-2">
        Coastal ride south to <strong>Hov village</strong>. Hvannhagi ridge walk starts from there.
        Check the fog — if the hills are white, swap the walk for the chieftain's mound loop.
      </p>
      <div className="flex gap-6 mt-3 pt-3 border-t border-basalt/10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">Walking</p>
          <p className="code tnum text-[15px] font-medium text-basalt">3–4 hrs</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">Dinner</p>
          <p className="code tnum text-[15px] font-medium text-basalt">19:00</p>
        </div>
      </div>
    </div>
  );
}

function MobileTripStatus() {
  return (
    <div className="border border-basalt/15 rounded-[8px] p-4">
      <div className="flex items-baseline gap-3">
        <p className="text-[48px] font-bold text-rust leading-none" style={{ fontFamily: "var(--font-cinzel)" }}>8</p>
        <p className="text-[14px] font-medium text-basalt">days until departure</p>
      </div>
      <p className="text-[12px] text-basalt/55 mt-1">Wednesday 29 July 2026</p>
      <p className="text-[12px] text-basalt/55">Suðuroy exploration day</p>
      <hr className="my-3.5 border-basalt/10" />
      <div className="grid grid-cols-2 gap-4">
        <FaroeClock />
        <WeatherBlock />
      </div>
    </div>
  );
}

// =============================================================================
// Main export
// =============================================================================

export function DayTwoDetail() {
  const mapRef = useRef<maplibregl.Map | null>(null);

  return (
    <>
      {/* ================================================================
          DESKTOP LAYOUT
          ================================================================ */}
      <article className="hidden lg:grid grid-cols-[1fr_340px] gap-8 px-8 pt-8 pb-20 max-w-[1280px]">
        <div className="min-w-0">
          <div className="mb-8">
            <p className="text-[12px] tracking-[0.14em] uppercase text-rust font-medium">Day 2 · Wednesday · 29 July 2026</p>
            <h1
              className="text-[clamp(2.5rem,3.5vw,3.2rem)] leading-[1.04] mt-1.5 text-basalt tracking-[-0.01em]"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              The cliffs of Suðuroy
            </h1>
            <p className="text-[20px] font-medium text-basalt/80 mt-2">Øravík · Hov · Beinisvørð · Tvøroyri</p>
            <p className="text-[14px] text-basalt/60 mt-2 max-w-[38rem]">
              A whole Suðuroy day. Beinisvørð on the way south, a pint at Hotel Tvøroyri, and the twilight worth losing sleep for.
              Thursday is the match — today is the breathing room.
            </p>
          </div>

          <section className="mb-8">
            <SummaryStrip />
          </section>

          <section className="mb-10">
            <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-4">Day plan</p>
            <Timeline />
          </section>

          <section className="max-w-[48rem]">
            <div className="harbour-notice">
              <p className="text-[10px] uppercase tracking-[0.14em] text-rust font-medium mb-1">Could disrupt the day</p>
              <p className="text-[14px]">Coastal fog. If the cliffs are in cloud, swap Beinisvørð for Hvannhagi — the markers vanish in fog. The chieftain's mound at Hov works in any weather.</p>
            </div>
          </section>
        </div>

        <aside className="min-w-0">
          <div className="space-y-8">
            <TripStatusPanel />
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-2">SUÐUROY · FAROE ISLANDS</p>
              <div style={{ minHeight: 500 }}>
                <FaroesMap onSelect={() => {}} selected={null} filter="suðuroy" mapRef={mapRef} />
              </div>
            </div>
          </div>
        </aside>
      </article>

      {/* ================================================================
          MOBILE LAYOUT
          ================================================================ */}
      <article className="lg:hidden px-4 pt-6 pb-24 max-w-[640px] mx-auto">
        <div className="mb-6">
          <p className="text-[11px] tracking-[0.14em] uppercase text-rust font-medium">Day 2 · Wednesday · 29 July</p>
          <h1
            className="text-[clamp(2rem,8vw,2.6rem)] leading-[1.06] mt-1 text-basalt tracking-[-0.01em]"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            The cliffs of Suðuroy
          </h1>
          <p className="text-[17px] font-medium text-basalt/80 mt-1.5">Øravík · Hov · Beinisvørð · Tvøroyri</p>
          <p className="text-[14px] text-basalt/60 mt-2">
            A whole Suðuroy day. Beinisvørð, Hvannhagi ridge walk, and a pint at Hotel Tvøroyri.
          </p>
        </div>

        <section className="mb-6">
          <MobileDecisionPanel />
        </section>

        <section className="mb-8">
          <MobileTripStatus />
        </section>

        <section className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-3">Day plan</p>
          <div className="space-y-2.5">
            {DAY_TWO_TIMELINE.map((step) => (
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
                    <p className="text-[11px] text-basalt/50 mt-2 pt-2 border-t border-basalt/5">{step.footer}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="harbour-notice">
            <p className="text-[10px] uppercase tracking-[0.14em] text-rust font-medium mb-1">Could disrupt the day</p>
            <p className="text-[14px]">Coastal fog. If the cliffs are in cloud, swap Beinisvørð for Hvannhagi — the markers vanish in fog.</p>
          </div>
        </section>

        <section>
          <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-2">SUÐUROY · FAROE ISLANDS</p>
          <div style={{ minHeight: 420 }}>
            <FaroesMap onSelect={() => {}} selected={null} filter="journey" mapRef={mapRef} />
          </div>
        </section>
      </article>
    </>
  );
}
