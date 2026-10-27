"use client";

interface PromptDisplayProps {
  text: string;
  score: number;
  timeLeft: number;
}

export default function PromptDisplay({ text, score, timeLeft }: PromptDisplayProps) {
  const isLow = timeLeft < 1;
  const isCritical = timeLeft < 0.5;
  const timerColor = isCritical ? "#ff0000" : isLow ? "#cc0000" : "rgba(0,0,0,0.3)";

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-6">
      {/* Score */}
      <div className="absolute top-6 right-6 text-black/30 text-2xl tabular-nums">
        {score}
      </div>

      {/* Timer number */}
      <div
        className="absolute top-6 left-6 tabular-nums text-2xl"
        style={{ color: timerColor }}
      >
        {timeLeft.toFixed(2)}
      </div>

      {/* Main prompt */}
      <p
        className="font-black text-black text-center leading-none"
        style={{ fontSize: "clamp(2.5rem, 9vw, 8rem)", letterSpacing: "0.02em" }}
      >
        {text}
      </p>

      {/* True / False hints */}
      <div className="flex w-full justify-between px-4 mt-16 text-black/20 text-lg uppercase tracking-widest">
        <span>← TRUE</span>
        <span>FALSE →</span>
      </div>
    </div>
  );
}
