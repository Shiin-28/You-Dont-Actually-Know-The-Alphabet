"use client";

import { ROUND_TIME } from "@/hooks/useAlphabetEngine";

interface TimerBarProps {
  timeLeft: number;
}

export default function TimerBar({ timeLeft }: TimerBarProps) {
  const pct = Math.max(0, Math.min(1, timeLeft / ROUND_TIME));
  const isLow = timeLeft < 1;
  const isCritical = timeLeft < 0.5;
  const barColor = isCritical ? "#ff0000" : isLow ? "#cc0000" : "#000000";

  return (
    <div className="fixed top-0 left-0 right-0 h-3 bg-black/10 z-50">
      <div
        className="h-full transition-none"
        style={{ width: `${pct * 100}%`, backgroundColor: barColor }}
      />
    </div>
  );
}
