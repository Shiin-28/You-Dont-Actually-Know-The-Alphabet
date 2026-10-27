"use client";

import { useEffect } from "react";

interface StartScreenProps {
  highScore: number;
  onStart: () => void;
}

export default function StartScreen({ highScore, onStart }: StartScreenProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "ArrowRight" || e.code === "Space") {
        onStart();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onStart]);

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-full px-8 cursor-pointer"
      onClick={onStart}
    >
      <h1
        className="text-black text-center leading-none mb-6"
        style={{ fontSize: "clamp(2rem, 9vw, 8rem)", letterSpacing: "0.03em" }}
      >
        YOU DON&apos;T ACTUALLY KNOW THE ALPHABET
      </h1>

      <p className="text-black/40 text-center text-xl mt-4 mb-2 tracking-widest">
        ← TRUE &nbsp;&nbsp; FALSE →
      </p>

      <p className="text-black/30 text-center text-base mt-2 mb-8 max-w-md tracking-wide">
        Decide if each statement about alphabetical order is true or false. One
        wrong answer ends it all.
      </p>

      {highScore > 0 && (
        <p className="text-black/30 text-lg mb-8 tracking-widest">
          BEST: {highScore}
        </p>
      )}

      <div
        className="text-black/50 text-xl tracking-widest uppercase mt-4"
        style={{ animation: "pulse 1.2s ease-in-out infinite" }}
      >
        press any arrow to start
      </div>
    </div>
  );
}
