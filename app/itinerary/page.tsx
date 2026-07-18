// /itinerary — the days as a single printed table-of-contents.
// Each row is a folio (I — V) with the day number in italic, the date in
// tabular mono, the chapter in italic Newsreader, the location, and a hand-
// drawn X glyph instead of a card thumbnail. The page reads as a printed
// contents page of a travel guide, not as a CMS post list.

import Link from "next/link";
import { DAYS } from "@/lib/data/itinerary";

const FOLIO = ["I", "II", "III", "IV", "V"] as const;

export default function ItineraryPage() {
  return (
    <article className="relative mx-auto px-6 sm:px-10 pt-24 pb-24 sm:pt-28 sm:pb-32" style={{ maxWidth: "min(72rem, 100%)" }}>
      <header className="mb-16 sm:mb-20">
        <p className="font-serif italic text-[13px] text-bone mb-3">
          Chapter index · the days in order
        </p>
        <h1 className="headline text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.02] tracking-tight max-w-[20ch]">
          <span className="italic font-normal">Six</span> days, <br />
          nine stops.
        </h1>
        <p className="prose-trip mt-6 max-w-[40rem]">
          The full trip, indexed. Each folio below opens onto a chapter on the
          home page. The match is its own page. The packing is its own page.
          This index is the printed contents.
        </p>
      </header>

      <ol className="border-t border-stone">
        {DAYS.map((day, i) => (
          <li key={day.num} className="border-b border-stone py-10 sm:py-12">
            <Link
              href={`/#day-${day.num}`}
              className="grid grid-cols-[auto_1fr] sm:grid-cols-[6rem_8rem_1fr] gap-x-5 sm:gap-x-10 gap-y-4 sm:gap-y-0 items-baseline group"
            >
              {/* Folio roman numeral + day number. */}
              <span className="font-serif italic text-[13px] text-bone">Folio {FOLIO[i]}</span>
              <span className="font-serif italic text-[13px] text-bone">{day.weekday} · <span className="tnum">{day.date}</span></span>
              <div>
                <h2 className="font-serif text-[clamp(1.7rem,3.4vw,2.4rem)] italic leading-[1.04] tracking-tight text-ink group-hover:text-atlantic">
                  {day.chapter}.
                </h2>
                <p className="font-serif italic text-[15.5px] text-atlantic mt-2 max-w-[34rem]">
                  {day.location}
                </p>
                <p className="caption mt-3 max-w-[40rem]">{day.narrative}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>

      <p className="prose-trip mt-16 max-w-[40rem] italic text-bone">
        More days than my research budget allows. The matching six days are
        indexed above; the Suðuroy stretch is chapters two, three and four.
      </p>
    </article>
  );
}
