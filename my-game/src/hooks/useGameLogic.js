// src/hooks/useGameLogic.js
import { useState, useCallback } from "react";

export function useGameLogic() {
  // وضعیت بازی (مثلاً امتیاز، سطح و انرژی)
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [energy, setEnergy] = useState(100);

  // افزایش امتیاز
  const increaseScore = useCallback((points = 1) => {
    setScore((prev) => prev + points);
  }, []);

  // کاهش انرژی
  const decreaseEnergy = useCallback((amount = 10) => {
    setEnergy((prev) => Math.max(prev - amount, 0));
  }, []);

  // بازیابی انرژی
  const restoreEnergy = useCallback((amount = 10) => {
    setEnergy((prev) => Math.min(prev + amount, 100));
  }, []);

  // پیشرفت سطح
  const levelUp = useCallback(() => {
    setLevel((prev) => prev + 1);
  }, []);

  return {
    score,
    level,
    energy,
    increaseScore,
    decreaseEnergy,
    restoreEnergy,
    levelUp,
  };
}
