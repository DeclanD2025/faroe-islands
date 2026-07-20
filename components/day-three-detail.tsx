// =============================================================================
// DayThreeDetail — "A free day on Suðuroy" page (Wednesday 29 July 2026).
// A deliberately unscheduled day between the Suðuroy cliffs and matchday.
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

const DAY_THREE_TIMELINE: TimelineStep[] = [
  { num: 1, title: "Slow start · Við á 7", subtitle: "Breakfast from ESLA supplies", middleLabel: "Wake", middleValue: "~09:00", rightLabel: "Check", rightValue: "yr.no", footer: "No ferry to catch today. Coffee, the weather window, and a decision: Fámjin (flag church, west) or Froðba (basalt columns, east)?" },
  { num: 2, title: "Fámjin — the flag church", subtitle: "Bus 701 west · original Merkið from 1919", middleLabel: "Bus", middleValue: "701", rightLabel: "Visit", rightValue: "1–2 hrs", footer: "The church keeps the original Faroese flag. A waterfall sits behind it, gentle shoreline walks either side. Quiet, historic, the west-coast option." },
  { num: 3, title: "Froðba — basalt columns", subtitle: "Bus 700 / short walk from Tvøroyri", middleLabel: "Walk", middleValue: "~20 min", rightLabel: "Free", rightValue: "loop", footer: "Red cliffs, a blowhole, and columnar basalt along the coast. The easy east-coast option — an add-on to a Tvøroyri morning." },
  { num: 4, title: "Café MorMor · late lunch", subtitle: "38 Undir Heygnum, Tvøroyri 800", middleLabel: "Open", middleValue: "12–18:00", rightLabel: "Rating", rightValue: "4.8★", footer: "The island gem — cosy, brilliant soup and cake. Daytime only, so a lunch. Wed–Fri opening makes this the day for it." },
  { num: 5, title: "Self-cater or Hotel Tvøroyri", subtitle: "ESLA groceries · or the hotel bar", middleLabel: "Evening", middleValue: "Free", rightLabel: "No", rightValue: "schedule", footer: "Pick up anything missing from ESLA (open daily to 22:00, including Sundays). Or walk to Hotel Tvøroyri for a pint and the pizzeria. Pack and prep for tomorrow's matchday ferry." },
];

const DAY_THREE_SUMMARY: SummaryItem[] = [
  { icon: "⌂", label: "Base", time: "Øravík", note: "Suðuroy" },
  { icon: "⚑", label: "Pick", time: "Fámjin", note: "or Froðba" },
  { icon: "☕", label: "Lunch", time: "MorMor", note: "12–18:00" },
  { icon: "⏱", label: "Walking", time: "Light", note: "No rush" },
  { icon: "⚽", label: "Tomorrow", time: "Matchday", note: "Ferry 11:30" },
];

// =============================================================================
// Mobile Decision Panel (Day 3 specific)
// =============================================================================

function MobileDecisionPanel() {
  return (
    <div className="border border-basalt/15 rounded-[8px] p-4">
      <p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60">Free day</p>
      <p className="code tnum text-[36px] font-medium text-basalt leading-none mt-1">No schedule</p>
      <p className="text-[13px] text-basalt/65 mt-2">A slow morning, then pick one: <strong>Fámjin</strong> (the flag church, Bus 701 west) or <strong>Froðba</strong> (basalt columns, easy walk). <strong>Café MorMor</strong> for lunch. Tomorrow is the match — today is for doing very little, well.</p>
      <div className="flex gap-6 mt-3 pt-3 border-t border-basalt/10"><div><p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">Walking</p><p className="code tnum text-[15px] font-medium text-basalt">Light</p></div><div><p className="text-[10px] uppercase tracking-[0.1em] text-basalt/45">Lunch</p><p className="code tnum text-[15px] font-medium text-basalt">MorMor</p></div></div>
    </div>
  );
}

// =============================================================================
// Main export
// =============================================================================

