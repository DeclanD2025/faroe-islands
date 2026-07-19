// =============================================================================
// Day 1 operational data — every practical detail for Monday 27 July 2026.
// Hardcoded because it's a single trip date. All times are local unless stated.
// Train times: typical Monday ScotRail departures (confirm near the date).
// Ferry times: SSL Route 7 published timetable.
// Flight: Atlantic Airways RC 415 schedule.
// =============================================================================

// -----------------------------------------------------------------------------
// Home → Edinburgh Airport
// -----------------------------------------------------------------------------
export const HOME_TO_AIRPORT = {
  origin: "40 Liberty Road, Bellshill, ML4 2EX",
  nearestStation: "Bellshill",
  stationWalk: "6 min walk east on Liberty Rd → Main St",
  stationPostcode: "ML4 1DT",
  scotrailRoute: "Bellshill → Haymarket",
  scotrailOperator: "ScotRail",
  scotrailFrequency: "Roughly hourly on Mondays",
  scotrailTypicalJourneyTime: "~1 h 03 m to Haymarket",
  haymarketNote: "Disembark at Haymarket — the tram stop is directly outside the station.",
  tramRoute: "Edinburgh Trams · Haymarket → Airport",
  tramFrequency: "Every 7 min",
  tramJourneyTime: "~25 min",
  tramPayment: "Tap-on-tap-off contactless or ticket machine on platform.",
  totalTransitTime: "~1 h 40 m from Bellshill to EDI terminal",
} as const;

// -----------------------------------------------------------------------------
// ScotRail — typical Monday departures Bellshill → Haymarket
// (Confirm near the date at scotrail.co.uk)
// -----------------------------------------------------------------------------
export const SCOTRAIL_DEPARTURES = [
  { dep: "12:59", arr: "14:02", notes: "" },
  { dep: "13:59", arr: "15:02", notes: "✓ recommend — arrives EDI ~15:30 after tram" },
  { dep: "14:59", arr: "16:02", notes: "⚠ latest safe option — tight for 17:10 flight" },
  { dep: "15:59", arr: "17:02", notes: "✗ too late for 17:10 departure" },
] as const;

// -----------------------------------------------------------------------------
// Edinburgh Airport — departure board for EDI → FAE
// -----------------------------------------------------------------------------
export const EDI_DEPARTURE_BOARD = [
  { time: "17:10", flight: "RC 415", destination: "Vágar (FAE)", carrier: "Atlantic Airways", gate: "Gate 7–10 (intl)", status: "Scheduled" },
] as const;

// -----------------------------------------------------------------------------
// Edinburgh Airport — gate-area pubs & food
// -----------------------------------------------------------------------------
export const EDI_PUBS_FOOD = [
  { name: "All Bar One", type: "Bar + dining", note: "Sit-down meal, wine, cocktails. Closest to international gates.", walk: "Airside · near gates 7–10" },
  { name: "The Sir Walter Scott", type: "Wetherspoons pub", note: "Traditional pub food, affordable pints. Reliable pre-flight.", walk: "Airside · main departure lounge" },
  { name: "Flutes and Tails", type: "Champagne bar", note: "Seafood + bubbles if you're feeling it.", walk: "Airside · central" },
  { name: "Pret a Manger", type: "Coffee + sandwiches", note: "Quick grab-and-go. Hot wraps, filter coffee.", walk: "Airside · throughout" },
  { name: "Starbucks", type: "Coffee", note: "Standard airport coffee. Open late.", walk: "Airside · main concourse" },
] as const;

// -----------------------------------------------------------------------------
// The aircraft — Atlantic Airways RC 415
// -----------------------------------------------------------------------------
export const AIRCRAFT = {
  type: "Airbus A320neo (or A320-214)",
  registration: "OY-RC_ (varies by airframe)",
  airline: "Atlantic Airways",
  livery: "Blue + white · Faroese flag on tail",
  engines: "CFM LEAP-1A26 (neo) or CFM56 (ceo)",
  capacity: "174–178 passengers · single-class economy",
  cruiseAltitude: "35,000–39,000 ft",
  cruiseSpeed: "~830 km/h (Mach 0.78)",
  range: "~6,300 km (neo) — this route is 670 km",
  boardingMusic: "Faroese folk instrumental (sometimes)",
  seatPitch: "~30 in · standard economy",
  inflightService: "Buy-on-board · Faroese beer, snacks, duty-free catalogue",
} as const;

