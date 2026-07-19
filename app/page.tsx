// =============================================================================
// Home — NOW operational screen.
// Compact header + interactive map + next-movement panel + action required
// + today timeline + near next stop + preparation summary + watchlist.
//
// No full-screen hero. No glassmorphism. No generic travel copy.
// =============================================================================

"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import type maplibregl from "maplibre-gl";

import { Countdown } from "@/components/countdown-block";
import { BOOKINGS, MATCH_FIXTURE, TRIP, DAYS } from "@/lib/data/itinerary";
import { JOURNEY_STOPS } from "@/lib/data/faroes-places";
import { JOURNEY_LEGS } from "@/lib/data/faroes-journey-legs";
import type { SelectedFeature } from "@/components/map/faroes-map";

// Lazy-load map
const FaroesMap = dynamic(() => import("@/components/map/faroes-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full border border-basalt/15 bg-fog/20 flex items-center justify-center" style={{ minHeight: 320 }}>
      <p className="caption">Loading map…</p>
    </div>
  ),
});

// =============================================================================
// Trip phase detection
// =============================================================================
type TripPhase = "preparation" | "departure" | "in-trip" | "match-day" | "return" | "completed";

function getTripPhase(): TripPhase {
  const now = Date.now();
  const depart = new Date("2026-07-27T17:00:00Z").getTime();
  const match = new Date("2026-07-30T18:00:00Z").getTime();
  const returnDay = new Date("2026-08-01T09:00:00Z").getTime();
  const completed = new Date("2026-08-01T22:00:00Z").getTime();

  if (now >= completed) return "completed";
  if (now >= returnDay) return "return";
  if (now >= match) return "match-day";
  if (now >= depart) return "in-trip";
  // Within 24h of departure
  if (now >= depart - 86_400_000) return "departure";
  return "preparation";
}

// =============================================================================
// Sub-components
// =============================================================================

function NorseLabel({ children }: { children: string }) {
  return (
    <span className="norse text-[13px] text-rust/80">
      {children}
    </span>
  );
}

function StatusDot({ tone }: { tone: "ok" | "warn" | "pending" }) {
  const c = tone === "ok" ? "text-moss" : tone === "warn" ? "text-rust" : "text-yellow";
  return <span className={`status-dot ${c}`} aria-hidden />;
}

function SmallField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="label">{label}</p>
      <p className={`mt-0.5 text-[14px] ${mono ? "code text-fjord tnum" : "text-basalt"}`}>{value}</p>
    </div>
  );
}

// =============================================================================
// Page
// =============================================================================