export function DayThreeDetail() {
  const mapRef = useRef<maplibregl.Map | null>(null);

  return (
    <>
      {/* DESKTOP */}
      <article className="hidden lg:grid grid-cols-[1fr_340px] gap-8 px-8 pt-8 pb-20 max-w-[1280px]">
        <div className="min-w-0">
          <div className="mb-8">
            <p className="text-[12px] tracking-[0.14em] uppercase text-rust font-medium">Day 3 · Wednesday · 29 July 2026</p>
            <h1 className="text-[clamp(2.5rem,3.5vw,3.2rem)] leading-[1.04] mt-1.5 text-basalt tracking-[-0.01em]" style={{ fontFamily: "var(--font-cinzel)" }}>A free day on Suðuroy</h1>
            <p className="text-[20px] font-medium text-basalt/80 mt-2">Øravík · Hov · Froðba</p>
            <p className="text-[14px] text-basalt/60 mt-2 max-w-[38rem]">No fixed plan, no ferry to catch. A slow morning, a walk that doesn't have to go anywhere, and the island at its own pace. The match is tomorrow — today is for doing very little, well.</p>
          </div>
          <section className="mb-8"><SummaryStrip items={DAY_THREE_SUMMARY} /></section>
          <section className="mb-10"><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-4">Day plan</p><JourneyTimeline steps={DAY_THREE_TIMELINE} /></section>
          <section className="max-w-[48rem]"><div className="harbour-notice"><p className="text-[10px] uppercase tracking-[0.14em] text-rust font-medium mb-1">Could disrupt the day</p><p className="text-[14px]">Rain. A free day is the cheapest day to lose to weather — ESLA, the guesthouse, and a book are the plan. If it clears, Froðba works in any visibility; Fámjin is better in clear conditions for the walk behind the church.</p></div></section>
        </div>
        <aside className="min-w-0">
          <div className="space-y-8">
            <TripStatusPanel dateLine1="Wednesday 29 July 2026" dateLine2="Free day on Suðuroy" weatherLat={61.536} weatherLon={-6.81} weatherLabel="Øravík" />
            <div><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-2">SUÐUROY · FAROE ISLANDS</p><div style={{ minHeight: 500 }}><FaroesMap onSelect={() => {}} selected={null} filter="suðuroy" mapRef={mapRef} /></div></div>
          </div>
        </aside>
      </article>

      {/* MOBILE */}
      <article className="lg:hidden px-4 pt-6 pb-24 max-w-[640px] mx-auto">
        <div className="mb-6"><p className="text-[11px] tracking-[0.14em] uppercase text-rust font-medium">Day 3 · Wednesday · 29 July</p><h1 className="text-[clamp(2rem,8vw,2.6rem)] leading-[1.06] mt-1 text-basalt tracking-[-0.01em]" style={{ fontFamily: "var(--font-cinzel)" }}>A free day on Suðuroy</h1><p className="text-[17px] font-medium text-basalt/80 mt-1.5">Øravík · Hov · Froðba</p><p className="text-[14px] text-basalt/60 mt-2">No fixed plan, no ferry to catch. The match is tomorrow — today is for doing very little, well.</p></div>
        <section className="mb-6"><MobileDecisionPanel /></section>
        <section className="mb-8"><MobileTripStatus dateLine1="Wednesday 29 July 2026" dateLine2="Free day on Suðuroy" weatherLat={61.536} weatherLon={-6.81} weatherLabel="Øravík" /></section>
        <section className="mb-8"><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-3">Day plan</p><MobileTimeline steps={DAY_THREE_TIMELINE} /></section>
        <section className="mb-8"><div className="harbour-notice"><p className="text-[10px] uppercase tracking-[0.14em] text-rust font-medium mb-1">Could disrupt the day</p><p className="text-[14px]">Rain. A free day is the cheapest day to lose to weather — ESLA, the guesthouse, and a book are the plan.</p></div></section>
        <section><p className="text-[10px] uppercase tracking-[0.16em] text-fjord/60 mb-2">SUÐUROY · FAROE ISLANDS</p><div style={{ minHeight: 420 }}><FaroesMap onSelect={() => {}} selected={null} filter="suðuroy" mapRef={mapRef} /></div></section>
      </article>
    </>
  );
}
