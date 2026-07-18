// The home page — the main editorial scroll that pulls the trip together.
// Hero → before-we-leave strip → journey spine → five bespoke day chapters
// → match-day climax sits inside Day 03 → checklist section → packing section →
// quiet coda.

import Link from "next/link";
import { BeforeWeLeave } from "@/components/before-we-leave";
import { ChecklistSection } from "@/components/checklist-section";
import { DayChapter } from "@/components/day-chapters";
import { EditorialHero } from "@/components/editorial-hero";
import { JourneySpine } from "@/components/journey-spine";
import { PackingLayout } from "@/components/packing-layout";

export default function HomePage() {
  return (
    <>
      <EditorialHero />

      {/* Editorial strip with the three things that genuinely remain to do. */}
      <BeforeWeLeave />

      {/* Horizontal cartographic journey spine. */}
      <JourneySpine />

      {/* Five bespoke day chapters. Each lays out a different editorial
          composition so the homepage reads like a chapter list rather than
          an array of identical cards. */}
      <DayChapter.DayArrival />
      <DayChapter.DayCliffs />
      <DayChapter.DayMatch />
      <DayChapter.DayReposition />
      <DayChapter.DayHomeward />

      {/* The personal checklist + packing layout — kept on this page so the
          trip ends with the prep-work, the way a printed guide would. */}
      <hr className="rule mx-auto mt-8 mb-0" style={{ maxWidth: "min(76rem, 100%)" }} />
      <ChecklistSection />
      <PackingLayout />

      {/* Quiet coda — three off-routes the user might want. */}
      <section className="mx-auto px-6 sm:px-10 mt-8 mb-16" style={{ maxWidth: "min(76rem, 100%)" }}>
        <hr className="rule mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-[10rem_1fr] gap-x-12 gap-y-10">
          <p className="font-serif italic text-[13px] text-bone md:pt-2">Off-routes</p>
          <div>
            <p className="prose-trip max-w-[40rem] mb-10">
              The book doesn&apos;t end on the back cover. There are a few
              off-routes on the trip website — the days as a single index,
              the match day as a printed programme page, this packing layout
              as a single view, and a field-guide page with the walking and
              the sailing.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
              <li>
                <Link href="/itinerary" className="font-serif italic text-[1.2rem] text-ink hover:text-atlantic underline decoration-stone underline-offset-4 hover:decoration-atlantic">
                  The days, indexed →
                </Link>
                <p className="caption mt-1">A chapter TOC with the dates and locations.</p>
              </li>
              <li>
                <Link href="/match-day" className="font-serif italic text-[1.2rem] text-ink hover:text-atlantic underline decoration-stone underline-offset-4 hover:decoration-atlantic">
                  The match programme →
                </Link>
                <p className="caption mt-1">Ferry tables + the full kick-off timeline.</p>
              </li>
              <li>
                <Link href="/places" className="font-serif italic text-[1.2rem] text-ink hover:text-atlantic underline decoration-stone underline-offset-4 hover:decoration-atlantic">
                  The field guide →
                </Link>
                <p className="caption mt-1">Walking and sailing — Hvannhagi, Beinisvørð, the ferry.</p>
              </li>
              <li>
                <Link href="/info" className="font-serif italic text-[1.2rem] text-ink hover:text-atlantic underline decoration-stone underline-offset-4 hover:decoration-atlantic">
                  Reference →
                </Link>
                <p className="caption mt-1">Gate codes, booking references, ferry+ phone.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
