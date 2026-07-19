// =============================================================================
// DayFourDetail — "Repositioning north" page.
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
  { num: 1, title: "Morning in Øravík", subtitle: "Pack up, clean, lockbox checkout", middleLabel: "Checkout", middleValue: "By 12:00", rightLabel: "Morning", rightValue: "Free", footer: "Leave the key in the lockbox. Final walk round the village. Bus 700 to Krambatangi leaves from Ferjuleðan — two stops." },
  { num: 2, title: "Bus 700 → Krambatangi", subtitle: "Ferjuleðan stop · 2 stops", middleLabel: "Depart", middleValue: "~15:15", rightLabel: "Transfer", rightValue: "~8 min", footer: "DKK 20 pp or SSL Travel Card. Don't cut it too close — the 16:00 is a Friday timetable sailing, different from Thursday." },
  { num: 3, title: "M/F Smyril northbound", subtitle: "Krambatangi → Tórshavn · Friday sailing", middleLabel: "Departs", middleValue: "16:00", middleLabel2: "Arrives", middleValue2: "18:05", rightLabel: "Crossing", rightValue: "2h 05m", footer: "Friday timetable — the 16:00 replaces the usual afternoon pattern. If this sailing is cancelled for swell, the 21:15 may still run as backup. Keep both options open." },
  { num: 4, title: "Bus 300 · Tórshavn → Sørvágur", subtitle: "Via Vágatunnilin · stops at airport", middleLabel: "Departs", middleValue: "18:30", middleLabel2: "Arrives", middleValue2: "19:15", rightLabel: "Journey", rightValue: "45 min", footer: "Connects from the 18:05 ferry arrival. DKK 90 pp or SSL Travel Card. The bus drops at Sørvágur village, not the airport — the terminal is 10 min walk or one stop on Bus 300." },
  { num: 5, title: "Guesthouse Hugo", subtitle: "2 Bakkavegur, 380 Sørvágur", middleLabel: "Arrive", middleValue: "~19:30", rightLabel: "PIN", rightValue: "9432", footer: "Confirm: 5924180270. Phone: +298 232101. Ten minutes from Vágar Airport terminal — easy morning tomorrow. Múlafossur waterfall is a 25 min walk east from the village." },
];

const DAY_FOUR_SUMMARY: SummaryItem[] = [
  { icon: "⌂", label: "Checkout", time: "12:00", note: "Øravík" },
  { icon: "⏻", label: "Ferry out", time: "16:00", note: "Krambatangi" },
  { icon: "⏻", label: "Bus 300", time: "18:30", note: "Tórshavn" },
  { icon: "⌂", label: "Check-in", time: "~19:30", note: "Sørvágur" },
  { icon: "✈", label: "Airport", time: "10 min", note: "from Hugo" },
];

// =============================================================================
// Mobile
// =============================================================================

function MobileDecisionPanel() {
  return (
    <div className="border border-basalt/15 rounded-[8px] p-4">
      <p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60">Game plan</p>
      <p className="code tnum text-[36px] font-medium text-basalt leading-none mt-1">Ferry 16:00</p>
      <p className="text-[13px] text-basalt/65 mt-2">Pack up Øravík. <strong>16:00 ferry</strong> north (Friday timetable — earlier than Thursday). Bus 300 to Sørvágur. <strong>Guesthouse Hugo</strong> is 10 min from the airport.</p>
      <div className="flex gap-6 mt-3 pt-3 border-t border-basalt/10"><div><p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">Arrive</p><p className="code tnum text-[15px] font-medium text-basalt">~19:30</p></div><div><p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">PIN</p><p className="code tnum text-[15px] font-medium text-basalt">9432</p></div></div>
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
            <p className="text-[14px] text-basalt/60 mt-2 max-w-[38rem]">One last ferry crossing, chasing the late sun towards the airport island. Guesthouse Hugo is ten minutes from the terminal — easy morning, no panicked dawn.</p>
          </div>
          <section className="mb-8"><SummaryStrip items={DAY_FOUR_SUMMARY} /></section>
          <section className="mb-10"><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-4">Journey north</p><JourneyTimeline steps={DAY_FOUR_TIMELINE} /></section>
          <section className="max-w-[48rem]"><div className="harbour-notice"><p className="text-[10px] uppercase tracking-[0.14em] text-rust font-medium mb-1">Could disrupt the day</p><p className="text-[14px]">The Friday timetable differs from Thursday's. If the 16:00 ferry is cancelled for swell, the 21:15 may still run — keep the option open. Múlafossur is a 25 min walk from Hugo if you arrive with light.</p></div></section>
        </div>
        <aside className="min-w-0">
          <div className="space-y-8">
            <TripStatusPanel dateLine1="Friday 31 July 2026" dateLine2="Repositioning to Sørvágur" weatherLat={62.0706} weatherLon={-7.3221} weatherLabel="Sørvágur" />
            <div><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-2">SUÐUROY → VÁGAR</p><div style={{ minHeight: 500 }}><FaroesMap onSelect={() => {}} selected={null} filter="journey" mapRef={mapRef} /></div></div>
          </div>
        </aside>
      </article>

      {/* MOBILE */}
      <article className="lg:hidden px-4 pt-6 pb-24 max-w-[640px] mx-auto">
        <div className="mb-6"><p className="text-[11px] tracking-[0.14em] uppercase text-rust font-medium">Day 4 · Friday · 31 July</p><h1 className="text-[clamp(2rem,8vw,2.6rem)] leading-[1.06] mt-1 text-basalt tracking-[-0.01em]" style={{ fontFamily: "var(--font-cinzel)" }}>Repositioning north</h1><p className="text-[17px] font-medium text-basalt/80 mt-1.5">Øravík → Tórshavn → Sørvágur</p><p className="text-[14px] text-basalt/60 mt-2">Last ferry crossing, Bus 300 to Sørvágur, Guesthouse Hugo ten minutes from the terminal.</p></div>
        <section className="mb-6"><MobileDecisionPanel /></section>
        <section className="mb-8"><MobileTripStatus dateLine1="Friday 31 July 2026" dateLine2="Repositioning to Sørvágur" weatherLat={62.0706} weatherLon={-7.3221} weatherLabel="Sørvágur" /></section>
        <section className="mb-8"><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-3">Journey north</p><MobileTimeline steps={DAY_FOUR_TIMELINE} /></section>
        <section><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-2">SUÐUROY → VÁGAR</p><div style={{ minHeight: 420 }}><FaroesMap onSelect={() => {}} selected={null} filter="journey" mapRef={mapRef} /></div></section>
      </article>
    </>
  );
}
