// =============================================================================
// DayOneDetail — "The journey north" full operational page.
// =============================================================================

"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import type maplibregl from "maplibre-gl";
import {
  type TimelineStep,
  type SummaryItem,
  TripStatusPanel,
  MobileTripStatus,
  SummaryStrip,
  JourneyTimeline,
  MobileTimeline,
} from "@/components/day-widgets";

const FaroesMap = dynamic(() => import("@/components/map/faroes-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full border border-basalt/15 bg-fog/20 flex items-center justify-center" style={{ minHeight: 280 }}>
      <p className="caption">Loading map…</p>
    </div>
  ),
});

// =============================================================================
// Timeline data
// =============================================================================

const TIMELINE_STEPS: TimelineStep[] = [
  { num: 1, title: "Home", subtitle: "40 Liberty Road, Bellshill ML4 2EX", middleLabel: "Walk", middleValue: "~20 min", rightLabel: "Leave by", rightValue: "08:30" },
  { num: 2, title: "Bellshill Station", subtitle: "ScotRail", middleLabel: "Platform", middleValue: "1", rightLabel: "Arrive by", rightValue: "08:50" },
  { num: 3, title: "ScotRail", subtitle: "Bellshill → Haymarket", middleLabel: "Departs", middleValue: "08:59", middleLabel2: "Arrives", middleValue2: "10:02", rightLabel: "Journey", rightValue: "1h 03m", footer: "Recommended service — gives you plenty of time at the airport.", footerLink: { label: "Live times on ScotRail →", href: "https://www.scotrail.co.uk/plan-your-journey" } },
  { num: 4, title: "Haymarket Station", subtitle: "Exit towards the tram stop directly outside.", middleLabel: "Transfer", middleValue: "~2 min", rightLabel: "Depart by", rightValue: "10:05" },
  { num: 5, title: "Edinburgh Tram", subtitle: "Haymarket → Edinburgh Airport", middleLabel: "Every", middleValue: "7–8 min", middleLabel2: "Arrives", middleValue2: "~10:35", rightLabel: "Journey", rightValue: "~30 min", footer: "Tap-on, tap-off contactless or ticket machine." },
  { num: 6, title: "Edinburgh Airport", subtitle: "Domestic Departures · gates 7–10", middleLabel: "Arrive by", middleValue: "~10:40", rightLabel: "Contingency", rightValue: "~6h 30m", footer: "All Bar One, Wetherspoons, Pret — plenty of options airside. Flight boards near the international gates." },
  { num: 7, title: "Atlantic Airways RC 415", subtitle: "Edinburgh → Vágar · Airbus A320neo", middleLabel: "Departs", middleValue: "17:10 BST", middleLabel2: "Lands", middleValue2: "18:35 WEST", rightLabel: "Flight", rightValue: "1h 25m", footer: "Forth bridges 3 min after takeoff. Cairngorms to the right. North Sea crossing. RNP approach between fjord walls into Sørvágur." },
  { num: 8, title: "Vágar Airport", subtitle: "Sørvágur, Vágar island · single terminal", middleLabel: "Arrive", middleValue: "18:35", rightLabel: "Onward", rightValue: "Bus 300", footer: "Walk across tarmac. Passport stamp on request. Arrivals duty-free open. No SIM vendor — buy eSIM before departure. Bus stop 50 m from the terminal exit." },
  { num: 9, title: "Bus 300", subtitle: "Vágar Airport → Tórshavn · via Vágatunnilin", middleLabel: "Departs", middleValue: "~19:00", middleLabel2: "Arrives", middleValue2: "~19:45", rightLabel: "Journey", rightValue: "~45 min", footer: "Meets RC 415. DKK 90 pp or 7-day SSL Travel Card. Bus terminates at Tórshavn bus station. Walk or taxi to the ferry terminal — Farstøðin is at the harbour." },
  { num: 10, title: "Tórshavn", subtitle: "Bus station → Farstøðin ferry terminal · ~10 min walk", middleLabel: "Arrive", middleValue: "~19:45", rightLabel: "Ferry", rightValue: "21:15", footer: "1h 30m before the Smyril sails. Grab food near the harbour — the ferry café also serves hot food, beer, and coffee onboard." },
  { num: 11, title: "M/F Smyril · Route 7", subtitle: "Tórshavn → Krambatangi · Suðuroy", middleLabel: "Departs", middleValue: "21:15", middleLabel2: "Arrives", middleValue2: "23:20", rightLabel: "Crossing", rightValue: "2h 05m", footer: "Last sailing of the day. Book at ssl.fo before travel. Gate closes 5 min before departure. Café, indoor seating, outdoor deck, free Wi-Fi onboard. Dark, exposed pier at Krambatangi — bring a layer.", footerLink: { label: "Book at ssl.fo →", href: "https://booking.ssl.fo" } },
  { num: 12, title: "Øravík AirBnB", subtitle: "Við á 7, Øravík 827 · 2 km from Krambatangi", middleLabel: "Arrive", middleValue: "~23:30", rightLabel: "Transfer", rightValue: "Bus 700", footer: "Bus 700 two stops from Krambatangi (Ferjuleðan) · ~8 min · DKK 20. Or pre-book taxi +298 239550 (~DKK 150). Self check-in — lockbox code saved offline. Still twilight at midnight — eye mask essential." },
];

