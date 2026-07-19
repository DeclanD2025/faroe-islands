// =============================================================================
// DayFiveDetail — "Homeward" full operational page.
// Bus to Vágar, RC 416 to Gatwick, National Express to Stansted,
// RK 330 to Glasgow, home to Bellshill. Day 1-level detail.
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
// Timeline — 12 steps from Hugo wake-up to front door at Liberty Road
// =============================================================================

const TIMELINE_STEPS = [
  {
    num: 1,
    title: "Wake up · Guesthouse Hugo",
    subtitle: "2 Bakkavegur, 380 Sørvágur",
    middleLabel: "Alarm",
    middleValue: "06:30",
    rightLabel: "Check",
    rightValue: "yr.no",
    footer: "Final morning in the Faroes. Pack everything — double-check drawers and chargers. Check the Vágar visibility on yr.no. If fog is forecast, don't panic — Atlantic Airways is used to it, but the coach transfer at Gatwick might need rebooking.",
  },
  {
    num: 2,
    title: "Walk to Sørvágur bus stop",
    subtitle: "Village centre · 2 min from Hugo",
    middleLabel: "Walk",
    middleValue: "~2 min",
    rightLabel: "Leave by",
    rightValue: "07:35",
    footer: "Bus 300 stops at the village centre, not the airport. The airport is one stop further on. Allow 5 min slack in case the Vágatunnilin has morning traffic.",
  },
  {
    num: 3,
    title: "Bus 300 · Sørvágur → Vágar Airport",
    subtitle: "Via Vágatunnilin · 1 stop",
    middleLabel: "Departs",
    middleValue: "07:40",
    rightLabel: "Arrive",
    rightValue: "07:50",
    footer: "DKK 20 pp or SSL Travel Card. 10 min hop. The bus drops at the terminal entrance — walk straight in. This is the same Bus 300 you've been riding all week.",
  },
  {
    num: 4,
    title: "Vágar Airport · check-in",
    subtitle: "Single terminal · Atlantic Airways desks",
    middleLabel: "Desks open",
    middleValue: "07:10",
    middleLabel2: "Gate closes",
    middleValue2: "08:50",
    rightLabel: "Boarding",
    rightValue: "08:40",
    footer: "One café airside (coffee, pastries, sandwiches). Duty-free for Faroese wool and beer. No lounge. Security is quick — single scanner, rarely a queue. Check-in online before you leave Hugo.",
  },
  {
    num: 5,
    title: "Atlantic Airways RC 416",
    subtitle: "Vágar → London Gatwick · Airbus A320neo",
    middleLabel: "Departs",
    middleValue: "09:10 WEST",
    middleLabel2: "Lands",
    middleValue2: "11:25 BST",
    rightLabel: "Flight",
    rightValue: "2h 15m",
    footer: "Same aircraft type as the outbound. Seat 2+2 layout on the A320neo — window seats give you Mykines on climb-out and the Forth bridges on descent. The Faroes disappear into cloud within 5 minutes. One last coffee at 30,000 ft before the UK re-entry.",
    footerLink: { label: "Live flight status →", href: "https://www.flightradar24.com/data/flights/rc416" },
  },
  {
    num: 6,
    title: "Gatwick · North Terminal arrivals",
    subtitle: "UK border · baggage reclaim",
    middleLabel: "Land",
    middleValue: "11:25",
    rightLabel: "Clear",
    rightValue: "~30 min",
    footer: "UK passport e-gates usually fast. Collect bags if checked. Follow signs to the inter-terminal shuttle — free monorail to South Terminal, runs every 3 min, 2 min journey. The coach station is at South Terminal lower level.",
  },
  {
    num: 7,
    title: "Gatwick South · coach station",
    subtitle: "National Express · lower level",
    middleLabel: "Arrive",
    middleValue: "~12:00",
    rightLabel: "Coach",
    rightValue: "Booked?",
    footer: "If you've got 2+ hours before the coach: M&S Food, Pret, and Costa in the South Terminal. The coach station waiting area has seating and a departures board. Book at nationalexpress.com — the 13:00 is the sweet spot.",
  },
  {
    num: 8,
    title: "National Express · LGW → STN",
    subtitle: "Gatwick South → Stansted Airport · via M25/M11",
    middleLabel: "Departs",
    middleValue: "13:00",
    middleLabel2: "Arrives",
    middleValue2: "15:15",
    rightLabel: "Coach",
    rightValue: "~2h 15m",
    footer: "Self-transfer done on purpose. Coach has Wi-Fi, USB charging, toilet onboard. The M25 can be slow on a Saturday afternoon — if Google Maps shows heavy traffic, the next coach is at 14:00. You've got 4h+ margin before the Stansted flight.",
    footerLink: { label: "Book National Express →", href: "https://www.nationalexpress.com" },
  },
  {
    num: 9,
    title: "Stansted Airport",
    subtitle: "Ryanair check-in · RK 330 to Glasgow",
    middleLabel: "Arrive",
    middleValue: "~15:15",
    rightLabel: "Gate",
    rightValue: "TBC",
    footer: "Food court before security: Leon, Pret, Burger King. Wetherspoons airside (The Windmill) — fish & chips and a pint before the last flight. Ryanair check-in closes 40 min before departure. Gate announced ~40 min before.",
  },
  {
    num: 10,
    title: "Ryanair RK 330",
    subtitle: "Stansted → Glasgow · Boeing 737-800",
    middleLabel: "Departs",
    middleValue: "19:35",
    middleLabel2: "Lands",
    middleValue2: "21:10",
    rightLabel: "Flight",
    rightValue: "1h 35m",
    footer: "Last leg. Glasgow's lights on approach. 737 — window seat left side for the best view of the Clyde coming in. The journey ends where it started.",
    footerLink: { label: "Live flight status →", href: "https://www.flightradar24.com/data/flights/rk330" },
  },
  {
    num: 11,
    title: "Glasgow Airport · arrivals",
    subtitle: "Domestic arrivals · baggage reclaim",
    middleLabel: "Land",
    middleValue: "21:10",
    rightLabel: "Transfer",
    rightValue: "~35 min",
    footer: "Quick exit — domestic, no passport control. Options to Bellshill: taxi ~£35 (35 min, rank outside domestic arrivals), or Bus 500 to Glasgow city centre then ScotRail Glasgow Central → Bellshill (~20 min train, runs until ~23:30).",
  },
  {
    num: 12,
    title: "40 Liberty Road, Bellshill",
    subtitle: "ML4 2EX · home",
    middleLabel: "Arrive",
    middleValue: "~22:00",
    rightLabel: "Trip",
    rightValue: "Complete",
    footer: "Key under the mat. Kettle on. The Faroes are a 1h 25m flight away — you could be back in Tórshavn by lunchtime tomorrow. Don't rule it out.",
  },
];