// -----------------------------------------------------------------------------
// The flight — RC 415 Edinburgh → Vágar
// -----------------------------------------------------------------------------
export const THE_FLIGHT = {
  flightNumber: "RC 415",
  callsign: "FAROELINE 415",
  route: "EDI → FAE",
  date: "Monday 27 July 2026",
  scheduledDeparture: "17:10 BST",
  scheduledArrival: "18:35 WEST (UTC+1)",
  duration: "1 h 25 m",
  distance: "~670 km",
  departureGate: "7–10 (international pier)",
  departureRunway: "06/24 · typically 24 for northbound departures",
  flightPath: "Depart EDI westbound → climb over Firth of Forth → turn north-west over the Highlands → cross the North Sea → descent over the Faroe plateau → approach into FAE runway 12/30",
  whatYouSee: [
    "The Forth bridges (rail + road) within 3 min of takeoff",
    "The Cairngorms on the right, if cloud permits",
    "The North Sea — 45 min of open water",
    "First sight of the Faroes: Mykines and Vágar appearing as dark shapes in the Atlantic",
    "A steep, curved approach between fjord walls — the pilot flies an RNP AR 0.1 precision path",
    "Tindholmur and Drangarnir sea-stacks visible on final approach",
  ],
  approachNote: "Atlantic Airways pilots are trained in RNP AR 0.1 — a GPS-guided precision approach that allows landing in cloud as low as 300 ft. The approach curves between mountains into the narrow Sørvágur fjord. It is one of the most technically demanding commercial approaches in Europe.",
} as const;

// -----------------------------------------------------------------------------
// Vágar Airport — arrival
// -----------------------------------------------------------------------------
export const VAGAR_ARRIVAL = {
  airportName: "Vágar Airport (FAE)",
  location: "Sørvágur, Vágar island",
  elevation: "85 m (279 ft)",
  runway: "1,799 m · asphalt · 12/30",
  terminal: "Single compact terminal. Walk from aircraft across tarmac into the building.",
  passportControl: "Non-Schengen queue. Passport stamp available on request.",
  dutyFree: "Arrivals duty-free shop — alcohol, Faroese wool, souvenirs. Open for incoming flights.",
  cafe: "Small café with runway views. Coffee, pastries, sandwiches. Card only.",
  wifi: "Free airport Wi-Fi · connect before heading to the bus.",
  outsideView: "Stepping out: cold Atlantic air, a wall of green mountain directly ahead, the Sørvágur fjord to the right. No city. No traffic. Just basalt, moss, and the smell of salt.",
  practicalNote: "There is no taxi rank. Pre-book a transfer or take Bus 300 from the stop directly outside the terminal.",
  busStopLocation: "50 m from the terminal exit, clearly signed. Bus 300 departs ~10 min after flight arrival.",
  simCard: "No SIM vendor at the airport — buy an eSIM before departure or use offline maps.",
} as const;

// -----------------------------------------------------------------------------
// Airport transfer — Bus 300 / taxi
// -----------------------------------------------------------------------------
export const AIRPORT_TRANSFER = {
  busRoute: "Bus 300 · Vágar Airport → Tórshavn",
  busDeparture: "~19:00 (timed to meet RC 415)",
  busArrival: "~19:45 at Tórshavn bus terminal",
  busDuration: "~45 min",
  busRoutePath: "Through Vágatunnilin (subsea tunnel) under Vestmannasund → Route 10 along Streymoy coast → into Tórshavn",
  busFare: "DKK 90 per person (~£10) · or 7-day SSL Travel Card",
  busOperator: "Strandfaraskip Landsins (SSL) · ssl.fo",
  taxiFallback: "Pre-book: +298 232323 (taxi) or +298 221212 (airport taxi)",
  taxiFare: "~DKK 800–1,200 (~£90–135)",
  taxiToFerryNote: "Ask driver for Farstøðin (Tórshavn ferry terminal), not the bus station.",
  reminder: "⚠ BOOK THE BUS TRANSFER OR TAXI BEFORE TRAVEL. Bus 300 does not require booking but confirm the summer timetable at ssl.fo. Taxi must be pre-booked.",
} as const;

