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

/**
 * Utility to get a nested value from an object using dot notation path.
 * Returns undefined if any part of the path doesn't exist.
 * 
 * @example
 * getByPath({ user: { name: "John" } }, "user.name") // "John"
 * getByPath({ items: [{ id: 1 }] }, "items.0.id") // 1
 * getByPath({ user: {} }, "user.name") // undefined
 */
export function getByPath<T = unknown>(
  obj: unknown,
  path: string
): T | undefined {
  if (!obj || typeof obj !== "object") {
    return undefined;
  }

  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current as T | undefined;
}