// =============================================================================
// Coach alternatives — recommended, backup, later
// =============================================================================

const COACH_OPTIONS = {
  recommended: {
    dep: "13:00", arr: "15:15", duration: "2h 15m",
    note: "Best balance. Leaves 1h 35m after RC 416 lands — time to clear border, shuttle to South Terminal, grab food. Arrives Stansted with ~4h before RK 330.",
  },
  backup: {
    dep: "14:00", arr: "16:15", duration: "2h 15m",
    note: "Still leaves 3h 15m before the Glasgow flight. Tight but manageable if Gatwick is slow.",
  },
  later: [
    { dep: "15:00", arr: "17:15", duration: "2h 15m", note: "Arrives ~2h before RK 330 — the last safe option." },
    { dep: "16:00", arr: "18:15", duration: "2h 15m", note: "Arrives ~1h 20m before RK 330. Viable only if checked in online. No margin for M11 delays." },
  ],
};

// =============================================================================
// GLA → Bellshill transport options
// =============================================================================

const HOME_OPTIONS = [
  { method: "Taxi", time: "~35 min", cost: "~£35", note: "Rank outside domestic arrivals. Fastest door-to-door." },
  { method: "Bus 500 + train", time: "~1h 10m", cost: "~£10", note: "Bus 500 to Glasgow city centre (15 min), then ScotRail Glasgow Central → Bellshill (20 min)." },
  { method: "Pick-up", time: "~35 min", cost: "Free", note: "If someone's collecting you — the pickup point is the short-stay car park." },
];

