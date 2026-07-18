// /places — a field-guide view of Suðuroy + Vágar. Each place is a hand-
// stamped X glyph with a small photo + a typed caption, plus a Caveat note
// pinned to the side. The page reads as a printed guidebook's "places" page.

import { PLACES } from "@/lib/data/itinerary";

export default function PlacesPage() {
  return (
    <article className="relative mx-auto px-6 sm:px-10 pt-24 pb-24 sm:pt-28 sm:pb-32" style={{ maxWidth: "min(76rem, 100%)" }}>
      <header className="mb-16 sm:mb-20">
        <p className="font-serif italic text-[13px] text-bone mb-3">
          Field guide · the places on the trip
        </p>
        <h1 className="headline text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.02] tracking-tight max-w-[20ch]">
          <span className="italic font-normal">Walking</span>, driving, <br />
          sailing. <br />
          <span className="italic font-normal">In that order.</span>
        </h1>
        <p className="prose-trip mt-6 max-w-[40rem]">
          A printed field guide: each place is a hand-stamped X on a small
          photograph, with a typed caption and a Caveat marginal note pinned
          to the side. Suðuroy is the south island; Sørvágur is the airport
          village. The ferry is the spine of both.
        </p>
      </header>

      <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
        {PLACES.map((place, i) => (
          <li key={place.id} className={`relative ${i === 0 ? "md:col-span-2" : ""}`}>
            {/* Hand-stamped X glyph pinned to the upper-left of each frame. */}
            <svg
              className="absolute -top-2 -left-2 z-10"
              width="34" height="34"
              viewBox="0 0 34 34"
              aria-hidden
              style={{ transform: `rotate(${-10 + ((i * 7) % 18) - 9}deg)` }}
            >
              <line x1="6" y1="6" x2="28" y2="28" stroke="#1B1F22" strokeWidth="2.4" />
              <line x1="6" y1="28" x2="28" y2="6" stroke="#1B1F22" strokeWidth="2.4" />
              <circle cx="17" cy="17" r="3" fill="#FBF8F1" />
            </svg>

            <figure className={`relative overflow-hidden ${i === 0 ? "h-[44vh] min-h-[280px]" : "h-[40vh] min-h-[220px]"}`}>
              <img
                src={`/images/faroes/${place.photo}.jpg`}
                alt={place.alt}
                className="object-cover object-center w-full h-full photo-tone"
                loading="lazy"
                decoding="async"
              />
            </figure>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-x-6">
              <p className="font-serif italic text-[13px] text-bone sm:pt-1">
                Folio {i === 0 ? "I" : i === 1 ? "II" : i === 2 ? "III" : i === 3 ? "IV" : "V"} · {place.island}
              </p>
              <div>
                <h2 className="font-serif italic text-[1.7rem] leading-tight text-ink">
                  {place.name}
                </h2>
                <p className="caption mt-2 max-w-[40rem]">{place.caption}</p>
                <p className="prose-trip mt-4 text-[15.5px] leading-[1.7] max-w-[40rem]">
                  {place.detail}
                </p>
                {place.handwritten ? (
                  <p
                    className="script script--atlantic text-[1.45rem] rotate-[-2deg] mt-5 max-w-[26ch]"
                    aria-hidden
                  >
                    {place.handwritten}
                  </p>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <p className="prose-trip mt-16 max-w-[40rem] italic text-bone">
        All photographs are stored locally under <span className="code">/public/images/faroes/</span>. Faroe Islands only — no Iceland, no Scotland, no AI landscapes.
      </p>
    </article>
  );
}
