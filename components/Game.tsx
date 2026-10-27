"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAlphabetEngine } from "@/hooks/useAlphabetEngine";
import TimerBar from "./TimerBar";
import PromptDisplay from "./PromptDisplay";
import StartScreen from "./StartScreen";
import GameOverScreen from "./GameOverScreen";

export default function Game() {
  const { state, startGame, submitAnswer } = useAlphabetEngine();
  const [isFlashing, setIsFlashing] = useState(false);
  const prevGameState = useRef(state.gameState);
  const inputLockedRef = useRef(false);

  // Flash red when game transitions to gameover
  useEffect(() => {
    if (prevGameState.current === "playing" && state.gameState === "gameover") {
      setIsFlashing(true);
      const t = setTimeout(() => setIsFlashing(false), 400);
      return () => clearTimeout(t);
    }
    prevGameState.current = state.gameState;
  }, [state.gameState]);

  // Global keyboard handler for gameplay
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (state.gameState !== "playing") return;
      if (inputLockedRef.current) return;
      if (e.code === "ArrowLeft") {
        inputLockedRef.current = true;
        submitAnswer(true);
        setTimeout(() => { inputLockedRef.current = false; }, 80);
      } else if (e.code === "ArrowRight") {
        inputLockedRef.current = true;
        submitAnswer(false);
        setTimeout(() => { inputLockedRef.current = false; }, 80);
      }
    },
    [state.gameState, submitAnswer]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // Mobile tap zones
  const handleTap = useCallback(
    (side: "left" | "right") => {
      if (state.gameState !== "playing") return;
      if (inputLockedRef.current) return;
      inputLockedRef.current = true;
      submitAnswer(side === "left");
      setTimeout(() => { inputLockedRef.current = false; }, 80);
    },
    [state.gameState, submitAnswer]
  );

  const shakeClass =
    state.gameState === "playing"
      ? state.timeLeft < 0.5
        ? "shake-hard"
        : state.timeLeft < 1.0
          ? "shake-subtle"
          : ""
      : "";

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden select-none ${isFlashing ? "flash-red" : "bg-white"}`}
    >
      {/* Timer bar — only during play */}
      {state.gameState === "playing" && (
        <TimerBar timeLeft={state.timeLeft} />
      )}

      {/* Mobile tap zones — invisible overlay split left/right */}
      {state.gameState === "playing" && (
        <>
          <div
            className="absolute top-0 left-0 w-1/2 h-full z-40 cursor-pointer"
            onPointerDown={() => handleTap("left")}
          />
          <div
            className="absolute top-0 right-0 w-1/2 h-full z-40 cursor-pointer"
            onPointerDown={() => handleTap("right")}
          />
        </>
      )}

      {/* State screens */}
      <div className={`w-full h-full ${shakeClass}`}>
        {state.gameState === "start" && (
          <StartScreen highScore={state.highScore} onStart={startGame} />
        )}

        {state.gameState === "playing" && state.prompt && (
          <PromptDisplay
            text={state.prompt.text}
            score={state.score}
            timeLeft={state.timeLeft}
          />
        )}

        {state.gameState === "gameover" && (
          <GameOverScreen
            score={state.score}
            highScore={state.highScore}
            deathReason={state.deathReason}
            onRestart={startGame}
          />
        )}
      </div>
    </div>
  );
}