export default function HomePage() {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [selected, setSelected] = useState<SelectedFeature>(null);

  const handleSelect = useCallback((f: SelectedFeature) => setSelected(f), []);

  // Trip phase — computed once, derived from current time
  const phase = useMemo(() => getTripPhase(), []);

  // Next movement: the first journey leg (Vágar → Tórshavn bus)
  const nextLeg = JOURNEY_LEGS[0];

  // Today's day plan (first day for preparation phase)
  const todayDay = DAYS[0];

  return (
    <article className="px-6 sm:px-8 lg:px-12 pt-8 sm:pt-10 pb-20 max-w-[72rem]">
      {/* ================================================================
          A. COMPACT TRIP HEADER (~150-210px)
          ================================================================ */}
      <header className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-y-4 gap-x-8 pb-6 border-b border-basalt/15">
        <div>
          <NorseLabel>North Atlantic · Field Guide</NorseLabel>
          <h1 className="font-sans font-medium text-[clamp(1.6rem,3.5vw,2.4rem)] leading-[1.06] mt-2 text-basalt tracking-[-0.01em]">
            FAROE ISLANDS
          </h1>
          <p className="caption mt-2 max-w-[36rem]">
            {TRIP.dates} · {MATCH_FIXTURE.home} v {MATCH_FIXTURE.away}
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-2 text-right lg:text-right">
          <div className="flex items-center">
            <Countdown target={TRIP.countdownTarget} label="EDI departure" />
          </div>
          <SmallField label="Departure" value={BOOKINGS.flights.outbound.dep} mono />
          <SmallField label="Phase" value={phase.replace("-", " ")} />
        </div>
      </header>

      {/* ================================================================
          B. PRIMARY GRID: Map (left 60%) + Next Movement (right 40%)
          ================================================================ */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
        {/* ---- LEFT: Map ---- */}
        <div className="relative min-h-[320px] lg:min-h-[420px]">
          <FaroesMap
            onSelect={handleSelect}
            selected={selected}
            filter="journey"
            mapRef={mapRef}
          />
        </div>

        {/* ---- RIGHT: Next Movement ---- */}
        <div>
          <div className="border border-basalt/15 p-4 sm:p-5">
            <p className="label text-rust">Next movement</p>
            <div className="mt-3">
              <p className="font-medium text-[1.15rem] leading-snug text-basalt">
                {nextLeg.service}
              </p>
              <p className="caption mt-1">
                {nextLeg.mode === "bus" ? "Bus" : nextLeg.mode === "ferry" ? "Ferry" : "Transfer"}
                {" · "}{JOURNEY_STOPS[0]?.name} → {JOURNEY_STOPS[1]?.name}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                <SmallField label="Departure" value={nextLeg.departureTime ?? "—"} mono />
                <SmallField label="Arrival" value={nextLeg.arrivalTime ?? "—"} mono />
                <SmallField label="Duration" value={nextLeg.duration ?? "—"} />
                <SmallField label="Date" value="Mon 27 Jul" />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <StatusDot tone="warn" />
                <span className="text-[13px] text-rust font-medium">Needs booking</span>
              </div>

              {nextLeg.practicalNote && (
                <p className="caption mt-3">{nextLeg.practicalNote}</p>
              )}
            </div>
          </div>

          {/* ---- Action Required ---- */}
          <div className="harbour-notice mt-4 py-3">
            <p className="label text-rust mb-1">Action required</p>
            <p className="text-[14px] font-medium">Book airport transfer Vágar → Tórshavn</p>
            <p className="caption mt-1">
              Bus 300 timetable unconfirmed for summer 2026. Pre-book taxi as fallback.
            </p>
            <a
              href="https://ssl.fo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 code text-[13px] underline decoration-basalt/30 underline-offset-4"
            >
              ssl.fo → check timetable ↗
            </a>
          </div>
        </div>
      </div>

      {/* ================================================================
          C. TODAY / SELECTED DAY
          ================================================================ */}
      <section className="mt-10 max-w-[56rem]">
        <header className="border-b border-basalt/15 pb-2 mb-4">
          <h2 className="label">Today · {todayDay.date}</h2>
          <p className="font-medium text-[1.1rem] mt-1 text-basalt">{todayDay.chapter}</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-3">
          <SmallField label="First departure" value="EDI 17:10" mono />
          <SmallField label="Movements" value={`${todayDay.stages.length} stages`} />
          <SmallField label="Risk" value={todayDay.couldDisrupt.slice(0, 40) + "…"} />
        </div>
      </section>

      {/* ================================================================
          D. NEAR THE NEXT STOP
          ================================================================ */}
      <section className="mt-10 max-w-[56rem]">
        <header className="border-b border-basalt/15 pb-2 mb-3">
          <h2 className="label">Near Vágar Airport</h2>
          <p className="caption mt-1">Practical options near the arrival point</p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
          <NearbyRow label="Transport" detail="Bus 300 · airport→Tórshavn · ~45 min" />
          <NearbyRow label="Taxi" detail="Pre-book · ~45 min to Tórshavn ferry" />
          <NearbyRow label="Terminal" detail="Café · limited hours · cash/card" />
        </div>
      </section>

      {/* ================================================================
          E. PREPARATION SUMMARY
          ================================================================ */}
      <section className="mt-10 max-w-[56rem]">
        <header className="border-b border-basalt/15 pb-2 mb-3">
          <h2 className="label">Preparation</h2>
        </header>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-2 bg-basalt/10 overflow-hidden">
            <div className="h-full bg-moss" style={{ width: "45%" }} />
          </div>
          <span className="caption tnum">8 of 18 ready</span>
        </div>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1">
          <StateCount label="Documents" ready={3} total={4} />
          <StateCount label="Bookings" ready={2} total={5} />
          <StateCount label="Packing" ready={3} total={6} />
          <StateCount label="Urgent" ready={0} total={3} urgent />
        </div>
      </section>

      {/* ================================================================
          F. WATCHLIST
          ================================================================ */}
      <section className="mt-10 max-w-[56rem]">
        <header className="border-b border-basalt/15 pb-2 mb-3">
          <h2 className="label">Watchlist</h2>
          <p className="caption mt-1">Items requiring monitoring</p>
        </header>
        <ul>
          <WatchItem
            title="Final ferry · Smyril 21:15"
            detail="Last sailing of the day. Miss it and sleep in Tórshavn. Gate closes 5 min before departure."
            critical
          />
          <WatchItem
            title="Summer 2026 ferry timetable"
            detail="Current timetable confirmed for match-day 21:15 sailing. Reconfirm before travel."
          />
          <WatchItem
            title="London self-transfer · LGW → STN"
            detail="8h 10m layover. National Express coach ~2h 15m. Book ahead."
          />
        </ul>
      </section>
    </article>
  );
}

// Helper sub-components
function NearbyRow({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="py-2">
      <p className="label">{label}</p>
      <p className="text-[14px] mt-0.5">{detail}</p>
    </div>
  );
}

function StateCount({ label, ready, total, urgent }: { label: string; ready: number; total: number; urgent?: boolean }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className={`caption ${urgent ? "text-rust" : ""}`}>{label}</span>
      <span className={`tnum text-[14px] font-medium ${urgent ? "text-rust" : "text-basalt"}`}>
        {ready}/{total}
      </span>
    </div>
  );
}

function WatchItem({ title, detail, critical }: { title: string; detail: string; critical?: boolean }) {
  return (
    <li className={`py-3 border-b border-basalt/10 ${critical ? "border-l-2 border-l-rust pl-3" : ""}`}>
      <p className={`font-medium text-[14.5px] ${critical ? "text-rust" : "text-basalt"}`}>{title}</p>
      <p className="caption mt-1">{detail}</p>
    </li>
  );
}