const TRAIN_OPTIONS = {
  recommended: { dep: "08:59", arr: "10:02", duration: "1h 03m", type: "Direct", note: "Best balance of time and contingency. Arrive at airport approximately 6h 30m before flight." },
  backup: { dep: "09:59", arr: "11:02", duration: "1h 03m", type: "Direct", note: "Still provides substantial airport contingency." },
  later: [
    { dep: "10:59", arr: "12:02", duration: "1h 03m" },
    { dep: "11:59", arr: "13:02", duration: "1h 03m" },
    { dep: "12:59", arr: "14:02", duration: "1h 03m" },
    { dep: "13:59", arr: "15:02", duration: "1h 03m" },
  ],
};

const SUMMARY_ITEMS: SummaryItem[] = [
  { icon: "⌂", label: "Leave home", time: "08:30", note: "Bellshill" },
  { icon: "✈", label: "Flight", time: "EDI 17:10", note: "RC 415" },
  { icon: "⌂", label: "Land", time: "FAE 18:35", note: "Vágar" },
  { icon: "⏻", label: "Ferry", time: "21:15", note: "M/F Smyril" },
  { icon: "⌂", label: "Arrive", time: "~23:30", note: "Øravík" },
];

// =============================================================================
// Train Departures (Day 1 specific)
// =============================================================================

