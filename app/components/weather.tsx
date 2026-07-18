"use client";

// Live weather re-wire — called directly from the browser because the static
// export dropped the original /api/weather route. Hits Open-Meteo (keyless,
// CORS-friendly). The widget renders five days at a time for two locations
// (Edinburgh on the way out, Øravík during the trip).

import { useEffect, useState } from "react";

const LOCATIONS = [
  { name: "Edinburgh", lat: 55.9533, lon: -3.1883, label: "the way out" },
  { name: "Øravík",    lat: 61.5333, lon: -6.8000, label: "the base"    },
];

interface DayForecast {
  date: string;
  weatherCode: number;
  tempMin: number;
  tempMax: number;
  precipMm: number;
  windMax: number;
}

const WEATHER_LABELS: Record<number, string> = {
  0: "Clear", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Rime fog",
  51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain",
  71: "Light snow", 73: "Snow", 75: "Heavy snow",
  77: "Snow grains",
  80: "Light showers", 81: "Showers", 82: "Heavy showers",
  85: "Snow showers", 86: "Heavy snow showers",
  95: "Thunderstorm", 96: "Thunder + hail", 99: "Thunder + heavy hail",
};

function weatherLabel(code: number): string {
  return WEATHER_LABELS[code] ?? "—";
}

async function loadForecast(lat: number, lon: number, days: number): Promise<DayForecast[]> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=${days}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo returned ${res.status}`);
  const data = await res.json();
  const dates: string[] = data.daily.time;
  const codes: number[] = data.daily.weather_code;
  const tmax: number[] = data.daily.temperature_2m_max;
  const tmin: number[] = data.daily.temperature_2m_min;
  const precip: number[] = data.daily.precipitation_sum;
  const wind: number[] = data.daily.wind_speed_10m_max;
  return dates.map((d, i) => ({
    date: d,
    weatherCode: codes[i] ?? 0,
    tempMin: tmin[i] ?? 0,
    tempMax: tmax[i] ?? 0,
    precipMm: precip[i] ?? 0,
    windMax: wind[i] ?? 0,
  }));
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const m = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()] ?? "—";
  return `${m} ${d.getDate()}\n${d.toLocaleDateString("en-GB", { month: "short" })}`;
}

type WeatherState =
  | { kind: "loading" }
  | { kind: "ok"; rows: Array<{ name: string; label: string; days: DayForecast[] }> }
  | { kind: "error"; message: string };

export default function WeatherWidget() {
  const [state, setState] = useState<WeatherState>({ kind: "loading" });

  useEffect(() => {
    // The initial state is already "loading" — set it inside the effect would
    // be a synchronous, redundant re-render. We go straight from "loading"
    // to either "ok" or "error" below.
    let alive = true;
    Promise.all(
      LOCATIONS.map(async (l) => {
        return { name: l.name, label: l.label, days: await loadForecast(l.lat, l.lon, 5) };
      }),
    )
      .then((rows) => { if (alive) setState({ kind: "ok", rows }); })
      .catch((err) => { if (alive) setState({ kind: "error", message: err.message }); });
    return () => { alive = false; };
  }, []);

  return (
    <section className="mx-auto max-w-[68rem] px-6 sm:px-8 py-20 sm:py-28">
      <header className="grid grid-cols-1 md:grid-cols-[12rem_1fr] gap-x-12 mb-10">
        <p className="caption md:pt-2">A weather insert · live</p>
        <div>
          <h2 className="headline text-[clamp(2rem,4.4vw,2.6rem)] leading-[1.05] tracking-tight max-w-[26ch]">
            <span className="italic font-normal">Five</span> days, two&nbsp;spots.
          </h2>
          <p className="prose-trip mt-6 max-w-[34rem]">
            Live forecast pulled from Open-Meteo. Edinburgh on the way out, Øravík during the trip. Faroese weather is small in detail and wide in range; this is the rough weather window, not a tactical plan.
          </p>
        </div>
      </header>

      <hr className="rule mb-10" />

      {state.kind === "loading" ? (
        <p className="caption max-w-[34rem]">Fetching…</p>
      ) : null}

      {state.kind === "error" ? (
        <p className="caption max-w-[34rem] text-timetable">
          Unable to load forecast right now. {state.message}
        </p>
      ) : null}

      {state.kind === "ok" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          {state.rows.map((row) => (
            <div key={row.name}>
              <header className="mb-4 flex items-baseline justify-between">
                <div>
                  <p className="font-serif italic text-[1.6rem] text-ink leading-snug">{row.name}</p>
                  <p className="caption mt-1">{row.label}</p>
                </div>
                <p className="caption">via Open-Meteo</p>
              </header>
              <ol className="border-t border-b border-stone divide-y divide-stone">
                {row.days.map((d, i) => (
                  <li key={d.date + i} className="grid grid-cols-[5rem_2.5rem_1fr_1fr] gap-x-2 py-3 items-baseline">
                    <span className="caption tnum">{
                      d.date === "2026-07-28" ? "Depart"
                      : d.date === "2026-07-30" ? "Match"
                      : d.date === "2026-08-01" ? "Return"
                      : formatDate(d.date).replace("\n", " ")
                    }</span>
                    <span className="caption text-bone">{weatherLabel(d.weatherCode)}</span>
                    <span className="font-serif italic text-[1.025rem] tnum text-ink">
                      {Math.round(d.tempMin)}–{Math.round(d.tempMax)}°C
                    </span>
                    <span className="caption tnum text-bone">
                      {Math.round(d.windMax)} m/s · {d.precipMm.toFixed(1)}mm
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
