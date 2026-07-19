// =============================================================================
// DayFourDetail — "Repositioning north" page.
// One last ferry, Bus 300 to Sørvágur, Guesthouse Hugo check-in.
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
// Timeline
// =============================================================================

const DAY_FOUR_TIMELINE = [
  {
    num: 1,
    title: "Morning in Øravík",
    subtitle: "Pack up, clean, lockbox checkout",
    middleLabel: "Checkout",
    middleValue: "By 12:00",
    rightLabel: "Morning",
    rightValue: "Free",
    footer: "Leave the key in the lockbox. Final walk round the village. Bus 700 to Krambatangi leaves from Ferjuleðan — two stops.",
  },
  {
    num: 2,
    title: "Bus 700 → Krambatangi",
    subtitle: "Ferjuleðan stop · 2 stops",
    middleLabel: "Depart",
    middleValue: "~15:15",
    rightLabel: "Transfer",
    rightValue: "~8 min",
    footer: "DKK 20 pp or SSL Travel Card. Don't cut it too close — the 16:00 is a Friday timetable sailing, different from Thursday.",
  },
  {
    num: 3,
    title: "M/F Smyril northbound",
    subtitle: "Krambatangi → Tórshavn · Friday sailing",
    middleLabel: "Departs",
    middleValue: "16:00",
    middleLabel2: "Arrives",
    middleValue2: "18:05",
    rightLabel: "Crossing",
    rightValue: "2h 05m",
    footer: "Friday timetable — the 16:00 replaces the usual afternoon pattern. If this sailing is cancelled for swell, the 21:15 may still run as backup. Keep both options open.",
  },
  {
    num: 4,
    title: "Bus 300 · Tórshavn → Sørvágur",
    subtitle: "Via Vágatunnilin · stops at airport",
    middleLabel: "Departs",
    middleValue: "18:30",
    middleLabel2: "Arrives",
    middleValue2: "19:15",
    rightLabel: "Journey",
    rightValue: "45 min",
    footer: "Connects from the 18:05 ferry arrival. DKK 90 pp or SSL Travel Card. The bus drops at Sørvágur village, not the airport — the terminal is 10 min walk or one stop on Bus 300.",
  },
  {
    num: 5,
    title: "Guesthouse Hugo",
    subtitle: "2 Bakkavegur, 380 Sørvágur",
    middleLabel: "Arrive",
    middleValue: "~19:30",
    rightLabel: "PIN",
    rightValue: "9432",
    footer: "Confirm: 5924180270. Phone: +298 232101. Ten minutes from Vágar Airport terminal — easy morning tomorrow. Múlafossur waterfall is a 25 min walk east from the village.",
  },
];

// =============================================================================
// Summary
// =============================================================================

const DAY_FOUR_SUMMARY = [
  { icon: "⌂", label: "Checkout", time: "12:00", note: "Øravík" },
  { icon: "⏻", label: "Ferry out", time: "16:00", note: "Krambatangi" },
  { icon: "⏻", label: "Bus 300", time: "18:30", note: "Tórshavn" },
  { icon: "⌂", label: "Check-in", time: "~19:30", note: "Sørvágur" },
  { icon: "✈", label: "Airport", time: "10 min", note: "from Hugo" },
];

// =============================================================================
// Shared widgets
// =============================================================================

interface WeatherData {
  temp: number | null; wind: number | null; desc: string; loading: boolean; error: boolean;
}

function formatSymbol(code: string): string {
  const map: Record<string, string> = {
    clearsky_day: "Clear sky", clearsky_night: "Clear sky", fair_day: "Fair", fair_night: "Fair",
    partlycloudy_day: "Partly cloudy", partlycloudy_night: "Partly cloudy", cloudy: "Cloudy",
    rainshowers_day: "Rain showers", rainshowers_night: "Rain showers", rain: "Rain",
    lightrain: "Light rain", heavyrain: "Heavy rain", fog: "Fog",
  };
  return map[code] ?? code.replace(/_/g, " ");
}

function FaroeClock() {
  const [time, setTime] = useState(""); const [date, setDate] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(new Intl.DateTimeFormat("en-GB", { timeZone: "Atlantic/Faroe", hour: "2-digit", minute: "2-digit", hour12: false }).format(now));
      setDate(new Intl.DateTimeFormat("en-GB", { timeZone: "Atlantic/Faroe", weekday: "short", day: "numeric", month: "short" }).format(now));
    };
    tick(); const id = setInterval(tick, 30_000); return () => clearInterval(id);
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
        const res = await fetch("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=62.0706&lon=-7.3221", { headers: { "User-Agent": "faroe-islands-expedition-log/1.0" } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json(); if (cancelled) return;
        const instant = json.properties.timeseries[0].data.instant.details;
        const next1h = json.properties.timeseries[0].data.next_1_hours;
        setW({ temp: instant.air_temperature, wind: instant.wind_speed, desc: formatSymbol(next1h?.summary?.symbol_code ?? ""), loading: false, error: false });
      } catch { if (!cancelled) setW(prev => ({ ...prev, loading: false, error: true })); }
    };
    fetchWeather(); const id = setInterval(fetchWeather, 1_800_000); return () => { cancelled = true; clearInterval(id); };
  }, []);
  return (
    <div>
      <p className="text-[11px] text-basalt/60 mb-0.5">Sørvágur</p>
      {w.loading ? <p className="text-[13px] text-basalt/50">—</p> : w.error ? <p className="text-[13px] text-rust/70">Unavailable</p> : (
        <><p className="code tnum text-[22px] font-medium text-basalt leading-none">{w.temp?.toFixed(0) ?? "—"}°</p><p className="text-[11px] text-basalt/55 mt-0.5">{w.desc || "—"}</p></>
      )}
    </div>
  );
}