// -----------------------------------------------------------------------------
// Ferry — Smyril Route 7 · Tórshavn → Krambatangi
// -----------------------------------------------------------------------------
export const FERRY_BOARD = {
  route: "Route 7 · M/F Smyril",
  vessel: "M/F Smyril",
  vesselType: "Ro-pax ferry · capacity 200 cars + 975 passengers",
  operator: "Strandfaraskip Landsins (SSL)",
  fromTerminal: "Farstøðin · Tórshavn",
  toTerminal: "Krambatangi · Suðuroy",
  crossingTime: "2 h 5 m",
  frequencyNote: "Three daily departures on Mondays. The 21:15 is the last sailing.",
  departures: [
    { dep: "08:45", arr: "10:50", note: "Morning · arrived too early for us" },
    { dep: "16:00", arr: "18:05", note: "Afternoon · we're still in the air at 16:00" },
    { dep: "21:15", arr: "23:20", note: "✓ OUR SAILING · last boat of the day" },
  ],
  ourSailing: "21:15 · Tórshavn → Krambatangi",
  arrivalNote: "Arrives Krambatangi 23:20. The pier is quiet, dark, and exposed. Bring a layer.",
  bookingUrl: "https://booking.ssl.fo",
  bookingReminder: "⚠ BOOK THIS FERRY. Foot-passenger gate closes 5 min before sailing. Queue at least 20 min before. Two foot passengers, no vehicle.",
  onboardFacilities: "Café (hot meals, beer, coffee) · indoor seating with fjord views · outdoor deck (cold but spectacular) · free Wi-Fi",
  weatherSensitivity: "Smyril sails in most conditions. Very rare cancellations for extreme swell only.",
  contingency: "If the 21:15 is cancelled (extremely unlikely), the next sailing is 08:45 Tuesday. We would need a Tórshavn hotel.",
} as const;

// -----------------------------------------------------------------------------
// Krambatangi → Øravík AirBnB
// -----------------------------------------------------------------------------
export const TO_AIRBNB = {
  from: "Krambatangi ferry terminal",
  to: "Við á 7, Øravík 827, Suðuroy",
  distance: "~2 km",
  options: [
    { method: "Bus 700", detail: "Two stops from Ferjuleðan (at the pier) to Øravík. ~8 min. DKK 20. Runs late on ferry arrival days — confirm with driver.", status: "preferred" },
    { method: "Taxi", detail: "Pre-book: +298 239550 (Suðuroy taxi). ~DKK 100–150 (£12–17). 5 min. Call from the ferry before docking.", status: "fallback" },
    { method: "Walk", detail: "2 km · ~25 min on Route 14. Footpath partial, road mostly. Dark at 23:20 — not recommended without torch.", status: "not-recommended" },
  ],
  airbnbAddress: "Við á 7, Øravík 827, Suðuroy",
  airbnbCheckIn: "Self check-in · host message has lockbox code. Save offline before departing UK.",
  airbnbContact: "Host contact in Airbnb app. Message before departure to confirm arrival time (~23:30).",
  nearestShop: "Tvøroyri (3–4 km north) · open until 22:00 on Mondays. Grab supplies before the ferry if possible.",
  arrivalNote: "You'll arrive around 23:30–midnight. It will still be twilight — sunrise is ~04:45, sunset ~22:15, so the sky never truly goes black. Bring the eye mask.",
} as const;