function TrainDepartures() {
  const [showLater, setShowLater] = useState(false);
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <div>
          <p className="font-medium text-[17px] text-basalt">Bellshill → Haymarket departures</p>
          <p className="text-[13px] text-basalt/55 mt-0.5">Monday 27 July 2026</p>
        </div>
        <p className="text-[11px] text-basalt/50">
          All times planned timetable ·{" "}
          <a href="https://www.scotrail.co.uk/plan-your-journey" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 decoration-basalt/30 hover:text-rust transition-colors">Check live times on ScotRail →</a>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 border border-basalt/15 rounded-[8px] divide-y md:divide-y-0 md:divide-x divide-basalt/10">
        <div className="p-4 border-l-[3px] border-moss/40">
          <p className="text-[10px] uppercase tracking-[0.12em] text-moss/80 mb-2 flex items-center gap-1.5"><span>✓</span> RECOMMENDED</p>
          <p className="code tnum text-[18px] font-medium text-basalt">{TRAIN_OPTIONS.recommended.dep} → {TRAIN_OPTIONS.recommended.arr}</p>
          <p className="text-[12px] text-basalt/55 mt-1">{TRAIN_OPTIONS.recommended.duration} · {TRAIN_OPTIONS.recommended.type}</p>
          <p className="text-[12px] text-basalt/60 mt-2 leading-[1.4]">{TRAIN_OPTIONS.recommended.note}</p>
        </div>
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60 mb-2">BACKUP OPTION</p>
          <p className="code tnum text-[18px] font-medium text-basalt">{TRAIN_OPTIONS.backup.dep} → {TRAIN_OPTIONS.backup.arr}</p>
          <p className="text-[12px] text-basalt/55 mt-1">{TRAIN_OPTIONS.backup.duration} · {TRAIN_OPTIONS.backup.type}</p>
          <p className="text-[12px] text-basalt/60 mt-2 leading-[1.4]">{TRAIN_OPTIONS.backup.note}</p>
        </div>
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60 mb-2">LATER ALTERNATIVES</p>
          <div className="space-y-2">
            {TRAIN_OPTIONS.later.slice(0, 2).map((t, i) => (<p key={i} className="code tnum text-[14px] text-basalt">{t.dep} → {t.arr}</p>))}
            {showLater && <div className="space-y-2">{TRAIN_OPTIONS.later.slice(2).map((t, i) => (<p key={i} className="code tnum text-[14px] text-basalt">{t.dep} → {t.arr}</p>))}</div>}
            <button type="button" onClick={() => setShowLater(!showLater)} className="text-[12px] text-fjord/70 underline underline-offset-2 decoration-fjord/30 hover:text-rust transition-colors mt-2">{showLater ? "Show fewer" : `+ ${TRAIN_OPTIONS.later.length - 2} more services`}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileTrainOptions() {
  const [showLater, setShowLater] = useState(false);
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3"><div><p className="font-medium text-[16px] text-basalt">Train departures</p><p className="text-[12px] text-basalt/55">Mon 27 Jul · Bellshill → Haymarket</p></div></div>
      <div className="space-y-3">
        <div className="border border-moss/30 rounded-[8px] p-4 border-l-[3px] border-l-moss/40"><p className="text-[10px] uppercase tracking-[0.12em] text-moss/80 flex items-center gap-1.5 mb-1.5"><span>✓</span> RECOMMENDED</p><p className="code tnum text-[18px] font-medium text-basalt">08:59 → 10:02</p><p className="text-[12px] text-basalt/55 mt-0.5">1h 03m · Direct</p><p className="text-[12px] text-basalt/60 mt-1.5">{TRAIN_OPTIONS.recommended.note}</p></div>
        <div className="border border-basalt/15 rounded-[8px] p-4"><p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60 mb-1.5">BACKUP OPTION</p><p className="code tnum text-[16px] font-medium text-basalt">09:59 → 11:02</p><p className="text-[12px] text-basalt/55 mt-0.5">1h 03m · Direct</p><p className="text-[12px] text-basalt/60 mt-1.5">{TRAIN_OPTIONS.backup.note}</p></div>
        <div className="border border-basalt/15 rounded-[8px] p-4">
          <button type="button" onClick={() => setShowLater(!showLater)} className="text-[13px] font-medium text-fjord w-full text-left flex items-center justify-between min-h-[44px]" aria-expanded={showLater}>{showLater ? "Hide later services" : `View ${TRAIN_OPTIONS.later.length} later services`}<span className="text-[11px] text-fjord/60">{showLater ? "▲" : "▼"}</span></button>
          {showLater && <div className="space-y-2 pt-2 border-t border-basalt/10 mt-2">{TRAIN_OPTIONS.later.map((t, i) => (<div key={i} className="flex items-center gap-4 py-1.5"><p className="code tnum text-[14px] font-medium text-basalt">{t.dep}</p><p className="text-[12px] text-basalt/40">→</p><p className="code tnum text-[14px] text-basalt">{t.arr}</p><p className="text-[12px] text-basalt/50">{t.duration}</p></div>))}</div>}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Mobile Decision Panel (Day 1 specific)
// =============================================================================

function MobileDecisionPanel() {
  return (
    <div className="border border-basalt/15 rounded-[8px] p-4">
      <p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60">Leave home by</p>
      <p className="code tnum text-[36px] font-medium text-basalt leading-none mt-1">08:30</p>
      <p className="text-[13px] text-basalt/65 mt-2">Take the <strong>08:59</strong> from Bellshill. Flight <strong>EDI 17:10</strong>. Ferry <strong>21:15</strong> from Tórshavn. Arrive Øravík <strong>~23:30</strong>.</p>
      <div className="flex gap-6 mt-3 pt-3 border-t border-basalt/10"><div><p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">Flight</p><p className="code tnum text-[15px] font-medium text-basalt">17:10</p></div><div><p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">Arrive</p><p className="code tnum text-[15px] font-medium text-basalt">~23:30</p></div></div>
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
      {/* DESKTOP */}
      <article className="hidden lg:grid grid-cols-[1fr_340px] gap-8 px-8 pt-8 pb-20 max-w-[1280px]">
        <div className="min-w-0">
          <div className="mb-8">
            <p className="text-[12px] tracking-[0.14em] uppercase text-rust font-medium">Day 1</p>
            <h1 className="text-[clamp(2.5rem,3.5vw,3.2rem)] leading-[1.04] mt-1.5 text-basalt tracking-[-0.01em]" style={{ fontFamily: "var(--font-cinzel)" }}>The journey north</h1>
            <p className="text-[20px] font-medium text-basalt/80 mt-2">Bellshill → Edinburgh → Vágar → Øravík</p>
            <p className="text-[14px] text-basalt/60 mt-2 max-w-[38rem]">One flight, one bus, one ferry, one short hop. ~15 hours door to door across Scotland and the North Atlantic.</p>
          </div>
          <section className="mb-8"><SummaryStrip items={SUMMARY_ITEMS} /></section>
          <section className="mb-10"><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-4">Journey timeline</p><JourneyTimeline steps={TIMELINE_STEPS} /></section>
          <section><TrainDepartures /></section>
        </div>
        <aside className="min-w-0">
          <div className="space-y-8">
            <TripStatusPanel dateLine1="Monday 27 July 2026" dateLine2="Flight at 17:10 from Edinburgh Airport" weatherLat={62.0097} weatherLon={-6.7716} weatherLabel="Tórshavn" />
            <div><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-2">SCOTLAND → FØROYAR</p><div style={{ minHeight: 500 }}><FaroesMap onSelect={() => {}} selected={null} filter="journey" mapRef={mapRef} /></div></div>
          </div>
        </aside>
      </article>

      {/* MOBILE */}
      <article className="lg:hidden px-4 pt-6 pb-24 max-w-[640px] mx-auto">
        <div className="mb-6"><p className="text-[11px] tracking-[0.14em] uppercase text-rust font-medium">Day 1</p><h1 className="text-[clamp(2rem,8vw,2.6rem)] leading-[1.06] mt-1 text-basalt tracking-[-0.01em]" style={{ fontFamily: "var(--font-cinzel)" }}>The journey north</h1><p className="text-[17px] font-medium text-basalt/80 mt-1.5">Bellshill → Edinburgh → Vágar → Øravík</p><p className="text-[14px] text-basalt/60 mt-2">One flight, one bus, one ferry, one short hop. ~15 hours door to door.</p></div>
        <section className="mb-6"><MobileDecisionPanel /></section>
        <section className="mb-8"><MobileTripStatus dateLine1="Monday 27 July 2026" dateLine2="Flight at 17:10 from Edinburgh Airport" weatherLat={62.0097} weatherLon={-6.7716} weatherLabel="Tórshavn" /></section>
        <section className="mb-8"><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-3">Journey</p><MobileTimeline steps={TIMELINE_STEPS} /></section>
        <section className="mb-8"><MobileTrainOptions /></section>
        <section><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-2">SCOTLAND → FØROYAR</p><div style={{ minHeight: 420 }}><FaroesMap onSelect={() => {}} selected={null} filter="journey" mapRef={mapRef} /></div></section>
      </article>
    </>
  );
}
