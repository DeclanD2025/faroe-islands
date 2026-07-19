// =============================================================================
// DayOneDetail — comprehensive operational brief for Day 1 (Mon 27 Jul 2026).
// Covers: home→EDI, train board, departure board, aircraft, flight path,
// Vágar arrival, transfer, ferry board, AirBnB directions, maps.
// =============================================================================

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import type maplibregl from "maplibre-gl";
import type { SelectedFeature } from "@/components/map/faroes-map";
import { LiveBoard, type LiveRow } from "@/components/live-board";
import { getEdiDeparturesUrl, transformEdiDepartures } from "@/lib/aviationstack";
import { getBlhDeparturesUrl, transformBlhDepartures } from "@/lib/transportapi";
import {
  HOME_TO_AIRPORT,
  SCOTRAIL_DEPARTURES,
  EDI_DEPARTURE_BOARD,
  EDI_PUBS_FOOD,
  AIRCRAFT,
  THE_FLIGHT,
  VAGAR_ARRIVAL,
  AIRPORT_TRANSFER,
  FERRY_BOARD,
  TO_AIRBNB,
} from "@/lib/data/day-one-data";

const FaroesMap = dynamic(() => import("@/components/map/faroes-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full border border-basalt/15 bg-fog/20 flex items-center justify-center" style={{ minHeight: 280 }}>
      <p className="caption">Loading map…</p>
    </div>
  ),
});

// =============================================================================
// Shared sub-components
// =============================================================================

function SectionHeader({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <header className="border-b border-basalt/15 pb-3 mb-4">
      <p className="label text-rust">{label}</p>
      <h2 className="font-medium text-[1.15rem] mt-1 text-basalt">{title}</h2>
      {subtitle && <p className="caption mt-1">{subtitle}</p>}
    </header>
  );
}

