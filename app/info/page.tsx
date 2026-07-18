// /info — the reference page. Booking codes, phone numbers, ferry links,
// weather, embassies, places the editor of the trip might need at a glance.
// Narrow reading column with thin rules. No decoration.

import { BOOKINGS, TRIP } from "@/lib/data/itinerary";

export default function InfoPage() {
  return (
    <article className="relative mx-auto px-6 sm:px-10 pt-24 pb-24 sm:pt-28 sm:pb-32" style={{ maxWidth: "min(40rem, 100%)" }}>
      <header className="mb-12">
        <p className="font-serif italic text-[13px] text-bone mb-3">
          Reference · small print
        </p>
        <h1 className="headline text-[clamp(2.4rem,5.2vw,3.4rem)] leading-[1.04] tracking-tight max-w-[18ch]">
          <span className="italic font-normal">Small</span> print.
        </h1>
        <p className="prose-trip mt-6 max-w-[40rem]">
          Booking codes and phone numbers that need to be in pocket-form.
          Bookmarkable. Offline-friendly.
        </p>
      </header>

      <dl className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-x-8 gap-y-0 border-t border-stone">
        <Row term="Booking · airbnb">
          {BOOKINGS.airbnb.label} · {BOOKINGS.airbnb.address}
          <br />£{BOOKINGS.airbnb.pricePerTwo} · {BOOKINGS.airbnb.nights} nights
          <br /><span className="code">{BOOKINGS.airbnb.listing}</span>
        </Row>
        <Row term="Booking · Hugo">
          {BOOKINGS.hugo.label} · {BOOKINGS.hugo.address}
          <br />Confirm&nbsp;<span className="code">{BOOKINGS.hugo.confirmation}</span> · Door&nbsp;<span className="code">{BOOKINGS.hugo.pin}</span>
          <br />Phone <span className="code">{BOOKINGS.hugo.phone}</span>
        </Row>
        <Row term="Outbound · RC 415">
          {BOOKINGS.flights.outbound.carrier}
          <br /><span className="tnum">{BOOKINGS.flights.outbound.dep}</span> → <span className="tnum">{BOOKINGS.flights.outbound.arr}</span>
          <br />{BOOKINGS.flights.outbound.date}
        </Row>
        <Row term="Return · RC 416">
          {BOOKINGS.flights.return.carrier}
          <br /><span className="tnum">{BOOKINGS.flights.return.dep}</span> → <span className="tnum">{BOOKINGS.flights.return.arr}</span>
          <br />{BOOKINGS.flights.return.date}
        </Row>
        <Row term="Connection · RK 330">
          {BOOKINGS.flights.onward.carrier}
          <br /><span className="tnum">{BOOKINGS.flights.onward.dep}</span> → <span className="tnum">{BOOKINGS.flights.onward.arr}</span>
          <br />{BOOKINGS.flights.onward.date}
        </Row>
        <Row term="Ferry · Smyril">
          Strandfaraskip Landsins · Route 7 (Tórshavn — Krambatangi)
          <br /><span className="code">ssl.fo</span> · office +298 313333
        </Row>
        <Row term="Coach · Nat Exp">
          National Express · Gatwick → Stansted
          <br /><span className="code">nationalexpress.com</span> · typical 2 h 15 m
        </Row>
        <Row term="Atlas · base">
          Øravík, Suðuroy
          <br /><span className="tnum">{TRIP.iso.start}</span> → <span className="tnum">{TRIP.iso.end}</span>
        </Row>
      </dl>

      <p className="prose-trip mt-12 max-w-[40rem] italic text-bone">
        If a number stops working in the rain and the eSim drops, walk to the
        museum and ask. Strandfaraskip Landsins&apos;s office is handier than any
        booking confirmation.
      </p>
    </article>
  );
}

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="contents">
      <dt className="font-serif italic text-[14.5px] text-bone py-4 border-b border-stone">
        {term}
      </dt>
      <dd className="prose-trip py-4 border-b border-stone">
        {children}
      </dd>
    </div>
  );
}
