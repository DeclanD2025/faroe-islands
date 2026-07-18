import { NextResponse } from "next/server";

const YR_BASE = "https://api.met.no/weatherapi/locationforecast/2.0/compact";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Missing lat or lon query parameter" },
      { status: 400 }
    );
  }

  try {
    const url = `${YR_BASE}?lat=${lat}&lon=${lon}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "faroe-trip-planner/1.0 (https://github.com/declan/faroe-islands)",
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `yr.no returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Simplify the response — extract current + next 36 hours
    const timeseries = data.properties.timeseries
      .slice(0, 37)
      .map((entry: { time: string; data: { instant?: { details?: Record<string, number> }; next_1_hours?: { details?: { precipitation_amount?: number }; summary?: { symbol_code?: string } }; next_6_hours?: { details?: { precipitation_amount?: number }; summary?: { symbol_code?: string } }; next_12_hours?: { details?: { precipitation_amount?: number }; summary?: { symbol_code?: string } } } }) => {
        const instant = entry.data.instant?.details ?? {};
        const next =
          entry.data.next_1_hours ?? entry.data.next_6_hours ?? entry.data.next_12_hours;

        return {
          time: entry.time,
          temperature: instant.air_temperature ?? null,
          wind_speed: instant.wind_speed ?? null,
          wind_direction: instant.wind_from_direction ?? null,
          humidity: instant.relative_humidity ?? null,
          precipitation: next?.details?.precipitation_amount ?? 0,
          symbol: next?.summary?.symbol_code ?? null,
        };
      });

    return NextResponse.json(
      { timeseries, updated: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 502 }
    );
  }
}