function TripStatusPanel() {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date("2026-07-27T16:10:00Z").getTime();
    const calc = () => setDays(Math.max(0, Math.ceil((target - Date.now()) / 86_400_000)));
    calc(); const id = setInterval(calc, 60_000); return () => clearInterval(id);
  }, []);
  return (
    <div className="border border-basalt/15 p-5">
      <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-3">Trip Status</p>
      <p className="text-[64px] font-bold text-rust leading-none" style={{ fontFamily: "var(--font-cinzel)" }}>{days ?? "—"}</p>
      <p className="text-[13px] text-basalt/70 mt-1">days until departure</p>
      <p className="text-[11px] text-basalt/50 mt-2">Friday 31 July 2026</p>
      <p className="text-[11px] text-basalt/50">Repositioning to Sørvágur</p>
      <hr className="my-4 border-basalt/10" />
      <div className="grid grid-cols-2 gap-4"><FaroeClock /><WeatherBlock /></div>
      <p className="text-[10px] text-basalt/35 mt-3">Updated 19 Jul, 10:30 · yr.no</p>
    </div>
  );
}

// =============================================================================
// Summary strip + Timeline
// =============================================================================

function SummaryStrip() {
  return (
    <div className="grid grid-cols-5 border border-basalt/15 rounded-[8px] divide-x divide-basalt/10" style={{ minHeight: 96 }}>
      {DAY_FOUR_SUMMARY.map((item, i) => (
        <div key={i} className="flex flex-col justify-center px-3 py-3">
          <p className="text-[11px] text-basalt/55 mb-1">{item.icon} {item.label}</p>
          <p className="code tnum text-[18px] font-medium text-basalt leading-none">{item.time}</p>
          <p className="text-[11px] text-basalt/45 mt-1">{item.note}</p>
        </div>
      ))}
    </div>
  );
}

