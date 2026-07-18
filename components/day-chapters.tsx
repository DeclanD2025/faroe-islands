// Five bespoke day chapters. The brief was explicit: do NOT make six
// identical cards; break the rhythm. So each day's container is structurally
// different. There is NO DayCard wrapper. Sharing happens via the data object
// in lib/data/itinerary.ts, not via a shared JSX component.
//
//   Day 01 — poem-narrow single column with drop-cap. Photo bleeds the
//            top of the section off the page.
//   Day 02 — newspaper-multi-column. Photo + sketch sit beside the chapter.
//   Day 03 — defers to <MatchDayClimax /> for the climax; itself is just
//            a heading + photo + disrupt note.
//   Day 04 — split-rhythm two-column with a strong photo band separating
//            morning and evening.
//   Day 05 — travel-note style: photo on left, prose on right, drop-cap on
//            the closing paragraph.
//
// Each chapter pulls from DAYS by num.

import Link from "next/link";
import { DAYS, type DayPlan, type DayStage } from "@/lib/data/itinerary";
import { SuduroyMapMotif } from "./motifs/cliff-band";
import { MatchDayClimax } from "./match-day-climax";

function getDay(num: string): DayPlan {
  const day = DAYS.find((d) => d.num === num);
  if (!day) throw new Error(`No day ${num} in DAYS`);
  return day;
}

function StageRow({ s }: { s: DayStage }) {
  if (s.kind === "anchor") {
    return (
      <li className="grid grid-cols-[5.5rem_1fr] gap-x-4 py-3 border-t border-stone first:border-t-0">
        <span className="code text-[13px] tracking-[0.06em] text-bone">{s.time}</span>
        <div>
          <p className="font-serif text-[1.1rem] leading-snug text-ink">{s.title}</p>
          <p className="caption mt-1.5 max-w-[34rem]">{s.detail}</p>
        </div>
      </li>
    );
  }
  const verb = s.kind === "flight" ? "Fly" : s.kind === "ferry" ? "Ferry" : "Bus";
  return (
    <li className="grid grid-cols-[5.5rem_1fr] gap-x-4 py-3 border-t border-stone first:border-t-0">
      <span className="code text-[13px] tracking-[0.06em] text-bone">{s.dep.split(" ")[0]}</span>
      <div>
        <p className="font-serif text-[1.1rem] leading-snug text-ink">
          <span className="italic">{verb}</span>{" "}
          <span>{s.dep.replace(/^\d+:\d+\s/, "")}</span>
          <span className="text-bone"> → {s.arr.replace(/^\d+:\d+\s/, "")}</span>
        </p>
        <p className="caption mt-1.5 max-w-[36rem]">
          <span className="code">{s.ref}</span>
          {s.note ? <span className="ml-2 text-bone">{s.note}</span> : null}
        </p>
      </div>
    </li>
  );
}

function DisruptNote({ text }: { text: string }) {
  if (!text || text === "—") return null;
  return (
    <aside className="relative mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-x-8 max-w-[40rem]">
      <span className="font-serif italic text-[15.5px] text-bone">could disrupt</span>
      <p className="prose-trip max-w-[34rem]">
        <span aria-hidden className="script script--claret text-[1.45rem] rotate-[-2deg] mr-2 align-middle">!&nbsp; </span>
        {text}
      </p>
    </aside>
  );
}

