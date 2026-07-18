"use client";

import { useCountdown } from "@/lib/hooks/use-countdown";

// A compact kickoff countdown next to the match-day fixture. Reads the
// kickoff ISO from the parent; the hook itself is hydration-safe.

export function TripCountdown({ target }: { target: string }) {
  const countdown = useCountdown(target);

  return (
    <p className="font-serif text-[1.65rem] italic leading-none text-paper tracking-tight">
      <span suppressHydrationWarning>
        {countdown.phrase ?? "—"}
      </span>
    </p>
  );
}
