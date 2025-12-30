import { createContext, useContext } from "react";
import type { StreamContextValue } from "./types";

/**
 * Internal context for Stream primitives.
 * Not exported publicly - consumers should use Stream.Root.
 */
export const StreamContext = createContext<StreamContextValue | null>(null);

/**
 * Internal hook to access stream context.
 * Throws if used outside of Stream.Root.
 */
export function useStreamContext(): StreamContextValue {
  const context = useContext(StreamContext);
  if (!context) {
    throw new Error(
      "Stream components must be used within a Stream.Root. " +
        "Make sure you have wrapped your components with <Stream.Root>."
    );
  }
  return context;
}