function InfoRow({ label, value, mono, warn }: { label: string; value: string; mono?: boolean; warn?: boolean }) {
  return (
    <div className="py-2 border-b border-basalt/5">
      <p className="label">{label}</p>
      <p className={`mt-0.5 text-[14px] ${mono ? "code text-fjord tnum" : "text-basalt"} ${warn ? "!text-rust font-medium" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function Badge({ children, tone }: { children: string; tone?: "warn" | "ok" | "info" }) {
  const c = tone === "warn" ? "border-rust/40 text-rust" : tone === "ok" ? "border-moss/40 text-moss" : "border-fjord/30 text-fjord";
  return (
    <span className={`text-[10.5px] uppercase tracking-[0.1em] font-medium border px-1.5 py-px ${c}`}>
      {children}
    </span>
  );
}

// =============================================================================
// Widget: Live Faroe Islands clock
// =============================================================================
function LiveClock() {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const faroe = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Atlantic/Faroe",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);
      const faroeDate = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Atlantic/Faroe",
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(now);
      setTime(faroe);
      setDate(faroeDate);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border border-basalt/15 p-3">
      <p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60 mb-1">Faroe Islands time</p>
      <p className="code text-fjord tnum text-[22px] font-medium leading-none">{time || "—:—:—"}</p>
      <p className="text-[11px] text-fjord/50 mt-0.5">{date || "—"} · WEST (UTC+1)</p>
    </div>
  );
}

// =============================================================================
// Widget: Countdown to train departure (11:59 Bellshill)
// =============================================================================
function TrainCountdown() {
  const [remaining, setRemaining] = useState<{ h: number; m: number; past: boolean }>({ h: 0, m: 0, past: false });

  useEffect(() => {
    const target = new Date("2026-07-27T10:59:00Z").getTime(); // 11:59 BST = 10:59 UTC
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setRemaining({ h: 0, m: 0, past: true });
        return;
      }
      setRemaining({
        past: false,
        h: Math.floor(diff / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
      });
    };
    tick();
    const id = setInterval(tick, 60_000); // update every minute
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border border-basalt/15 p-3 inline-block">
      <p className="text-[10px] uppercase tracking-[0.12em] text-rust/70 mb-1">Train countdown</p>
      {remaining.past ? (
        <p className="code text-rust tnum text-[16px] font-medium">Departed</p>
      ) : (
        <p className="code text-basalt tnum text-[22px] font-medium leading-none">
          {remaining.h}h {remaining.m}m
        </p>
      )}
      <p className="text-[11px] text-fjord/50 mt-0.5">until 11:59 Bellshill</p>
    </div>
  );
}

// =============================================================================
// Widget: yr.no weather for Tórshavn
// =============================================================================
interface WeatherData {
  temp: number | null;
  wind: number | null;
  precip: number | null;
  symbol: string;
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

function WeatherWidget() {
  const [w, setW] = useState<WeatherData>({ temp: null, wind: null, precip: null, symbol: "", desc: "", loading: true, error: false });

  useEffect(() => {
    let cancelled = false;
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=62.0636&lon=-7.2772",
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
          precip: next1h?.details?.precipitation_amount ?? null,
          symbol: next1h?.summary?.symbol_code ?? "",
          desc: formatSymbol(next1h?.summary?.symbol_code ?? ""),
          loading: false,
          error: false,
        });
      } catch {
        if (!cancelled) setW((prev) => ({ ...prev, loading: false, error: true }));
      }
    };
    fetchWeather();
    // Refresh every 30 min
    const id = setInterval(fetchWeather, 1_800_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return (
    <div className="border border-basalt/15 p-3">
      <p className="text-[10px] uppercase tracking-[0.12em] text-fjord/60 mb-2">Vágar Airport · yr.no</p>
      {w.loading ? (
        <p className="caption">Loading weather…</p>
      ) : w.error ? (
        <p className="caption text-rust">Weather unavailable</p>
      ) : (
        <div className="space-y-1.5">
          <div className="flex items-baseline gap-2">
            <span className="code text-basalt tnum text-[22px] font-medium leading-none">{w.temp?.toFixed(0) ?? "—"}°</span>
            <span className="text-[12px] text-fjord/70">{w.desc || "—"}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            <p className="text-[11px] text-fjord/60">Wind <span className="code tnum text-fjord/80 ml-1">{w.wind?.toFixed(1) ?? "—"} m/s</span></p>
            {w.precip != null && w.precip > 0 && (
              <p className="text-[11px] text-fjord/60">Rain <span className="code tnum text-fjord/80 ml-1">{w.precip} mm</span></p>
            )}
          </div>
        </div>
      )}
      <p className="text-[10px] text-fjord/40 mt-1.5">Data: met.no · CC BY 4.0</p>
    </div>
  );
}

// =============================================================================
// Main component
// =============================================================================

export function DayOneDetail() {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [selected, setSelected] = useState<SelectedFeature>(null);
  const handleSelect = useCallback((f: SelectedFeature) => setSelected(f), []);

  // Day 1 checklist state
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const toggleCheck = (id: string) => setChecks((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <article className="px-6 sm:px-8 lg:px-12 pt-8 sm:pt-10 pb-20 max-w-[76rem]">
      {/* ================================================================
          HEADER
          ================================================================ */}
      <header className="pb-5 border-b border-basalt/15 mb-8">
        <div className="flex flex-wrap items-baseline justify-between gap-y-2">
          <div>
            <p className="label text-rust">Day 1 · Monday · 27 July 2026</p>
            <h1 className="font-sans font-medium text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.08] mt-1.5 text-basalt tracking-[-0.01em]">
              Bellshill → Øravík
            </h1>
          </div>
          <div className="flex items-baseline gap-4 text-right">
            <div>
              <p className="label">Departure</p>
              <p className="code text-fjord tnum text-[16px] mt-0.5">EDI 17:10</p>
            </div>
            <div>
              <p className="label">Arrival</p>
              <p className="code text-fjord tnum text-[16px] mt-0.5">FAE 18:35</p>
            </div>
          </div>
        </div>
        <p className="caption mt-3 max-w-[40rem]">
          One flight, one bus, one ferry, one short hop. ~10.5 hours door to door.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        {/* ================================================================
            MAIN COLUMN — operational sections
            ================================================================ */}
        <div className="min-w-0">

          {/* ——— 1. Getting to Edinburgh Airport ——— */}
          <SectionHeader label="01 · Before you leave" title="Getting to Edinburgh Airport" subtitle="From 40 Liberty Road, Bellshill ML4 2EX" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-4">
            <InfoRow label="Origin" value={HOME_TO_AIRPORT.origin} />
            <InfoRow label="Nearest station" value={`${HOME_TO_AIRPORT.nearestStation} · ${HOME_TO_AIRPORT.stationWalk}`} />
            <InfoRow label="Train" value={`${HOME_TO_AIRPORT.scotrailRoute} · ${HOME_TO_AIRPORT.scotrailOperator}`} />
            <InfoRow label="Typical journey" value={HOME_TO_AIRPORT.scotrailTypicalJourneyTime} />
            <InfoRow label="Connection" value={HOME_TO_AIRPORT.haymarketNote} />
            <InfoRow label="Tram" value={`${HOME_TO_AIRPORT.tramRoute} · ${HOME_TO_AIRPORT.tramFrequency} · ${HOME_TO_AIRPORT.tramJourneyTime}`} />
            <InfoRow label="Tram payment" value={HOME_TO_AIRPORT.tramPayment} />
            <InfoRow label="Total transit" value={HOME_TO_AIRPORT.totalTransitTime} mono warn />
          </div>

          {/* ——— 2. ScotRail Departure Board ——— */}
          <SectionHeader label="02 · ScotRail" title="Bellshill → Haymarket · Departure Board" subtitle="Monday 27 July 2026 · confirm at scotrail.co.uk" />
          <div className="mb-4">
            <LiveBoard
              title="Departures"
              fetchUrl={getBlhDeparturesUrl() ?? undefined}
              transform={transformBlhDepartures}
              sourceUrl="https://www.scotrail.co.uk/plan-your-journey"
              sourceLabel="ScotRail live"
              columns={[
                { key: "dep", label: "Depart", mono: true },
                { key: "arr", label: "Arrive", mono: true },
                { key: "notes", label: "Notes" },
              ]}
              highlightKey="dep"
              highlightValue="11:59"
              fallbackRows={SCOTRAIL_DEPARTURES as unknown as LiveRow[]}
            />
          </div>
          <p className="caption">
            <strong>11:59</strong> is the safest pick — Haymarket 13:02, EDI by ~13:30, bags of time. 
            <strong>12:59</strong> works too if you want another hour at home. Off-peak return ~£18. ScotRail app or Bellshill machine.
          </p>

          <div className="mt-4">
            <TrainCountdown />
          </div>

          {/* ——— Route Map ——— */}
          <div className="mt-8 mb-8">
            <p className="label mb-2">Route map</p>
            <div style={{ minHeight: 280 }}>
              <FaroesMap onSelect={handleSelect} selected={selected} filter="journey" mapRef={mapRef} />
            </div>
          </div>

          {/* ——— 3. EDI Departure Board + Pubs ——— */}
          <SectionHeader label="03 · Edinburgh Airport" title="Departure Board · EDI → FAE" subtitle="Monday 27 July 2026" />
          <div className="mb-3">
            <LiveBoard
              title="Departures"
              fetchUrl={getEdiDeparturesUrl() ?? undefined}
              transform={transformEdiDepartures}
              sourceUrl="https://www.edinburghairport.com/flights/departures"
              sourceLabel="EDI live departures"
              columns={[
                { key: "time", label: "Time", mono: true, narrow: true },
                { key: "flight", label: "Flight" },
                { key: "destination", label: "Destination" },
                { key: "gate", label: "Gate", mono: true },
                { key: "status", label: "Status" },
              ]}
              fallbackRows={EDI_DEPARTURE_BOARD as unknown as LiveRow[]}
            />
          </div>

          <p className="label mt-4 mb-2">Pubs & food near the gate</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {EDI_PUBS_FOOD.map((p, i) => (
              <div key={i} className="border border-basalt/15 p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-medium text-[14px] text-basalt">{p.name}</p>
                  <Badge tone="info">{p.type}</Badge>
                </div>
                <p className="caption mt-1">{p.note}</p>
                <p className="text-[11px] text-fjord/60 mt-1">{p.walk}</p>
              </div>
            ))}
          </div>

          {/* ——— 4. The Aircraft ——— */}
          <SectionHeader label="04 · The aircraft" title="Atlantic Airways · Airbus A320neo" subtitle="RC 415 · 174–178 seats · single-class economy" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-6">
            <InfoRow label="Type" value={AIRCRAFT.type} />
            <InfoRow label="Engines" value={AIRCRAFT.engines} />
            <InfoRow label="Cruise altitude" value={AIRCRAFT.cruiseAltitude} />
            <InfoRow label="Cruise speed" value={AIRCRAFT.cruiseSpeed} />
            <InfoRow label="Capacity" value={AIRCRAFT.capacity} />
            <InfoRow label="Seat pitch" value={AIRCRAFT.seatPitch} />
            <InfoRow label="In-flight" value={AIRCRAFT.inflightService} />
            <InfoRow label="Livery" value={AIRCRAFT.livery} />
          </div>

          {/* ——— 5. The Flight ——— */}
          <SectionHeader label="05 · The flight" title="RC 415 · Edinburgh → Vágar" subtitle={`${THE_FLIGHT.duration} · ${THE_FLIGHT.distance} · ${THE_FLIGHT.scheduledDeparture}–${THE_FLIGHT.scheduledArrival}`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-4">
            <InfoRow label="Flight number" value={THE_FLIGHT.flightNumber} mono />
            <InfoRow label="Callsign" value={THE_FLIGHT.callsign} mono />
            <InfoRow label="Departure gate" value={THE_FLIGHT.departureGate} />
            <InfoRow label="Runway" value={THE_FLIGHT.departureRunway} />
          </div>
          <p className="label mb-2">Flight path & what you'll see</p>
          <div className="border border-basalt/15 p-4 mb-2">
            <p className="text-[13px] text-fjord mb-3">{THE_FLIGHT.flightPath}</p>
            <ul className="space-y-1.5">
              {THE_FLIGHT.whatYouSee.map((item, i) => (
                <li key={i} className="text-[14px] flex items-start gap-2">
                  <span className="text-rust mt-0.5">{i + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="harbour-notice mt-3 mb-6">
            <p className="text-[13px]">{THE_FLIGHT.approachNote}</p>
          </div>

          {/* ——— 6. Vágar Arrival ——— */}
          <SectionHeader label="06 · Arrival" title="Vágar Airport · FAE" subtitle="Landing ~18:35 WEST (UTC+1) · single terminal · walk across tarmac" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-4">
            <InfoRow label="Airport" value={VAGAR_ARRIVAL.airportName} />
            <InfoRow label="Location" value={VAGAR_ARRIVAL.location} />
            <InfoRow label="Runway" value={VAGAR_ARRIVAL.runway} />
            <InfoRow label="Terminal" value={VAGAR_ARRIVAL.terminal} />
            <InfoRow label="Passport control" value={VAGAR_ARRIVAL.passportControl} />
            <InfoRow label="Duty-free" value={VAGAR_ARRIVAL.dutyFree} />
            <InfoRow label="Wi-Fi" value={VAGAR_ARRIVAL.wifi} />
            <InfoRow label="Bus stop" value={VAGAR_ARRIVAL.busStopLocation} />
          </div>
          <div className="border border-basalt/15 p-4 mb-6">
            <p className="label mb-1">What you'll see stepping outside</p>
            <p className="text-[14px]">{VAGAR_ARRIVAL.outsideView}</p>
          </div>

          {/* ——— 7. Airport Transfer ——— */}
          <SectionHeader label="07 · Transfer" title="Vágar Airport → Tórshavn" subtitle="⚠ Book before travel" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-2">
            <InfoRow label="Bus" value={`${AIRPORT_TRANSFER.busRoute} · ${AIRPORT_TRANSFER.busDeparture}–${AIRPORT_TRANSFER.busArrival}`} />
            <InfoRow label="Duration" value={AIRPORT_TRANSFER.busDuration} mono />
            <InfoRow label="Fare" value={AIRPORT_TRANSFER.busFare} />
            <InfoRow label="Route" value={AIRPORT_TRANSFER.busRoutePath} />
            <InfoRow label="Taxi fallback" value={AIRPORT_TRANSFER.taxiFallback} mono />
            <InfoRow label="Taxi fare" value={AIRPORT_TRANSFER.taxiFare} />
          </div>
          <div className="harbour-notice mb-6">
            <p className="text-[13px] font-medium">{AIRPORT_TRANSFER.reminder}</p>
            <a href="https://ssl.fo" target="_blank" rel="noopener noreferrer" className="inline-block mt-1.5 code text-[12px] underline underline-offset-4 decoration-rust/40">
              ssl.fo → check Bus 300 timetable ↗
            </a>
          </div>

          {/* ——— 8. Ferry ——— */}
          <SectionHeader label="08 · Ferry" title="M/F Smyril · Tórshavn → Krambatangi" subtitle="⚠ BOOK THIS FERRY · Route 7 · last sailing of the day" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-4">
            <InfoRow label="Vessel" value={FERRY_BOARD.vessel} />
            <InfoRow label="Type" value={FERRY_BOARD.vesselType} />
            <InfoRow label="Route" value={FERRY_BOARD.route} />
            <InfoRow label="Crossing time" value={FERRY_BOARD.crossingTime} mono />
            <InfoRow label="From" value={FERRY_BOARD.fromTerminal} />
            <InfoRow label="To" value={FERRY_BOARD.toTerminal} />
          </div>

          <p className="label mb-2">Monday 27 July · Tórshavn → Krambatangi sailings</p>
          <div className="mb-4">
            <LiveBoard
              title="Sailings"
              sourceUrl="https://booking.ssl.fo"
              sourceLabel="SSL live timetable"
              columns={[
                { key: "dep", label: "Depart", mono: true, narrow: true },
                { key: "arr", label: "Arrive", mono: true, narrow: true },
                { key: "note", label: "Notes" },
              ]}
              highlightKey="dep"
              highlightValue="21:15"
              fallbackRows={FERRY_BOARD.departures as unknown as LiveRow[]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-3">
            <InfoRow label="Onboard" value={FERRY_BOARD.onboardFacilities} />
            <InfoRow label="Weather" value={FERRY_BOARD.weatherSensitivity} />
          </div>
          <div className="harbour-notice mb-2">
            <p className="text-[13px] font-medium">{FERRY_BOARD.bookingReminder}</p>
            <a href={FERRY_BOARD.bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-1.5 code text-[12px] underline underline-offset-4 decoration-rust/40">
              booking.ssl.fo → book M/F Smyril ↗
            </a>
          </div>
          <div className="border border-basalt/15 p-4 mb-6">
            <p className="label mb-1">Contingency</p>
            <p className="text-[13px]">{FERRY_BOARD.contingency}</p>
          </div>

          {/* ——— 9. Getting to the AirBnB ——— */}
          <SectionHeader label="09 · Final leg" title="Krambatangi → Øravík AirBnB" subtitle="Arriving ~23:20 · it will still be twilight" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-4">
            <InfoRow label="From" value={TO_AIRBNB.from} />
            <InfoRow label="To" value={TO_AIRBNB.to} />
            <InfoRow label="Distance" value={TO_AIRBNB.distance} mono />
          </div>
          <div className="mb-4 space-y-3">
            {TO_AIRBNB.options.map((opt, i) => (
              <div key={i} className={`border p-3 ${opt.status === "preferred" ? "border-moss/30 bg-moss/5" : opt.status === "fallback" ? "border-basalt/15" : "border-basalt/10 opacity-70"}`}>
                <div className="flex items-baseline gap-2">
                  <p className="font-medium text-[14px] text-basalt">{opt.method}</p>
                  {opt.status === "preferred" && <Badge tone="ok">Preferred</Badge>}
                  {opt.status === "fallback" && <Badge tone="warn">Fallback</Badge>}
                  {opt.status === "not-recommended" && <Badge>Not recommended</Badge>}
                </div>
                <p className="caption mt-1">{opt.detail}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-6">
            <InfoRow label="AirBnB" value={TO_AIRBNB.airbnbAddress} mono />
            <InfoRow label="Check-in" value={TO_AIRBNB.airbnbCheckIn} />
            <InfoRow label="Nearest shop" value={TO_AIRBNB.nearestShop} />
            <InfoRow label="Note" value={TO_AIRBNB.arrivalNote} warn />
          </div>

          {/* ——— 10. Could Disrupt ——— */}
          <SectionHeader label="10 · Risks" title="What could disrupt the day" />
          <ul className="space-y-3 mb-6">
            <li className="flex items-start gap-2 text-[14px]">
              <span className="text-rust font-bold mt-px">!</span>
              <span><strong>Faroese fog.</strong> RC 415 may be held or diverted if Vágar visibility drops below RNP minima. Watch the yr.no Vágar forecast the morning of the flight.</span>
            </li>
            <li className="flex items-start gap-2 text-[14px]">
              <span className="text-rust font-bold mt-px">!</span>
              <span><strong>ScotRail delays.</strong> If the 11:59 is cancelled, the 12:59 or 13:59 still leave plenty of time. 30 min buffer at Haymarket for the tram.</span>
            </li>
            <li className="flex items-start gap-2 text-[14px]">
              <span className="text-rust font-bold mt-px">!</span>
              <span><strong>The 21:15 is the last boat.</strong> If the flight is delayed by more than 2.5 hours, we miss it. Have a Tórshavn hotel name saved offline as fallback.</span>
            </li>
          </ul>

          {/* ——— Day navigation ——— */}
          <div className="flex items-center justify-between border-t border-basalt/15 pt-5 mt-8">
            <span />
            <a
              href="/day/2"
              className="code text-[13px] underline underline-offset-4 decoration-basalt/30 hover:text-rust transition-colors"
            >
              Day 2 · The cliffs of Suðuroy →
            </a>
          </div>
        </div>

        {/* ================================================================
            SIDEBAR — map + quick info
            ================================================================ */}
        <aside className="space-y-4">
          {/* Live widgets */}
          <LiveClock />
          <WeatherWidget />

          <div className="space-y-6">

            {/* Quick facts */}
            <div className="border border-basalt/15 p-4">
              <p className="label mb-3">Day 1 at a glance</p>
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.1em] text-fjord/60">Depart home</p>
                  <p className="code text-fjord tnum text-[14px]">~13:00</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.1em] text-fjord/60">Flight</p>
                  <p className="code text-fjord tnum text-[14px]">EDI 17:10 → FAE 18:35</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.1em] text-fjord/60">Bus</p>
                  <p className="code text-fjord tnum text-[14px]">Vágar → Tórshavn 19:00–19:45</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.1em] text-fjord/60">Ferry</p>
                  <p className="code text-rust tnum text-[14px] font-medium">Tórshavn 21:15 → Krambatangi 23:20</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.1em] text-fjord/60">Arrive AirBnB</p>
                  <p className="code text-fjord tnum text-[14px]">~23:30 · Øravík</p>
                </div>
                <div className="pt-2 border-t border-basalt/10">
                  <p className="text-[11px] uppercase tracking-[0.1em] text-fjord/60">Total travel time</p>
                  <p className="code text-basalt tnum text-[14px] font-medium">~10.5 hours door-to-door</p>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="border border-basalt/15 p-4">
              <p className="label mb-3">For Day 1</p>
              <ul className="space-y-2 text-[13px]">
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="accent-rust" id="d1-train" checked={!!checks["d1-train"]} onChange={() => toggleCheck("d1-train")} />
                  <label htmlFor="d1-train" className="cursor-pointer">Book train tickets (ScotRail app)</label>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="accent-rust" id="d1-ferry" checked={!!checks["d1-ferry"]} onChange={() => toggleCheck("d1-ferry")} />
                  <label htmlFor="d1-ferry" className="cursor-pointer">Book M/F Smyril · 21:15 sailing</label>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="accent-rust" id="d1-taxi" checked={!!checks["d1-taxi"]} onChange={() => toggleCheck("d1-taxi")} />
                  <label htmlFor="d1-taxi" className="cursor-pointer">Pre-book taxi (or confirm Bus 300)</label>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="accent-rust" id="d1-offline" checked={!!checks["d1-offline"]} onChange={() => toggleCheck("d1-offline")} />
                  <label htmlFor="d1-offline" className="cursor-pointer">Save AirBnB lockbox code offline</label>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="accent-rust" id="d1-hotel" checked={!!checks["d1-hotel"]} onChange={() => toggleCheck("d1-hotel")} />
                  <label htmlFor="d1-hotel" className="cursor-pointer">Save Tórshavn hotel name (fallback)</label>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="accent-rust" id="d1-boarding" checked={!!checks["d1-boarding"]} onChange={() => toggleCheck("d1-boarding")} />
                  <label htmlFor="d1-boarding" className="cursor-pointer">Download boarding passes</label>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
