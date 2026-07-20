// =============================================================================
// DayTwoDetail — "The cliffs of Suðuroy" page.
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

const DAY_TWO_TIMELINE: TimelineStep[] = [
  { num: 1, title: "Øravík base", subtitle: "Við á 7, Øravík 827", middleLabel: "Wake", middleValue: "~08:00", rightLabel: "Check", rightValue: "yr.no", footer: "Check the weather. If the cliffs are in fog, swap Hvannhagi for a Tvøroyri morning." },
  { num: 2, title: "Bus 700 south", subtitle: "Ferjuleðan → Hov · ~15 min", middleLabel: "Depart", middleValue: "~10:00", rightLabel: "Fare", rightValue: "DKK 20", footer: "Two stops from the Krambatangi junction. Tell the driver 'Hov' — they know the drill." },
  { num: 3, title: "Hvannhagi ridge walk", subtitle: "Orange T-marked posts · 2–3 hrs", middleLabel: "Distance", middleValue: "~5 km", middleLabel2: "Highest", middleValue2: "~200 m", rightLabel: "Duration", rightValue: "2–3 hrs", footer: "Cliff-edge lake facing Stóra Dímun. The markers vanish in fog — if visibility is poor, do the Hov chieftain-mound loop instead." },
  { num: 4, title: "Hov village", subtitle: "Chieftain's mound · harbour", middleLabel: "Walk", middleValue: "~30 min", rightLabel: "Free", rightValue: "loop", footer: "The burial mound of a Viking chieftain overlooking the harbour. Quick, easy, worth the detour." },
  { num: 5, title: "Beinisvørð", subtitle: "469 m · south-west corner of Suðuroy", middleLabel: "Drive", middleValue: "~20 min", rightLabel: "Visit", rightValue: "30–60 min", footer: "The defining cliff of Suðuroy. Walk past the gate north of the lighthouse. If the cloud base is low, skip it — the view is the point." },
  { num: 6, title: "Hotel Tvøroyri", subtitle: "Pizzeria · bar · evening", middleLabel: "Arrive", middleValue: "~19:00", rightLabel: "Close", rightValue: "Late", footer: "Pizzeria, dependable pint, the same locals every night. Cash and card accepted. Last Bus 700 north runs ~22:00." },
];

const DAY_TWO_SUMMARY: SummaryItem[] = [
  { icon: "⌂", label: "Base", time: "Øravík", note: "Suðuroy" },
  { icon: "⏻", label: "Bus route", time: "700", note: "Coastal spine" },
  { icon: "▲", label: "Highest point", time: "469 m", note: "Beinisvørð" },
  { icon: "⏱", label: "Walking time", time: "3–4 hrs", note: "Total" },
  { icon: "🍺", label: "Dinner", time: "~19:00", note: "Hotel Tvøroyri" },
];

// =============================================================================
// Mobile Decision Panel (Day 2 specific)
// =============================================================================

