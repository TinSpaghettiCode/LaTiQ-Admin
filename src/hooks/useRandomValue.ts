import { useState, useEffect } from 'react';

interface UseRandomValueOptions {
  min?: number;
  max?: number;
  interval?: number; // milliseconds
}

export function useRandomValue({
  min = 0,
  max = 100,
  interval = 5000,
}: UseRandomValueOptions) {
  const [randomValue, setRandomValue] = useState<number>(() =>
    getRandomNumber(min, max)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setRandomValue(getRandomNumber(min, max));
    }, interval);

    return () => clearInterval(timer);
  }, [min, max, interval]);

  return randomValue;
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