function Timeline() {
  return (
    <div className="relative">
      <div className="absolute left-[17px] top-8 bottom-8 w-px border-l border-dashed border-fjord/25" aria-hidden />
      <div className="space-y-2.5">
        {DAY_FOUR_TIMELINE.map((step) => (
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
                    <div><p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">{step.middleLabel}</p><p className="code tnum text-[13px] text-fjord font-medium">{step.middleValue}</p></div>
                    <div><p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">{step.middleLabel2}</p><p className="code tnum text-[13px] text-fjord font-medium">{step.middleValue2}</p></div>
                  </div>
                ) : (
                  <div><p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">{step.middleLabel}</p><p className="code tnum text-[13px] text-fjord font-medium">{step.middleValue}</p></div>
                )}
                <div className="bg-basalt/[0.03] border border-basalt/8 px-3 py-2 rounded-[4px] min-w-[72px] text-center">
                  <p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">{step.rightLabel}</p>
                  <p className="code tnum text-[15px] font-medium text-basalt leading-tight mt-0.5">{step.rightValue}</p>
                </div>
              </div>
              {"footer" in step && <p className="text-[11px] text-basalt/50 mt-1.5 px-1">{step.footer}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Mobile
// =============================================================================

function MobileDecisionPanel() {
  return (
    <div className="border border-basalt/15 rounded-[8px] p-4">
      <p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60">Game plan</p>
      <p className="code tnum text-[36px] font-medium text-basalt leading-none mt-1">Ferry 16:00</p>
      <p className="text-[13px] text-basalt/65 mt-2">
        Pack up Øravík. <strong>16:00 ferry</strong> north (Friday timetable — earlier than Thursday).
        Bus 300 to Sørvágur. <strong>Guesthouse Hugo</strong> is 10 min from the airport.
      </p>
      <div className="flex gap-6 mt-3 pt-3 border-t border-basalt/10">
        <div><p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">Arrive</p><p className="code tnum text-[15px] font-medium text-basalt">~19:30</p></div>
        <div><p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">PIN</p><p className="code tnum text-[15px] font-medium text-basalt">9432</p></div>
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
      <p className="text-[12px] text-basalt/55 mt-1">Friday 31 July 2026</p>
      <p className="text-[12px] text-basalt/55">Repositioning to Sørvágur</p>
      <hr className="my-3.5 border-basalt/10" />
      <div className="grid grid-cols-2 gap-4"><FaroeClock /><WeatherBlock /></div>
    </div>
  );
}

// =============================================================================
// Main export
// =============================================================================

export function DayFourDetail() {
  const mapRef = useRef<maplibregl.Map | null>(null);

  return (
    <>
      {/* DESKTOP */}
      <article className="hidden lg:grid grid-cols-[1fr_340px] gap-8 px-8 pt-8 pb-20 max-w-[1280px]">
        <div className="min-w-0">
          <div className="mb-8">
            <p className="text-[12px] tracking-[0.14em] uppercase text-rust font-medium">Day 4 · Friday · 31 July 2026</p>
            <h1 className="text-[clamp(2.5rem,3.5vw,3.2rem)] leading-[1.04] mt-1.5 text-basalt tracking-[-0.01em]" style={{ fontFamily: "var(--font-cinzel)" }}>Repositioning north</h1>
            <p className="text-[20px] font-medium text-basalt/80 mt-2">Øravík → Tórshavn → Sørvágur</p>
            <p className="text-[14px] text-basalt/60 mt-2 max-w-[38rem]">
              One last ferry crossing, chasing the late sun towards the airport island. Guesthouse Hugo is ten minutes from the terminal — easy morning, no panicked dawn.
            </p>
          </div>

          <section className="mb-8"><SummaryStrip /></section>

          <section className="mb-10">
            <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-4">Journey north</p>
            <Timeline />
          </section>

          <section className="max-w-[48rem]">
            <div className="harbour-notice">
              <p className="text-[10px] uppercase tracking-[0.14em] text-rust font-medium mb-1">Could disrupt the day</p>
              <p className="text-[14px]">
                The Friday timetable differs from Thursday's. If the 16:00 ferry is cancelled for swell, the 21:15 may still run — keep the option open. Múlafossur is a 25 min walk from Hugo if you arrive with light.
              </p>
            </div>
          </section>
        </div>

        <aside className="min-w-0">
          <div className="space-y-8">
            <TripStatusPanel />
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-2">SUÐUROY → VÁGAR</p>
              <div style={{ minHeight: 500 }}><FaroesMap onSelect={() => {}} selected={null} filter="journey" mapRef={mapRef} /></div>
            </div>
          </div>
        </aside>
      </article>

      {/* MOBILE */}
      <article className="lg:hidden px-4 pt-6 pb-24 max-w-[640px] mx-auto">
        <div className="mb-6">
          <p className="text-[11px] tracking-[0.14em] uppercase text-rust font-medium">Day 4 · Friday · 31 July</p>
          <h1 className="text-[clamp(2rem,8vw,2.6rem)] leading-[1.06] mt-1 text-basalt tracking-[-0.01em]" style={{ fontFamily: "var(--font-cinzel)" }}>Repositioning north</h1>
          <p className="text-[17px] font-medium text-basalt/80 mt-1.5">Øravík → Tórshavn → Sørvágur</p>
          <p className="text-[14px] text-basalt/60 mt-2">Last ferry crossing, Bus 300 to Sørvágur, Guesthouse Hugo ten minutes from the terminal.</p>
        </div>
        <section className="mb-6"><MobileDecisionPanel /></section>
        <section className="mb-8"><MobileTripStatus /></section>
        <section className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-3">Journey north</p>
          <div className="space-y-2.5">
            {DAY_FOUR_TIMELINE.map((step) => (
              <div key={step.num} className="flex gap-3">
                <div className="w-[34px] h-[34px] rounded-full bg-navy flex items-center justify-center shrink-0 mt-0.5"><span className="text-[13px] font-medium text-wool">{step.num}</span></div>
                <div className="flex-1 min-w-0 border border-basalt/15 rounded-[7px] p-3">
                  <p className="font-medium text-[15px] text-basalt">{step.title}</p>
                  <p className="text-[12px] text-basalt/55">{step.subtitle}</p>
                  <div className="flex items-baseline gap-3 mt-2">
                    <p className="text-[11px] text-basalt/45">{step.rightLabel}:</p>
                    <p className="code tnum text-[15px] font-medium text-basalt">{step.rightValue}</p>
                    {"middleLabel2" in step && <><span className="text-basalt/30">·</span><p className="code tnum text-[14px] text-fjord">{step.middleValue}–{step.middleValue2}</p></>}
                    {!("middleLabel2" in step) && <><span className="text-basalt/30">·</span><p className="text-[12px] text-fjord/70">{step.middleLabel}: {step.middleValue}</p></>}
                  </div>
                  {"footer" in step && <p className="text-[11px] text-basalt/50 mt-2 pt-2 border-t border-basalt/5">{step.footer}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-2">SUÐUROY → VÁGAR</p>
          <div style={{ minHeight: 420 }}><FaroesMap onSelect={() => {}} selected={null} filter="journey" mapRef={mapRef} /></div>
        </section>
      </article>
    </>
  );
}