// =============================================================================
// Day 01 — poem-narrow column with drop-cap. The image bleeds off the left
// edge of the page so the prose feels like a magazine spread.
// =============================================================================
export function DayArrival() {
  const day = getDay("01");
  return (
    <section id="day-01" className="relative pt-24 pb-24 sm:pt-32 sm:pb-32">
      {/* Full-bleed image. Sharp-edged by intent; crop left so the cliff
          falls off the page. */}
      <figure className="relative w-screen left-1/2 right-1/2 -mx-[50vw] mb-12 sm:mb-20">
        <div className="relative w-full h-[58vh] min-h-[340px] max-h-[640px] overflow-hidden">
          <img
            src="/images/faroes/funningur.jpg"
            alt="A sea-stacked cliff reaching into the Atlantic off the Faroe Islands."
            className="h-full w-full object-cover photo-tone object-[center_60%]"
            loading="lazy"
            decoding="async"
          />
          <figcaption
            className="absolute right-6 sm:right-10 top-6 sm:top-8 max-w-[24rem] text-right text-paper/85 font-serif italic text-[13px] sm:text-[14px]"
          >
            Funningur — the sea stacks at the end of the first ferry road.
          </figcaption>
        </div>
      </figure>

      <div className="mx-auto px-6 sm:px-10" style={{ maxWidth: "min(40rem, 100%)" }}>
        <header className="mb-10">
          <p className="font-serif italic text-[13px] text-bone mb-3">
            Folio I · Day one · arrival
          </p>
          <h3 className="headline text-[clamp(2.4rem,5.2vw,3.4rem)] leading-[1.04] tracking-tight max-w-[16ch]">
            <span className="italic font-normal">Onto</span> the ferry.
          </h3>
          <p className="font-serif italic text-[1.1rem] mt-3 text-atlantic">
            {day.location}
          </p>
          <p className="caption mt-3">{day.weekday} · {day.date}</p>
        </header>

        <p className="prose-trip dropcap text-[1.0625rem] leading-[1.7] max-w-[34rem]">
          {day.narrative}
        </p>

        <ul className="mt-12 max-w-[34rem]">
          {day.stages.map((s, i) => <StageRow key={i} s={s} />)}
        </ul>

        <DisruptNote text={day.couldDisrupt} />

        <p className="caption mt-12 max-w-[34rem]">
          Continue —&gt; <Link href="#day-02" className="italic text-atlantic underline decoration-stone underline-offset-4 hover:decoration-atlantic">Folio II: the south island</Link>.
        </p>
      </div>
    </section>
  );
}

