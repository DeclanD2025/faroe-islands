// =============================================================================
// DayFourDetail — "Matchday" page.
// =============================================================================

"use client";

import { useRef } from "react";
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

const DAY_FOUR_TIMELINE: TimelineStep[] = [
  { num: 1, title: "Bus 700 → Krambatangi", subtitle: "Ferjuleðan stop · 2 stops from Øravík", middleLabel: "Depart", middleValue: "~10:45", rightLabel: "Transfer", rightValue: "~8 min", footer: "Bus 700 stops at the ferry terminal. DKK 20 pp or SSL Travel Card. No need to rush — the ferry boards foot passengers up to 5 min before sailing." },
  { num: 2, title: "M/F Smyril northbound", subtitle: "Krambatangi → Tórshavn · Route 7", middleLabel: "Departs", middleValue: "11:30", middleLabel2: "Arrives", middleValue2: "13:35", rightLabel: "Crossing", rightValue: "2h 05m", footer: "Café onboard — hot food, beer, coffee. Upper deck for the fjord views. The approach into Tórshavn harbour is worth being outside for." },
  { num: 3, title: "Tinganes & the harbour", subtitle: "Old-town peninsula · turf-roofed houses", middleLabel: "Arrive", middleValue: "13:35", rightLabel: "Free", rightValue: "~2.5 hrs", footer: "Walk the peninsula end-to-end. The Government has sat here since 1848. Gravel lanes, timber houses, the harbour one minute from where the ferry docks." },
  { num: 4, title: "OY Brewing · pre-match", subtitle: "5 min walk from Tórsvøllur", middleLabel: "Open", middleValue: "From 14:00", rightLabel: "Walk", rightValue: "5 min", footer: "Site-brewed beer, food menu, the pre-match room. Also nearby: Tórshøll (cheap Faroese pints, 15 min walk harbour-side), Mikkeller (tiny craft bar, old lanes)." },
  { num: 5, title: "Kick-off · Tórsvøllur", subtitle: "Gundadalur · HB Tórshavn v Motherwell FC", middleLabel: "KO", middleValue: "18:00", rightLabel: "Full time", rightValue: "~19:50", footer: "UEFA Conference League · Qualifying Round 1. National stadium, ~6,000 capacity. Away end on the north terrace. Late-July evening cools fast — layer up." },
  { num: 6, title: "Walk to the pier", subtitle: "Tórsvøllur → Farstøðin ferry terminal", middleLabel: "Distance", middleValue: "~1 km", rightLabel: "Walk", rightValue: "15–20 min", footer: "Through the town, downhill to the harbour. Don't linger — the 21:15 is the last boat. Gate closes 5 min before departure. There is no Plan B after this." },
  { num: 7, title: "M/F Smyril southbound", subtitle: "Tórshavn → Krambatangi · LAST SAILING", middleLabel: "Departs", middleValue: "21:15", middleLabel2: "Arrives", middleValue2: "23:20", rightLabel: "Crossing", rightValue: "2h 05m", footer: "The last boat of the day. Café open. Dark, exposed pier at Krambatangi — bring a layer. Bus 700 two stops to Øravík or pre-book taxi +298 239550." },
];

const DAY_FOUR_SUMMARY: SummaryItem[] = [
  { icon: "⏻", label: "Ferry out", time: "11:30", note: "Krambatangi" },
  { icon: "⚽", label: "Kick-off", time: "18:00", note: "Tórsvøllur" },
  { icon: "⏻", label: "Last boat", time: "21:15", note: "Critical" },
  { icon: "⌂", label: "Arrive", time: "~23:30", note: "Øravík" },
  { icon: "🍺", label: "Pre-match", time: "OY Brewing", note: "5 min walk" },
];

// =============================================================================
// Mobile
// =============================================================================

