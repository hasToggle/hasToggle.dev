"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    guess: (userGuess: number) => void;
    startGuessingGame: () => void;
  }
}

const _colors = {
  gray: "font-weight: bold; color: #1B2B34;",
  red: "font-weight: bold; color: #EC5f67;",
  orange: "font-weight: bold; color: #F99157;",
  yellow: "font-weight: bold; color: #FAC863;",
  green: "font-weight: bold; color: #99C794;",
  teal: "font-weight: bold; color: #5FB3B3;",
  blue: "font-weight: bold; color: #6699CC;",
  purple: "font-weight: bold; color: #C594C5;",
  brown: "font-weight: bold; color: #AB7967;",
};

export function ColorfulLogs() {
  useEffect(() => {
    let numberToGuess: number;
    let _attempts: number;
    let gameActive = false;

    const startGuessingGame = () => {
      numberToGuess = Math.floor(Math.random() * 10) + 1;
      _attempts = 0;
      gameActive = true;
    };

    const guess = (userGuess: unknown) => {
      if (!gameActive) {
        return;
      }

      const guessNumber = Number(userGuess);
      _attempts += 1;

      if (Number.isNaN(guessNumber) || !Number.isFinite(guessNumber)) {
        return;
      }

      if (guessNumber < 1 || guessNumber > 10) {
        return;
      }

      if (guessNumber === numberToGuess) {
        gameActive = false;
      }
    };

    window.startGuessingGame = startGuessingGame;
    window.guess = guess;
  }, []);

  return null;
}