// =============================================================================
// Day 02 — newspaper-multi with photo + sketch side. Wide reading column,
// CSS columns layout. The hand-drawn Suðuroy map sits beside it.
// =============================================================================
export function DayCliffs() {
  const day = getDay("02");
  return (
    <section id="day-02" className="bg-mist relative pt-24 pb-24 sm:pt-32 sm:pb-32">
      <div className="mx-auto px-6 sm:px-10" style={{ maxWidth: "min(76rem, 100%)" }}>
        <header className="mb-12 sm:mb-16">
          <p className="font-serif italic text-[13px] text-bone mb-3">
            Folio II · Day two · the south island
          </p>
          <div className="grid grid-cols-1 md:grid-cols-[5rem_1fr] gap-x-8 items-start">
            <span className="font-serif text-[3.4rem] sm:text-[4.4rem] italic leading-none text-ink -tracking-[0.02em]">
              02
            </span>
            <div>
              <h3 className="headline text-[clamp(2.4rem,5.2vw,3.4rem)] leading-[1.04] tracking-tight max-w-[18ch]">
                The <span className="italic font-normal">cliffs</span> of Suðuroy.
              </h3>
              <p className="font-serif italic text-[1.1rem] mt-3 text-atlantic">
                {day.location}
              </p>
              <p className="caption mt-3">{day.weekday} · {day.date}</p>
            </div>
          </div>
        </header>

        {/* The wide reading area: photo left, prose right (multi-column on
            desktop), sketch + marginalia pinned down. */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-10 md:gap-x-10">
          <figure className="md:col-span-5 relative h-[40vh] min-h-[280px] overflow-hidden">
            <img
              src="/images/faroes/beinisvor.jpg"
              alt="Beinisvørð, near-vertical basalt cliff at the south-west corner of Suðuroy."
              className="h-full w-full object-cover photo-tone"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="absolute left-5 bottom-4 max-w-[24rem] text-paper/85 font-serif italic text-[12.5px]">
              Beinisvørð — 469&nbsp;m of cliff above the South Atlantic.
            </figcaption>
          </figure>

          <div className="md:col-span-7">
            <div className="columns-1 sm:columns-2 gap-x-10 max-w-[44rem]">
              <p className="prose-trip dropcap text-[1.0625rem] leading-[1.7]">
                {day.narrative}
              </p>
            </div>

            <ul className="mt-10 max-w-[34rem]">
              {day.stages.map((s, i) => <StageRow key={i} s={s} />)}
            </ul>

            <DisruptNote text={day.couldDisrupt} />
          </div>
        </div>

        <aside className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-16 sm:mt-20 pt-10 border-t border-stone">
          <div>
            <p className="font-serif italic text-[13px] text-bone mb-4">
              Sketch · Beinisvørð to Hvannhagi
            </p>
            <SuduroyMapMotif />
          </div>
          <div>
            <p className="font-serif italic text-[13px] text-bone mb-4">
              Field note
            </p>
            <p
              className="script script--atlantic text-[1.6rem] rotate-[-2deg] max-w-[28ch]"
              aria-hidden
            >
              the orange posts &nbsp; are the path; the path &nbsp; is the point.
            </p>
            <p className="prose-trip mt-6 max-w-[36rem]">
              Suðuroy is the south island — longer than it is wide, no bridge,
              no tunnel. The cliffs and the ferry are the whole reason to be
              here. If the cloud is in by 14:00, swap Beinisvørð for the
              Hvannhagi ridge above the fjord.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

// =============================================================================
// Day 03 — match climax. A short heading chapter defers to the standalone
// full-bleed Claret section below.
// =============================================================================
export function DayMatch() {
  const day = getDay("03");
  return (
    <section id="day-03" className="bg-paper pt-0 pb-0">
      {/* A narrow panoramic Tórshavn-harbour strip severs the chapter from
          Day 02 like a printed page break in an expedition guidebook. */}
      <figure className="relative h-[28vh] min-h-[200px] max-h-[420px] overflow-hidden">
        <img
          src="/images/faroes/torshavn.jpg"
          alt="Tórshavn harbour, late evening, ferry at the pier — the day the match happens."
          className="h-full w-full object-cover photo-tone-deep object-[center_62%]"
          loading="lazy"
          decoding="async"
        />
        <figcaption className="absolute right-6 bottom-5 max-w-[26rem] text-right text-paper/85 font-serif italic text-[12.5px]">
          Tórshavn harbour on match eve — the walk to the ferry is on foot, in late-July light.
        </figcaption>
      </figure>

      <div className="mx-auto px-6 sm:px-10 max-w-[68rem] py-16 sm:py-20">
        <header className="mb-10">
          <p className="font-serif italic text-[13px] text-bone mb-3">
            Folio III · Day three · the match
          </p>
          <h3 className="headline text-[clamp(2.4rem,5.2vw,3.4rem)] leading-[1.04] tracking-tight max-w-[18ch]">
            <span className="italic font-normal">Motherwell</span> v HB.
          </h3>
          <p className="font-serif italic text-[1.1rem] mt-3 text-atlantic">
            {day.location}
          </p>
          <p className="caption mt-3">{day.weekday} · {day.date}</p>
        </header>
        <p className="prose-trip dropcap text-[1.0625rem] leading-[1.7] max-w-[36rem]">
          {day.narrative}
        </p>
        <DisruptNote text={day.couldDisrupt} />
      </div>

      <MatchDayClimax />
    </section>
  );
}

// =============================================================================
// Day 04 — split-rhythm two-column with a strong photo band separating
// morning and evening.
// =============================================================================
export function DayReposition() {
  const day = getDay("04");
  const morningStages = day.stages.slice(0, 1);
  const eveningStages = day.stages.slice(1);

  return (
    <section id="day-04" className="relative pt-24 pb-24 sm:pt-32 sm:pb-32">
      <div className="mx-auto px-6 sm:px-10" style={{ maxWidth: "min(74rem, 100%)" }}>
        <header className="mb-12 sm:mb-16 relative">
          <p className="font-serif italic text-[13px] text-bone mb-3">
            Folio IV · Day four · reposition north
          </p>
          {/* A giant italic day-number pinned to the right margin, rotated
              vertically — breaks the standard "left big number, right title"
              chapter-header skeleton that Day 02 / Day 05 also used. */}
          <span
            aria-hidden
            className="hidden md:block absolute right-0 top-2 font-serif italic text-[12rem] xl:text-[15rem] leading-none text-ink/[0.06] -tracking-[0.04em] select-none"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            04
          </span>
          <h3 className="headline text-[clamp(2.4rem,5.2vw,3.4rem)] leading-[1.04] tracking-tight max-w-[18ch] relative z-[1]">
            Walking then <span className="italic font-normal">back</span> across.
          </h3>
          <p className="font-serif italic text-[1.1rem] mt-3 text-atlantic relative z-[1]">
            {day.location}
          </p>
          <p className="caption mt-3 relative z-[1]">{day.weekday} · {day.date}</p>
        </header>

        {/* A wide photo band runs as a separator between the chapter header
            and the split columns. */}
        <figure className="relative mb-16 sm:mb-20 h-[34vh] min-h-[220px] max-h-[480px] overflow-hidden">
          <img
            src="/images/faroes/saksun.jpg"
            alt="Saksun — a small Faroese village tucked under the cliffs of Streymoy."
            className="h-full w-full object-cover photo-tone object-[center_55%]"
            loading="lazy"
            decoding="async"
          />
          <figcaption className="absolute right-6 top-5 max-w-[22rem] text-right text-paper/85 font-serif italic text-[12.5px]">
            Saksun — a side trip if the Friday ferry holds.
          </figcaption>
        </figure>

        <p className="prose-trip dropcap text-[1.0625rem] leading-[1.7] max-w-[36rem] -mt-2 mb-14">
          {day.narrative}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 border-t border-stone pt-12 relative">
          <Column
            title="Morning"
            sub="Last day on Suðuroy."
            stages={morningStages}
          />
          <Column
            title="Evening"
            sub="Cross, catch a bus, sleep in Sørvágur."
            stages={eveningStages}
          />

          {/* A Caveat handwritten note pinned in the gutter between the columns. */}
          <p
            className="absolute left-1/2 top-10 -translate-x-1/2 script script--atlantic text-[1.4rem] rotate-[-3deg] hidden md:block"
            arid-hidden
          >
            keep the 16:00 option open.
          </p>
        </div>

        <DisruptNote text={day.couldDisrupt} />
      </div>
    </section>
  );
}

// =============================================================================
// Day 05 — travel-note closing. Photo on left, prose on right, drop-cap on
// the closing paragraph. A handwritten marginal line closes the trip.
// =============================================================================
export function DayHomeward() {
  const day = getDay("05");

  return (
    <section id="day-05" className="relative pt-24 pb-24 sm:pt-32 sm:pb-32">
      <div className="mx-auto px-6 sm:px-10" style={{ maxWidth: "min(72rem, 100%)" }}>
        <header className="mb-10">
          <p className="font-serif italic text-[13px] text-bone mb-3">
            Folio V · Day five · homeward
          </p>
          <div className="grid grid-cols-1 md:grid-cols-[5rem_1fr] gap-x-8 items-start">
            <span className="font-serif text-[3.4rem] sm:text-[4.4rem] italic leading-none text-ink -tracking-[0.02em]">
              05
            </span>
            <div>
              <h3 className="headline text-[clamp(2.4rem,5.2vw,3.4rem)] leading-[1.04] tracking-tight max-w-[18ch]">
                Homeward, via <span className="italic font-normal">London</span>.
              </h3>
              <p className="font-serif italic text-[1.1rem] mt-3 text-atlantic">
                {day.location}
              </p>
              <p className="caption mt-3">{day.weekday} · {day.date}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-10">
          <figure className="md:col-span-7 relative h-[44vh] min-h-[280px] overflow-hidden">
            <img
              src="/images/faroes/sorvagur.jpg"
              alt="Sørvágur, the airport village on Vágar, with Mykines island in the distance."
              className="h-full w-full object-cover photo-tone"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="absolute left-5 bottom-4 max-w-[24rem] text-paper/85 font-serif italic text-[12.5px]">
              Sørvágur — the airport village, last night of the trip.
            </figcaption>
          </figure>

          <div className="md:col-span-5">
            <p className="prose-trip dropcap text-[1.0625rem] leading-[1.7] max-w-[34rem]">
              {day.narrative}
            </p>
            <ul className="mt-10 max-w-[34rem]">
              {day.stages.map((s, i) => <StageRow key={i} s={s} />)}
            </ul>

            <p
              className="script script--atlantic text-[1.6rem] rotate-[-2deg] mt-12 max-w-[20ch]"
              aria-hidden
            >
              arrive in Glasgow by 21:10.
            </p>

            <p className="caption mt-10 max-w-[34rem]">
              The Faroes will sit somewhere quieter than the trip just did.
              End.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Column({ title, sub, stages }: { title: string; sub: string; stages: DayStage[] }) {
  return (
    <div>
      <p className="font-serif italic text-[13px] text-bone mb-2">{title}</p>
      <h4 className="font-serif italic text-[1.5rem] text-ink leading-tight mb-6">{sub}</h4>
      <ul>
        {stages.map((s, i) => <StageRow key={i} s={s} />)}
      </ul>
    </div>
  );
}

export const DayChapter = { DayArrival, DayCliffs, DayMatch, DayReposition, DayHomeward };
