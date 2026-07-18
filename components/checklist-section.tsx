"use client";

// Personal checklist — five grouped columns (Book / Confirm / Download /
// Pack / Carry). Real checkboxes with persistent localStorage state. The
// progress meter is rendered as TALLY MARKS (/ // /// ////) drawn from local
// state, with no loading-bar transition. The page reads as a private
// notebook, not a project-management board.

import { CHECKLIST, type ChecklistItem } from "@/lib/data/itinerary";
import { useChecklist } from "@/lib/hooks/use-checklist";

const GROUP_ORDER: ChecklistItem["group"][] = ["Book", "Confirm", "Download", "Pack", "Carry"];

export function ChecklistSection() {
  const ids = CHECKLIST.map((c) => c.id);
  const checklist = useChecklist(ids);

  // Tally rendering — five groups of five, with a slash through every fifth.
  const total = checklist.total;
  const done = checklist.ready;

  return (
    <section className="relative mx-auto px-6 sm:px-10 pt-24 pb-24 sm:pt-28 sm:pb-32" style={{ maxWidth: "min(76rem, 100%)" }}>
      {/* Caveat marginal scribble — hung off the right margin. */}
      <p
        className="absolute right-2 sm:right-[-2rem] top-24 script script--claret text-[1.45rem] rotate-[3deg] max-w-[18ch] hidden sm:block"
        aria-hidden
      >
        tick as you &nbsp; go.
      </p>

      <header className="mb-16">
        <p className="font-serif italic text-[13px] text-bone mb-3">
          Private checklist · runs on this device
        </p>
        <h2 className="headline text-[clamp(2.4rem,5.6vw,3.6rem)] leading-[1.04] tracking-tight max-w-[20ch]">
          The <span className="italic font-normal">prep&nbsp;work</span>.
        </h2>
        <p className="prose-trip mt-6 max-w-[40rem]">
          A private notebook. Items fall through as I tick them. Tally marks —
          like in a paperback — show progress, never percentages. Stored
          privately on this device. Nothing leaves the browser.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-12">
        {GROUP_ORDER.map((group) => {
          const items = CHECKLIST.filter((c) => c.group === group);
          return (
            <div key={group}>
              <h3 className="font-serif italic text-[1.4rem] text-ink mb-1">{group}</h3>
              <p className="font-serif italic text-[12.5px] text-bone mb-4">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
              <ul>
                {items.map((item) => (
                  <ChecklistRow
                    key={item.id}
                    item={item}
                    isChecked={checklist.isChecked(item.id)}
                    onToggle={() => checklist.toggle(item.id)}
                  />
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Tally-mark progress, suppressed until the user has actually ticked
          something. No "0%" pessimism on first load. */}
      {checklist.phrase && (
        <div className="mt-20 sm:mt-24 max-w-[40rem]">
          <div className="flex items-baseline justify-between mb-4">
            <p className="font-serif italic text-[13px] text-bone">
              Tally · {checklist.phrase}
            </p>
            <p className="caption text-ink">
              <span className="code">faroe-pack-state</span>
            </p>
          </div>
          <TallyMarks done={done} total={total} />
        </div>
      )}
    </section>
  );
}

function TallyMarks({ done, total }: { done: number; total: number }) {
  // Draw `done` vertical hash marks, each group of 5 with a horizontal slash.
  const marksPerRow = 5;
  const rows = Math.ceil(total / marksPerRow);
  return (
    <svg
      viewBox={`0 0 ${rows * marksPerRow * 14} ${rows * 28}`}
      className="tally w-full max-w-[28rem] h-auto"
      aria-hidden
    >
      {Array.from({ length: total }, (_, i) => {
        const col = i % marksPerRow;
        const row = Math.floor(i / marksPerRow);
        const isDone = i < done;
        const x = col * 14 + 8;
        const y = row * 28 + 12;
        const slash = col === 4 && row > 0;
        const ink = isDone ? "#1B1F22" : "#B5AC97";
        return (
          <g key={i} stroke={ink} strokeWidth="1.4">
            <line x1={x} y1={y} x2={x} y2={y + 16} />
            <line x1={x - 4} y1={y} x2={x + 4} y2={y + 16} opacity="0.5" />
            {slash ? <line x1={x - 9} y1={y + 8} x2={x + 9} y2={y + 8} /> : null}
          </g>
        );
      })}
    </svg>
  );
}

function ChecklistRow({
  item,
  isChecked,
  onToggle,
}: {
  item: ChecklistItem;
  isChecked: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <label
        htmlFor={item.id}
        className="flex items-start gap-3 py-3 border-t border-stone cursor-pointer"
      >
        <input
          type="checkbox"
          id={item.id}
          checked={isChecked}
          onChange={onToggle}
          className="sr-only"
        />
        <span
          aria-hidden
          className={`mt-1 block w-4 h-4 shrink-0 border ${
            isChecked ? "border-atlantic" : "border-stone"
          }`}
          style={{
            background: isChecked
              ? "color-mix(in oklab, var(--atlantic) 18%, transparent)"
              : "transparent",
          }}
        >
          {isChecked ? <Checkmark /> : null}
        </span>
        <span className="flex-1">
          <span
            className={`block leading-snug text-[14.5px] ${
              isChecked ? "text-bone line-through" : "text-ink"
            }`}
          >
            {item.what}
          </span>
          {item.why ? (
            <span className="block caption mt-1.5">{item.why}</span>
          ) : null}
        </span>
      </label>
    </li>
  );
}

function Checkmark() {
  return (
    <svg
      viewBox="0 0 14 14"
      className="block w-full h-full"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
      aria-hidden
      style={{ color: "var(--atlantic)" }}
    >
      <path d="M3 7.5 L6 10.5 L11 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
