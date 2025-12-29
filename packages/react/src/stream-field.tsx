import type { ReactNode } from "react";
import { getByPath, useStreamContext } from "./context";
import type { StreamFieldProps } from "./types";

/**
 * Stream.Field - Renders a field from the streaming data with automatic fallback.
 * 
 * Accesses a field from the streaming data using dot notation path.
 * Shows the fallback while the field is undefined, then renders children
 * with the value once available.
 * 
 * @example
 * ```tsx
 * // Simple field access
 * <Stream.Field path="location">
 *   {(location) => <h1>{location}</h1>}
 * </Stream.Field>
 * 
 * // With custom fallback
 * <Stream.Field path="temperature" fallback={<Skeleton className="h-12 w-20" />}>
 *   {(temp) => <span className="text-5xl">{temp}°</span>}
 * </Stream.Field>
 * 
 * // Nested path access
 * <Stream.Field path="user.profile.name">
 *   {(name) => <span>{name}</span>}
 * </Stream.Field>
 * 
 * // Array index access
 * <Stream.Field path="items.0.title">
 *   {(title) => <h2>{title}</h2>}
 * </Stream.Field>
 * ```
 */
/**
 * Check if a value should be considered "empty" or "not ready"
 */
function isEmptyValue(value: unknown): boolean {
  // Undefined or null
  if (value === undefined || value === null) {
    return true;
  }
  
  // Empty string
  if (typeof value === "string" && value === "") {
    return true;
  }
  
  // Empty object (but allow objects with properties)
  if (typeof value === "object" && !Array.isArray(value)) {
    return Object.keys(value).length === 0;
  }
  
  return false;
}

export function StreamField<T = unknown>({
  path,
  fallback = null,
  children,
}: StreamFieldProps<T>): ReactNode {
  const { data } = useStreamContext();
  const value = getByPath<T>(data, path);

  // Show fallback if value is empty/not ready
  if (isEmptyValue(value)) {
    return fallback;
  }

  // Render children with the value (we know it's not empty at this point)
  return children(value as T);
}