function MobileDecisionPanel() {
  return (
    <div className="border border-basalt/15 rounded-[8px] p-4">
      <p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60">First move</p>
      <p className="code tnum text-[36px] font-medium text-basalt leading-none mt-1">Bus 700 · 10:00</p>
      <p className="text-[13px] text-basalt/65 mt-2">Coastal ride south to <strong>Hov village</strong>. Hvannhagi ridge walk starts from there. Check the fog — if the hills are white, swap the walk for the chieftain's mound loop.</p>
      <div className="flex gap-6 mt-3 pt-3 border-t border-basalt/10"><div><p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">Walking</p><p className="code tnum text-[15px] font-medium text-basalt">3–4 hrs</p></div><div><p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">Dinner</p><p className="code tnum text-[15px] font-medium text-basalt">19:00</p></div></div>
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
      {/* DESKTOP */}
      <article className="hidden lg:grid grid-cols-[1fr_340px] gap-8 px-8 pt-8 pb-20 max-w-[1280px]">
        <div className="min-w-0">
          <div className="mb-8">
            <p className="text-[12px] tracking-[0.14em] uppercase text-rust font-medium">Day 2 · Tuesday · 28 July 2026</p>
            <h1 className="text-[clamp(2.5rem,3.5vw,3.2rem)] leading-[1.04] mt-1.5 text-basalt tracking-[-0.01em]" style={{ fontFamily: "var(--font-cinzel)" }}>The cliffs of Suðuroy</h1>
            <p className="text-[20px] font-medium text-basalt/80 mt-2">Øravík · Hov · Beinisvørð · Tvøroyri</p>
            <p className="text-[14px] text-basalt/60 mt-2 max-w-[38rem]">A whole Suðuroy day. Beinisvørð on the way south, a pint at Hotel Tvøroyri, and the twilight worth losing sleep for. Thursday is the match — today is the breathing room.</p>
          </div>
          <section className="mb-8"><SummaryStrip items={DAY_TWO_SUMMARY} /></section>
          <section className="mb-10"><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-4">Day plan</p><JourneyTimeline steps={DAY_TWO_TIMELINE} /></section>
          <section className="max-w-[48rem]"><div className="harbour-notice"><p className="text-[10px] uppercase tracking-[0.14em] text-rust font-medium mb-1">Could disrupt the day</p><p className="text-[14px]">Coastal fog. If the cliffs are in cloud, swap Beinisvørð for Hvannhagi — the markers vanish in fog. The chieftain's mound at Hov works in any weather.</p></div></section>
        </div>
        <aside className="min-w-0">
          <div className="space-y-8">
            <TripStatusPanel dateLine1="Tuesday 28 July 2026" dateLine2="Suðuroy exploration day" weatherLat={61.536} weatherLon={-6.81} weatherLabel="Øravík" />
            <div><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-2">SUÐUROY · FAROE ISLANDS</p><div style={{ minHeight: 500 }}><FaroesMap onSelect={() => {}} selected={null} filter="suðuroy" mapRef={mapRef} /></div></div>
          </div>
        </aside>
      </article>

      {/* MOBILE */}
      <article className="lg:hidden px-4 pt-6 pb-24 max-w-[640px] mx-auto">
        <div className="mb-6">            <p className="text-[11px] tracking-[0.14em] uppercase text-rust font-medium">Day 2 · Tuesday · 28 July</p><h1 className="text-[clamp(2rem,8vw,2.6rem)] leading-[1.06] mt-1 text-basalt tracking-[-0.01em]" style={{ fontFamily: "var(--font-cinzel)" }}>The cliffs of Suðuroy</h1><p className="text-[17px] font-medium text-basalt/80 mt-1.5">Øravík · Hov · Beinisvørð · Tvøroyri</p><p className="text-[14px] text-basalt/60 mt-2">A whole Suðuroy day. Beinisvørð, Hvannhagi ridge walk, and a pint at Hotel Tvøroyri.</p></div>
        <section className="mb-6"><MobileDecisionPanel /></section>
        <section className="mb-8"><MobileTripStatus dateLine1="Tuesday 28 July 2026" dateLine2="Suðuroy exploration day" weatherLat={61.536} weatherLon={-6.81} weatherLabel="Øravík" /></section>
        <section className="mb-8"><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-3">Day plan</p><MobileTimeline steps={DAY_TWO_TIMELINE} /></section>
        <section className="mb-8"><div className="harbour-notice"><p className="text-[10px] uppercase tracking-[0.14em] text-rust font-medium mb-1">Could disrupt the day</p><p className="text-[14px]">Coastal fog. If the cliffs are in cloud, swap Beinisvørð for Hvannhagi — the markers vanish in fog.</p></div></section>
        <section><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-2">SUÐUROY · FAROE ISLANDS</p><div style={{ minHeight: 420 }}><FaroesMap onSelect={() => {}} selected={null} filter="journey" mapRef={mapRef} /></div></section>
      </article>
    </>
  );
}