// =============================================================================
// Summary strip — 5 key waypoints
// =============================================================================

const SUMMARY_ITEMS = [
  { icon: "⏻", label: "Bus to FAE", time: "07:40", note: "Hugo" },
  { icon: "✈", label: "Flight 1", time: "RC 416", note: "FAE → LGW" },
  { icon: "⏻", label: "Coach", time: "13:00", note: "LGW → STN" },
  { icon: "✈", label: "Flight 2", time: "RK 330", note: "STN → GLA" },
  { icon: "⌂", label: "Home", time: "~22:00", note: "Bellshill" },
];

// =============================================================================
// Weather widget
// =============================================================================

interface WeatherData {
  temp: number | null; wind: number | null; desc: string; loading: boolean; error: boolean;
}

function formatSymbol(code: string): string {
  const m: Record<string, string> = {
    clearsky_day: "Clear sky", clearsky_night: "Clear sky", fair_day: "Fair", fair_night: "Fair",
    partlycloudy_day: "Partly cloudy", partlycloudy_night: "Partly cloudy", cloudy: "Cloudy",
    rainshowers_day: "Rain showers", rainshowers_night: "Rain showers",
    heavyrainshowers_day: "Heavy rain showers", rain: "Rain", lightrain: "Light rain",
    heavyrain: "Heavy rain", fog: "Fog", snow: "Snow", lightsnow: "Light snow",
    heavysnow: "Heavy snow", snowshowers_day: "Snow showers", sleet: "Sleet",
    rainshowersandthunder_day: "Rain & thunder",
    heavyrainshowersandthunder_day: "Heavy rain & thunder",
  };
  return m[code] ?? code.replace(/_/g, " ");
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
      <p className="text-[11px] text-basalt/50 mt-2">Saturday 1 August 2026</p>
      <p className="text-[11px] text-basalt/50">RC 416 FAE→LGW 09:10 · RK 330 STN→GLA 19:35</p>
      <hr className="my-4 border-basalt/10" />
      <div className="grid grid-cols-2 gap-4"><FaroeClock /><WeatherBlock /></div>
      <p className="text-[10px] text-basalt/35 mt-3">Updated 19 Jul, 10:30 · yr.no</p>
    </div>
  );
}

// =============================================================================
// Summary strip
// =============================================================================

