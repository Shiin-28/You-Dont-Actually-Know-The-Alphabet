"use client";

import { useEffect } from "react";

interface GameOverScreenProps {
  score: number;
  highScore: number;
  deathReason: "timeout" | "wrong" | null;
  onRestart: () => void;
}

export default function GameOverScreen({
  score,
  highScore,
  deathReason,
  onRestart,
}: GameOverScreenProps) {
  const isNewHigh = score > 0 && score >= highScore;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "ArrowRight" || e.code === "Space") {
        onRestart();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onRestart]);

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full px-8 cursor-pointer"
      onClick={onRestart}
    >
      <p className="text-black/30 text-xl uppercase tracking-widest mb-2">
        {deathReason === "timeout" ? "time's up" : "wrong answer"}
      </p>

      <h2
        className="text-black text-center leading-none mb-6"
        style={{ fontSize: "clamp(5rem, 22vw, 18rem)" }}
      >
        {score}
      </h2>

      {isNewHigh && (
        <p className="text-2xl uppercase tracking-widest mb-4" style={{ color: "#ff0000" }}>
          NEW BEST
        </p>
      )}

      {!isNewHigh && highScore > 0 && (
        <p className="text-black/30 text-xl mb-4 tracking-widest">
          BEST: {highScore}
        </p>
      )}

      <div
        className="text-black/40 text-xl tracking-widest uppercase mt-8"
        style={{ animation: "pulse 1.2s ease-in-out infinite" }}
      >
        press any arrow to retry
      </div>
    </div>
  );
}
