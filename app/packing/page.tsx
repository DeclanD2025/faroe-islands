// /packing — the packing as a single view. Bag-sketch SVG as the dominant
// visual at the top; four zones as a written-out list with reasoning and
// personal copy underneath.

import { ChecklistSection } from "@/components/checklist-section";
import { PackingLayout } from "@/components/packing-layout";

export default function PackingPage() {
  return (
    <article className="relative mx-auto px-6 sm:px-10 pt-24 pb-24 sm:pt-28 sm:pb-32" style={{ maxWidth: "min(80rem, 100%)" }}>
      <header className="mb-14 sm:mb-20">
        <p className="font-serif italic text-[13px] text-bone mb-3">
          Packing chapter · runs on this device
        </p>
        <h1 className="headline text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.02] tracking-tight max-w-[18ch]">
          The{" "}
          <span className="italic font-normal">40&nbsp;×&nbsp;30&nbsp;×&nbsp;20</span>{" "}
          bag.
        </h1>
        <p className="prose-trip mt-6 max-w-[40rem]">
          Frontier-fare under-seat allowance. Four physical zones. A bag sketch
          that looks like the back of an expedition guide. Personal copy. None
          of it lives anywhere but this browser.
        </p>
        <p
          className="script script--atlantic text-[1.6rem] rotate-[-2deg] mt-7 max-w-[28ch]"
          aria-hidden
        >
          the smallest bag I&apos;ve ever packed for a long weekend.
        </p>
      </header>

      <PackingLayout />
      <hr className="rule my-16" />
      <ChecklistSection />
    </article>
  );
}