function JourneySummaryStrip() {
  return (
    <div className="grid grid-cols-5 border border-basalt/15 rounded-[8px] divide-x divide-basalt/10" style={{ minHeight: 96 }}>
      {SUMMARY_ITEMS.map((item, i) => (
        <div key={i} className="flex flex-col justify-center px-3 py-3">
          <p className="text-[11px] text-basalt/55 mb-1">{item.icon} {item.label}</p>
          <p className="code tnum text-[18px] font-medium text-basalt leading-none">{item.time}</p>
          <p className="text-[11px] text-basalt/45 mt-1">{item.note}</p>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Timeline
// =============================================================================

function JourneyTimeline() {
  return (
    <div className="relative">
      <div className="absolute left-[17px] top-8 bottom-8 w-px border-l border-dashed border-fjord/25" aria-hidden />
      <div className="space-y-2.5">
        {TIMELINE_STEPS.map((step) => (
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
              {"footer" in step && (
                <div className="flex items-start justify-between mt-1.5 px-1 gap-4">
                  <p className="text-[11px] text-basalt/50">{step.footer}</p>
                  {"footerLink" in step && step.footerLink && (
                    <a href={step.footerLink.href} target="_blank" rel="noopener noreferrer"
                      className="text-[11px] text-fjord/70 underline underline-offset-2 decoration-fjord/30 hover:text-rust transition-colors shrink-0 mt-0.5">
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
// Coach alternatives section (same pattern as Day 1 train section)
// =============================================================================

function CoachAlternatives() {
  const [showLater, setShowLater] = useState(false);
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <div>
          <p className="font-medium text-[17px] text-basalt">LGW → STN National Express departures</p>
          <p className="text-[13px] text-basalt/55 mt-0.5">Saturday 1 August 2026</p>
        </div>
        <p className="text-[11px] text-basalt/50">
          All times planned timetable ·{" "}
          <a href="https://www.nationalexpress.com" target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2 decoration-basalt/30 hover:text-rust transition-colors">
            Book at nationalexpress.com →
          </a>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 border border-basalt/15 rounded-[8px] divide-y md:divide-y-0 md:divide-x divide-basalt/10">
        {/* Recommended */}
        <div className="p-4 border-l-[3px] border-moss/40">
          <p className="text-[10px] uppercase tracking-[0.12em] text-moss/80 mb-2 flex items-center gap-1.5"><span>✓</span> RECOMMENDED</p>
          <p className="code tnum text-[18px] font-medium text-basalt">{COACH_OPTIONS.recommended.dep} → {COACH_OPTIONS.recommended.arr}</p>
          <p className="text-[12px] text-basalt/55 mt-1">{COACH_OPTIONS.recommended.duration}</p>
          <p className="text-[12px] text-basalt/60 mt-2 leading-[1.4]">{COACH_OPTIONS.recommended.note}</p>
        </div>
        {/* Backup */}
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60 mb-2">BACKUP OPTION</p>
          <p className="code tnum text-[18px] font-medium text-basalt">{COACH_OPTIONS.backup.dep} → {COACH_OPTIONS.backup.arr}</p>
          <p className="text-[12px] text-basalt/55 mt-1">{COACH_OPTIONS.backup.duration}</p>
          <p className="text-[12px] text-basalt/60 mt-2 leading-[1.4]">{COACH_OPTIONS.backup.note}</p>
        </div>
        {/* Later */}
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60 mb-2">LATER ALTERNATIVES</p>
          <div className="space-y-2">
            {COACH_OPTIONS.later.slice(0, 1).map((t, i) => (
              <div key={i}>
                <p className="code tnum text-[14px] text-basalt">{t.dep} → {t.arr}</p>
                <p className="text-[11px] text-basalt/50 mt-0.5">{t.note}</p>
              </div>
            ))}
            {showLater && (
              <div className="space-y-2">
                {COACH_OPTIONS.later.slice(1).map((t, i) => (
                  <div key={i}>
                    <p className="code tnum text-[14px] text-basalt">{t.dep} → {t.arr}</p>
                    <p className="text-[11px] text-basalt/50 mt-0.5">{t.note}</p>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={() => setShowLater(!showLater)}
              className="text-[12px] text-fjord/70 underline underline-offset-2 decoration-fjord/30 hover:text-rust transition-colors mt-2">
              {showLater ? "Show fewer" : `+ ${COACH_OPTIONS.later.length - 1} more service`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Mobile Coach Options
// =============================================================================

function MobileCoachOptions() {
  const [showLater, setShowLater] = useState(false);
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <div>
          <p className="font-medium text-[16px] text-basalt">Coach departures</p>
          <p className="text-[12px] text-basalt/55">Sat 1 Aug · LGW → STN</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="border border-moss/30 rounded-[8px] p-4 border-l-[3px] border-l-moss/40">
          <p className="text-[10px] uppercase tracking-[0.12em] text-moss/80 flex items-center gap-1.5 mb-1.5"><span>✓</span> RECOMMENDED</p>
          <p className="code tnum text-[18px] font-medium text-basalt">13:00 → 15:15</p>
          <p className="text-[12px] text-basalt/55 mt-0.5">2h 15m</p>
          <p className="text-[12px] text-basalt/60 mt-1.5">{COACH_OPTIONS.recommended.note}</p>
        </div>
        <div className="border border-basalt/15 rounded-[8px] p-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60 mb-1.5">BACKUP OPTION</p>
          <p className="code tnum text-[16px] font-medium text-basalt">14:00 → 16:15</p>
          <p className="text-[12px] text-basalt/55 mt-0.5">2h 15m</p>
          <p className="text-[12px] text-basalt/60 mt-1.5">{COACH_OPTIONS.backup.note}</p>
        </div>
        <div className="border border-basalt/15 rounded-[8px] p-4">
          <button type="button" onClick={() => setShowLater(!showLater)}
            className="text-[13px] font-medium text-fjord w-full text-left flex items-center justify-between min-h-[44px]"
            aria-expanded={showLater}>
            {showLater ? "Hide later services" : `View ${COACH_OPTIONS.later.length} later services`}
            <span className="text-[11px] text-fjord/60">{showLater ? "▲" : "▼"}</span>
          </button>
          {showLater && (
            <div className="space-y-2 pt-2 border-t border-basalt/10 mt-2">
              {COACH_OPTIONS.later.map((t, i) => (
                <div key={i} className="py-1.5">
                  <p className="code tnum text-[14px] font-medium text-basalt">{t.dep} → {t.arr}</p>
                  <p className="text-[11px] text-basalt/50 mt-0.5">{t.note}</p>
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
// Mobile components
// =============================================================================

function MobileDecisionPanel() {
  return (
    <div className="border border-basalt/15 rounded-[8px] p-4">
      <p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60">First move</p>
      <p className="code tnum text-[36px] font-medium text-basalt leading-none mt-1">Bus 07:40</p>
      <p className="text-[13px] text-basalt/65 mt-2">
        Walk to Sørvágur bus stop. <strong>Bus 300 at 07:40</strong> to Vágar Airport.
        RC 416 to Gatwick, National Express to Stansted, <strong>RK 330 to Glasgow</strong> at 19:35.
      </p>
      <div className="flex gap-6 mt-3 pt-3 border-t border-basalt/10">
        <div><p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">Depart FAE</p><p className="code tnum text-[15px] font-medium text-basalt">09:10</p></div>
        <div><p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">Home</p><p className="code tnum text-[15px] font-medium text-basalt">~22:00</p></div>
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
      <p className="text-[12px] text-basalt/55 mt-1">Saturday 1 August 2026</p>
      <p className="text-[12px] text-basalt/55">Homeward · 2 flights · 1 coach</p>
      <hr className="my-3.5 border-basalt/10" />
      <div className="grid grid-cols-2 gap-4"><FaroeClock /><WeatherBlock /></div>
    </div>
  );
}

// =============================================================================
// Main export
// =============================================================================

export function DayFiveDetail() {
  const mapRef = useRef<maplibregl.Map | null>(null);

  return (
    <>
      {/* ================================================================
          DESKTOP LAYOUT
          ================================================================ */}
      <article className="hidden lg:grid grid-cols-[1fr_340px] gap-8 px-8 pt-8 pb-20 max-w-[1280px]">
        {/* MAIN COLUMN */}
        <div className="min-w-0">
          <div className="mb-8">
            <p className="text-[12px] tracking-[0.14em] uppercase text-rust font-medium">Day 5 · Saturday · 1 August 2026</p>
            <h1 className="text-[clamp(2.5rem,3.5vw,3.2rem)] leading-[1.04] mt-1.5 text-basalt tracking-[-0.01em]" style={{ fontFamily: "var(--font-cinzel)" }}>Homeward</h1>
            <p className="text-[20px] font-medium text-basalt/80 mt-2">Sørvágur → Gatwick → Stansted → Glasgow → Bellshill</p>
            <p className="text-[14px] text-basalt/60 mt-2 max-w-[38rem]">
              A short hop over the North Sea, the awkwardness of a self-transfer done on purpose, then Glasgow's lights coming up the horizon. ~15 hours door to door in reverse.
            </p>
          </div>

          <section className="mb-8"><JourneySummaryStrip /></section>

          <section className="mb-10">
            <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-4">Homeward timeline</p>
            <JourneyTimeline />
          </section>

          <section className="mb-10">
            <CoachAlternatives />
          </section>

          {/* GLA → Bellshill */}
          <section className="mb-10 max-w-[48rem]">
            <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-3">Glasgow Airport → Bellshill</p>
            <div className="border border-basalt/15 rounded-[8px] divide-y divide-basalt/8">
              {HOME_OPTIONS.map((opt, i) => (
                <div key={i} className="flex items-center gap-4 p-3.5">
                  <p className="text-[13px] font-medium text-basalt w-28 shrink-0">{opt.method}</p>
                  <p className="code tnum text-[14px] text-fjord w-20 shrink-0">{opt.time}</p>
                  <p className="text-[12px] text-basalt/55 w-16 shrink-0">{opt.cost}</p>
                  <p className="text-[12px] text-basalt/50">{opt.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="max-w-[48rem]">
            <div className="harbour-notice">
              <p className="text-[10px] uppercase tracking-[0.14em] text-rust font-medium mb-1">Could disrupt the day</p>
              <p className="text-[14px]">
                Faroese fog swallows the morning flight more often than you'd like. If RC 416 is delayed, the National Express coach is rebookable — don't panic, just move to the next one. The 15:00 coach is the last safe option for making RK 330. If both fail, Ryanair allows check-in changes up to 2h before departure for a fee.
              </p>
            </div>
          </section>
        </div>

        {/* SECONDARY COLUMN */}
        <aside className="min-w-0">
          <div className="space-y-8">
            <TripStatusPanel />
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-2">FAROES → SCOTLAND</p>
              <div style={{ minHeight: 500 }}><FaroesMap onSelect={() => {}} selected={null} filter="journey" mapRef={mapRef} /></div>
            </div>
          </div>
        </aside>
      </article>

      {/* ================================================================
          MOBILE LAYOUT
          ================================================================ */}
      <article className="lg:hidden px-4 pt-6 pb-24 max-w-[640px] mx-auto">
        <div className="mb-6">
          <p className="text-[11px] tracking-[0.14em] uppercase text-rust font-medium">Day 5 · Saturday · 1 August</p>
          <h1 className="text-[clamp(2rem,8vw,2.6rem)] leading-[1.06] mt-1 text-basalt tracking-[-0.01em]" style={{ fontFamily: "var(--font-cinzel)" }}>Homeward</h1>
          <p className="text-[17px] font-medium text-basalt/80 mt-1.5">Sørvágur → Gatwick → Stansted → Glasgow</p>
          <p className="text-[14px] text-basalt/60 mt-2">Two flights, one coach, and Glasgow's lights at the end — ~15 hours door to door.</p>
        </div>
        <section className="mb-6"><MobileDecisionPanel /></section>
        <section className="mb-8"><MobileTripStatus /></section>
        <section className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-3">Homeward timeline</p>
          <div className="space-y-2.5">
            {TIMELINE_STEPS.map((step) => (
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
                  {"footer" in step && (
                    <div className="mt-2 pt-2 border-t border-basalt/5">
                      <p className="text-[11px] text-basalt/50">{step.footer}</p>
                      {"footerLink" in step && step.footerLink && (
                        <a href={step.footerLink.href} target="_blank" rel="noopener noreferrer"
                          className="inline-block text-[11px] text-fjord/70 underline underline-offset-2 mt-1">
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
        <section className="mb-8"><MobileCoachOptions /></section>
        <section className="mb-8">
          <div className="harbour-notice">
            <p className="text-[10px] uppercase tracking-[0.14em] text-rust font-medium mb-1">Could disrupt the day</p>
            <p className="text-[14px]">Faroese fog. If RC 416 is delayed, rebook the coach — the 15:00 is the last safe option for making RK 330.</p>
          </div>
        </section>
        <section>
          <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-2">FAROES → SCOTLAND</p>
          <div style={{ minHeight: 420 }}><FaroesMap onSelect={() => {}} selected={null} filter="journey" mapRef={mapRef} /></div>
        </section>
      </article>
    </>
  );
}
