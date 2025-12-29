"use client";

import * as React from "react";

interface UseStreamSimulatorOptions<T> {
  /** Sequence of partial data to stream through */
  sequence: T[];
  /** Delay between each step in ms */
  delay?: number;
  /** Initial delay before starting in ms */
  initialDelay?: number;
}

interface UseStreamSimulatorReturn<T> {
  /** Current partial data */
  data: T | undefined;
  /** Whether the stream is loading */
  isLoading: boolean;
  /** Current step index (-1 = idle, 0+ = step) */
  step: number;
  /** Total steps in sequence */
  totalSteps: number;
  /** Whether idle (not started) */
  isIdle: boolean;
  /** Whether complete (finished streaming) */
  isComplete: boolean;
  /** Start or restart the simulation */
  start: () => void;
  /** Reset to idle state */
  reset: () => void;
}

export function useStreamSimulator<T>({
  sequence,
  delay = 100,
  initialDelay = 300,
}: UseStreamSimulatorOptions<T>): UseStreamSimulatorReturn<T> {
  const [data, setData] = React.useState<T | undefined>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [step, setStep] = React.useState(-1);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const cleanup = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const runStep = React.useCallback(
    (index: number) => {
      if (index >= sequence.length) {
        setIsLoading(false);
        return;
      }

      setData(sequence[index]);
      setStep(index);
      timeoutRef.current = setTimeout(() => runStep(index + 1), delay);
    },
    [sequence, delay]
  );

  const start = React.useCallback(() => {
    cleanup();
    setData(undefined);
    setIsLoading(true);
    setStep(-1);

    timeoutRef.current = setTimeout(() => runStep(0), initialDelay);
  }, [cleanup, runStep, initialDelay]);

  const reset = React.useCallback(() => {
    cleanup();
    setData(undefined);
    setIsLoading(false);
    setStep(-1);
  }, [cleanup]);

  React.useEffect(() => cleanup, [cleanup]);

  const isIdle = !isLoading && data === undefined;
  const isComplete = !isLoading && data !== undefined;

  return {
    data,
    isLoading,
    step,
    totalSteps: sequence.length,
    isIdle,
    isComplete,
    start,
    reset,
  };
}

