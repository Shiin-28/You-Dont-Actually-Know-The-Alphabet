"use client";

import { useCallback, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type GameState = "start" | "playing" | "gameover";

export interface Prompt {
  text: string;
  answer: boolean;
}

export interface EngineState {
  gameState: GameState;
  prompt: Prompt | null;
  timeLeft: number;
  score: number;
  highScore: number;
  deathReason: "timeout" | "wrong" | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const ROUND_TIME = 3.0;

// ─── Prompt generation ────────────────────────────────────────────────────────

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function randomLetter(exclude: string[] = []): string {
  const pool = LETTERS.filter((l) => !exclude.includes(l));
  return pool[Math.floor(Math.random() * pool.length)];
}

function letterIndex(l: string): number {
  return LETTERS.indexOf(l.toUpperCase());
}

function generatePrompt(): Prompt {
  const type = Math.floor(Math.random() * 3) as 0 | 1 | 2;

  if (type === 0) {
    // "[A] comes before [B]"
    const a = randomLetter();
    const b = randomLetter([a]);
    const makeTrue = Math.random() < 0.5;
    const [l1, l2] =
      makeTrue === (letterIndex(a) < letterIndex(b)) ? [a, b] : [b, a];
    return {
      text: `${l1} comes before ${l2}`,
      answer: letterIndex(l1) < letterIndex(l2),
    };
  }

  if (type === 1) {
    // "[A] comes after [B]"
    const a = randomLetter();
    const b = randomLetter([a]);
    const makeTrue = Math.random() < 0.5;
    const [l1, l2] = makeTrue
      ? letterIndex(a) > letterIndex(b)
        ? [a, b]
        : [b, a]
      : letterIndex(a) < letterIndex(b)
        ? [a, b]
        : [b, a];
    return {
      text: `${l1} comes after ${l2}`,
      answer: letterIndex(l1) > letterIndex(l2),
    };
  }

  // "[A] is between [B] and [C]"
  const makeTrue = Math.random() < 0.5;
  if (makeTrue) {
    const lo = randomLetter();
    const hi = randomLetter([lo]);
    const [s0, s1] = [lo, hi].sort((x, y) => letterIndex(x) - letterIndex(y));
    const between = LETTERS.filter(
      (l) =>
        l !== s0 &&
        l !== s1 &&
        letterIndex(l) > letterIndex(s0) &&
        letterIndex(l) < letterIndex(s1)
    );
    if (between.length > 0) {
      const mid = between[Math.floor(Math.random() * between.length)];
      return { text: `${mid} is between ${s0} and ${s1}`, answer: true };
    }
  }
  // False: pick any three, compute actual answer
  const a = randomLetter();
  const b = randomLetter([a]);
  const c = randomLetter([a, b]);
  const aIdx = letterIndex(a);
  const bIdx = letterIndex(b);
  const cIdx = letterIndex(c);
  const actuallyBetween =
    (aIdx > bIdx && aIdx < cIdx) || (aIdx > cIdx && aIdx < bIdx);
  return {
    text: `${a} is between ${b} and ${c}`,
    answer: actuallyBetween,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAlphabetEngine() {
  const [state, setState] = useState<EngineState>({
    gameState: "start",
    prompt: null,
    timeLeft: ROUND_TIME,
    score: 0,
    highScore: 0,
    deathReason: null,
  });

  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const timeLeftRef = useRef(ROUND_TIME);
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);
  const promptRef = useRef<Prompt | null>(null);
  const activeRef = useRef(false);

  const stopLoop = useCallback(() => {
    activeRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTimestampRef.current = null;
  }, []);

  const triggerGameOver = useCallback(
    (reason: "timeout" | "wrong") => {
      stopLoop();
      const finalScore = scoreRef.current;
      const finalHigh = Math.max(finalScore, highScoreRef.current);
      highScoreRef.current = finalHigh;
      setState((prev) => ({
        ...prev,
        gameState: "gameover",
        timeLeft: 0,
        deathReason: reason,
        score: finalScore,
        highScore: finalHigh,
      }));
    },
    [stopLoop]
  );

  const startLoop = useCallback(
    (initialTime: number) => {
      timeLeftRef.current = initialTime;
      activeRef.current = true;

      const tick = (timestamp: number) => {
        if (!activeRef.current) return;

        if (lastTimestampRef.current === null) {
          lastTimestampRef.current = timestamp;
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        const delta = (timestamp - lastTimestampRef.current) / 1000;
        lastTimestampRef.current = timestamp;
        timeLeftRef.current = Math.max(0, timeLeftRef.current - delta);

        setState((prev) => ({ ...prev, timeLeft: timeLeftRef.current }));

        if (timeLeftRef.current <= 0) {
          triggerGameOver("timeout");
          return;
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    },
    [triggerGameOver]
  );

  const startGame = useCallback(() => {
    stopLoop();
    scoreRef.current = 0;
    const firstPrompt = generatePrompt();
    promptRef.current = firstPrompt;

    setState((prev) => ({
      ...prev,
      gameState: "playing",
      prompt: firstPrompt,
      timeLeft: ROUND_TIME,
      score: 0,
      deathReason: null,
      highScore: highScoreRef.current,
    }));

    startLoop(ROUND_TIME);
  }, [stopLoop, startLoop]);

  const submitAnswer = useCallback(
    (answer: boolean) => {
      if (!activeRef.current) return;
      const current = promptRef.current;
      if (!current) return;

      if (answer !== current.answer) {
        triggerGameOver("wrong");
        return;
      }

      // Correct — reset timer to full 3 seconds, advance prompt
      scoreRef.current += 1;
      timeLeftRef.current = ROUND_TIME;
      lastTimestampRef.current = null; // forces RAF to re-sync timestamp on next tick

      const nextPrompt = generatePrompt();
      promptRef.current = nextPrompt;

      setState((prev) => ({
        ...prev,
        prompt: nextPrompt,
        score: scoreRef.current,
        timeLeft: ROUND_TIME,
      }));
    },
    [triggerGameOver]
  );

  return { state, startGame, submitAnswer };
}
