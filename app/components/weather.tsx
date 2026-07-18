"use client";

import { useEffect, useState } from "react";

// Weather codes → emoji
const symbolEmoji: Record<string, string> = {
  clearsky_day: "☀️",
  clearsky_night: "🌙",
  fair_day: "🌤️",
  fair_night: "🌤️",
  partlycloudy_day: "⛅",
  partlycloudy_night: "⛅",
  cloudy: "☁️",
  rainshowers_day: "🌦️",
  rainshowers_night: "🌦️",
  rain: "🌧️",
  lightrain: "🌦️",
  heavyrain: "⛈️",
  heavyrainshowers_day: "⛈️",
  heavyrainshowers_night: "⛈️",
  sleet: "🌨️",
  snow: "❄️",
  snowshowers_day: "🌨️",
  snowshowers_night: "🌨️",
  fog: "🌫️",
  lightsleet: "🌨️",
};

function weatherEmoji(code: string | null): string {
  if (!code) return "🌤️";
  // Normalise night codes to day for emoji
  const day = code.replace("_night", "_day").replace("polartwilight", "day");
  return symbolEmoji[day] ?? symbolEmoji[code] ?? "🌤️";
}

const LOCATIONS = [
  { name: "Tórshavn", lat: 62.0097, lon: -6.7716 },
  { name: "Øravík", lat: 61.5333, lon: -6.8 },
];

interface WeatherPoint {
  time: string;
  temperature: number | null;
  wind_speed: number | null;
  wind_direction: number | null;
  humidity: number | null;
  precipitation: number;
  symbol: string | null;
}

interface LocationWeather {
  name: string;
  data: WeatherPoint[] | null;
  error: string | null;
  loading: boolean;
}

function formatDay(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (isToday) return "Today";
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow =
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear();
  if (isTomorrow) return "Tomorrow";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

function windDirection(deg: number | null): string {
  if (deg === null) return "—";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export default function WeatherWidget() {
  const [locations, setLocations] = useState<LocationWeather[]>(
    LOCATIONS.map((l) => ({ name: l.name, data: null, error: null, loading: true }))
  );

  useEffect(() => {
    LOCATIONS.forEach((loc, i) => {
      fetch(`/api/weather?lat=${loc.lat}&lon=${loc.lon}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.error) throw new Error(json.error);
          setLocations((prev) =>
            prev.map((l, j) =>
              j === i ? { ...l, data: json.timeseries, loading: false } : l
            )
          );
        })
        .catch((err) => {
          setLocations((prev) =>
            prev.map((l, j) =>
              j === i ? { ...l, error: err.message, loading: false } : l
            )
          );
        });
    });
  }, []);

  // Group timeseries into days
  const groupByDay = (points: WeatherPoint[]) => {
    const days: { label: string; points: WeatherPoint[] }[] = [];
    let current: { label: string; points: WeatherPoint[] } | null = null;
    for (const p of points) {
      const label = formatDay(p.time);
      if (!current || current.label !== label) {
        current = { label, points: [] };
        days.push(current);
      }
      current.points.push(p);
    }
    return days;
  };

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 border-t border-white/[0.06]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-fog/60">
            Live Weather
          </h2>
          <p className="text-xs text-fog/40 mt-1">
            via yr.no · updated hourly
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {locations.map((loc) => (
          <div
            key={loc.name}
            className="rounded-2xl border border-white/[0.06] bg-storm/30 p-6"
          >
            <h3 className="text-lg font-semibold text-cream mb-4">
              📍 {loc.name}
            </h3>

            {loc.loading && (
              <div className="flex items-center gap-3 text-sm text-fog/50">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-fog/20 border-t-fog/60" />
                Loading forecast…
              </div>
            )}

            {loc.error && (
              <div className="rounded-xl border border-rust/20 bg-rust/[0.04] p-4 text-sm text-fog">
                <span className="font-semibold text-cream">⚠️</span> Could not
                load weather: {loc.error}
              </div>
            )}

            {loc.data && loc.data.length > 0 && (
              <div>
                {/* Current */}
                {(() => {
                  const now = loc.data[0];
                  return (
                    <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-4xl">
                        {weatherEmoji(now.symbol)}
                      </span>
                      <div>
                        <span className="text-3xl font-bold text-cream">
                          {now.temperature !== null
                            ? `${Math.round(now.temperature)}°C`
                            : "—"}
                        </span>
                        <p className="text-xs text-fog/60 mt-0.5">
                          Wind:{" "}
                          {now.wind_speed !== null
                            ? `${Math.round(now.wind_speed)} m/s ${windDirection(now.wind_direction)}`
                            : "—"}
                          {now.humidity !== null &&
                            ` · Humidity: ${Math.round(now.humidity)}%`}
                        </p>
                        {now.precipitation > 0 && (
                          <p className="text-xs text-sea/70 mt-0.5">
                            Rain: {now.precipitation} mm next hour
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Day-by-day forecast */}
                <div className="space-y-3">
                  {groupByDay(loc.data.slice(1)).map((day) => {
                    const temps = day.points
                      .map((p) => p.temperature)
                      .filter((t): t is number => t !== null);
                    const sym = day.points[Math.floor(day.points.length / 2)]?.symbol;
                    const maxPrecip = Math.max(
                      ...day.points.map((p) => p.precipitation ?? 0)
                    );

                    return (
                      <div
                        key={day.label}
                        className="flex items-center justify-between gap-2 text-sm"
                      >
                        <span className="text-fog/60 w-20 shrink-0">
                          {day.label}
                        </span>
                        <span className="text-xl">{weatherEmoji(sym)}</span>
                        <span className="text-cream font-medium w-16 text-right">
                          {temps.length > 0
                            ? `${Math.round(Math.min(...temps))}–${Math.round(Math.max(...temps))}°`
                            : "—"}
                        </span>
                        <span className="text-xs text-fog/40 w-16 text-right">
                          {maxPrecip > 0 ? `${maxPrecip}mm` : "dry"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