function MobileDecisionPanel() {
  return (
    <div className="border border-basalt/15 rounded-[8px] p-4">
      <p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60">Matchday plan</p>
      <p className="code tnum text-[36px] font-medium text-basalt leading-none mt-1">Ferry 11:30</p>
      <p className="text-[13px] text-basalt/65 mt-2">Northbound to <strong>Tórshavn</strong>. Tinganes, OY Brewing, then <strong>HB v Motherwell</strong> at 18:00. The <strong>21:15 is the last boat</strong> — miss it and we sleep in Tórshavn.</p>
      <div className="flex gap-6 mt-3 pt-3 border-t border-basalt/10"><div><p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">KO</p><p className="code tnum text-[15px] font-medium text-basalt">18:00</p></div><div><p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">Last boat</p><p className="code tnum text-[15px] font-medium text-rust">21:15</p></div></div>
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
            <p className="text-[12px] tracking-[0.14em] uppercase text-rust font-medium">Day 4 · Thursday · 30 July 2026</p>
            <h1 className="text-[clamp(2.5rem,3.5vw,3.2rem)] leading-[1.04] mt-1.5 text-basalt tracking-[-0.01em]" style={{ fontFamily: "var(--font-cinzel)" }}>Matchday</h1>
            <p className="text-[20px] font-medium text-basalt/80 mt-2">Øravík → Tórshavn → Tórsvøllur</p>
            <p className="text-[14px] text-basalt/60 mt-2 max-w-[38rem]">Brief up the coast, ferry across the fjord, Tinganes and a stadium that fits inside a small town. Kick-off in late-afternoon light; the last boat back is the only thing that matters afterwards.</p>
          </div>
          <section className="mb-8"><SummaryStrip items={DAY_FOUR_SUMMARY} /></section>
          <section className="mb-10"><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-4">Matchday timeline</p><JourneyTimeline steps={DAY_FOUR_TIMELINE} /></section>
          <section className="mb-10 max-w-[48rem]"><div className="border border-rust/20 bg-rust/[0.02] p-4 rounded-[6px]"><p className="text-[10px] uppercase tracking-[0.14em] text-rust font-medium mb-1">⚠ Critical</p><p className="text-[14px]">Miss the <strong>21:15</strong> and we sleep in Tórshavn. There is no Plan B after this boat. The stadium is ~1 km from the pier — leave at the final whistle, walk briskly, don't stop.</p></div></section>
          <section className="max-w-[48rem]">
            <p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-3">Pubs near the ground</p>
            <div className="space-y-2">
              {[{ name: "OY Brewing", walk: "5 min", note: "Site-brewed, food. The pre-match room." },{ name: "Tórshøll", walk: "15 min", note: "Cheap Faroese pints, harbour-side." },{ name: "Mikkeller Tórshavn", walk: "10 min", note: "Tiny craft bar, old lanes." },{ name: "Sirkus Bar", walk: "Central", note: "Last stop before the pier." },].map((pub, i) => (<div key={i} className="flex items-center gap-3 text-[13px] border-b border-basalt/5 pb-2"><span className="code tnum text-fjord w-12 shrink-0">{pub.walk}</span><span className="font-medium text-basalt">{pub.name}</span><span className="text-basalt/50">— {pub.note}</span></div>))}
            </div>
          </section>
        </div>
        <aside className="min-w-0">
          <div className="space-y-8">
            <TripStatusPanel dateLine1="Thursday 30 July 2026" dateLine2="Kick-off 18:00 · Tórsvøllur" weatherLat={62.0097} weatherLon={-6.7716} weatherLabel="Tórshavn" />
            <div><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-2">TÓRSHAVN · MATCHDAY</p><div style={{ minHeight: 500 }}><FaroesMap onSelect={() => {}} selected={null} filter="match" mapRef={mapRef} /></div></div>
          </div>
        </aside>
      </article>

      {/* MOBILE */}
      <article className="lg:hidden px-4 pt-6 pb-24 max-w-[640px] mx-auto">
        <div className="mb-6">            <p className="text-[11px] tracking-[0.14em] uppercase text-rust font-medium">Day 4 · Thursday · 30 July</p><h1 className="text-[clamp(2rem,8vw,2.6rem)] leading-[1.06] mt-1 text-basalt tracking-[-0.01em]" style={{ fontFamily: "var(--font-cinzel)" }}>Matchday</h1><p className="text-[17px] font-medium text-basalt/80 mt-1.5">Øravík → Tórshavn → Tórsvøllur</p><p className="text-[14px] text-basalt/60 mt-2">Ferry across the fjord, Tinganes, OY Brewing, then the match. Last boat at 21:15.</p></div>
        <section className="mb-6"><MobileDecisionPanel /></section>
        <section className="mb-8"><MobileTripStatus dateLine1="Thursday 30 July 2026" dateLine2="Matchday · HB Tórshavn v Motherwell" weatherLat={62.0097} weatherLon={-6.7716} weatherLabel="Tórshavn" /></section>
        <section className="mb-8"><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-3">Matchday timeline</p><MobileTimeline steps={DAY_FOUR_TIMELINE} /></section>
        <section className="mb-8"><div className="border border-rust/20 bg-rust/[0.02] p-4 rounded-[6px]"><p className="text-[10px] uppercase tracking-[0.14em] text-rust font-medium mb-1">⚠ Critical</p><p className="text-[14px]">Miss the 21:15 and we sleep in Tórshavn. There is no Plan B.</p></div></section>
        <section><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-2">TÓRSHAVN · MATCHDAY</p><div style={{ minHeight: 420 }}><FaroesMap onSelect={() => {}} selected={null} filter="match" mapRef={mapRef} /></div></section>
      </article>
    </>
  );
}
